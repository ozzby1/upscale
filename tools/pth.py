"""Minimal loader for PyTorch .pth state dicts without torch (numpy only)."""
import pickle, zipfile, numpy as np

DTYPES = {'FloatStorage': np.float32, 'HalfStorage': np.float16, 'DoubleStorage': np.float64, 'LongStorage': np.int64, 'IntStorage': np.int32}

def load_state_dict(path):
    archive = zipfile.ZipFile(path)
    prefix = archive.namelist()[0].split('/')[0]

    def rebuild(storage, offset, size, stride, *_):
        data, dtype = storage
        flat = np.frombuffer(data, dtype=dtype)
        if not size:
            return flat[offset:offset + 1].reshape(()).copy()
        itemsize = flat.itemsize
        return np.lib.stride_tricks.as_strided(flat[offset:], shape=size, strides=[s * itemsize for s in stride]).copy()

    class Unpickler(pickle.Unpickler):
        def find_class(self, module, name):
            if module == 'torch._utils' and name == '_rebuild_tensor_v2':
                return rebuild
            if module == 'torch' and name in DTYPES:
                return name
            if module == 'collections' and name == 'OrderedDict':
                import collections
                return collections.OrderedDict
            raise pickle.UnpicklingError(f'unsupported global {module}.{name}')

        def persistent_load(self, pid):
            _, storage_type, key, _location, _numel = pid
            return archive.read(f'{prefix}/data/{key}'), DTYPES[storage_type]

    state = Unpickler(archive.open(f'{prefix}/data.pkl')).load()
    for key in ('params_ema', 'params'):
        if isinstance(state, dict) and key in state:
            return state[key]
    return state
