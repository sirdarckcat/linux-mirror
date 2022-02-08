(()=>{var e={891:function(e){e.exports=(()=>{"use strict";var e={870:(e,t,r)=>{r.r(t),r.d(t,{createEndpoint:()=>o,expose:()=>l,proxy:()=>E,proxyMarker:()=>n,releaseProxy:()=>i,transfer:()=>g,transferHandlers:()=>c,windowEndpoint:()=>b,wrap:()=>m});const n=Symbol("Comlink.proxy"),o=Symbol("Comlink.endpoint"),i=Symbol("Comlink.releaseProxy"),a=Symbol("Comlink.thrown"),s=e=>"object"==typeof e&&null!==e||"function"==typeof e,c=new Map([["proxy",{canHandle:e=>s(e)&&e[n],serialize(e){const{port1:t,port2:r}=new MessageChannel;return l(e,t),[r,[r]]},deserialize:e=>(e.start(),m(e))}],["throw",{canHandle:e=>s(e)&&a in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function l(e,t=self){t.addEventListener("message",(function r(n){if(!n||!n.data)return;const{id:o,type:i,path:s}=Object.assign({path:[]},n.data),c=(n.data.argumentList||[]).map(w);let m;try{const t=s.slice(0,-1).reduce(((e,t)=>e[t]),e),r=s.reduce(((e,t)=>e[t]),e);switch(i){case 0:m=r;break;case 1:t[s.slice(-1)[0]]=w(n.data.value),m=!0;break;case 2:m=r.apply(t,c);break;case 3:m=E(new r(...c));break;case 4:{const{port1:t,port2:r}=new MessageChannel;l(e,r),m=g(t,[t])}break;case 5:m=void 0}}catch(e){m={value:e,[a]:0}}Promise.resolve(m).catch((e=>({value:e,[a]:0}))).then((e=>{const[n,a]=y(e);t.postMessage(Object.assign(Object.assign({},n),{id:o}),a),5===i&&(t.removeEventListener("message",r),u(t))}))})),t.start&&t.start()}function u(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function m(e,t){return d(e,[],t)}function f(e){if(e)throw new Error("Proxy has been released and is not useable")}function d(e,t=[],r=function(){}){let n=!1;const a=new Proxy(r,{get(r,o){if(f(n),o===i)return()=>v(e,{type:5,path:t.map((e=>e.toString()))}).then((()=>{u(e),n=!0}));if("then"===o){if(0===t.length)return{then:()=>a};const r=v(e,{type:0,path:t.map((e=>e.toString()))}).then(w);return r.then.bind(r)}return d(e,[...t,o])},set(r,o,i){f(n);const[a,s]=y(i);return v(e,{type:1,path:[...t,o].map((e=>e.toString())),value:a},s).then(w)},apply(r,i,a){f(n);const s=t[t.length-1];if(s===o)return v(e,{type:4}).then(w);if("bind"===s)return d(e,t.slice(0,-1));const[c,l]=h(a);return v(e,{type:2,path:t.map((e=>e.toString())),argumentList:c},l).then(w)},construct(r,o){f(n);const[i,a]=h(o);return v(e,{type:3,path:t.map((e=>e.toString())),argumentList:i},a).then(w)}});return a}function h(e){const t=e.map(y);return[t.map((e=>e[0])),(r=t.map((e=>e[1])),Array.prototype.concat.apply([],r))];var r}const p=new WeakMap;function g(e,t){return p.set(e,t),e}function E(e){return Object.assign(e,{[n]:!0})}function b(e,t=self,r="*"){return{postMessage:(t,n)=>e.postMessage(t,r,n),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function y(e){for(const[t,r]of c)if(r.canHandle(e)){const[n,o]=r.serialize(e);return[{type:3,name:t,value:n},o]}return[{type:0,value:e},p.get(e)||[]]}function w(e){switch(e.type){case 3:return c.get(e.name).deserialize(e.value);case 0:return e.value}}function v(e,t,r){return new Promise((n=>{const o=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(r){r.data&&r.data.id&&r.data.id===o&&(e.removeEventListener("message",t),n(r.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),r)}))}},162:function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&n(t,e,r);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.createDbWorker=void 0;const a=i(r(870));async function s(e){if(e.data&&"eval"===e.data.action){const t=new Int32Array(e.data.notify,0,2),r=new Uint8Array(e.data.notify,8);let n;try{n={ok:await u(e.data.request)}}catch(t){console.error("worker request error",e.data.request,t),n={err:String(t)}}const o=(new TextEncoder).encode(JSON.stringify(n));r.set(o,0),t[1]=o.length,Atomics.notify(t,0)}}function c(e){if("BODY"===e.tagName)return"body";const t=[];for(;e.parentElement&&"BODY"!==e.tagName;){if(e.id){t.unshift("#"+e.id);break}{let r=1,n=e;for(;n.previousElementSibling;)n=n.previousElementSibling,r++;t.unshift(e.tagName.toLowerCase()+":nth-child("+r+")")}e=e.parentElement}return t.join(" > ")}function l(e){return Object.keys(e)}async function u(e){if(console.log("dom vtable request",e),"select"===e.type)return[...document.querySelectorAll(e.selector)].map((t=>{const r={};for(const n of e.columns)"selector"===n?r.selector=c(t):"parent"===n?t.parentElement&&(r.parent=t.parentElement?c(t.parentElement):null):"idx"===n||(r[n]=t[n]);return r}));if("insert"===e.type){if(!e.value.parent)throw Error('"parent" column must be set when inserting');const t=document.querySelectorAll(e.value.parent);if(0===t.length)throw Error(`Parent element ${e.value.parent} could not be found`);if(t.length>1)throw Error(`Parent element ${e.value.parent} ambiguous (${t.length} results)`);const r=t[0];if(!e.value.tagName)throw Error("tagName must be set for inserting");const n=document.createElement(e.value.tagName);for(const t of l(e.value))if(null!==e.value[t]){if("tagName"===t||"parent"===t)continue;if("idx"===t||"selector"===t)throw Error(`${t} can't be set`);n[t]=e.value[t]}return r.appendChild(n),null}if("update"===e.type){const t=document.querySelector(e.value.selector);if(!t)throw Error(`Element ${e.value.selector} not found!`);const r=[];for(const n of l(e.value)){const o=e.value[n];if("parent"!==n){if("idx"!==n&&"selector"!==n&&o!==t[n]){if(console.log("SETTING ",n,t[n],"->",o),"tagName"===n)throw Error("can't change tagName");r.push(n)}}else if(o!==c(t.parentElement)){const e=document.querySelectorAll(o);if(1!==e.length)throw Error(`Invalid target parent: found ${e.length} matches`);e[0].appendChild(t)}}for(const n of r)t[n]=e.value[n];return null}throw Error(`unknown request ${e.type}`)}a.transferHandlers.set("WORKERSQLPROXIES",{canHandle:e=>!1,serialize(e){throw Error("no")},deserialize:e=>(e.start(),a.wrap(e))}),t.createDbWorker=async function(e,t,r){const n=new Worker(t),o=a.wrap(n),i=await o.SplitFileHttpDatabase(r,e);return n.addEventListener("message",s),{db:i,worker:o,configs:e}}},432:function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),o(r(162),t)}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}return r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r(432)})()},611:(e,t,r)=>{"use strict";e.exports=r.p+"c74ad46623e4ee643959.wasm"},421:(e,t,r)=>{"use strict";e.exports=r.p+"03e1cd6585d66bccd5ba.js"}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}r.m=e,r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e})(),r.b=document.baseURI||self.location.href,(()=>{"use strict";var e=r(891);const t=new URL(r(421),r.b),n=new URL(r(611),r.b);(new class{constructor(){this.NUM_WORKERS=6,this.CONFIG="https://linux-mirror-db.storage.googleapis.com/config.json",this.workers=null,this.initialConfig=null}async init(){this.initialConfig=fetch(this.CONFIG);const r=[];for(let o=0;o<this.NUM_WORKERS;o++){const o=(0,e.createDbWorker)([{from:"jsonconfig",configUrl:this.CONFIG}],t.toString(),n.toString());r.push(o)}this.workers=await Promise.all(r),window.onhashchange=()=>this.doit(),this.doit()}async getGithubCommit(e){try{const t=await(await fetch(`https://api.github.com/repos/sirdarckcat/linux-1/commits/${encodeURI(e)}`)).json();return void 0===t.sha||void 0===t.commit?{sha:e,commit:{message:"[!] GitHub error: "+t.message}}:t}catch(t){return{sha:e,commit:{message:"[!] Fetch error: "+t}}}}async load(e){if(!this.workers)throw new Error("Workers are not initialized.");if(e.match(/^CVE-\d+-\d+$/)){const t=await this.workers[5].db.query("SELECT `commit` FROM cve WHERE cve = ?",[e]);if(!t)throw new Error("No commit exists for this CVE");e=t[0].commit}let t=null;if(e.length<40){if(t=await this.getGithubCommit(e),!t.sha)throw new Error("Couldn't find commit "+e);e=t.sha}if(e.length<4||e.length<7&&e.length>=4&&!confirm("Commit is very short - might return too many (or incorrect) results."))throw new Error("Commit is too short");const r=[t||this.getGithubCommit(e),this.workers[0].db.query("SELECT tags FROM tags WHERE `commit` >= ? AND `commit` <= ? || 'g'",[e,e]),this.workers[0].db.query("SELECT upstream FROM upstream WHERE `commit` >= ? AND `commit` <= ? || 'g'",[e,e]),this.workers[1].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream >= ? AND upstream <= ? || 'g')",[e,e]),this.workers[0].db.query("SELECT fixes FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4",[e,e]),this.workers[2].db.query("SELECT tags, `commit` FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (`commit`>trunc AND `commit`<trunc||'g')",[e,e]),this.workers[3].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (upstream>trunc AND upstream<trunc||'g'))",[e,e]),this.workers[4].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) >= ?)",[e,e,e]),this.workers[5].db.query("SELECT reported_by, `commit` FROM reported_by WHERE (`commit` >= ? AND `commit` <= ? || 'g') OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) >= ?)",[e,e,e,e,e]),this.workers[5].db.query("SELECT cve FROM cve WHERE (`commit` >= ? AND `commit` <= ? || 'g') OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) >= ?)",[e,e,e,e,e])];let n;if(location.href.match(/__PERF__/)){console.time("promise perf");const e=setInterval((()=>console.log(...r)),100);n=await Promise.all(r.map((async(e,t)=>{const r=await e;return console.timeLog("promise perf"),console.log(t),r}))),clearInterval(e),console.timeEnd("promise perf")}else n=await Promise.all(r);return{commit:e,details:n.shift().commit.message.split("\n"),"the commit landed on upstream on":n.shift(),"the commit is a backport of":n.shift(),"the commit was backported to":n.shift(),"the commit fixes a bug introduced by":n.shift(),"the buggy commit landed on upstream on":n.shift(),"the buggy commit was backported to":n.shift(),"the commit introduced a bug fixed by":n.shift(),"syzkaller reference for the commit and the fix commit":n.shift(),"cve identifier for the commit and the fix commit":n.shift()}}format(e){const t={};((r,n)=>{const o=t.a=t.a||[];[...e.childNodes].forEach((e=>"#text"==e.nodeName&&e.nodeValue&&e.nodeValue.replace(r,((t,r)=>(o.unshift(document.createRange()),o[0].setStart(e,r),o[0].setEnd(e,r+t.length),t)))))})(/\b(?:[0-9a-f]{7,40}|CVE-\d+-\d+)\b/g),Object.entries(t).forEach((([e,t])=>t.forEach((t=>t.surroundContents(document.createElement(e)))))),[...e.querySelectorAll("a")].forEach((e=>{e.href="#"+e.textContent}))}async doit(){const e=document.getElementById("output")||document.body;try{let t=location.hash.slice(1);if(e.textContent="Loading "+t,document.body.className="loading",!t)return location.hash="23f57406",void location.reload();const r=await this.load(t);e.textContent=JSON.stringify(r,null,1),this.format(e),document.body.className="done"}catch(t){if(e.textContent=String(t),document.body.className="error",this.initialConfig){const e=await fetch(this.CONFIG,{cache:"reload"}),t=await this.initialConfig;(await e.json()).databaseLengthBytes!=(await t.json()).databaseLengthBytes&&confirm("Database has been updated, reload?")&&location.reload()}}}}).init()})()})();