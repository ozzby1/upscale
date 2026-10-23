const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function dep(name){try{return require(name)}catch(error){if(!process.env.UPSCALE_TEST_DEPS)throw error;return require(path.join(process.env.UPSCALE_TEST_DEPS,'node_modules',name))}}
const {parseHTML}=dep('linkedom'),tf=dep('@tensorflow/tfjs'),ort=dep('onnxruntime-web');
const {createCanvas,Image:NativeImage,ImageData,loadImage}=dep('@napi-rs/canvas');
const root=process.cwd(),assets=path.resolve(process.argv[2]||'.'),workerCode=fs.readFileSync('illustration-worker.js','utf8');
const outputDir=path.join(root,'qa-output/batch');fs.mkdirSync(outputDir,{recursive:true});
function canvas(){const c=createCanvas(1,1);c.toBlob=(callback,type='image/png',quality=.92)=>callback(new Blob([c.toBuffer(type,type==='image/jpeg'?Math.round(quality*100):undefined)],{type}));return c}
class BrowserImage extends NativeImage{
 set src(value){this.url=value}get src(){return this.url}
 get naturalWidth(){return this.width}get naturalHeight(){return this.height}
 async decode(){const bytes=Buffer.from(await(await fetch(this.url)).arrayBuffer());await new Promise((resolve,reject)=>{this.onload=resolve;this.onerror=reject;super.src=bytes})}
}
class Worker{
 constructor(){this.dead=false;const self={location:{href:'https://test.invalid/illustration-worker.js'},navigator:{},postMessage:data=>{if(!this.dead)setTimeout(()=>this.onmessage?.({data}),0)}};
  const api={Tensor:ort.Tensor,env:{wasm:{set wasmPaths(_){ort.env.wasm.wasmPaths=path.resolve('node_modules/onnxruntime-web/dist')+'/'},set numThreads(value){ort.env.wasm.numThreads=value}}},InferenceSession:{create:(url,options)=>ort.InferenceSession.create(new Uint8Array(fs.readFileSync(path.join(assets,new URL(url).pathname))),options)}};
  this.ctx=vm.createContext({self,URL,console,Float32Array,Uint8ClampedArray,importScripts(){},ort:api});vm.runInContext(workerCode,this.ctx);this.self=self;
 }
 postMessage(data){if(!this.dead)setTimeout(()=>this.self.onmessage({data}),0)}terminate(){this.dead=true;vm.runInContext('session?.release()',this.ctx)}
}
const modelRoot=path.join(process.env.UPSCALE_TEST_DEPS||root,'node_modules/@upscalerjs/esrgan-slim/models');
const loadLayersModel=async url=>{const scale=new URL(url).pathname.match(/\/x([24])\//)[1],dir=path.join(modelRoot,'x'+scale),json=JSON.parse(fs.readFileSync(path.join(dir,'model.json'))),weights=Buffer.concat(json.weightsManifest.flatMap(group=>group.paths.map(file=>fs.readFileSync(path.join(dir,file)))));return tf.loadLayersModel(tf.io.fromMemory({modelTopology:json.modelTopology,weightSpecs:json.weightsManifest.flatMap(group=>group.weights),weightData:weights.buffer.slice(weights.byteOffset,weights.byteOffset+weights.byteLength)}))};
const tfAdapter=new Proxy(tf,{get(target,key){if(key==='loadLayersModel')return loadLayersModel;if(key==='browser')return {...tf.browser,fromPixels:(input,channels)=>{const pixels=input.getContext('2d').getImageData(0,0,input.width,input.height);return tf.browser.fromPixels({data:new Uint8Array(pixels.data),width:input.width,height:input.height},channels)}};return target[key]}});
function app(language){
 const html=fs.readFileSync(language==='cs'?'cs/index.html':'index.html','utf8'),code=fs.readFileSync('app.js','utf8');
 const {window}=parseHTML(html),document=window.document,events=new Map();
 for(const element of document.querySelectorAll('*'))Object.defineProperty(element,'dataset',{value:new Proxy({},{get:(_,key)=>element.getAttribute('data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase()))})});
 const createElement=document.createElement.bind(document);document.createElement=name=>name==='canvas'?canvas():createElement(name);
 const add=window.HTMLElement.prototype.addEventListener;window.HTMLElement.prototype.addEventListener=function(type,handler,options){if(this.id){const key=this.id+':'+type;events.set(key,[...(events.get(key)||[]),handler])}return add.call(this,type,handler,options)};
 for(const id of ['format']){const el=document.getElementById(id);let value=el.value;Object.defineProperty(el,'value',{get:()=>value,set:next=>{value=next}})}
 Object.defineProperty(document.getElementById('dpi'),'validity',{get:()=>({valid:true})});
 const ctx=vm.createContext({window,document,location:{pathname:language==='cs'?'/cs/':'/',origin:'https://test.invalid'},navigator:{hardwareConcurrency:4,deviceMemory:8},performance,Worker,Image:BrowserImage,ImageData,URL,URLSearchParams,Blob,File,DOMException,TextEncoder,Uint8Array,Uint8ClampedArray,Float32Array,Uint32Array,DataView,Map,console,setTimeout,clearTimeout,AbortController,tfAdapter});
 vm.runInContext(code,ctx);vm.runInContext('runtime = async () => tfAdapter',ctx);
 return {ctx,document,events,async click(id){assert.ok(events.has(id+':click'),'registered handler '+id);for(const handler of events.get(id+':click'))await handler({preventDefault(){}})},async cleanup(){window.HTMLElement.prototype.addEventListener=add;await vm.runInContext('stopIllustration(); cachedModel?.dispose(); if (batchURL) URL.revokeObjectURL(batchURL)',ctx)}};
}
function fixture(name,w,h,type='image/png'){const c=createCanvas(w,h),g=c.getContext('2d');g.fillStyle='#e94928';g.fillRect(0,0,w,h);g.fillStyle='#32a0e4';g.fillRect(w/2,0,w/2,h);g.clearRect(0,0,Math.min(3,w),Math.min(3,h));return new File([c.toBuffer(type)],name,{type})}
async function zipEntries(app){const url=app.document.getElementById('batch-download').href;assert.ok(url);const zip=Buffer.from(await(await fetch(url)).arrayBuffer()),entries=[];let offset=0;while(zip.readUInt32LE(offset)===0x04034b50){const size=zip.readUInt32LE(offset+18),nameLength=zip.readUInt16LE(offset+26),extraLength=zip.readUInt16LE(offset+28),name=zip.subarray(offset+30,offset+30+nameLength).toString('utf8'),start=offset+30+nameLength+extraLength;entries.push({name,bytes:zip.subarray(start,start+size)});offset=start+size}assert.equal(zip.readUInt32LE(offset),0x02014b50);return {entries,zip}}
async function runCase(language,model,factor,format){
 const a=app(language),files=[fixture('stejné.png',12,10),fixture('stejné.jpg',15,11,'image/jpeg'),fixture('třetí.png',9,14)];a.ctx.files=files;a.ctx.selection=model;a.ctx.factor=factor;
 try{
  assert.equal(a.document.getElementById('expert-toggle'),null);assert.equal(a.document.getElementById('metadata-only'),null);assert.equal(a.document.getElementById('model-illustration-detail'),null);assert.equal(a.document.getElementById('settings-panel').hidden,false);assert.equal(a.document.getElementById('print-settings').hidden,false);assert.equal(a.document.getElementById('scale-hint'),null);assert.equal(a.document.getElementById('smoothing-help'),null);assert.ok(a.document.getElementById('file').hasAttribute('multiple'));
  vm.runInContext('selectModel(selection); selectScale(factor); acceptFiles(files)',a.ctx);a.document.getElementById('format').value=format;a.document.getElementById('dpi').value='300';a.document.getElementById('quality').value='85';a.document.getElementById('smoothing').value='20';
  await a.click('batch-start');assert.equal(vm.runInContext('busy',a.ctx),false);assert.equal(a.document.getElementById('batch-download').hidden,false);
  const {entries,zip}=await zipEntries(a);assert.equal(entries.length,3);
  for(let i=0;i<entries.length;i++){const ext=format==='jpeg'?'jpg':'png';assert.equal(entries[i].name,`${String(i+1).padStart(2,'0')}-${files[i].name.replace(/\.[^.]+$/,'')}-${factor}x.${ext}`);const image=await loadImage(entries[i].bytes);assert.equal(image.width,[12,15,9][i]*factor);assert.equal(image.height,[10,11,14][i]*factor);a.ctx.resultFile=new File([entries[i].bytes],entries[i].name,{type:format==='jpeg'?'image/jpeg':'image/png'});const dpi=await vm.runInContext('readResolution(resultFile)',a.ctx);assert.ok(Math.abs(dpi.x-300)<.1&&Math.abs(dpi.y-300)<.1);const c=createCanvas(image.width,image.height),g=c.getContext('2d');g.drawImage(image,0,0);const pixels=g.getImageData(0,0,c.width,c.height).data;if(format==='jpeg'){assert.ok(pixels.every((v,index)=>index%4!==3||v===255));if(i!==1)assert.ok(pixels[0]>220&&pixels[1]>220&&pixels[2]>220&&(pixels[0]+pixels[1]+pixels[2])/3>240,'transparent area flattened to white: '+i+': '+Array.from(pixels.slice(0,4)))}else if(i!==1)assert.equal(pixels[3],0,'PNG keeps transparency');}
  const stem=`${language}-${model}-${factor}x-${format}`;fs.writeFileSync(path.join(outputDir,stem+'.zip'),zip);console.log('PASS:',stem,'three real AI outputs, order, dimensions, DPI, format and transparency');
  const url=a.document.getElementById('batch-download').href;vm.runInContext('selectScale(scale===2?4:2)',a.ctx);assert.equal(a.document.getElementById('batch-download').hidden,true);await assert.rejects(fetch(url));
  vm.runInContext('restoreSingle()',a.ctx);assert.equal(vm.runInContext('queueMode',a.ctx),false);assert.equal(a.document.getElementById('batch-queue').hidden,true);
 }finally{await a.cleanup()}
}
(async()=>{await tf.setBackend('cpu');await tf.ready();for(const language of ['en','cs'])for(const model of ['photo','illustration'])await runCase(language,model,(model==='photo')===(language==='en')?2:4,language==='en'?'jpeg':'png');
 const prepared=app('cs');try{
  const d=prepared.document;
  assert.equal(d.getElementById('detail-open').hidden,true);assert.equal(d.getElementById('detail-open').disabled,true);
  assert.equal(d.getElementById('output-pixels').textContent,'— px');assert.equal(d.getElementById('output-print').textContent,'— cm');
  assert.equal(d.getElementById('output-pixels').parentElement.parentElement,d.getElementById('output-print').parentElement.parentElement);
  d.getElementById('dpi').value='150';for(const handler of prepared.events.get('dpi:input'))handler();
  await prepared.click('format-jpeg');assert.equal(d.getElementById('quality-control').hidden,false);
  prepared.ctx.preparedFile=fixture('prepared.png',12,10);await vm.runInContext('loadFile(preparedFile)',prepared.ctx);
  assert.equal(d.getElementById('dpi').value,'150');assert.equal(d.getElementById('format').value,'jpeg');
  assert.equal(d.getElementById('output-pixels').textContent,'24 × 20 px');assert.equal(d.getElementById('output-print').textContent,'0,41 × 0,34 cm');
  vm.runInContext('selectScale(4)',prepared.ctx);assert.equal(d.getElementById('output-pixels').textContent,'48 × 40 px');assert.equal(d.getElementById('output-print').textContent,'0,81 × 0,68 cm');
  assert.equal(d.getElementById('detail-open').hidden,true);await prepared.click('upscale');
  assert.equal(d.getElementById('detail-open').hidden,false);assert.equal(d.getElementById('detail-open').disabled,false);
  vm.runInContext('clearOutput()',prepared.ctx);assert.equal(d.getElementById('detail-open').hidden,true);
  console.log('PASS: detail button appears only after a successful upscale and hides when output is cleared');
  prepared.ctx.preparedFiles=[fixture('batch.png',12,10),fixture('another.png',9,14)];vm.runInContext('acceptFiles(preparedFiles);restoreSingle()',prepared.ctx);
  assert.equal(d.getElementById('format').value,'jpeg');assert.equal(d.getElementById('dpi').value,'150');assert.equal(d.getElementById('print-settings').hidden,false);
  console.log('PASS: settings visible before upload, chosen DPI/format retained, paired px/cm dimensions update');
 }finally{await prepared.cleanup()}
 const a=app('cs');try{a.ctx.files=[fixture('první.png',12,10),new File(['bad image bytes'],'chybný.png',{type:'image/png'}),fixture('poslední.png',9,10)];vm.runInContext("selectModel('illustration');acceptFiles(files)",a.ctx);a.document.getElementById('smoothing').value='0';await a.click('batch-start');assert.equal((await zipEntries(a)).entries.length,2);assert.ok(a.document.getElementById('batch-list').children[1].classList.contains('failed'));console.log('PASS: invalid middle image is reported and remaining images finish');
 vm.runInContext('restoreSingle();',a.ctx);a.ctx.files=[fixture('one.png',10,10),fixture('two.png',10,10),fixture('three.png',10,10)];vm.runInContext("acceptFiles(files);let calls=0;const realIllustration=enhanceIllustration;enhanceIllustration=async (...args)=>{if(++calls===2){controller.abort();throw new DOMException('Cancelled','AbortError')}return realIllustration(...args)}",a.ctx);await a.click('batch-start');assert.equal((await zipEntries(a)).entries.length,1);assert.equal(vm.runInContext('busy',a.ctx),false);assert.match(a.document.getElementById('batch-list').children[2].textContent,/Zrušeno/);console.log('PASS: cancellation retains completed files in ZIP and skips remaining files');
 vm.runInContext('restoreSingle()',a.ctx);a.ctx.files=Array.from({length:11},(_,i)=>fixture(i+'.png',1,1));vm.runInContext('acceptFiles(files)',a.ctx);assert.equal(vm.runInContext('queueMode',a.ctx),false);assert.match(a.document.getElementById('message').textContent,/10/);console.log('PASS: batch input limit enforced');
 }finally{await a.cleanup()}
})().catch(e=>{console.error(e);process.exitCode=1});
