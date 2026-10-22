#!/usr/bin/env python3
"""Convert Real-ESRGAN general x4v3 (+ its weak-denoise variant) to one ONNX model.

The ONNX graph takes two inputs:
  input   float32 [1, 3, H, W]  RGB in [0, 1]
  denoise float32 [1]           0 = weak denoise (wdn model) … 1 = strong denoise
and returns `output` float32 [1, 3, 4H, 4W].

Weights are blended inside the graph exactly like Real-ESRGAN's own
`--denoise_strength` (deep network interpolation):
    W = denoise * W_x4v3 + (1 - denoise) * W_wdn_x4v3

Only numpy is required (no torch / onnx packages); the protobuf is written by hand.

Usage:
  python3 tools/convert-realesr-general.py realesr-general-x4v3.pth \
      realesr-general-wdn-x4v3.pth models/photo/model.onnx [--check]
Weights: https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0 (BSD-3-Clause).
"""
import struct, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pth import load_state_dict

# --- minimal protobuf writer -------------------------------------------------
def varint(n):
    out = bytearray()
    n &= (1 << 64) - 1
    while True:
        b = n & 0x7F; n >>= 7
        out.append(b | (0x80 if n else 0))
        if not n: return bytes(out)
def key(field, wire): return varint(field << 3 | wire)
def f_int(field, n): return key(field, 0) + varint(n)
def f_bytes(field, b): return key(field, 2) + varint(len(b)) + b
def f_str(field, s): return f_bytes(field, s.encode())
def f_float(field, x): return key(field, 5) + struct.pack('<f', x)

FLOAT = 1
def tensor(name, array):
    array = np.ascontiguousarray(array, dtype=np.float32)
    return b''.join(f_int(1, d) for d in array.shape) + f_int(2, FLOAT) + f_str(8, name) + f_bytes(9, array.tobytes())
def attr_ints(name, values): return f_str(1, name) + b''.join(f_int(8, v) for v in values) + f_int(20, 7)
def attr_int(name, value): return f_str(1, name) + f_int(3, value) + f_int(20, 2)
def attr_str(name, value): return f_str(1, name) + f_bytes(4, value.encode()) + f_int(20, 3)
def node(op, inputs, outputs, name, attrs=()):
    return (b''.join(f_str(1, i) for i in inputs) + b''.join(f_str(2, o) for o in outputs)
            + f_str(3, name) + f_str(4, op) + b''.join(f_bytes(5, a) for a in attrs))
def value_info(name, dims):
    shape = b''.join(f_bytes(1, f_str(2, d) if isinstance(d, str) else f_int(1, d)) for d in dims)
    return f_str(1, name) + f_bytes(2, f_bytes(1, f_int(1, FLOAT) + f_bytes(2, shape)))

# --- graph -------------------------------------------------------------------
def build(normal, weak):
    keys = list(normal)
    assert keys == list(weak), 'weight sets differ'
    nodes, inits = [], []
    inits.append(tensor('one', np.ones(1)))
    inits.append(tensor('up_scales', np.array([1, 1, 4, 4])))
    nodes.append(node('Sub', ['one', 'denoise'], ['weak_share'], 'weak_share'))
    def blended(k):
        a, b = normal[k], weak[k]
        if k.endswith('.weight') and a.ndim == 1:  # PReLU slope broadcasts over C,1,1
            a, b = a.reshape(-1, 1, 1), b.reshape(-1, 1, 1)
        inits.append(tensor(k + '.n', a)); inits.append(tensor(k + '.w', b))
        nodes.append(node('Mul', [k + '.n', 'denoise'], [k + '.na'], k + '.na'))
        nodes.append(node('Mul', [k + '.w', 'weak_share'], [k + '.wb'], k + '.wb'))
        nodes.append(node('Add', [k + '.na', k + '.wb'], [k], k))
        return k
    layers = sorted({int(k.split('.')[1]) for k in keys})
    x = 'input'
    for i in layers:
        prefix = f'body.{i}'
        if f'{prefix}.bias' in normal:  # conv
            nodes.append(node('Conv', [x, blended(prefix + '.weight'), blended(prefix + '.bias')], [prefix + '.out'], prefix,
                              [attr_ints('kernel_shape', [3, 3]), attr_ints('pads', [1, 1, 1, 1])]))
        else:  # PReLU
            nodes.append(node('PRelu', [x, blended(prefix + '.weight')], [prefix + '.out'], prefix))
        x = prefix + '.out'
    nodes.append(node('DepthToSpace', [x], ['shuffled'], 'pixel_shuffle', [attr_int('blocksize', 4), attr_str('mode', 'CRD')]))
    nodes.append(node('Resize', ['input', '', 'up_scales'], ['base'], 'nearest_base',
                      [attr_str('mode', 'nearest'), attr_str('coordinate_transformation_mode', 'asymmetric'), attr_str('nearest_mode', 'floor')]))
    nodes.append(node('Add', ['shuffled', 'base'], ['output'], 'residual'))
    graph = (b''.join(f_bytes(1, n) for n in nodes) + f_str(2, 'realesr_general_x4v3_dni')
             + b''.join(f_bytes(5, t) for t in inits)
             + f_bytes(11, value_info('input', [1, 3, 'height', 'width'])) + f_bytes(11, value_info('denoise', [1]))
             + f_bytes(12, value_info('output', [1, 3, 'height4', 'width4'])))
    opset = f_str(1, '') + f_int(2, 13)
    return f_int(1, 8) + f_str(2, 'photoupscale-converter') + f_bytes(8, opset) + f_bytes(7, graph)

# --- numpy reference (for --check) ------------------------------------------------
def conv3x3(x, w, b):
    c, h, wd = x.shape
    p = np.pad(x, ((0, 0), (1, 1), (1, 1)))
    cols = np.stack([p[:, dy:dy + h, dx:dx + wd] for dy in range(3) for dx in range(3)], axis=1)  # C,9,H,W
    return np.einsum('ckhw,ock->ohw', cols, w.reshape(w.shape[0], c, 9)) + b[:, None, None]
def reference(sd, x):
    y = x
    for i in sorted({int(k.split('.')[1]) for k in sd}):
        p = f'body.{i}'
        y = conv3x3(y, sd[p + '.weight'], sd[p + '.bias']) if p + '.bias' in sd else np.where(y >= 0, y, y * sd[p + '.weight'][:, None, None])
    c, h, w = y.shape; r = 4
    y = y.reshape(c // (r * r), r, r, h, w).transpose(0, 3, 1, 4, 2).reshape(c // (r * r), h * r, w * r)
    return y + np.repeat(np.repeat(x, 4, 1), 4, 2)

if __name__ == '__main__':
    normal_path, weak_path, out_path = sys.argv[1:4]
    normal, weak = load_state_dict(normal_path), load_state_dict(weak_path)
    os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
    with open(out_path, 'wb') as f: f.write(build(normal, weak))
    print('wrote', out_path, os.path.getsize(out_path), 'bytes')
    if '--check' in sys.argv:
        import onnxruntime as ort
        session = ort.InferenceSession(out_path, providers=['CPUExecutionProvider'])
        rng = np.random.default_rng(0)
        x = rng.random((3, 20, 17), dtype=np.float32)
        for d in (0.0, 0.5, 1.0):
            got = session.run(None, {'input': x[None], 'denoise': np.array([d], np.float32)})[0][0]
            mix = {k: d * normal[k] + (1 - d) * weak[k] for k in normal}
            diff = np.abs(got - reference(mix, x.astype(np.float64))).max()
            print(f'denoise={d}: output {got.shape}, max |onnx - numpy reference| = {diff:.2e}')
            assert got.shape == (3, 80, 68) and diff < 1e-3
        print('PASS: ONNX matches the PyTorch-equivalent numpy reference')
