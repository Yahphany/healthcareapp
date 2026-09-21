import{r as c}from"./index-BEUv5siw.js";/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=e=>e==null?void 0:e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function I(e,t,i=[]){if(t==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:E(e),size:24,node:t,...i.length>0?{aliases:i}:{}}}/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=e=>{let t="",i=!1;for(const o of e){if(o==="-"||o==="_"||o<=" "){i=t.length>0;continue}t.length===0?t+=o.toLowerCase():t+=i?o.toUpperCase():o,i=!1}return t};/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=e=>{const t=$(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=(...e)=>e.filter((t,i,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===i).join(" ").trim();/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function A(e){return e!=null}function P(e,t={}){var b,w;const i=t.attributeNames??{},o=n=>i[n]??n,l=e.size??e.width??r.width,d=e.size??e.height??r.height,h=((b=e.aliases)==null?void 0:b.filter(n=>typeof n=="string"&&n.trim()!=="").map(n=>`lucide-${n}`))??[],f=[...e.name?[`lucide-${e.name}`]:[],...h],s=((w=t.className)==null?void 0:w.split(" ").filter(Boolean))??[],k=t.includeDefaultClasses===!1?S(...s):S("lucide",...f,...s),x=t.absoluteStrokeWidth?Number(t.strokeWidth??r["stroke-width"])*Number(e.size??e.width??r.width)/Number(t.size??t.width??r.width):t.strokeWidth??r["stroke-width"];return["svg",{...Object.entries(r).reduce((n,[u,a])=>(n[o(u)]=a,n),{}),..."color"in t&&t.color&&{[o("stroke")]:t.color},..."size"in t&&A(t.size)&&{[o("width")]:t.size,[o("height")]:t.size},..."width"in t&&A(t.width)&&{[o("width")]:t.width},..."height"in t&&A(t.height)&&{[o("height")]:t.height},[o("stroke-width")]:x,...k&&{[o("class")]:k},[o("viewBox")]:`0 0 ${l} ${d}`,...t.hasA11yProp===!1?{[o("aria-hidden")]:"true"}:{},..."attributes"in t&&t.attributes},e.node.map(n=>{const[u,a,g]=n,C=t.nonScalingStroke?{[o("vector-effect")]:"non-scaling-stroke",...a}:a;return g?[u,C,g]:[u,C]})]}/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function p(e,t={}){return P(e,{...t,attributeNames:{...t.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},R=c.createContext({}),_=()=>c.useContext(R),F=c.forwardRef(({color:e,size:t,width:i,height:o,strokeWidth:l,absoluteStrokeWidth:d,nonScalingStroke:h,className:f="",children:s,iconNode:k=[],icon:x={node:k,aliases:[],size:24},...N},b)=>{const{size:w=24,strokeWidth:n=2,absoluteStrokeWidth:u=!1,nonScalingStroke:a=!1,color:g="currentColor",className:C=""}=_()??{},z=!!s||D(N),[W,v,y=[]]=p(x,{color:e??g,width:i??t??w,height:o??t??w,strokeWidth:l??n,absoluteStrokeWidth:d??u,nonScalingStroke:h??a,className:S(C,f),hasA11yProp:z,attributes:N});return c.createElement(W,{ref:b,...v},[...y.map(([L,B])=>c.createElement(L,B)),...Array.isArray(s)?s:[s]])});/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function H(e,t=[],i=[]){const o=typeof e=="string"?I(e,t,i):e,l=c.forwardRef(({className:d,...h},f)=>c.createElement(F,{ref:f,icon:o,className:d,...h}));return o.name&&(l.displayName=j(o.name)),l}/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m={name:"activity",size:24,node:[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]};m.node;const q=H(m);export{q as A,H as c};
