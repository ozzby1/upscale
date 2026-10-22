const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('index.html','utf8'),code=source.slice(source.indexOf('// The illustration runtime'),source.indexOf('// Local inference only.'));
async function scenario({cores=8,memory=8,mode='auto',provider='wasm',failure=0}){
 let created=0,stopped=0;
 class Worker{constructor(){this.number=++created}postMessage(m){setTimeout(()=>{if(this.number===failure)this.onerror();else this.onmessage({data:{id:m.id,provider}})},0)}terminate(){stopped++}}
 const ctx=vm.createContext({Worker,Map,URL,DOMException,Uint8ClampedArray,Float32Array,navigator:{hardwareConcurrency:cores,deviceMemory:memory},assetUrl:p=>p,t:p=>p});
 vm.runInContext(code,ctx);vm.runInContext('illustrationCpuMode='+JSON.stringify(mode),ctx);await vm.runInContext('startIllustration(false)',ctx);
 const count=vm.runInContext('illustrationWorkers.length',ctx);vm.runInContext('stopIllustration()',ctx);assert.equal(vm.runInContext('illustrationPending.size',ctx),0);return {count,created,stopped};
}
(async()=>{
 assert.equal((await scenario({})).count,2);
 assert.equal((await scenario({mode:'high'})).count,4);
 assert.equal((await scenario({cores:2,mode:'high'})).count,2);
 assert.equal((await scenario({memory:2,mode:'high'})).count,1);
 assert.equal((await scenario({memory:4,mode:'high'})).count,2);
 assert.equal((await scenario({memory:undefined,mode:'high'})).count,4);
 assert.equal((await scenario({provider:'webgpu',mode:'high'})).count,1);
 assert.equal((await scenario({mode:'high',failure:3})).count,2);
 console.log('PASS: CPU mode uses 2/4 workers, respects core/memory limits, keeps GPU single-session and recovers from extra-worker initialization failure');
})().catch(e=>{console.error(e);process.exitCode=1});
