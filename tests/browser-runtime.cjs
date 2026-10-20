const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const deployment=process.argv[2]||'.';
const root=path.resolve(deployment,'vendor/ort'),build=fs.readFileSync(root+'/ort.webgpu.min.js','utf8');
const moduleName=build.match(/ort-wasm-simd-threaded[^"'`\s]*?\.mjs/)[0];
for(const file of [moduleName,moduleName.replace('.mjs','.wasm')])assert.ok(fs.existsSync(root+'/'+file),'Missing deployed runtime asset '+file);
const ort=require(path.resolve(root,'ort.webgpu.min.js'));
ort.env.wasm.numThreads=1;ort.env.wasm.wasmPaths={mjs:root+'/'+moduleName,wasm:root+'/'+moduleName.replace('.mjs','.wasm')};
(async()=>{const session=await ort.InferenceSession.create(new Uint8Array(fs.readFileSync(path.resolve(deployment,'models/illustration/model.onnx'))),{executionProviders:['wasm']});const input=new ort.Tensor('float32',new Float32Array(3*16*16).fill(.5),[1,3,16,16]);const result=await session.run({input});assert.deepEqual(result.output.dims,[1,3,64,64]);assert.ok((await result.output.getData()).every(Number.isFinite));console.log('PASS: actual browser WebGPU build, asyncify module and binary, real ONNX WASM inference');input.dispose();result.output.dispose();await session.release()})().catch(e=>{console.error(e);process.exitCode=1});
