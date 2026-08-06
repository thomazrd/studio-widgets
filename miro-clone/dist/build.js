(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));function l(e){if(typeof e!=`string`||!e)throw Error(`expected a non-empty string, got: `+e)}function u(e){if(typeof e!=`number`)throw Error(`expected a number, got: `+e)}var d=1,f=1,p=`emoji`,m=`keyvalue`,h=`favorites`,g=`tokens`,_=`tokens`,v=`unicode`,y=`count`,b=`group`,x=`order`,S=`group-order`,C=`eTag`,w=`url`,T=`skinTone`,E=`readonly`,D=`readwrite`,O=`skinUnicodes`,k=`skinUnicodes`,A=`https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json`,j=`en`;function M(e,t){let n=new Set,r=[];for(let i of e){let e=t(i);n.has(e)||(n.add(e),r.push(i))}return r}function N(e){return M(e,e=>e.unicode)}function P(e){function t(t,n,r){let i=n?e.createObjectStore(t,{keyPath:n}):e.createObjectStore(t);if(r)for(let[e,[t,n]]of Object.entries(r))i.createIndex(e,t,{multiEntry:n});return i}t(m),t(p,v,{[_]:[g,!0],[S]:[[b,x]],[O]:[k,!0]}),t(h,void 0,{[y]:[``]})}var F={},I={},L={};function ee(e,t,n){n.onerror=()=>t(n.error),n.onblocked=()=>t(Error(`IDB blocked`)),n.onsuccess=()=>e(n.result)}async function R(e){let t=await new Promise((t,n)=>{let r=indexedDB.open(e,d);F[e]=r,r.onupgradeneeded=e=>{e.oldVersion<f&&P(r.result)},ee(t,n,r)});return t.onclose=()=>ne(e),t}function te(e){return I[e]||(I[e]=R(e)),I[e]}function z(e,t,n,r){return new Promise((i,a)=>{let o=e.transaction(t,n,{durability:`relaxed`}),s=typeof t==`string`?o.objectStore(t):t.map(e=>o.objectStore(e)),c;r(s,o,e=>{c=e}),o.oncomplete=()=>i(c),o.onerror=()=>a(o.error)})}function ne(e){let t=F[e],n=t&&t.result;if(n){n.close();let t=L[e];if(t)for(let e of t)e()}delete F[e],delete I[e],delete L[e]}function re(e){return new Promise((t,n)=>{ne(e),ee(t,n,indexedDB.deleteDatabase(e))})}function ie(e,t){let n=L[e];n||=L[e]=[],n.push(t)}var ae=new Set(`:D.XD.:'D.O:).:X.:P.;P.XP.:L.:Z.:j.8D.XO.8).:B.:O.:S.:'o.Dx.X(.D:.:C.>0).:3.</3.<3.\\M/.:E.8#`.split(`.`));function B(e){return e.split(/[\s_]+/).map(e=>!e.match(/\w/)||ae.has(e)?e.toLowerCase():e.replace(/[)(:,]/g,``).replace(/’/g,`'`).toLowerCase()).filter(Boolean)}var oe=2;function se(e){return e.filter(Boolean).map(e=>e.toLowerCase()).filter(e=>e.length>=oe)}function ce(e){return e.map(({annotation:e,emoticon:t,group:n,order:r,shortcodes:i,skins:a,tags:o,emoji:s,version:c})=>{let l={annotation:e,group:n,order:r,tags:o,tokens:[...new Set(se([...(i||[]).map(B).flat(),...(o||[]).map(B).flat(),...B(e),t]))].sort(),unicode:s,version:c};if(t&&(l.emoticon=t),i&&(l.shortcodes=i),a){l.skinTones=[],l.skinUnicodes=[],l.skinVersions=[];for(let{tone:e,emoji:t,version:n}of a)l.skinTones.push(e),l.skinUnicodes.push(t),l.skinVersions.push(n)}return l})}function le(e,t,n,r){e[t](n).onsuccess=e=>r&&r(e.target.result)}function ue(e,t,n){le(e,`get`,t,n)}function de(e,t,n){le(e,`getAll`,t,n)}function fe(e){e.commit&&e.commit()}function pe(e,t){let n=e[0];for(let r=1;r<e.length;r++){let i=e[r];t(n)>t(i)&&(n=i)}return n}function me(e,t){let n=pe(e,e=>e.length),r=[];for(let i of n)e.some(e=>e.findIndex(e=>t(e)===t(i))===-1)||r.push(i);return r}async function he(e){return!await Ce(e,m,w)}async function ge(e,t,n){let[r,i]=await Promise.all([C,w].map(t=>Ce(e,m,t)));return r===n&&i===t}async function _e(e,t){return z(e,p,E,(e,n,r)=>{let i,a=()=>{e.getAll(i&&IDBKeyRange.lowerBound(i,!0),50).onsuccess=e=>{let n=e.target.result;for(let e of n)if(i=e.unicode,t(e))return r(e);if(n.length<50)return r();a()}};a()})}async function ve(e,t,n,r){try{let i=ce(t);await z(e,[p,m],D,([e,t],a)=>{let o,s,c=0;function l(){++c===2&&u()}function u(){if(!(o===r&&s===n)){e.clear();for(let t of i)e.put(t);t.put(r,C),t.put(n,w),fe(a)}}ue(t,C,e=>{o=e,l()}),ue(t,w,e=>{s=e,l()})})}finally{}}async function ye(e,t){return z(e,p,E,(e,n,r)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);de(e.index(S),i,r)})}async function be(e,t){let n=se(B(t));return n.length?z(e,p,E,(e,t,r)=>{let i=[],a=()=>{i.length===n.length&&o()},o=()=>{r(me(i,e=>e.unicode).sort((e,t)=>e.order<t.order?-1:1))};for(let t=0;t<n.length;t++){let r=n[t],o=t===n.length-1?IDBKeyRange.bound(r,r+`￿`,!1,!0):IDBKeyRange.only(r);de(e.index(_),o,e=>{i.push(e),a()})}}):[]}async function xe(e,t){let n=await be(e,t);return n.length?n.filter(e=>(e.shortcodes||[]).map(e=>e.toLowerCase()).includes(t.toLowerCase()))[0]||null:await _e(e,e=>(e.shortcodes||[]).includes(t.toLowerCase()))||null}async function Se(e,t){return z(e,p,E,(e,n,r)=>ue(e,t,n=>{if(n)return r(n);ue(e.index(O),t,e=>r(e||null))}))}function Ce(e,t,n){return z(e,t,E,(e,t,r)=>ue(e,n,r))}function we(e,t,n,r){return z(e,t,D,(e,t)=>{e.put(r,n),fe(t)})}function Te(e,t){return z(e,h,D,(e,n)=>ue(e,t,r=>{e.put((r||0)+1,t),fe(n)}))}function Ee(e,t,n){return n===0?[]:z(e,[h,p],E,([e,r],i,a)=>{let o=[];e.index(y).openCursor(void 0,`prev`).onsuccess=e=>{let i=e.target.result;if(!i)return a(o);function s(e){if(o.push(e),o.length===n)return a(o);i.continue()}let c=i.primaryKey,l=t.byName(c);if(l)return s(l);ue(r,c,e=>{if(e)return s(e);i.continue()})}})}var De=``;function V(e,t){let n=new Map;for(let r of e){let e=t(r);for(let t of e){let e=n;for(let n=0;n<t.length;n++){let r=t.charAt(n),i=e.get(r);i||(i=new Map,e.set(r,i)),e=i}let i=e.get(De);i||(i=[],e.set(De,i)),i.push(r)}}return(e,t)=>{let r=n;for(let t=0;t<e.length;t++){let n=e.charAt(t),i=r.get(n);if(i)r=i;else return[]}if(t)return r.get(De)||[];let i=[],a=[r];for(;a.length;){let e=[...a.shift().entries()].sort((e,t)=>e[0]<t[0]?-1:1);for(let[t,n]of e)t===De?i.push(...n):a.push(n)}return i}}var Oe=[`name`,`url`];function ke(e){let t=e&&Array.isArray(e),n=t&&e.length&&(!e[0]||Oe.some(t=>!(t in e[0])));if(!t||n)throw Error(`Custom emojis are in the wrong format`)}function H(e){ke(e);let t=(e,t)=>e.name.toLowerCase()<t.name.toLowerCase()?-1:1,n=e.sort(t),r=V(e,e=>{let t=new Set;if(e.shortcodes)for(let n of e.shortcodes)for(let e of B(n))t.add(e);return t}),i=e=>r(e,!0),a=e=>r(e,!1),o=e=>{let n=B(e);return me(n.map((e,t)=>(t<n.length-1?i:a)(e)),e=>e.name).sort(t)},s=new Map,c=new Map;for(let t of e){c.set(t.name.toLowerCase(),t);for(let e of t.shortcodes||[])s.set(e.toLowerCase(),t)}return{all:n,search:o,byShortcode:e=>s.get(e.toLowerCase()),byName:e=>c.get(e.toLowerCase())}}var Ae=typeof wrappedJSObject<`u`;function U(e){if(!e)return e;if(Ae&&(e=structuredClone(e)),delete e.tokens,e.skinTones){let t=e.skinTones.length;e.skins=Array(t);for(let n=0;n<t;n++)e.skins[n]={tone:e.skinTones[n],unicode:e.skinUnicodes[n],version:e.skinVersions[n]};delete e.skinTones,delete e.skinUnicodes,delete e.skinVersions}return e}function W(e){e||console.warn(`emoji-picker-element is more efficient if the dataSource server exposes an ETag header.`)}var je=[`annotation`,`emoji`,`group`,`order`,`version`];function Me(e){if(!e||!Array.isArray(e)||!e[0]||typeof e[0]!=`object`||je.some(t=>!(t in e[0])))throw Error(`Emoji data is in the wrong format`)}function G(e,t){if(Math.floor(e.status/100)!==2)throw Error(`Failed to fetch: `+t+`:  `+e.status)}async function K(e){let t=await fetch(e,{method:`HEAD`});G(t,e);let n=t.headers.get(`etag`);return W(n),n}async function Ne(e){let t=await fetch(e);G(t,e);let n=t.headers.get(`etag`);W(n);let r=await t.json();return Me(r),[n,r]}function Pe(e){for(var t=``,n=new Uint8Array(e),r=n.byteLength,i=-1;++i<r;)t+=String.fromCharCode(n[i]);return t}function Fe(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),i=-1;++i<t;)r[i]=e.charCodeAt(i);return n}async function q(e){let t=Fe(JSON.stringify(e)),n=Pe(await crypto.subtle.digest(`SHA-1`,t));return btoa(n)}async function Ie(e,t){let n,r=await K(t);if(!r){let e=await Ne(t);r=e[0],n=e[1],r||=await q(n)}await ge(e,t,r)||(n||=(await Ne(t))[1],await ve(e,n,t,r))}async function J(e,t){let[n,r]=await Ne(t);n||=await q(r),await ve(e,r,t,n)}async function Y(e,t){try{await Ie(e,t)}catch(e){if(e.name!==`InvalidStateError`)throw e}}var Le=class{constructor({dataSource:e=A,locale:t=j,customEmoji:n=[]}={}){this.dataSource=e,this.locale=t,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=H(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let e=this._db=await te(this._dbName);ie(this._dbName,this._clear);let t=this.dataSource;await he(e)?await J(e,t):this._lazyUpdate=Y(e,t)}async ready(){let e=async()=>(this._ready||=this._init(),this._ready);await e(),this._db||await e()}async getEmojiByGroup(e){return u(e),await this.ready(),N(await ye(this._db,e)).map(U)}async getEmojiBySearchQuery(e){l(e),await this.ready();let t=this._custom.search(e),n=N(await be(this._db,e)).map(U);return[...t,...n]}async getEmojiByShortcode(e){return l(e),await this.ready(),this._custom.byShortcode(e)||U(await xe(this._db,e))}async getEmojiByUnicodeOrName(e){return l(e),await this.ready(),this._custom.byName(e)||U(await Se(this._db,e))}async getPreferredSkinTone(){return await this.ready(),await Ce(this._db,m,T)||0}async setPreferredSkinTone(e){return u(e),await this.ready(),we(this._db,m,T,e)}async incrementFavoriteEmojiCount(e){return l(e),await this.ready(),Te(this._db,e)}async getTopFavoriteEmoji(e){return u(e),await this.ready(),(await Ee(this._db,this._custom,e)).map(U)}set customEmoji(e){this._custom=H(e)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ne(this._dbName)}async delete(){await this._shutdown(),await re(this._dbName)}},Re=[[-1,`✨`,`custom`],[0,`😀`,`smileys-emotion`],[1,`👋`,`people-body`],[3,`🐱`,`animals-nature`],[4,`🍎`,`food-drink`],[5,`🏠️`,`travel-places`],[6,`⚽`,`activities`],[7,`📝`,`objects`],[8,`⛔️`,`symbols`],[9,`🏁`,`flags`]].map(([e,t,n])=>({id:e,emoji:t,name:n})),ze=Re.slice(1),Be=2,Ve=6,He=typeof requestIdleCallback==`function`?requestIdleCallback:setTimeout;function Ue(e){return e.unicode.includes(`‍`)}var We={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},X=1e3,Z=`🖐️`,Ge=8,Ke=[`😊`,`😒`,`❤️`,`👍️`,`😍`,`😂`,`😭`,`☺️`,`😔`,`😩`,`😏`,`💕`,`🙌`,`😘`],qe=`"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif`,Je=(e,t)=>e<t?-1:+(e>t),Ye=(e,t)=>{let n=document.createElement(`canvas`);n.width=n.height=1;let r=n.getContext(`2d`,{willReadFrequently:!0});return r.textBaseline=`top`,r.font=`100px ${qe}`,r.fillStyle=t,r.scale(.01,.01),r.fillText(e,0,0),r.getImageData(0,0,1,1).data},Xe=(e,t)=>{let n=[...e].join(`,`);return n===[...t].join(`,`)&&!n.startsWith(`0,0,0,`)};function Ze(e){let t=Ye(e,`#000`),n=Ye(e,`#fff`);return t&&n&&Xe(t,n)}function Qe(){let e=Object.entries(We);try{for(let[t,n]of e)if(Ze(t))return n}catch{}return e[0][1]}var $e,et=()=>($e||=new Promise(e=>He(()=>e(Qe()))),$e),Q=new Map,tt=`️`,nt=`\ud83c`,rt=`‍`,it=127995,at=57339;function ot(e,t){if(t===0)return e;let n=e.indexOf(rt);return n===-1?(e.endsWith(tt)&&(e=e.substring(0,e.length-1)),e+nt+String.fromCodePoint(at+t-1)):e.substring(0,n)+String.fromCodePoint(it+t-1)+e.substring(n)}function $(e){e.preventDefault(),e.stopPropagation()}function st(e,t,n){return t+=e?-1:1,t<0?t=n.length-1:t>=n.length&&(t=0),t}function ct(e,t){let n=new Set,r=[];for(let i of e){let e=t(i);n.has(e)||(n.add(e),r.push(i))}return r}function lt(e,t){let n=e=>{let n={};for(let r of e)typeof r.tone==`number`&&r.version<=t&&(n[r.tone]=r.unicode);return n};return e.map(({unicode:e,skins:t,shortcodes:r,url:i,name:a,category:o,annotation:s})=>({unicode:e,name:a,shortcodes:r,url:i,category:o,annotation:s,id:e||a,skins:t&&n(t)}))}var ut=requestAnimationFrame,dt=typeof ResizeObserver==`function`;function ft(e,t,n){let r;dt?(r=new ResizeObserver(n),r.observe(e)):ut(n),t.addEventListener(`abort`,()=>{r&&r.disconnect()})}function pt(e){{let t=document.createRange();return t.selectNode(e.firstChild),t.getBoundingClientRect().width}}var mt=`😀`,ht,gt;function _t(e,t,n){let r=pt(t);if(!r){if(!gt){gt=n.cloneNode(!0);let e=getComputedStyle(n);for(let t of[`font-family`,`line-height`,`width`,`height`,`font-size`,`display`,`align-items`,`justify-content`])gt.style.setProperty(t,e.getPropertyValue(t),`important`)}try{return document.body.appendChild(gt),gt.firstChild.nodeValue=e,pt(gt)}finally{gt.remove()}}return r}function vt(e,t,n){let r=!0;for(let i of e){let e=n(i);if(!e)continue;ht===void 0&&(ht=_t(mt,t,t));let a=_t(i.unicode,e,t)/1.8<ht;Q.set(i.unicode,a),a||(r=!1)}return r}function yt(e){return ct(e,e=>e)}function bt(e){e&&(e.scrollTop=0)}function xt(e,t,n){let r=e.get(t);return r||(r=n(),e.set(t,r)),r}function St(e){return``+e}function Ct(e){let t=document.createElement(`template`);return t.innerHTML=e,t}var wt=new WeakMap,Tt=new WeakMap,Et=Symbol(`un-keyed`),Dt=`replaceChildren`in Element.prototype;function Ot(e,t){Dt?e.replaceChildren(...t):(e.innerHTML=``,e.append(...t))}function kt(e,t){let n=e.firstChild,r=0;for(;n;){if(t[r]!==n)return!0;n=n.nextSibling,r++}return r!==t.length}function At(e,t){let{targetNode:n}=t,{targetParentNode:r}=t,i=!1;r?i=kt(r,e):(i=!0,t.targetNode=void 0,t.targetParentNode=r=n.parentNode),i&&Ot(r,e)}function jt(e,t){for(let n of t){let{targetNode:t,currentExpression:r,binding:{expressionIndex:i,attributeName:a,attributeValuePre:o,attributeValuePost:s}}=n,c=e[i];if(r!==c)if(n.currentExpression=c,a)if(c===null)t.removeAttribute(a);else{let e=o+St(c)+s;t.setAttribute(a,e)}else{let e;Array.isArray(c)?At(c,n):c instanceof Element?(e=c,t.replaceWith(e)):t.nodeValue=St(c),e&&(n.targetNode=e)}}}function Mt(e){let t=``,n=!1,r=!1,i=-1,a=new Map,o=[],s=0;for(let c=0,l=e.length;c<l;c++){let u=e[c];if(t+=u.slice(s),c===l-1)break;for(let e=0;e<u.length;e++)switch(u.charAt(e)){case`<`:u.charAt(e+1)===`/`?o.pop():(n=!0,o.push(++i));break;case`>`:n=!1,r=!1;break;case`=`:r=!0;break}let d=o[o.length-1],f=xt(a,d,()=>[]),p,m,h;if(r){let n=/(\S+)="?([^"=]*)$/.exec(u);p=n[1],m=n[2];let r=/^([^">]*)("?)/.exec(e[c+1]);h=r[1],t=t.slice(0,-1*n[0].length),s=r[0].length}else s=0;let g={attributeName:p,attributeValuePre:m,attributeValuePost:h,expressionIndex:c};f.push(g),!n&&!r&&(t+=` `)}return{template:Ct(t),elementsToBindings:a}}function Nt(e,t,n){for(let r=0;r<e.length;r++){let i=e[r],a={binding:i,targetNode:i.attributeName?t:t.firstChild,targetParentNode:void 0,currentExpression:void 0};n.push(a)}}function Pt(e,t){let n=[],r;if(t.size===1&&(r=t.get(0)))Nt(r,e,n);else{let r=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT),i=e,a=-1;do{let e=t.get(++a);e&&Nt(e,i,n)}while(i=r.nextNode())}return n}function Ft(e){let{template:t,elementsToBindings:n}=xt(wt,e,()=>Mt(e)),r=t.cloneNode(!0).content.firstElementChild,i=Pt(r,n);return function(e){return jt(e,i),r}}function It(e){let t=xt(Tt,e,()=>new Map),n=Et;function r(e,...r){return xt(xt(t,e,()=>new Map),n,()=>Ft(e))(r)}function i(e,t,r){return e.map((e,i)=>{let a=n;n=r(e);try{return t(e,i)}finally{n=a}})}return{map:i,html:r}}function Lt(e,t,n,r,i,a,o,s,c){let{labelWithSkin:l,titleForEmoji:u,unicodeWithSkin:d}=n,{html:f,map:p}=It(t);function m(e,n,r){return p(e,(e,i)=>f`<button role="${n?`option`:`menuitem`}" aria-selected="${n?i===t.activeSearchItem:null}" aria-label="${l(e,t.currentSkinTone)}" title="${u(e)}" class="${`emoji`+(n&&i===t.activeSearchItem?` active`:``)+(e.unicode?``:` custom-emoji`)}" id="${`${r}-${e.id}`}" style="${e.unicode?null:`--custom-emoji-background: url(${JSON.stringify(e.url)})`}">${e.unicode?d(e,t.currentSkinTone):``}</button>`,e=>`${r}-${e.id}`)}let h=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||``}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?`expanded`:``}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?`hide-focus`:``}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||``}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?``:`hidden no-animate`}" style="transform:translateY(${t.skinTonePickerExpanded?0:`calc(-1 * var(--num-skintones) * var(--total-emoji-size))`})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${p(t.skinTones,(e,n)=>f`<div id="skintone-${n}" class="emoji ${n===t.activeSkinTone?`active`:``}" aria-selected="${n===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[n]}" aria-label="${t.i18n.skinTones[n]}">${e}</div>`,e=>e)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${p(t.groups,e=>f`<button role="tab" class="nav-button" aria-controls="tab-${e.id}" aria-label="${t.i18n.categories[e.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===e.id}" title="${t.i18n.categories[e.name]}" data-group-id="${e.id}"><div class="nav-emoji emoji">${e.emoji}</div></button>`,e=>e.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?``:`gone`}" role="alert" aria-live="polite">${t.message||``}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?`gone`:``}" role="${t.searchMode?`region`:`tabpanel`}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${p(t.currentEmojisWithCategories,(e,n)=>f`<div><div id="menu-label-${n}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===``?`gone`:``}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:e.category?e.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${n!==0&&!t.searchMode&&t.currentGroup.id===-1?`visibility-auto`:``}" style="${`--num-rows: ${Math.ceil(e.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?`listbox`:`menu`}" aria-labelledby="menu-label-${n}" id="${t.searchMode?`search-results`:null}">${m(e.emojis,t.searchMode,`emo`)}</div></div>`,e=>e.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?`gone`:``}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${m(t.currentFavorites,!1,`fav`)}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,g=(t,n)=>{for(let r of e.querySelectorAll(`[${t}]`))n(r,r.getAttribute(t))};if(c){e.appendChild(h);for(let e of[`click`,`focusout`,`input`,`keydown`,`keyup`])g(`data-on-${e}`,(t,n)=>{t.addEventListener(e,r[n])});g(`data-ref`,(e,t)=>{a[t]=e}),o.addEventListener(`abort`,()=>{e.removeChild(h)})}g(`data-action`,(e,t)=>{let n=s.get(t);n||s.set(t,n=new WeakSet),n.has(e)||(n.add(e),i[t](e))})}var Rt=typeof queueMicrotask==`function`?queueMicrotask:e=>Promise.resolve().then(e);function zt(e){let t=!1,n,r=new Map,i=new Set,a,o=()=>{if(t)return;let e=[...i];i.clear();try{for(let t of e)t()}finally{a=!1,i.size&&(a=!0,Rt(o))}},s=new Proxy({},{get(e,t){if(n){let e=r.get(t);e||(e=new Set,r.set(t,e)),e.add(n)}return e[t]},set(e,t,n){if(e[t]!==n){e[t]=n;let s=r.get(t);if(s){for(let e of s)i.add(e);a||(a=!0,Rt(o))}}return!0}});return e.addEventListener(`abort`,()=>{t=!0}),{state:s,createEffect:e=>{let t=()=>{let r=n;n=t;try{return e()}finally{n=r}};return t()}}}function Bt(e,t,n){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(!n(e[r],t[r]))return!1;return!0}var Vt=new WeakMap;function Ht(e,t,n){{let r=e.closest(`.tabpanel`),i=Vt.get(r);i||(i=new IntersectionObserver(n,{root:r,rootMargin:`50% 0px 50% 0px`,threshold:0}),Vt.set(r,i),t.addEventListener(`abort`,()=>{i.disconnect()})),i.observe(e)}}var Ut=[],{assign:Wt}=Object;function Gt(e,t){let n={},r=new AbortController,i=r.signal,{state:a,createEffect:o}=zt(i),s=new Map;Wt(a,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Wt(a,t),Wt(a,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:``,searchText:``,searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:``,skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Ge,isRtl:!1,currentGroupIndex:0,groups:ze,databaseLoaded:!1,activeSearchItemId:void 0}),o(()=>{a.currentGroup!==a.groups[a.currentGroupIndex]&&(a.currentGroup=a.groups[a.currentGroupIndex])});let c=t=>{e.getElementById(t).focus()},l=t=>e.getElementById(`emo-${t.id}`),u=(e,t)=>{n.rootElement.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))},d=(e,t)=>e.id===t.id,f=(e,t)=>{let{category:n,emojis:r}=e,{category:i,emojis:a}=t;return n===i?Bt(r,a,d):!1},p=e=>{Bt(a.currentEmojis,e,d)||(a.currentEmojis=e)},m=e=>{a.searchMode!==e&&(a.searchMode=e)},h=e=>{Bt(a.currentEmojisWithCategories,e,f)||(a.currentEmojisWithCategories=e)},g=(e,t)=>t&&e.skins&&e.skins[t]||e.unicode,_={labelWithSkin:(e,t)=>yt([e.name||g(e,t),e.annotation,...e.shortcodes||Ut].filter(Boolean)).join(`, `),titleForEmoji:e=>e.annotation||(e.shortcodes||Ut).join(`, `),unicodeWithSkin:g},v={onClickSkinToneButton:R,onEmojiClick:I,onNavClick:M,onNavKeydown:N,onSearchKeydown:j,onSkinToneOptionsClick:ee,onSkinToneOptionsFocusOut:ne,onSkinToneOptionsKeydown:te,onSkinToneOptionsKeyup:z,onSearchInput:re},y={calculateEmojiGridStyle:S,updateOnIntersection:C},b=!0;o(()=>{Lt(e,a,_,v,y,n,i,s,b),b=!1}),a.emojiVersion||et().then(e=>{e||(a.message=a.i18n.emojiUnsupportedMessage)}),o(()=>{async function e(){let e=!1,t=setTimeout(()=>{e=!0,a.message=a.i18n.loadingMessage},X);try{await a.database.ready(),a.databaseLoaded=!0}catch(e){console.error(e),a.message=a.i18n.networkErrorMessage}finally{clearTimeout(t),e&&(e=!1,a.message=``)}}a.database&&e()}),o(()=>{a.pickerStyle=`
      --num-groups: ${a.groups.length}; 
      --indicator-opacity: ${+!a.searchMode}; 
      --num-skintones: ${Ve};`}),o(()=>{a.customEmoji&&a.database&&x()}),o(()=>{a.customEmoji&&a.customEmoji.length?a.groups!==Re&&(a.groups=Re):a.groups!==ze&&(a.currentGroupIndex&&a.currentGroupIndex--,a.groups=ze)}),o(()=>{async function e(){a.databaseLoaded&&(a.currentSkinTone=await a.database.getPreferredSkinTone())}e()}),o(()=>{a.skinTones=Array(Ve).fill().map((e,t)=>ot(a.skinToneEmoji,t))}),o(()=>{a.skinToneButtonText=a.skinTones[a.currentSkinTone]}),o(()=>{a.skinToneButtonLabel=a.i18n.skinToneLabel.replace(`{skinTone}`,a.i18n.skinTones[a.currentSkinTone])}),o(()=>{async function e(){let{database:e}=a;a.defaultFavoriteEmojis=(await Promise.all(Ke.map(t=>e.getEmojiByUnicodeOrName(t)))).filter(Boolean)}a.databaseLoaded&&e()});function x(){let{customEmoji:e,database:t}=a,n=e||Ut;t.customEmoji!==n&&(t.customEmoji=n)}o(()=>{async function e(){x();let{database:e,defaultFavoriteEmojis:t,numColumns:n}=a;a.currentFavorites=await O(ct([...await e.getTopFavoriteEmoji(n),...t],e=>e.unicode||e.name).slice(0,n))}a.databaseLoaded&&a.defaultFavoriteEmojis&&e()});function S(e){ft(e,i,()=>{{let e=getComputedStyle(n.rootElement),t=parseInt(e.getPropertyValue(`--num-columns`),10),r=e.getPropertyValue(`direction`)===`rtl`;a.numColumns=t,a.isRtl=r}})}function C(e){Ht(e,i,e=>{for(let{target:t,isIntersecting:n}of e)t.classList.toggle(`onscreen`,n)})}o(()=>{async function e(){let{searchText:e,currentGroup:t,databaseLoaded:n,customEmoji:r}=a;if(!n)a.currentEmojis=[],a.searchMode=!1;else if(e.length>=Be){let t=await A(e);a.searchText===e&&(p(t),m(!0))}else{let{id:e}=t;if(e!==-1||r&&r.length){let t=await k(e);a.currentGroup.id===e&&(p(t),m(!1))}}}e()});let w=()=>{ut(()=>bt(n.tabpanelElement))};o(()=>{let{currentEmojis:e,emojiVersion:t}=a,n=e.filter(e=>e.unicode).filter(e=>Ue(e)&&!Q.has(e.unicode));!t&&n.length?(p(e),ut(()=>T(n))):(p(t?e:e.filter(E)),w())});function T(e){vt(e,n.baselineEmoji,l)?w():a.currentEmojis=[...a.currentEmojis]}function E(e){return!e.unicode||!Ue(e)||Q.get(e.unicode)}async function D(e){let t=a.emojiVersion||await et();return e.filter(({version:e})=>!e||e<=t)}async function O(e){return lt(e,a.emojiVersion||await et())}async function k(e){return O(await D(e===-1?a.customEmoji:await a.database.getEmojiByGroup(e)))}async function A(e){return O(await D(await a.database.getEmojiBySearchQuery(e)))}o(()=>{}),o(()=>{function e(){let{searchMode:e,currentEmojis:t}=a;if(e)return[{category:``,emojis:t}];let n=new Map;for(let e of t){let t=e.category||``,r=n.get(t);r||(r=[],n.set(t,r)),r.push(e)}return[...n.entries()].map(([e,t])=>({category:e,emojis:t})).sort((e,t)=>a.customCategorySorting(e.category,t.category))}h(e())}),o(()=>{a.activeSearchItemId=a.activeSearchItem!==-1&&a.currentEmojis[a.activeSearchItem].id}),o(()=>{let{rawSearchText:e}=a;He(()=>{a.searchText=(e||``).trim(),a.activeSearchItem=-1})});function j(e){if(!a.searchMode||!a.currentEmojis.length)return;let t=t=>{$(e),a.activeSearchItem=st(t,a.activeSearchItem,a.currentEmojis)};switch(e.key){case`ArrowDown`:return t(!1);case`ArrowUp`:return t(!0);case`Enter`:if(a.activeSearchItem===-1)a.activeSearchItem=0;else return $(e),F(a.currentEmojis[a.activeSearchItem].id)}}function M(e){let{target:t}=e,r=t.closest(`.nav-button`);if(!r)return;let i=parseInt(r.dataset.groupId,10);n.searchElement.value=``,a.rawSearchText=``,a.searchText=``,a.activeSearchItem=-1,a.currentGroupIndex=a.groups.findIndex(e=>e.id===i)}function N(e){let{target:t,key:n}=e,r=t=>{t&&($(e),t.focus())};switch(n){case`ArrowLeft`:return r(t.previousElementSibling);case`ArrowRight`:return r(t.nextElementSibling);case`Home`:return r(t.parentElement.firstElementChild);case`End`:return r(t.parentElement.lastElementChild)}}async function P(e){let t=await a.database.getEmojiByUnicodeOrName(e),n=[...a.currentEmojis,...a.currentFavorites].find(t=>t.id===e),r=n.unicode&&g(n,a.currentSkinTone);return await a.database.incrementFavoriteEmojiCount(e),{emoji:t,skinTone:a.currentSkinTone,...r&&{unicode:r},...n.name&&{name:n.name}}}async function F(e){let t=P(e);u(`emoji-click-sync`,t),u(`emoji-click`,await t)}function I(e){let{target:t}=e;t.classList.contains(`emoji`)&&($(e),F(t.id.substring(4)))}function L(e){a.currentSkinTone=e,a.skinTonePickerExpanded=!1,c(`skintone-button`),u(`skin-tone-change`,{skinTone:e}),a.database.setPreferredSkinTone(e)}function ee(e){let{target:{id:t}}=e,n=t&&t.match(/^skintone-(\d)/);n&&($(e),L(parseInt(n[1],10)))}function R(e){a.skinTonePickerExpanded=!a.skinTonePickerExpanded,a.activeSkinTone=a.currentSkinTone,a.skinTonePickerExpanded&&($(e),ut(()=>c(`skintone-list`)))}o(()=>{a.skinTonePickerExpanded?n.skinToneDropdown.addEventListener(`transitionend`,()=>{a.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):a.skinTonePickerExpandedAfterAnimation=!1});function te(e){if(!a.skinTonePickerExpanded)return;let t=async t=>{$(e),a.activeSkinTone=t};switch(e.key){case`ArrowUp`:return t(st(!0,a.activeSkinTone,a.skinTones));case`ArrowDown`:return t(st(!1,a.activeSkinTone,a.skinTones));case`Home`:return t(0);case`End`:return t(a.skinTones.length-1);case`Enter`:return $(e),L(a.activeSkinTone);case`Escape`:return $(e),a.skinTonePickerExpanded=!1,c(`skintone-button`)}}function z(e){if(a.skinTonePickerExpanded)switch(e.key){case` `:return $(e),L(a.activeSkinTone)}}async function ne(e){let{relatedTarget:t}=e;(!t||t.id!==`skintone-list`)&&(a.skinTonePickerExpanded=!1)}function re(e){a.rawSearchText=e.target.value}return{$set(e){Wt(a,e)},$destroy(){r.abort()}}}var Kt=`https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json`,qt=`en`,Jt={categoriesLabel:`Categories`,emojiUnsupportedMessage:`Your browser does not support color emoji.`,favoritesLabel:`Favorites`,loadingMessage:`Loading…`,networkErrorMessage:`Could not load emoji.`,regionLabel:`Emoji picker`,searchDescription:`When search results are available, press up or down to select and enter to choose.`,searchLabel:`Search`,searchResultsLabel:`Search results`,skinToneDescription:`When expanded, press up or down to select and enter to choose.`,skinToneLabel:`Choose a skin tone (currently {skinTone})`,skinTonesLabel:`Skin tones`,skinTones:[`Default`,`Light`,`Medium-Light`,`Medium`,`Medium-Dark`,`Dark`],categories:{custom:`Custom`,"smileys-emotion":`Smileys and emoticons`,"people-body":`People and body`,"animals-nature":`Animals and nature`,"food-drink":`Food and drink`,"travel-places":`Travel and places`,activities:`Activities`,objects:`Objects`,symbols:`Symbols`,flags:`Flags`}},Yt=`:host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}`,Xt=[`customEmoji`,`customCategorySorting`,`database`,`dataSource`,`i18n`,`locale`,`skinToneEmoji`,`emojiVersion`],Zt=`:host{--emoji-font-family:${qe}}`,Qt=class extends HTMLElement{constructor(e){super(),this.attachShadow({mode:`open`});let t=document.createElement(`style`);t.textContent=Yt+Zt,this.shadowRoot.appendChild(t),this._ctx={locale:qt,dataSource:Kt,skinToneEmoji:Z,customCategorySorting:Je,customEmoji:null,i18n:Jt,emojiVersion:null,...e};for(let e of Xt)e!==`database`&&Object.prototype.hasOwnProperty.call(this,e)&&(this._ctx[e]=this[e],delete this[e]);this._dbFlush()}connectedCallback(){en(this),this._cmp||=Gt(this.shadowRoot,this._ctx)}disconnectedCallback(){en(this),Rt(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:e}=this._ctx;e.close().catch(e=>console.error(e))}})}static get observedAttributes(){return[`locale`,`data-source`,`skin-tone-emoji`,`emoji-version`]}attributeChangedCallback(e,t,n){this._set(e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase()),e===`emoji-version`?parseFloat(n):n)}_set(e,t){this._ctx[e]=t,this._cmp&&this._cmp.$set({[e]:t}),[`locale`,`dataSource`].includes(e)&&this._dbFlush()}_dbCreate(){let{locale:e,dataSource:t,database:n}=this._ctx;(!n||n.locale!==e||n.dataSource!==t)&&this._set(`database`,new Le({locale:e,dataSource:t}))}_dbFlush(){Rt(()=>this._dbCreate())}},$t={};for(let e of Xt)$t[e]={get(){return e===`database`&&this._dbCreate(),this._ctx[e]},set(t){if(e===`database`)throw Error(`database is read-only`);this._set(e,t)}};Object.defineProperties(Qt.prototype,$t);function en(e){e instanceof Qt||Object.setPrototypeOf(e,customElements.get(e.tagName.toLowerCase()).prototype)}customElements.get(`emoji-picker`)||customElements.define(`emoji-picker`,Qt);var tn=class{constructor(e){this.prefix=`miro_clone_v1_${e}_`}generateId(){return Math.random().toString(36).substr(2,9)}getBoards(){let e=localStorage.getItem(this.prefix+`boards`);if(!e)return[];try{return JSON.parse(e)}catch{return[]}}saveBoards(e){localStorage.setItem(this.prefix+`boards`,JSON.stringify(e))}createBoard(e){let t=this.getBoards(),n={id:this.generateId(),title:e||`Novo Quadro`,updatedAt:new Date().toISOString(),elements:[],drawings:[],isLocked:!1};return t.push(n),this.saveBoards(t),n}updateBoard(e,t){let n=this.getBoards(),r=n.findIndex(t=>t.id===e);return r===-1?null:(n[r]={...n[r],...t,updatedAt:new Date().toISOString()},this.saveBoards(n),n[r])}deleteBoard(e){let t=this.getBoards();t=t.filter(t=>t.id!==e),this.saveBoards(t)}getBoard(e){return this.getBoards().find(t=>t.id===e)||null}},nn=document.createElement(`template`);nn.innerHTML=`
<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    background-color: #f4f5f7;
    --primary-color: #4262ff;
    --danger-color: #f24726;
  }

  * {
    box-sizing: border-box;
  }

  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  /* Dashboard View */
  .dashboard {
    width: 100%;
    height: 100%;
    padding: 40px;
    background: #f4f5f7;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .dashboard-header h1 {
    margin: 0;
    color: #050038;
    font-size: 28px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background-color: #314de0;
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: white;
  }

  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .board-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e0e0e0;
  }

  .board-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .board-title {
    font-size: 16px;
    font-weight: 600;
    color: #050038;
    margin-bottom: 8px;
  }

  .board-date {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 16px;
  }

  .board-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }

  .board-actions button {
    padding: 6px 12px;
    font-size: 12px;
  }

  /* Board View Skeleton */
  .board-view {
    display: none;
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #e5e5e5;
    animation: fadeIn 0.3s ease;
  }

  .board-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: white;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-shadow: 0 1px 8px rgba(0,0,0,0.08);
    z-index: 10;
  }

  .board-header .back-btn {
    margin-right: 20px;
    background: #f4f5f7;
    border: none;
    border-radius: 4px;
    color: #050038;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    transition: background-color 0.2s;
  }

  .board-header .back-btn:hover {
    background: #e0e2e8;
  }

  .board-header input.board-title-input {
    border: 1px solid transparent;
    font-size: 18px;
    font-weight: 600;
    color: #050038;
    background: transparent;
    outline: none;
    padding: 4px 8px;
    border-radius: 4px;
    transition: border-color 0.2s;
  }

  .board-header input.board-title-input:hover,
  .board-header input.board-title-input:focus {
    border-color: #cacedb;
  }

  .history-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  .history-actions .tool-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .history-actions .tool-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Toolbar */
  .toolbar {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 8px;
    z-index: 10;
  }

  .context-toolbar {
    position: absolute;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none;
    padding: 4px;
    gap: 4px;
    z-index: 20;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .context-toolbar.visible {
    display: flex;
  }

  .tool-btn {
    width: 44px;
    height: 44px;
    border: none;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    font-size: 20px;
    color: #050038;
  }

  .tool-btn:hover {
    background-color: #f4f5f7;
  }

  .tool-btn.active {
    background-color: #e5e9ff;
    color: var(--primary-color);
  }

  .tool-options {
    position: absolute;
    left: 80px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none; /* hidden by default */
    flex-direction: column;
    padding: 12px;
    gap: 8px;
    z-index: 10;
  }

  .tool-options.visible {
    display: flex;
  }

  .color-picker {
    width: 30px;
    height: 30px;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
  }

  .thickness-picker {
    width: 100%;
  }

  .palette-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-top: 8px;
  }

  .palette-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .palette-btn:hover {
    background: #f4f5f7;
  }

  .palette-btn.selected {
    background: #e5e9ff;
    outline: 1px solid var(--primary-color);
  }

  .palette-btn svg,
  .palette-btn i {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .icon-search-container {
    padding: 8px 0;
  }

  .icon-search-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #cacedb;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
  }
  
  .icon-search-input:focus {
    border-color: var(--primary-color);
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 4px;
  }

  /* Customizing emoji-picker-element */
  emoji-picker {
    --num-columns: 8;
    --emoji-size: 1.5rem;
    --background: white;
    width: 320px;
    height: 350px;
  }

  /* Workspace */
  .board-workspace {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden; /* Important for pan/zoom */
    background-image: radial-gradient(#d1d1d1 1px, transparent 1px);
    background-size: 20px 20px;
    cursor: grab;
  }

  .board-workspace:active {
    cursor: grabbing;
  }

  .workspace-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
  }

  .drawing-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Let clicks pass through if not drawing */
    overflow: visible;
  }

  .board-workspace[data-tool="select"] .drawing-layer path,
  .board-workspace[data-tool="select"] .drawing-layer line {
    pointer-events: auto; /* allow clicking on strokes when selecting */
    cursor: default;
  }

  .drawing-layer path.selected,
  .drawing-layer line.selected {
    filter: drop-shadow(0px 0px 4px var(--primary-color));
    stroke: var(--primary-color);
    cursor: move !important;
  }

  .board-element {
    position: absolute;
    cursor: default;
    user-select: none;
    box-sizing: border-box;
  }

  .board-element.selected {
    outline: 2px solid var(--primary-color);
    cursor: move;
  }

  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 2px solid var(--primary-color);
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
    display: none;
    z-index: 10;
  }

  .board-element.selected .resize-handle {
    display: block;
  }

  .shape-rect {
    background: transparent;
    border: 2px solid #050038;
    border-radius: 4px;
  }

  .shape-circle {
    background: transparent;
    border: 2px solid #050038;
    border-radius: 50%;
  }
  
  .shape-image {
    background: transparent;
  }
  
  .shape-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 4px;
    pointer-events: none; /* so drag events fall to the parent div */
  }

  .sticky-note {
    background: #fff9b1;
    padding: 10px;
    box-shadow: 2px 4px 8px rgba(0,0,0,0.15);
    font-size: 16px;
    min-width: 150px;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    word-break: break-word;
    color: #000000;
    font-weight: 500;
  }

  .selection-box {
    position: absolute;
    background: rgba(66, 98, 255, 0.1);
    border: 1px solid var(--primary-color);
    pointer-events: none;
    z-index: 100;
  }

  .text-note {
    font-size: 20px;
    color: #050038;
    min-width: 100px;
    padding: 5px;
  }

  .editable-content {
    width: 100%;
    height: 100%;
    outline: none;
    cursor: text;
    overflow-y: auto;
  }

  .board-view.locked .toolbar {
    pointer-events: none;
  }

  .board-view.locked .board-element {
    pointer-events: none;
  }

  .board-view.locked .drawing-layer path,
  .board-view.locked .drawing-layer line {
    pointer-events: none;
  }

  /* Modals */
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(5, 0, 56, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-overlay.visible { display: flex; }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 600px;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    overflow: hidden;
  }
  
  .modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e0e2e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-header h3 { margin: 0; color: #050038; }
  .close-modal { cursor: pointer; font-size: 20px; font-weight: bold; color: #8c8c8c; border: none; background: transparent; }
  .close-modal:hover { color: #f24726; }
  
  .modal-tabs {
    display: flex;
    border-bottom: 1px solid #e0e2e8;
  }
  .modal-tab {
    flex: 1;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    background: #f4f5f7;
    font-weight: 600;
    color: #050038;
    border-bottom: 2px solid transparent;
  }
  .modal-tab.active { background: white; border-bottom-color: var(--primary-color); color: var(--primary-color); }
  
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .tab-pane { display: none; flex-direction: column; height: 100%; }
  .tab-pane.active { display: flex; }
  
  /* Pexels Search */
  .search-bar { display: flex; gap: 8px; margin-bottom: 16px; }
  .search-bar input { flex: 1; padding: 10px; border: 1px solid #cacedb; border-radius: 6px; outline: none; font-size: 14px; }
  .search-bar input:focus { border-color: var(--primary-color); }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    overflow-y: auto;
  }
  .image-grid img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .image-grid img:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  
  /* Upload Area */
  .upload-area {
    border: 2px dashed #cacedb;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .upload-area:hover, .upload-area.dragover { border-color: var(--primary-color); background-color: #f4f5f7; }
  .upload-area input[type="file"] { display: none; }
  .upload-icon { font-size: 40px; color: #8c8c8c; }
  
  /* Cropper Modal */
  .cropper-container-wrapper { width: 100%; height: 400px; background: #e5e5e5; }
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e0e2e8;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .hidden { display: none !important; }

</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<div class="app-container">
  <!-- Dashboard -->
  <div class="dashboard" id="dashboard">
    <div class="dashboard-header">
      <h1>Meus Quadros</h1>
      <button class="btn btn-primary" id="new-board-btn">+ Novo Quadro</button>
    </div>
    <div class="boards-grid" id="boards-grid">
      <!-- Board cards will be injected here -->
    </div>
  </div>

  <!-- Board View -->
  <div class="board-view" id="board-view">
    <div class="board-header">
      <button class="back-btn" id="back-btn">← Voltar</button>
      <input type="text" class="board-title-input" id="board-title-input" value="Novo Quadro">
      <div class="history-actions">
        <button class="tool-btn" id="lock-btn" title="Bloquear/Desbloquear">🔓</button>
        <button class="tool-btn" id="undo-btn" title="Desfazer (Ctrl+Z)" disabled>↩️</button>
        <button class="tool-btn" id="redo-btn" title="Refazer (Ctrl+Y)" disabled>↪️</button>
      </div>
    </div>
    <div class="toolbar">
      <button class="tool-btn active" data-tool="select" title="Selecionar">👆</button>
      <button class="tool-btn" data-tool="pen" title="Caneta">✏️</button>
      <button class="tool-btn" data-tool="line" title="Linha">📏</button>
      <button class="tool-btn" data-tool="rect" title="Retângulo">⬜</button>
      <button class="tool-btn" data-tool="circle" title="Círculo">⭕</button>
      <button class="tool-btn" data-tool="sticky" title="Post-it">📝</button>
      <button class="tool-btn" data-tool="text" title="Texto">T</button>
      <button class="tool-btn" data-tool="image" title="Imagem">🖼️</button>
    </div>
    <div class="tool-options" id="pen-options">
      <label>Cor: <input type="color" class="color-picker" id="pen-color" value="#050038"></label>
      <label>Espessura: <input type="range" class="thickness-picker" id="pen-thickness" min="1" max="20" value="4"></label>
    </div>
    <div class="tool-options" id="emoji-options" style="padding: 0;">
      <emoji-picker id="emoji-picker"></emoji-picker>
    </div>
    <div class="tool-options" id="icon-options" style="width: 260px;">
      <label style="display:flex; align-items:center; gap: 8px; font-weight: 500;">
        Cor: <input type="color" class="color-picker" id="icon-color" value="#050038">
      </label>
      <div class="icon-search-container">
        <input type="search" class="icon-search-input" id="icon-search" placeholder="Buscar ícones...">
      </div>
      <div class="icon-grid" id="icon-grid">
        <!-- Ícones inseridos dinamicamente -->
      </div>
    </div>
    <div class="board-workspace" id="board-workspace">
      <div class="workspace-content" id="workspace-content">
        <svg class="drawing-layer" id="drawing-layer"></svg>
      </div>
      <div class="context-toolbar" id="context-toolbar">
         <button class="tool-btn" id="crop-btn" title="Cortar Imagem">✂️</button>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <div class="modal-overlay" id="image-modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Adicionar Imagem</h3>
        <button class="close-modal" id="close-image-modal">&times;</button>
      </div>
      <div class="modal-tabs">
        <div class="modal-tab active" data-target="pexels-pane">Pexels</div>
        <div class="modal-tab" data-target="upload-pane">Meu Computador</div>
      </div>
      <div class="modal-body">
        <div class="tab-pane active" id="pexels-pane">
          <div class="search-bar">
            <input type="text" id="pexels-search-input" placeholder="Buscar imagens gratuitas..." value="nature">
            <button class="btn btn-primary" id="pexels-search-btn">Buscar</button>
          </div>
          <div id="pexels-loading" class="loading-spinner hidden"></div>
          <div class="image-grid" id="pexels-grid"></div>
        </div>
        <div class="tab-pane" id="upload-pane">
           <div class="upload-area" id="upload-area">
              <span class="upload-icon">📁</span>
              <div>Arraste e solte ou clique para enviar uma imagem</div>
              <small>Envio direto seguro via UploadThing</small>
              <input type="file" id="upload-file-input" accept="image/*">
           </div>
           <div id="upload-loading" class="loading-spinner hidden"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="crop-modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Cortar Imagem</h3>
        <button class="close-modal" id="close-crop-modal">&times;</button>
      </div>
      <div class="modal-body" style="padding:0">
        <div class="cropper-container-wrapper">
           <img id="cropper-image-target" src="" style="max-width: 100%; display:block;">
        </div>
      </div>
      <div class="modal-footer">
        <div id="crop-loading" class="loading-spinner hidden" style="margin:0 10px; width:20px; height:20px;"></div>
        <button class="btn" id="cancel-crop-btn">Cancelar</button>
        <button class="btn btn-primary" id="confirm-crop-btn">Aplicar Corte</button>
      </div>
    </div>
  </div>
</div>
`;var rn=class{constructor(e){this.app=e}renderDashboard(){this.app.dashboardEl.style.display=`flex`,this.app.boardViewEl.style.display=`none`,this.app.currentBoardId=null;let e=this.app.boardStore.getBoards();this.app.boardsGridEl.innerHTML=``,e.forEach(e=>{let t=document.createElement(`div`);t.className=`board-card`,t.addEventListener(`click`,t=>{t.target.classList.contains(`delete-btn`)||this.openBoard(e.id)});let n=new Date(e.updatedAt).toLocaleString(`pt-BR`);t.innerHTML=`
        <div class="board-title">${e.title}</div>
        <div class="board-date">Atualizado em: ${n}</div>
        <div class="board-actions">
          <button class="btn btn-danger delete-btn" data-id="${e.id}">Excluir</button>
        </div>
      `,t.querySelector(`.delete-btn`).addEventListener(`click`,t=>{t.stopPropagation(),confirm(`Tem certeza que deseja excluir este quadro?`)&&(this.app.boardStore.deleteBoard(e.id),this.renderDashboard())}),this.app.boardsGridEl.appendChild(t)})}createNewBoard(){let e=this.app.boardStore.createBoard(`Quadro sem título`);this.openBoard(e.id)}openBoard(e){let t=this.app.boardStore.getBoard(e);t&&(this.app.currentBoardId=e,this.app.dashboardEl.style.display=`none`,this.app.boardViewEl.style.display=`block`,this.app.boardTitleInput.value=t.title,this.app.loadBoardState())}showDashboard(){this.renderDashboard()}},an=class{constructor(e){this.app=e}bindEvents(){this.app.workspaceEl.addEventListener(`wheel`,e=>this.handleWheel(e),{passive:!1})}handleWheel(e){e.preventDefault();let t=e.deltaY*-.001,n=Math.min(Math.max(.1,this.app.scale+t),5),r=this.app.workspaceEl.getBoundingClientRect(),i=e.clientX-r.left,a=e.clientY-r.top;this.app.panX=i-(i-this.app.panX)*(n/this.app.scale),this.app.panY=a-(a-this.app.panY)*(n/this.app.scale),this.app.scale=n,this.updateWorkspaceTransform()}updateWorkspaceTransform(){this.app.workspaceContentEl.style.transform=`translate(${this.app.panX}px, ${this.app.panY}px) scale(${this.app.scale})`}updateWorkspaceCursor(){switch(this.app.currentTool){case`select`:this.app.workspaceEl.style.cursor=`grab`;break;case`pen`:this.app.workspaceEl.style.cursor=`crosshair`;break;default:this.app.workspaceEl.style.cursor=`crosshair`}}getWorkspaceCoords(e,t){let n=this.app.workspaceEl.getBoundingClientRect();return{x:(e-n.left-this.app.panX)/this.app.scale,y:(t-n.top-this.app.panY)/this.app.scale}}},on=class{constructor(e){this.app=e}selectElement(e,t=!1){t||this.clearSelection(),this.app.selectedElements.includes(e)||(this.app.selectedElements.push(e),e.classList.add(`selected`)),this.app.updateContextToolbar&&this.app.updateContextToolbar()}addToSelection(e){this.selectElement(e,!0)}clearSelection(){this.app.selectedElements.forEach(e=>e.classList.remove(`selected`)),this.app.selectedElements=[],this.app.updateContextToolbar&&this.app.updateContextToolbar()}updateSelectionBox(e,t){if(!this.app.selectionBoxEl)return;let n=Math.min(this.app.selectionBoxStartX,e),r=Math.min(this.app.selectionBoxStartY,t),i=Math.abs(e-this.app.selectionBoxStartX),a=Math.abs(t-this.app.selectionBoxStartY);this.app.selectionBoxEl.style.left=n+`px`,this.app.selectionBoxEl.style.top=r+`px`,this.app.selectionBoxEl.style.width=i+`px`,this.app.selectionBoxEl.style.height=a+`px`}},sn=class{constructor(e){this.app=e}handleGlobalKeyDown(e){if(this.app.boardViewEl.style.display===`block`&&!(e.target.isContentEditable||e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`)&&((e.key===`Delete`||e.key===`Backspace`)&&this.app.selectedElements.length>0&&(this.app.selectedElements.forEach(e=>e.remove()),this.app.selectionManager.clearSelection(),this.app.saveBoardState()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`&&(e.shiftKey?this.app.redo():this.app.undo(),e.preventDefault()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`&&(this.app.redo(),e.preventDefault()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`c`&&this.app.selectedElements.length>0&&(this.app.clipboard=this.app.selectedElements.map(e=>{let t={type:e.dataset.type||e.tagName.toLowerCase(),x:parseFloat(e.style.left||0),y:parseFloat(e.style.top||0)};return t.type===`line`||t.type===`path`?(t.type===`line`?(t.x1=e.getAttribute(`x1`),t.y1=e.getAttribute(`y1`),t.x2=e.getAttribute(`x2`),t.y2=e.getAttribute(`y2`)):t.d=e.getAttribute(`d`),t.stroke=e.getAttribute(`stroke`),t.strokeWidth=e.getAttribute(`stroke-width`),t.transform=e.getAttribute(`transform`)||``):((t.type===`rect`||t.type===`circle`||t.type===`sticky`)&&(t.width=parseFloat(e.style.width||e.offsetWidth),t.height=parseFloat(e.style.height||e.offsetHeight)),(t.type===`sticky`||t.type===`text`)&&(t.content=e.querySelector(`.editable-content`).innerHTML)),t})),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`v`&&this.app.clipboard&&this.app.clipboard.length>0)){this.app.selectionManager.clearSelection();let e=[];this.app.clipboard.forEach(t=>{if(t.type===`line`||t.type===`path`){let n;t.type===`line`?(n=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),n.setAttribute(`x1`,t.x1),n.setAttribute(`y1`,t.y1),n.setAttribute(`x2`,t.x2),n.setAttribute(`y2`,t.y2)):(n=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),n.setAttribute(`d`,t.d),n.setAttribute(`fill`,`none`),n.setAttribute(`stroke-linejoin`,`round`)),n.setAttribute(`stroke`,t.stroke||`#050038`),n.setAttribute(`stroke-width`,t.strokeWidth||`4`),n.setAttribute(`stroke-linecap`,`round`);let r=(t.transform||``).match(/translate\(([^,]+),([^)]+)\)/),i=0,a=0;r&&(i=parseFloat(r[1]),a=parseFloat(r[2])),t.transform=`translate(${i+20}, ${a+20})`,n.setAttribute(`transform`,t.transform),this.app.drawingLayer.appendChild(n),e.push(n)}else{let n={...t,x:t.x+20,y:t.y+20},r=this.app.elementFactory.createElement(t.type,null,n);e.push(r),t.x+=20,t.y+=20}}),e.forEach(e=>this.app.selectionManager.addToSelection(e)),this.app.saveBoardState()}}},cn=class{constructor(e){this.app=e}startDrawing(e){this.app.currentTool===`line`?(this.app.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),this.app.currentPath.setAttribute(`x1`,e.x),this.app.currentPath.setAttribute(`y1`,e.y),this.app.currentPath.setAttribute(`x2`,e.x),this.app.currentPath.setAttribute(`y2`,e.y)):(this.app.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),this.app.currentPath.setAttribute(`d`,`M ${e.x} ${e.y}`),this.app.currentPath.setAttribute(`fill`,`none`),this.app.currentPath.setAttribute(`stroke-linejoin`,`round`)),this.app.currentPath.setAttribute(`stroke`,this.app.penColorInput.value),this.app.currentPath.setAttribute(`stroke-width`,this.app.penThicknessInput.value),this.app.currentPath.setAttribute(`stroke-linecap`,`round`),this.app.drawingLayer.appendChild(this.app.currentPath)}continueDrawing(e){if(this.app.currentPath)if(this.app.currentTool===`line`)this.app.currentPath.setAttribute(`x2`,e.x),this.app.currentPath.setAttribute(`y2`,e.y);else{let t=this.app.currentPath.getAttribute(`d`);this.app.currentPath.setAttribute(`d`,`${t} L ${e.x} ${e.y}`)}}},ln=class{constructor(e){this.app=e}createElement(e,t,n=null){let r=document.createElement(`div`);if(r.classList.add(`board-element`),r.style.left=(n?n.x:t.x)+`px`,r.style.top=(n?n.y:t.y)+`px`,e===`rect`||e===`circle`||e===`sticky`||e===`image`){let e=document.createElement(`div`);e.classList.add(`resize-handle`),e.addEventListener(`pointerdown`,t=>{if(this.app.currentTool!==`select`)return;t.stopPropagation(),this.app.selectionManager.selectElement(r,!1),this.app.isResizingElement=!0;let n=this.app.workspaceManager.getWorkspaceCoords(t.clientX,t.clientY);this.app.elementDragStartX=n.x,this.app.elementDragStartY=n.y,this.app.elementStartWidth=parseFloat(r.style.width||0),this.app.elementStartHeight=parseFloat(r.style.height||0),e.setPointerCapture(t.pointerId)}),e.addEventListener(`pointerup`,t=>{e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId)}),r.appendChild(e)}if(e===`rect`)r.classList.add(`shape-rect`),r.style.width=(n?n.width:200)+`px`,r.style.height=(n?n.height:100)+`px`;else if(e===`circle`)r.classList.add(`shape-circle`),r.style.width=(n?n.width:150)+`px`,r.style.height=(n?n.height:150)+`px`;else if(e===`sticky`){r.classList.add(`sticky-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Nota...`,r.style.width=n&&n.width?n.width+`px`:``,r.style.height=n&&n.height?n.height+`px`:``,r.appendChild(e),e.addEventListener(`blur`,()=>this.app.saveBoardState()),e.addEventListener(`pointerdown`,e=>{this.app.currentTool!==`select`&&e.stopPropagation()}),e.addEventListener(`keydown`,e=>e.stopPropagation())}else if(e===`emoji`)r.classList.add(`shape-emoji`),r.innerHTML=n?n.content:this.app.currentEmoji,r.style.width=(n?n.width:60)+`px`,r.style.height=(n?n.height:60)+`px`,r.style.fontSize=(n&&n.fontSize?n.fontSize:48)+`px`,r.style.display=`flex`,r.style.justifyContent=`center`,r.style.alignItems=`center`,r.dataset.content=r.innerHTML;else if(e===`icon`){r.classList.add(`shape-icon`);let e=n?n.iconName:this.app.currentIcon,t=n?n.color:this.app.shadowRoot.getElementById(`icon-color`).value;r.innerHTML=`<i class="${e}" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"></i>`,r.style.color=t,r.style.width=(n?n.width:60)+`px`,r.style.height=(n?n.height:60)+`px`,r.style.fontSize=(n&&n.fontSize?n.fontSize:48)+`px`,r.dataset.iconName=e,r.dataset.color=t}else if(e===`text`){r.classList.add(`text-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Texto`,r.appendChild(e),e.addEventListener(`blur`,()=>this.app.saveBoardState()),e.addEventListener(`pointerdown`,e=>{this.app.currentTool!==`select`&&e.stopPropagation()}),e.addEventListener(`keydown`,e=>e.stopPropagation())}else if(e===`image`){r.classList.add(`shape-image`),r.style.width=(n&&n.width?n.width:200)+`px`,r.style.height=(n&&n.height?n.height:200)+`px`;let e=document.createElement(`img`);e.src=n?n.url:``,r.appendChild(e)}return r.dataset.type=e,r.addEventListener(`pointerdown`,t=>{if(this.app.currentTool!==`select`)return;if(e===`rect`||e===`circle`){let n=r.getBoundingClientRect(),i=t.clientX-n.left,a=t.clientY-n.top,o=n.width,s=n.height,c=!1;if(e===`rect`)i>15&&i<o-15&&a>15&&a<s-15&&(c=!0);else if(e===`circle`){let e=o/2,t=s/2,n=o/2,r=i-e,l=a-t;Math.sqrt(r*r+l*l)<n-15&&(c=!0)}if(c){r.style.pointerEvents=`none`;let e=this.app.shadowRoot.elementFromPoint(t.clientX,t.clientY);if(r.style.pointerEvents=``,!(!e||e===this.app.workspaceEl||e===this.app.workspaceContentEl||e===this.app.drawingLayer||e.tagName.toLowerCase()===`svg`||e.classList.contains(`board-workspace`))&&e!==r){t.stopPropagation(),e.dispatchEvent(new PointerEvent(t.type,t)),e.dispatchEvent(new MouseEvent(`mousedown`,t)),e.isContentEditable&&e.focus();return}}}t.stopPropagation(),t.shiftKey?this.app.selectedElements.includes(r)?(this.app.selectedElements=this.app.selectedElements.filter(e=>e!==r),r.classList.remove(`selected`)):this.app.selectionManager.addToSelection(r):this.app.selectedElements.includes(r)||this.app.selectionManager.selectElement(r,!1),this.app.isDraggingElement=!0;let n=this.app.workspaceManager.getWorkspaceCoords(t.clientX,t.clientY);this.app.elementDragStartX=n.x,this.app.elementDragStartY=n.y,r.setPointerCapture(t.pointerId)}),r.addEventListener(`pointerup`,e=>{r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId)}),this.app.workspaceContentEl.appendChild(r),n||this.app.saveBoardState(),r}},un=c(o(((e,t)=>{(function(n,r){typeof e==`object`&&t!==void 0?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.Cropper=r())})(e,(function(){"use strict";function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function t(t){for(var n=1;n<arguments.length;n++){var r=arguments[n]==null?{}:arguments[n];n%2?e(Object(r),!0).forEach(function(e){c(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function n(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function r(e){var t=n(e,`string`);return typeof t==`symbol`?t:t+``}function i(e){"@babel/helpers - typeof";return i=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},i(e)}function a(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function o(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,`value`in i&&(i.writable=!0),Object.defineProperty(e,r(i.key),i)}}function s(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function c(e,t,n){return t=r(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e){return u(e)||d(e)||f(e)||m()}function u(e){if(Array.isArray(e))return p(e)}function d(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function f(e,t){if(e){if(typeof e==`string`)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`)return Array.from(e);if(n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}}function p(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function m(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var h=typeof window<`u`&&window.document!==void 0,g=h?window:{},_=h&&g.document.documentElement?`ontouchstart`in g.document.documentElement:!1,v=h?`PointerEvent`in g:!1,y=`cropper`,b=`all`,x=`crop`,S=`move`,C=`zoom`,w=`e`,T=`w`,E=`s`,D=`n`,O=`ne`,k=`nw`,A=`se`,j=`sw`,M=`${y}-crop`,N=`${y}-disabled`,P=`${y}-hidden`,F=`${y}-hide`,I=`${y}-invisible`,L=`${y}-modal`,ee=`${y}-move`,R=`${y}Action`,te=`${y}Preview`,z=`crop`,ne=`move`,re=`none`,ie=`crop`,ae=`cropend`,B=`cropmove`,oe=`cropstart`,se=`dblclick`,ce=_?`touchstart`:`mousedown`,le=_?`touchmove`:`mousemove`,ue=_?`touchend touchcancel`:`mouseup`,de=v?`pointerdown`:ce,fe=v?`pointermove`:le,pe=v?`pointerup pointercancel`:ue,me=`ready`,he=`resize`,ge=`wheel`,_e=`zoom`,ve=`image/jpeg`,ye=/^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/,be=/^data:/,xe=/^data:image\/jpeg;base64,/,Se=/^img|canvas$/i,Ce=200,we=100,Te={viewMode:0,dragMode:z,initialAspectRatio:NaN,aspectRatio:NaN,data:null,preview:``,responsive:!0,restore:!0,checkCrossOrigin:!0,checkOrientation:!0,modal:!0,guides:!0,center:!0,highlight:!0,background:!0,autoCrop:!0,autoCropArea:.8,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,wheelZoomRatio:.1,cropBoxMovable:!0,cropBoxResizable:!0,toggleDragModeOnDblclick:!0,minCanvasWidth:0,minCanvasHeight:0,minCropBoxWidth:0,minCropBoxHeight:0,minContainerWidth:Ce,minContainerHeight:we,ready:null,cropstart:null,cropmove:null,cropend:null,crop:null,zoom:null},Ee=`<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>`,De=Number.isNaN||g.isNaN;function V(e){return typeof e==`number`&&!De(e)}var Oe=function(e){return e>0&&e<1/0};function ke(e){return e===void 0}function H(e){return i(e)===`object`&&e!==null}var Ae=Object.prototype.hasOwnProperty;function U(e){if(!H(e))return!1;try{var t=e.constructor,n=t.prototype;return t&&n&&Ae.call(n,`isPrototypeOf`)}catch{return!1}}function W(e){return typeof e==`function`}var je=Array.prototype.slice;function Me(e){return Array.from?Array.from(e):je.call(e)}function G(e,t){return e&&W(t)&&(Array.isArray(e)||V(e.length)?Me(e).forEach(function(n,r){t.call(e,n,r,e)}):H(e)&&Object.keys(e).forEach(function(n){t.call(e,e[n],n,e)})),e}var K=Object.assign||function(e){var t=[...arguments].slice(1);return H(e)&&t.length>0&&t.forEach(function(t){H(t)&&Object.keys(t).forEach(function(n){e[n]=t[n]})}),e},Ne=/\.\d*(?:0|9){12}\d*$/;function Pe(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1e11;return Ne.test(e)?Math.round(e*t)/t:e}var Fe=/^width|height|left|top|marginLeft|marginTop$/;function q(e,t){var n=e.style;G(t,function(e,t){Fe.test(t)&&V(e)&&(e=`${e}px`),n[t]=e})}function Ie(e,t){return e.classList?e.classList.contains(t):e.className.indexOf(t)>-1}function J(e,t){if(t){if(V(e.length)){G(e,function(e){J(e,t)});return}if(e.classList){e.classList.add(t);return}var n=e.className.trim();n?n.indexOf(t)<0&&(e.className=`${n} ${t}`):e.className=t}}function Y(e,t){if(t){if(V(e.length)){G(e,function(e){Y(e,t)});return}if(e.classList){e.classList.remove(t);return}e.className.indexOf(t)>=0&&(e.className=e.className.replace(t,``))}}function Le(e,t,n){if(t){if(V(e.length)){G(e,function(e){Le(e,t,n)});return}n?J(e,t):Y(e,t)}}var Re=/([a-z\d])([A-Z])/g;function ze(e){return e.replace(Re,`$1-$2`).toLowerCase()}function Be(e,t){return H(e[t])?e[t]:e.dataset?e.dataset[t]:e.getAttribute(`data-${ze(t)}`)}function Ve(e,t,n){H(n)?e[t]=n:e.dataset?e.dataset[t]=n:e.setAttribute(`data-${ze(t)}`,n)}function He(e,t){if(H(e[t]))try{delete e[t]}catch{e[t]=void 0}else if(e.dataset)try{delete e.dataset[t]}catch{e.dataset[t]=void 0}else e.removeAttribute(`data-${ze(t)}`)}var Ue=/\s\s*/,We=function(){var e=!1;if(h){var t=!1,n=function(){},r=Object.defineProperty({},"once",{get:function(){return e=!0,t},set:function(e){t=e}});g.addEventListener(`test`,n,r),g.removeEventListener(`test`,n,r)}return e}();function X(e,t,n){var r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},i=n;t.trim().split(Ue).forEach(function(t){if(!We){var a=e.listeners;a&&a[t]&&a[t][n]&&(i=a[t][n],delete a[t][n],Object.keys(a[t]).length===0&&delete a[t],Object.keys(a).length===0&&delete e.listeners)}e.removeEventListener(t,i,r)})}function Z(e,t,n){var r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},i=n;t.trim().split(Ue).forEach(function(t){if(r.once&&!We){var a=e.listeners,o=a===void 0?{}:a;i=function(){delete o[t][n],e.removeEventListener(t,i,r);var a=[...arguments];n.apply(e,a)},o[t]||(o[t]={}),o[t][n]&&e.removeEventListener(t,o[t][n],r),o[t][n]=i,e.listeners=o}e.addEventListener(t,i,r)})}function Ge(e,t,n){var r;return W(Event)&&W(CustomEvent)?r=new CustomEvent(t,{detail:n,bubbles:!0,cancelable:!0}):(r=document.createEvent(`CustomEvent`),r.initCustomEvent(t,!0,!0,n)),e.dispatchEvent(r)}function Ke(e){var t=e.getBoundingClientRect();return{left:t.left+(window.pageXOffset-document.documentElement.clientLeft),top:t.top+(window.pageYOffset-document.documentElement.clientTop)}}var qe=g.location,Je=/^(\w+:)\/\/([^:/?#]*):?(\d*)/i;function Ye(e){var t=e.match(Je);return t!==null&&(t[1]!==qe.protocol||t[2]!==qe.hostname||t[3]!==qe.port)}function Xe(e){var t=`timestamp=${new Date().getTime()}`;return e+(e.indexOf(`?`)===-1?`?`:`&`)+t}function Ze(e){var t=e.rotate,n=e.scaleX,r=e.scaleY,i=e.translateX,a=e.translateY,o=[];V(i)&&i!==0&&o.push(`translateX(${i}px)`),V(a)&&a!==0&&o.push(`translateY(${a}px)`),V(t)&&t!==0&&o.push(`rotate(${t}deg)`),V(n)&&n!==1&&o.push(`scaleX(${n})`),V(r)&&r!==1&&o.push(`scaleY(${r})`);var s=o.length?o.join(` `):`none`;return{WebkitTransform:s,msTransform:s,transform:s}}function Qe(e){var n=t({},e),r=0;return G(e,function(e,t){delete n[t],G(n,function(t){var n=Math.abs(e.startX-t.startX),i=Math.abs(e.startY-t.startY),a=Math.abs(e.endX-t.endX),o=Math.abs(e.endY-t.endY),s=Math.sqrt(n*n+i*i),c=(Math.sqrt(a*a+o*o)-s)/s;Math.abs(c)>Math.abs(r)&&(r=c)})}),r}function $e(e,n){var r=e.pageX,i=e.pageY,a={endX:r,endY:i};return n?a:t({startX:r,startY:i},a)}function et(e){var t=0,n=0,r=0;return G(e,function(e){var i=e.startX,a=e.startY;t+=i,n+=a,r+=1}),t/=r,n/=r,{pageX:t,pageY:n}}function Q(e){var t=e.aspectRatio,n=e.height,r=e.width,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:`contain`,a=Oe(r),o=Oe(n);if(a&&o){var s=n*t;i===`contain`&&s>r||i===`cover`&&s<r?n=r/t:r=n*t}else a?n=r/t:o&&(r=n*t);return{width:r,height:n}}function tt(e){var t=e.width,n=e.height,r=e.degree;if(r=Math.abs(r)%180,r===90)return{width:n,height:t};var i=r%90*Math.PI/180,a=Math.sin(i),o=Math.cos(i),s=t*o+n*a,c=t*a+n*o;return r>90?{width:c,height:s}:{width:s,height:c}}function nt(e,t,n,r){var i=t.aspectRatio,a=t.naturalWidth,o=t.naturalHeight,s=t.rotate,c=s===void 0?0:s,u=t.scaleX,d=u===void 0?1:u,f=t.scaleY,p=f===void 0?1:f,m=n.aspectRatio,h=n.naturalWidth,g=n.naturalHeight,_=r.fillColor,v=_===void 0?`transparent`:_,y=r.imageSmoothingEnabled,b=y===void 0?!0:y,x=r.imageSmoothingQuality,S=x===void 0?`low`:x,C=r.maxWidth,w=C===void 0?1/0:C,T=r.maxHeight,E=T===void 0?1/0:T,D=r.minWidth,O=D===void 0?0:D,k=r.minHeight,A=k===void 0?0:k,j=document.createElement(`canvas`),M=j.getContext(`2d`),N=Q({aspectRatio:m,width:w,height:E}),P=Q({aspectRatio:m,width:O,height:A},`cover`),F=Math.min(N.width,Math.max(P.width,h)),I=Math.min(N.height,Math.max(P.height,g)),L=Q({aspectRatio:i,width:w,height:E}),ee=Q({aspectRatio:i,width:O,height:A},`cover`),R=Math.min(L.width,Math.max(ee.width,a)),te=Math.min(L.height,Math.max(ee.height,o)),z=[-R/2,-te/2,R,te];return j.width=Pe(F),j.height=Pe(I),M.fillStyle=v,M.fillRect(0,0,F,I),M.save(),M.translate(F/2,I/2),M.rotate(c*Math.PI/180),M.scale(d,p),M.imageSmoothingEnabled=b,M.imageSmoothingQuality=S,M.drawImage.apply(M,[e].concat(l(z.map(function(e){return Math.floor(Pe(e))})))),M.restore(),j}var rt=String.fromCharCode;function it(e,t,n){var r=``;n+=t;for(var i=t;i<n;i+=1)r+=rt(e.getUint8(i));return r}var at=/^data:.*,/;function ot(e){var t=e.replace(at,``),n=atob(t),r=new ArrayBuffer(n.length),i=new Uint8Array(r);return G(i,function(e,t){i[t]=n.charCodeAt(t)}),r}function $(e,t){for(var n=[],r=8192,i=new Uint8Array(e);i.length>0;)n.push(rt.apply(null,Me(i.subarray(0,r)))),i=i.subarray(r);return`data:${t};base64,${btoa(n.join(``))}`}function st(e){var t=new DataView(e),n;try{var r,i,a;if(t.getUint8(0)===255&&t.getUint8(1)===216)for(var o=t.byteLength,s=2;s+1<o;){if(t.getUint8(s)===255&&t.getUint8(s+1)===225){i=s;break}s+=1}if(i){var c=i+4,l=i+10;if(it(t,c,4)===`Exif`){var u=t.getUint16(l);if(r=u===18761,(r||u===19789)&&t.getUint16(l+2,r)===42){var d=t.getUint32(l+4,r);d>=8&&(a=l+d)}}}if(a){var f=t.getUint16(a,r),p,m;for(m=0;m<f;m+=1)if(p=a+m*12+2,t.getUint16(p,r)===274){p+=8,n=t.getUint16(p,r),t.setUint16(p,1,r);break}}}catch{n=1}return n}function ct(e){var t=0,n=1,r=1;switch(e){case 2:n=-1;break;case 3:t=-180;break;case 4:r=-1;break;case 5:t=90,r=-1;break;case 6:t=90;break;case 7:t=90,n=-1;break;case 8:t=-90;break}return{rotate:t,scaleX:n,scaleY:r}}var lt={render:function(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.cropped&&this.renderCropBox()},initContainer:function(){var e=this.element,t=this.options,n=this.container,r=this.cropper,i=Number(t.minContainerWidth),a=Number(t.minContainerHeight);J(r,P),Y(e,P);var o={width:Math.max(n.offsetWidth,i>=0?i:Ce),height:Math.max(n.offsetHeight,a>=0?a:we)};this.containerData=o,q(r,{width:o.width,height:o.height}),J(e,P),Y(r,P)},initCanvas:function(){var e=this.containerData,t=this.imageData,n=this.options.viewMode,r=Math.abs(t.rotate)%180==90,i=r?t.naturalHeight:t.naturalWidth,a=r?t.naturalWidth:t.naturalHeight,o=i/a,s=e.width,c=e.height;e.height*o>e.width?n===3?s=e.height*o:c=e.width/o:n===3?c=e.width/o:s=e.height*o;var l={aspectRatio:o,naturalWidth:i,naturalHeight:a,width:s,height:c};this.canvasData=l,this.limited=n===1||n===2,this.limitCanvas(!0,!0),l.width=Math.min(Math.max(l.width,l.minWidth),l.maxWidth),l.height=Math.min(Math.max(l.height,l.minHeight),l.maxHeight),l.left=(e.width-l.width)/2,l.top=(e.height-l.height)/2,l.oldLeft=l.left,l.oldTop=l.top,this.initialCanvasData=K({},l)},limitCanvas:function(e,t){var n=this.options,r=this.containerData,i=this.canvasData,a=this.cropBoxData,o=n.viewMode,s=i.aspectRatio,c=this.cropped&&a;if(e){var l=Number(n.minCanvasWidth)||0,u=Number(n.minCanvasHeight)||0;o>1?(l=Math.max(l,r.width),u=Math.max(u,r.height),o===3&&(u*s>l?l=u*s:u=l/s)):o>0&&(l?l=Math.max(l,c?a.width:0):u?u=Math.max(u,c?a.height:0):c&&(l=a.width,u=a.height,u*s>l?l=u*s:u=l/s));var d=Q({aspectRatio:s,width:l,height:u});l=d.width,u=d.height,i.minWidth=l,i.minHeight=u,i.maxWidth=1/0,i.maxHeight=1/0}if(t)if(o>+!c){var f=r.width-i.width,p=r.height-i.height;i.minLeft=Math.min(0,f),i.minTop=Math.min(0,p),i.maxLeft=Math.max(0,f),i.maxTop=Math.max(0,p),c&&this.limited&&(i.minLeft=Math.min(a.left,a.left+(a.width-i.width)),i.minTop=Math.min(a.top,a.top+(a.height-i.height)),i.maxLeft=a.left,i.maxTop=a.top,o===2&&(i.width>=r.width&&(i.minLeft=Math.min(0,f),i.maxLeft=Math.max(0,f)),i.height>=r.height&&(i.minTop=Math.min(0,p),i.maxTop=Math.max(0,p))))}else i.minLeft=-i.width,i.minTop=-i.height,i.maxLeft=r.width,i.maxTop=r.height},renderCanvas:function(e,t){var n=this.canvasData,r=this.imageData;if(t){var i=tt({width:r.naturalWidth*Math.abs(r.scaleX||1),height:r.naturalHeight*Math.abs(r.scaleY||1),degree:r.rotate||0}),a=i.width,o=i.height,s=n.width*(a/n.naturalWidth),c=n.height*(o/n.naturalHeight);n.left-=(s-n.width)/2,n.top-=(c-n.height)/2,n.width=s,n.height=c,n.aspectRatio=a/o,n.naturalWidth=a,n.naturalHeight=o,this.limitCanvas(!0,!1)}(n.width>n.maxWidth||n.width<n.minWidth)&&(n.left=n.oldLeft),(n.height>n.maxHeight||n.height<n.minHeight)&&(n.top=n.oldTop),n.width=Math.min(Math.max(n.width,n.minWidth),n.maxWidth),n.height=Math.min(Math.max(n.height,n.minHeight),n.maxHeight),this.limitCanvas(!1,!0),n.left=Math.min(Math.max(n.left,n.minLeft),n.maxLeft),n.top=Math.min(Math.max(n.top,n.minTop),n.maxTop),n.oldLeft=n.left,n.oldTop=n.top,q(this.canvas,K({width:n.width,height:n.height},Ze({translateX:n.left,translateY:n.top}))),this.renderImage(e),this.cropped&&this.limited&&this.limitCropBox(!0,!0)},renderImage:function(e){var t=this.canvasData,n=this.imageData,r=n.naturalWidth*(t.width/t.naturalWidth),i=n.naturalHeight*(t.height/t.naturalHeight);K(n,{width:r,height:i,left:(t.width-r)/2,top:(t.height-i)/2}),q(this.image,K({width:n.width,height:n.height},Ze(K({translateX:n.left,translateY:n.top},n)))),e&&this.output()},initCropBox:function(){var e=this.options,t=this.canvasData,n=e.aspectRatio||e.initialAspectRatio,r=Number(e.autoCropArea)||.8,i={width:t.width,height:t.height};n&&(t.height*n>t.width?i.height=i.width/n:i.width=i.height*n),this.cropBoxData=i,this.limitCropBox(!0,!0),i.width=Math.min(Math.max(i.width,i.minWidth),i.maxWidth),i.height=Math.min(Math.max(i.height,i.minHeight),i.maxHeight),i.width=Math.max(i.minWidth,i.width*r),i.height=Math.max(i.minHeight,i.height*r),i.left=t.left+(t.width-i.width)/2,i.top=t.top+(t.height-i.height)/2,i.oldLeft=i.left,i.oldTop=i.top,this.initialCropBoxData=K({},i)},limitCropBox:function(e,t){var n=this.options,r=this.containerData,i=this.canvasData,a=this.cropBoxData,o=this.limited,s=n.aspectRatio;if(e){var c=Number(n.minCropBoxWidth)||0,l=Number(n.minCropBoxHeight)||0,u=o?Math.min(r.width,i.width,i.width+i.left,r.width-i.left):r.width,d=o?Math.min(r.height,i.height,i.height+i.top,r.height-i.top):r.height;c=Math.min(c,r.width),l=Math.min(l,r.height),s&&(c&&l?l*s>c?l=c/s:c=l*s:c?l=c/s:l&&(c=l*s),d*s>u?d=u/s:u=d*s),a.minWidth=Math.min(c,u),a.minHeight=Math.min(l,d),a.maxWidth=u,a.maxHeight=d}t&&(o?(a.minLeft=Math.max(0,i.left),a.minTop=Math.max(0,i.top),a.maxLeft=Math.min(r.width,i.left+i.width)-a.width,a.maxTop=Math.min(r.height,i.top+i.height)-a.height):(a.minLeft=0,a.minTop=0,a.maxLeft=r.width-a.width,a.maxTop=r.height-a.height))},renderCropBox:function(){var e=this.options,t=this.containerData,n=this.cropBoxData;(n.width>n.maxWidth||n.width<n.minWidth)&&(n.left=n.oldLeft),(n.height>n.maxHeight||n.height<n.minHeight)&&(n.top=n.oldTop),n.width=Math.min(Math.max(n.width,n.minWidth),n.maxWidth),n.height=Math.min(Math.max(n.height,n.minHeight),n.maxHeight),this.limitCropBox(!1,!0),n.left=Math.min(Math.max(n.left,n.minLeft),n.maxLeft),n.top=Math.min(Math.max(n.top,n.minTop),n.maxTop),n.oldLeft=n.left,n.oldTop=n.top,e.movable&&e.cropBoxMovable&&Ve(this.face,R,n.width>=t.width&&n.height>=t.height?S:b),q(this.cropBox,K({width:n.width,height:n.height},Ze({translateX:n.left,translateY:n.top}))),this.cropped&&this.limited&&this.limitCanvas(!0,!0),this.disabled||this.output()},output:function(){this.preview(),Ge(this.element,ie,this.getData())}},ut={initPreview:function(){var e=this.element,t=this.crossOrigin,n=this.options.preview,r=t?this.crossOriginUrl:this.url,i=e.alt||`The image to preview`,a=document.createElement(`img`);if(t&&(a.crossOrigin=t),a.src=r,a.alt=i,this.viewBox.appendChild(a),this.viewBoxImage=a,n){var o=n;typeof n==`string`?o=e.ownerDocument.querySelectorAll(n):n.querySelector&&(o=[n]),this.previews=o,G(o,function(e){var n=document.createElement(`img`);Ve(e,te,{width:e.offsetWidth,height:e.offsetHeight,html:e.innerHTML}),t&&(n.crossOrigin=t),n.src=r,n.alt=i,n.style.cssText=`display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"`,e.innerHTML=``,e.appendChild(n)})}},resetPreview:function(){G(this.previews,function(e){var t=Be(e,te);q(e,{width:t.width,height:t.height}),e.innerHTML=t.html,He(e,te)})},preview:function(){var e=this.imageData,t=this.canvasData,n=this.cropBoxData,r=n.width,i=n.height,a=e.width,o=e.height,s=n.left-t.left-e.left,c=n.top-t.top-e.top;!this.cropped||this.disabled||(q(this.viewBoxImage,K({width:a,height:o},Ze(K({translateX:-s,translateY:-c},e)))),G(this.previews,function(t){var n=Be(t,te),l=n.width,u=n.height,d=l,f=u,p=1;r&&(p=l/r,f=i*p),i&&f>u&&(p=u/i,d=r*p,f=u),q(t,{width:d,height:f}),q(t.getElementsByTagName(`img`)[0],K({width:a*p,height:o*p},Ze(K({translateX:-s*p,translateY:-c*p},e))))}))}},dt={bind:function(){var e=this.element,t=this.options,n=this.cropper;W(t.cropstart)&&Z(e,oe,t.cropstart),W(t.cropmove)&&Z(e,B,t.cropmove),W(t.cropend)&&Z(e,ae,t.cropend),W(t.crop)&&Z(e,ie,t.crop),W(t.zoom)&&Z(e,_e,t.zoom),Z(n,de,this.onCropStart=this.cropStart.bind(this)),t.zoomable&&t.zoomOnWheel&&Z(n,ge,this.onWheel=this.wheel.bind(this),{passive:!1,capture:!0}),t.toggleDragModeOnDblclick&&Z(n,se,this.onDblclick=this.dblclick.bind(this)),Z(e.ownerDocument,fe,this.onCropMove=this.cropMove.bind(this)),Z(e.ownerDocument,pe,this.onCropEnd=this.cropEnd.bind(this)),t.responsive&&Z(window,he,this.onResize=this.resize.bind(this))},unbind:function(){var e=this.element,t=this.options,n=this.cropper;W(t.cropstart)&&X(e,oe,t.cropstart),W(t.cropmove)&&X(e,B,t.cropmove),W(t.cropend)&&X(e,ae,t.cropend),W(t.crop)&&X(e,ie,t.crop),W(t.zoom)&&X(e,_e,t.zoom),X(n,de,this.onCropStart),t.zoomable&&t.zoomOnWheel&&X(n,ge,this.onWheel,{passive:!1,capture:!0}),t.toggleDragModeOnDblclick&&X(n,se,this.onDblclick),X(e.ownerDocument,fe,this.onCropMove),X(e.ownerDocument,pe,this.onCropEnd),t.responsive&&X(window,he,this.onResize)}},ft={resize:function(){if(!this.disabled){var e=this.options,t=this.container,n=this.containerData,r=t.offsetWidth/n.width,i=t.offsetHeight/n.height,a=Math.abs(r-1)>Math.abs(i-1)?r:i;if(a!==1){var o,s;e.restore&&(o=this.getCanvasData(),s=this.getCropBoxData()),this.render(),e.restore&&(this.setCanvasData(G(o,function(e,t){o[t]=e*a})),this.setCropBoxData(G(s,function(e,t){s[t]=e*a})))}}},dblclick:function(){this.disabled||this.options.dragMode===re||this.setDragMode(Ie(this.dragBox,M)?ne:z)},wheel:function(e){var t=this,n=Number(this.options.wheelZoomRatio)||.1,r=1;this.disabled||(e.preventDefault(),!this.wheeling&&(this.wheeling=!0,setTimeout(function(){t.wheeling=!1},50),e.deltaY?r=e.deltaY>0?1:-1:e.wheelDelta?r=-e.wheelDelta/120:e.detail&&(r=e.detail>0?1:-1),this.zoom(-r*n,e)))},cropStart:function(e){var t=e.buttons,n=e.button;if(!(this.disabled||(e.type===`mousedown`||e.type===`pointerdown`&&e.pointerType===`mouse`)&&(V(t)&&t!==1||V(n)&&n!==0||e.ctrlKey))){var r=this.options,i=this.pointers,a;e.changedTouches?G(e.changedTouches,function(e){i[e.identifier]=$e(e)}):i[e.pointerId||0]=$e(e),a=Object.keys(i).length>1&&r.zoomable&&r.zoomOnTouch?C:Be(e.target,R),ye.test(a)&&Ge(this.element,oe,{originalEvent:e,action:a})!==!1&&(e.preventDefault(),this.action=a,this.cropping=!1,a===x&&(this.cropping=!0,J(this.dragBox,L)))}},cropMove:function(e){var t=this.action;if(!(this.disabled||!t)){var n=this.pointers;e.preventDefault(),Ge(this.element,B,{originalEvent:e,action:t})!==!1&&(e.changedTouches?G(e.changedTouches,function(e){K(n[e.identifier]||{},$e(e,!0))}):K(n[e.pointerId||0]||{},$e(e,!0)),this.change(e))}},cropEnd:function(e){if(!this.disabled){var t=this.action,n=this.pointers;e.changedTouches?G(e.changedTouches,function(e){delete n[e.identifier]}):delete n[e.pointerId||0],t&&(e.preventDefault(),Object.keys(n).length||(this.action=``),this.cropping&&(this.cropping=!1,Le(this.dragBox,L,this.cropped&&this.options.modal)),Ge(this.element,ae,{originalEvent:e,action:t}))}}},pt={change:function(e){var t=this.options,n=this.canvasData,r=this.containerData,i=this.cropBoxData,a=this.pointers,o=this.action,s=t.aspectRatio,c=i.left,l=i.top,u=i.width,d=i.height,f=c+u,p=l+d,m=0,h=0,g=r.width,_=r.height,v=!0,y;!s&&e.shiftKey&&(s=u&&d?u/d:1),this.limited&&(m=i.minLeft,h=i.minTop,g=m+Math.min(r.width,n.width,n.left+n.width),_=h+Math.min(r.height,n.height,n.top+n.height));var M=a[Object.keys(a)[0]],N={x:M.endX-M.startX,y:M.endY-M.startY},F=function(e){switch(e){case w:f+N.x>g&&(N.x=g-f);break;case T:c+N.x<m&&(N.x=m-c);break;case D:l+N.y<h&&(N.y=h-l);break;case E:p+N.y>_&&(N.y=_-p);break}};switch(o){case b:c+=N.x,l+=N.y;break;case w:if(N.x>=0&&(f>=g||s&&(l<=h||p>=_))){v=!1;break}F(w),u+=N.x,u<0&&(o=T,u=-u,c-=u),s&&(d=u/s,l+=(i.height-d)/2);break;case D:if(N.y<=0&&(l<=h||s&&(c<=m||f>=g))){v=!1;break}F(D),d-=N.y,l+=N.y,d<0&&(o=E,d=-d,l-=d),s&&(u=d*s,c+=(i.width-u)/2);break;case T:if(N.x<=0&&(c<=m||s&&(l<=h||p>=_))){v=!1;break}F(T),u-=N.x,c+=N.x,u<0&&(o=w,u=-u,c-=u),s&&(d=u/s,l+=(i.height-d)/2);break;case E:if(N.y>=0&&(p>=_||s&&(c<=m||f>=g))){v=!1;break}F(E),d+=N.y,d<0&&(o=D,d=-d,l-=d),s&&(u=d*s,c+=(i.width-u)/2);break;case O:if(s){if(N.y<=0&&(l<=h||f>=g)){v=!1;break}F(D),d-=N.y,l+=N.y,u=d*s}else F(D),F(w),N.x>=0?f<g?u+=N.x:N.y<=0&&l<=h&&(v=!1):u+=N.x,N.y<=0?l>h&&(d-=N.y,l+=N.y):(d-=N.y,l+=N.y);u<0&&d<0?(o=j,d=-d,u=-u,l-=d,c-=u):u<0?(o=k,u=-u,c-=u):d<0&&(o=A,d=-d,l-=d);break;case k:if(s){if(N.y<=0&&(l<=h||c<=m)){v=!1;break}F(D),d-=N.y,l+=N.y,u=d*s,c+=i.width-u}else F(D),F(T),N.x<=0?c>m?(u-=N.x,c+=N.x):N.y<=0&&l<=h&&(v=!1):(u-=N.x,c+=N.x),N.y<=0?l>h&&(d-=N.y,l+=N.y):(d-=N.y,l+=N.y);u<0&&d<0?(o=A,d=-d,u=-u,l-=d,c-=u):u<0?(o=O,u=-u,c-=u):d<0&&(o=j,d=-d,l-=d);break;case j:if(s){if(N.x<=0&&(c<=m||p>=_)){v=!1;break}F(T),u-=N.x,c+=N.x,d=u/s}else F(E),F(T),N.x<=0?c>m?(u-=N.x,c+=N.x):N.y>=0&&p>=_&&(v=!1):(u-=N.x,c+=N.x),N.y>=0?p<_&&(d+=N.y):d+=N.y;u<0&&d<0?(o=O,d=-d,u=-u,l-=d,c-=u):u<0?(o=A,u=-u,c-=u):d<0&&(o=k,d=-d,l-=d);break;case A:if(s){if(N.x>=0&&(f>=g||p>=_)){v=!1;break}F(w),u+=N.x,d=u/s}else F(E),F(w),N.x>=0?f<g?u+=N.x:N.y>=0&&p>=_&&(v=!1):u+=N.x,N.y>=0?p<_&&(d+=N.y):d+=N.y;u<0&&d<0?(o=k,d=-d,u=-u,l-=d,c-=u):u<0?(o=j,u=-u,c-=u):d<0&&(o=O,d=-d,l-=d);break;case S:this.move(N.x,N.y),v=!1;break;case C:this.zoom(Qe(a),e),v=!1;break;case x:if(!N.x||!N.y){v=!1;break}y=Ke(this.cropper),c=M.startX-y.left,l=M.startY-y.top,u=i.minWidth,d=i.minHeight,N.x>0?o=N.y>0?A:O:N.x<0&&(c-=u,o=N.y>0?j:k),N.y<0&&(l-=d),this.cropped||(Y(this.cropBox,P),this.cropped=!0,this.limited&&this.limitCropBox(!0,!0));break}v&&(i.width=u,i.height=d,i.left=c,i.top=l,this.action=o,this.renderCropBox()),G(a,function(e){e.startX=e.endX,e.startY=e.endY})}},mt={crop:function(){return this.ready&&!this.cropped&&!this.disabled&&(this.cropped=!0,this.limitCropBox(!0,!0),this.options.modal&&J(this.dragBox,L),Y(this.cropBox,P),this.setCropBoxData(this.initialCropBoxData)),this},reset:function(){return this.ready&&!this.disabled&&(this.imageData=K({},this.initialImageData),this.canvasData=K({},this.initialCanvasData),this.cropBoxData=K({},this.initialCropBoxData),this.renderCanvas(),this.cropped&&this.renderCropBox()),this},clear:function(){return this.cropped&&!this.disabled&&(K(this.cropBoxData,{left:0,top:0,width:0,height:0}),this.cropped=!1,this.renderCropBox(),this.limitCanvas(!0,!0),this.renderCanvas(),Y(this.dragBox,L),J(this.cropBox,P)),this},replace:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return!this.disabled&&e&&(this.isImg&&(this.element.src=e),t?(this.url=e,this.image.src=e,this.ready&&(this.viewBoxImage.src=e,G(this.previews,function(t){t.getElementsByTagName(`img`)[0].src=e}))):(this.isImg&&(this.replaced=!0),this.options.data=null,this.uncreate(),this.load(e))),this},enable:function(){return this.ready&&this.disabled&&(this.disabled=!1,Y(this.cropper,N)),this},disable:function(){return this.ready&&!this.disabled&&(this.disabled=!0,J(this.cropper,N)),this},destroy:function(){var e=this.element;return e[y]?(e[y]=void 0,this.isImg&&this.replaced&&(e.src=this.originalUrl),this.uncreate(),this):this},move:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,n=this.canvasData,r=n.left,i=n.top;return this.moveTo(ke(e)?e:r+Number(e),ke(t)?t:i+Number(t))},moveTo:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,n=this.canvasData,r=!1;return e=Number(e),t=Number(t),this.ready&&!this.disabled&&this.options.movable&&(V(e)&&(n.left=e,r=!0),V(t)&&(n.top=t,r=!0),r&&this.renderCanvas(!0)),this},zoom:function(e,t){var n=this.canvasData;return e=Number(e),e=e<0?1/(1-e):1+e,this.zoomTo(n.width*e/n.naturalWidth,null,t)},zoomTo:function(e,t,n){var r=this.options,i=this.canvasData,a=i.width,o=i.height,s=i.naturalWidth,c=i.naturalHeight;if(e=Number(e),e>=0&&this.ready&&!this.disabled&&r.zoomable){var l=s*e,u=c*e;if(Ge(this.element,_e,{ratio:e,oldRatio:a/s,originalEvent:n})===!1)return this;if(n){var d=this.pointers,f=Ke(this.cropper),p=d&&Object.keys(d).length?et(d):{pageX:n.pageX,pageY:n.pageY};i.left-=(l-a)*((p.pageX-f.left-i.left)/a),i.top-=(u-o)*((p.pageY-f.top-i.top)/o)}else U(t)&&V(t.x)&&V(t.y)?(i.left-=(l-a)*((t.x-i.left)/a),i.top-=(u-o)*((t.y-i.top)/o)):(i.left-=(l-a)/2,i.top-=(u-o)/2);i.width=l,i.height=u,this.renderCanvas(!0)}return this},rotate:function(e){return this.rotateTo((this.imageData.rotate||0)+Number(e))},rotateTo:function(e){return e=Number(e),V(e)&&this.ready&&!this.disabled&&this.options.rotatable&&(this.imageData.rotate=e%360,this.renderCanvas(!0,!0)),this},scaleX:function(e){var t=this.imageData.scaleY;return this.scale(e,V(t)?t:1)},scaleY:function(e){var t=this.imageData.scaleX;return this.scale(V(t)?t:1,e)},scale:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,n=this.imageData,r=!1;return e=Number(e),t=Number(t),this.ready&&!this.disabled&&this.options.scalable&&(V(e)&&(n.scaleX=e,r=!0),V(t)&&(n.scaleY=t,r=!0),r&&this.renderCanvas(!0,!0)),this},getData:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,t=this.options,n=this.imageData,r=this.canvasData,i=this.cropBoxData,a;if(this.ready&&this.cropped){a={x:i.left-r.left,y:i.top-r.top,width:i.width,height:i.height};var o=n.width/n.naturalWidth;if(G(a,function(e,t){a[t]=e/o}),e){var s=Math.round(a.y+a.height),c=Math.round(a.x+a.width);a.x=Math.round(a.x),a.y=Math.round(a.y),a.width=c-a.x,a.height=s-a.y}}else a={x:0,y:0,width:0,height:0};return t.rotatable&&(a.rotate=n.rotate||0),t.scalable&&(a.scaleX=n.scaleX||1,a.scaleY=n.scaleY||1),a},setData:function(e){var t=this.options,n=this.imageData,r=this.canvasData,i={};if(this.ready&&!this.disabled&&U(e)){var a=!1;t.rotatable&&V(e.rotate)&&e.rotate!==n.rotate&&(n.rotate=e.rotate,a=!0),t.scalable&&(V(e.scaleX)&&e.scaleX!==n.scaleX&&(n.scaleX=e.scaleX,a=!0),V(e.scaleY)&&e.scaleY!==n.scaleY&&(n.scaleY=e.scaleY,a=!0)),a&&this.renderCanvas(!0,!0);var o=n.width/n.naturalWidth;V(e.x)&&(i.left=e.x*o+r.left),V(e.y)&&(i.top=e.y*o+r.top),V(e.width)&&(i.width=e.width*o),V(e.height)&&(i.height=e.height*o),this.setCropBoxData(i)}return this},getContainerData:function(){return this.ready?K({},this.containerData):{}},getImageData:function(){return this.sized?K({},this.imageData):{}},getCanvasData:function(){var e=this.canvasData,t={};return this.ready&&G([`left`,`top`,`width`,`height`,`naturalWidth`,`naturalHeight`],function(n){t[n]=e[n]}),t},setCanvasData:function(e){var t=this.canvasData,n=t.aspectRatio;return this.ready&&!this.disabled&&U(e)&&(V(e.left)&&(t.left=e.left),V(e.top)&&(t.top=e.top),V(e.width)?(t.width=e.width,t.height=e.width/n):V(e.height)&&(t.height=e.height,t.width=e.height*n),this.renderCanvas(!0)),this},getCropBoxData:function(){var e=this.cropBoxData,t;return this.ready&&this.cropped&&(t={left:e.left,top:e.top,width:e.width,height:e.height}),t||{}},setCropBoxData:function(e){var t=this.cropBoxData,n=this.options.aspectRatio,r,i;return this.ready&&this.cropped&&!this.disabled&&U(e)&&(V(e.left)&&(t.left=e.left),V(e.top)&&(t.top=e.top),V(e.width)&&e.width!==t.width&&(r=!0,t.width=e.width),V(e.height)&&e.height!==t.height&&(i=!0,t.height=e.height),n&&(r?t.height=t.width/n:i&&(t.width=t.height*n)),this.renderCropBox()),this},getCroppedCanvas:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!this.ready||!window.HTMLCanvasElement)return null;var t=this.canvasData,n=nt(this.image,this.imageData,t,e);if(!this.cropped)return n;var r=this.getData(e.rounded),i=r.x,a=r.y,o=r.width,s=r.height,c=n.width/Math.floor(t.naturalWidth);c!==1&&(i*=c,a*=c,o*=c,s*=c);var u=o/s,d=Q({aspectRatio:u,width:e.maxWidth||1/0,height:e.maxHeight||1/0}),f=Q({aspectRatio:u,width:e.minWidth||0,height:e.minHeight||0},`cover`),p=Q({aspectRatio:u,width:e.width||(c===1?o:n.width),height:e.height||(c===1?s:n.height)}),m=p.width,h=p.height;m=Math.min(d.width,Math.max(f.width,m)),h=Math.min(d.height,Math.max(f.height,h));var g=document.createElement(`canvas`),_=g.getContext(`2d`);g.width=Pe(m),g.height=Pe(h),_.fillStyle=e.fillColor||`transparent`,_.fillRect(0,0,m,h);var v=e.imageSmoothingEnabled,y=v===void 0?!0:v,b=e.imageSmoothingQuality;_.imageSmoothingEnabled=y,b&&(_.imageSmoothingQuality=b);var x=n.width,S=n.height,C=i,w=a,T,E,D,O,k,A;C<=-o||C>x?(C=0,T=0,D=0,k=0):C<=0?(D=-C,C=0,T=Math.min(x,o+C),k=T):C<=x&&(D=0,T=Math.min(o,x-C),k=T),T<=0||w<=-s||w>S?(w=0,E=0,O=0,A=0):w<=0?(O=-w,w=0,E=Math.min(S,s+w),A=E):w<=S&&(O=0,E=Math.min(s,S-w),A=E);var j=[C,w,T,E];if(k>0&&A>0){var M=m/o;j.push(D*M,O*M,k*M,A*M)}return _.drawImage.apply(_,[n].concat(l(j.map(function(e){return Math.floor(Pe(e))})))),g},setAspectRatio:function(e){var t=this.options;return!this.disabled&&!ke(e)&&(t.aspectRatio=Math.max(0,e)||NaN,this.ready&&(this.initCropBox(),this.cropped&&this.renderCropBox())),this},setDragMode:function(e){var t=this.options,n=this.dragBox,r=this.face;if(this.ready&&!this.disabled){var i=e===z,a=t.movable&&e===ne;e=i||a?e:re,t.dragMode=e,Ve(n,R,e),Le(n,M,i),Le(n,ee,a),t.cropBoxMovable||(Ve(r,R,e),Le(r,M,i),Le(r,ee,a))}return this}},ht=g.Cropper,gt=function(){function e(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(a(this,e),!t||!Se.test(t.tagName))throw Error(`The first argument is required and must be an <img> or <canvas> element.`);this.element=t,this.options=K({},Te,U(n)&&n),this.cropped=!1,this.disabled=!1,this.pointers={},this.ready=!1,this.reloading=!1,this.replaced=!1,this.sized=!1,this.sizing=!1,this.init()}return s(e,[{key:`init`,value:function(){var e=this.element,t=e.tagName.toLowerCase(),n;if(!e[y]){if(e[y]=this,t===`img`){if(this.isImg=!0,n=e.getAttribute(`src`)||``,this.originalUrl=n,!n)return;n=e.src}else t===`canvas`&&window.HTMLCanvasElement&&(n=e.toDataURL());this.load(n)}}},{key:`load`,value:function(e){var t=this;if(e){this.url=e,this.imageData={};var n=this.element,r=this.options;if(!r.rotatable&&!r.scalable&&(r.checkOrientation=!1),!r.checkOrientation||!window.ArrayBuffer){this.clone();return}if(be.test(e)){xe.test(e)?this.read(ot(e)):this.clone();return}var i=new XMLHttpRequest,a=this.clone.bind(this);this.reloading=!0,this.xhr=i,i.onabort=a,i.onerror=a,i.ontimeout=a,i.onprogress=function(){i.getResponseHeader(`content-type`)!==ve&&i.abort()},i.onload=function(){t.read(i.response)},i.onloadend=function(){t.reloading=!1,t.xhr=null},r.checkCrossOrigin&&Ye(e)&&n.crossOrigin&&(e=Xe(e)),i.open(`GET`,e,!0),i.responseType=`arraybuffer`,i.withCredentials=n.crossOrigin===`use-credentials`,i.send()}}},{key:`read`,value:function(e){var t=this.options,n=this.imageData,r=st(e),i=0,a=1,o=1;if(r>1){this.url=$(e,ve);var s=ct(r);i=s.rotate,a=s.scaleX,o=s.scaleY}t.rotatable&&(n.rotate=i),t.scalable&&(n.scaleX=a,n.scaleY=o),this.clone()}},{key:`clone`,value:function(){var e=this.element,t=this.url,n=e.crossOrigin,r=t;this.options.checkCrossOrigin&&Ye(t)&&(n||=`anonymous`,r=Xe(t)),this.crossOrigin=n,this.crossOriginUrl=r;var i=document.createElement(`img`);n&&(i.crossOrigin=n),i.src=r||t,i.alt=e.alt||`The image to crop`,this.image=i,i.onload=this.start.bind(this),i.onerror=this.stop.bind(this),J(i,F),e.parentNode.insertBefore(i,e.nextSibling)}},{key:`start`,value:function(){var e=this,t=this.image;t.onload=null,t.onerror=null,this.sizing=!0;var n=g.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(g.navigator.userAgent),r=function(t,n){K(e.imageData,{naturalWidth:t,naturalHeight:n,aspectRatio:t/n}),e.initialImageData=K({},e.imageData),e.sizing=!1,e.sized=!0,e.build()};if(t.naturalWidth&&!n){r(t.naturalWidth,t.naturalHeight);return}var i=document.createElement(`img`),a=document.body||document.documentElement;this.sizingImage=i,i.onload=function(){r(i.width,i.height),n||a.removeChild(i)},i.src=t.src,n||(i.style.cssText=`left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;`,a.appendChild(i))}},{key:`stop`,value:function(){var e=this.image;e.onload=null,e.onerror=null,e.parentNode.removeChild(e),this.image=null}},{key:`build`,value:function(){if(!(!this.sized||this.ready)){var e=this.element,t=this.options,n=this.image,r=e.parentNode,i=document.createElement(`div`);i.innerHTML=Ee;var a=i.querySelector(`.${y}-container`),o=a.querySelector(`.${y}-canvas`),s=a.querySelector(`.${y}-drag-box`),c=a.querySelector(`.${y}-crop-box`),l=c.querySelector(`.${y}-face`);this.container=r,this.cropper=a,this.canvas=o,this.dragBox=s,this.cropBox=c,this.viewBox=a.querySelector(`.${y}-view-box`),this.face=l,o.appendChild(n),J(e,P),r.insertBefore(a,e.nextSibling),Y(n,F),this.initPreview(),this.bind(),t.initialAspectRatio=Math.max(0,t.initialAspectRatio)||NaN,t.aspectRatio=Math.max(0,t.aspectRatio)||NaN,t.viewMode=Math.max(0,Math.min(3,Math.round(t.viewMode)))||0,J(c,P),t.guides||J(c.getElementsByClassName(`${y}-dashed`),P),t.center||J(c.getElementsByClassName(`${y}-center`),P),t.background&&J(a,`${y}-bg`),t.highlight||J(l,I),t.cropBoxMovable&&(J(l,ee),Ve(l,R,b)),t.cropBoxResizable||(J(c.getElementsByClassName(`${y}-line`),P),J(c.getElementsByClassName(`${y}-point`),P)),this.render(),this.ready=!0,this.setDragMode(t.dragMode),t.autoCrop&&this.crop(),this.setData(t.data),W(t.ready)&&Z(e,me,t.ready,{once:!0}),Ge(e,me)}}},{key:`unbuild`,value:function(){if(this.ready){this.ready=!1,this.unbind(),this.resetPreview();var e=this.cropper.parentNode;e&&e.removeChild(this.cropper),Y(this.element,P)}}},{key:`uncreate`,value:function(){this.ready?(this.unbuild(),this.ready=!1,this.cropped=!1):this.sizing?(this.sizingImage.onload=null,this.sizing=!1,this.sized=!1):this.reloading?(this.xhr.onabort=null,this.xhr.abort()):this.image&&this.stop()}}],[{key:`noConflict`,value:function(){return window.Cropper=ht,e}},{key:`setDefaults`,value:function(e){K(Te,U(e)&&e)}}])}();return K(gt.prototype,lt,ut,dt,ft,pt,mt),gt}))}))()),dn=`/*!
 * Cropper.js v1.6.2
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2024-04-21T07:43:02.731Z
 */
.cropper-container{-ms-touch-action:none;touch-action:none;-webkit-touch-callout:none;user-select:none;direction:ltr;font-size:0;line-height:0;position:relative}.cropper-container img{backface-visibility:hidden;image-orientation:0deg;width:100%;height:100%;display:block;min-width:0!important;max-width:none!important;min-height:0!important;max-height:none!important}.cropper-wrap-box,.cropper-canvas,.cropper-drag-box,.cropper-crop-box,.cropper-modal{position:absolute;inset:0}.cropper-wrap-box,.cropper-canvas{overflow:hidden}.cropper-drag-box{opacity:0;background-color:#fff}.cropper-modal{opacity:.5;background-color:#000}.cropper-view-box{outline:1px solid #3399ffbf;width:100%;height:100%;display:block;overflow:hidden}.cropper-dashed{opacity:.5;border:0 dashed #eee;display:block;position:absolute}.cropper-dashed.dashed-h{border-top-width:1px;border-bottom-width:1px;width:100%;height:33.3333%;top:33.3333%;left:0}.cropper-dashed.dashed-v{border-left-width:1px;border-right-width:1px;width:33.3333%;height:100%;top:0;left:33.3333%}.cropper-center{opacity:.75;width:0;height:0;display:block;position:absolute;top:50%;left:50%}.cropper-center:before,.cropper-center:after{content:" ";background-color:#eee;display:block;position:absolute}.cropper-center:before{width:7px;height:1px;top:0;left:-3px}.cropper-center:after{width:1px;height:7px;top:-3px;left:0}.cropper-face,.cropper-line,.cropper-point{opacity:.1;width:100%;height:100%;display:block;position:absolute}.cropper-face{background-color:#fff;top:0;left:0}.cropper-line{background-color:#39f}.cropper-line.line-e{cursor:ew-resize;width:5px;top:0;right:-3px}.cropper-line.line-n{cursor:ns-resize;height:5px;top:-3px;left:0}.cropper-line.line-w{cursor:ew-resize;width:5px;top:0;left:-3px}.cropper-line.line-s{cursor:ns-resize;height:5px;bottom:-3px;left:0}.cropper-point{opacity:.75;background-color:#39f;width:5px;height:5px}.cropper-point.point-e{cursor:ew-resize;margin-top:-3px;top:50%;right:-3px}.cropper-point.point-n{cursor:ns-resize;margin-left:-3px;top:-3px;left:50%}.cropper-point.point-w{cursor:ew-resize;margin-top:-3px;top:50%;left:-3px}.cropper-point.point-s{cursor:s-resize;margin-left:-3px;bottom:-3px;left:50%}.cropper-point.point-ne{cursor:nesw-resize;top:-3px;right:-3px}.cropper-point.point-nw{cursor:nwse-resize;top:-3px;left:-3px}.cropper-point.point-sw{cursor:nesw-resize;bottom:-3px;left:-3px}.cropper-point.point-se{cursor:nwse-resize;opacity:1;width:20px;height:20px;bottom:-3px;right:-3px}@media (width>=768px){.cropper-point.point-se{width:15px;height:15px}}@media (width>=992px){.cropper-point.point-se{width:10px;height:10px}}@media (width>=1200px){.cropper-point.point-se{opacity:.75;width:5px;height:5px}}.cropper-point.point-se:before{content:" ";opacity:0;background-color:#39f;width:200%;height:200%;display:block;position:absolute;bottom:-50%;right:-50%}.cropper-invisible{opacity:0}.cropper-bg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC)}.cropper-hide{width:0;height:0;display:block;position:absolute}.cropper-hidden{display:none!important}.cropper-move{cursor:move}.cropper-crop{cursor:crosshair}.cropper-disabled .cropper-drag-box,.cropper-disabled .cropper-face,.cropper-disabled .cropper-line,.cropper-disabled .cropper-point{cursor:not-allowed}`,fn=`eyJhcGlLZXkiOiJza19saXZlXzdkN2Y0NjlmMWNlZGEyZDk3MmYyNTNmZGUyMGY5ZWI3ZDlmYmI5ZjQ2NWUxYmY5NzMzZGNlODNmNzY5ZGZjNDEiLCJhcHBJZCI6IjA4cmx6Zjc4dHMiLCJyZWdpb25zIjpbInNlYTEiXX0=`,pn=`Ab2loXzMXv2MnCCEQmP9pRzOPA9NQhaHhk3gQn2h7AnjZ08vOAuQbQ25`,mn=class{constructor(e){this.app=e,this.cropperInstance=null,this.targetImageElement=null;let t=document.createElement(`style`);t.textContent=dn,this.app.shadowRoot.appendChild(t),this.initElements(),this.bindEvents()}initElements(){this.imageModal=this.app.shadowRoot.getElementById(`image-modal-overlay`),this.cropModal=this.app.shadowRoot.getElementById(`crop-modal-overlay`),this.closeImageModalBtn=this.app.shadowRoot.getElementById(`close-image-modal`),this.closeCropModalBtn=this.app.shadowRoot.getElementById(`close-crop-modal`),this.cancelCropBtn=this.app.shadowRoot.getElementById(`cancel-crop-btn`),this.confirmCropBtn=this.app.shadowRoot.getElementById(`confirm-crop-btn`),this.tabs=this.app.shadowRoot.querySelectorAll(`.modal-tab`),this.panes=this.app.shadowRoot.querySelectorAll(`.tab-pane`),this.pexelsSearchInput=this.app.shadowRoot.getElementById(`pexels-search-input`),this.pexelsSearchBtn=this.app.shadowRoot.getElementById(`pexels-search-btn`),this.pexelsGrid=this.app.shadowRoot.getElementById(`pexels-grid`),this.pexelsLoading=this.app.shadowRoot.getElementById(`pexels-loading`),this.uploadArea=this.app.shadowRoot.getElementById(`upload-area`),this.uploadInput=this.app.shadowRoot.getElementById(`upload-file-input`),this.uploadLoading=this.app.shadowRoot.getElementById(`upload-loading`),this.cropperImageTarget=this.app.shadowRoot.getElementById(`cropper-image-target`),this.cropLoading=this.app.shadowRoot.getElementById(`crop-loading`)}bindEvents(){this.closeImageModalBtn.addEventListener(`click`,()=>this.hideImageModal()),this.closeCropModalBtn.addEventListener(`click`,()=>this.hideCropModal()),this.cancelCropBtn.addEventListener(`click`,()=>this.hideCropModal()),this.tabs.forEach(e=>{e.addEventListener(`click`,t=>{this.tabs.forEach(e=>e.classList.remove(`active`)),this.panes.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),this.app.shadowRoot.getElementById(e.dataset.target).classList.add(`active`)})}),this.pexelsSearchBtn.addEventListener(`click`,()=>this.searchPexels()),this.pexelsSearchInput.addEventListener(`keydown`,e=>{e.key===`Enter`&&this.searchPexels()}),this.uploadArea.addEventListener(`click`,()=>this.uploadInput.click()),this.uploadArea.addEventListener(`dragover`,e=>{e.preventDefault(),this.uploadArea.classList.add(`dragover`)}),this.uploadArea.addEventListener(`dragleave`,()=>this.uploadArea.classList.remove(`dragover`)),this.uploadArea.addEventListener(`drop`,e=>{e.preventDefault(),this.uploadArea.classList.remove(`dragover`),e.dataTransfer.files&&e.dataTransfer.files[0]&&this.handleFileUpload(e.dataTransfer.files[0])}),this.uploadInput.addEventListener(`change`,e=>{e.target.files&&e.target.files[0]&&this.handleFileUpload(e.target.files[0])}),this.confirmCropBtn.addEventListener(`click`,()=>this.applyCrop())}showImageModal(){this.imageModal.classList.add(`visible`),this.pexelsGrid.hasChildNodes()||this.searchPexels()}hideImageModal(){if(this.imageModal.classList.remove(`visible`),this.app.currentTool===`image`){let e=this.app.shadowRoot.querySelector(`.tool-btn[data-tool="select"]`);e&&e.click()}}async searchPexels(){let e=this.pexelsSearchInput.value.trim()||`nature`;this.pexelsLoading.classList.remove(`hidden`),this.pexelsGrid.innerHTML=``;try{(await(await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(e)}&per_page=15`,{headers:{Authorization:pn}})).json()).photos.forEach(e=>{let t=document.createElement(`img`);t.src=e.src.medium,t.dataset.largeUrl=e.src.large,t.addEventListener(`click`,()=>this.insertImageToBoard(e.src.large)),this.pexelsGrid.appendChild(t)})}catch(e){console.error(`Failed to fetch from Pexels`,e),this.pexelsGrid.innerHTML=`<p>Erro ao carregar imagens.</p>`}finally{this.pexelsLoading.classList.add(`hidden`)}}async handleFileUpload(e){if(!e.type.startsWith(`image/`)){alert(`Por favor selecione uma imagem válida.`);return}this.uploadLoading.classList.remove(`hidden`),this.uploadArea.style.opacity=`0.5`,this.uploadArea.style.pointerEvents=`none`;try{let t=await this.uploadToUploadThing(e);t&&this.insertImageToBoard(t)}catch(e){console.error(`Upload failed`,e),alert(`Falha ao enviar imagem.`)}finally{this.uploadLoading.classList.add(`hidden`),this.uploadArea.style.opacity=`1`,this.uploadArea.style.pointerEvents=`auto`,this.uploadInput.value=``}}async uploadToUploadThing(e){let t=new FormData;t.append(`files`,e);let n=JSON.parse(atob(fn)),r=await fetch(`https://uploadthing.com/api/uploadFiles`,{method:`POST`,headers:{"x-uploadthing-api-key":n.apiKey,"x-uploadthing-version":`6.4.0`},body:t});if(!r.ok){let e=await fetch(`https://api.uploadthing.com/v6/uploadFiles`,{method:`POST`,headers:{"x-uploadthing-api-key":n.apiKey},body:t});if(!e.ok)throw Error(`Upload failed`);let r=await e.json();return r[0]?.url||r[0]?.ufsUrl}let i=await r.json();return i[0]?.url||i[0]?.ufsUrl}insertImageToBoard(e){this.hideImageModal();let t=this.app.workspaceEl.getBoundingClientRect(),n=this.app.workspaceManager.getWorkspaceCoords(t.width/2,t.height/2),r=this.app.elementFactory.createElement(`image`,n,{type:`image`,x:n.x-100,y:n.y-100,width:200,height:200,url:e});this.app.selectionManager.clearSelection(),this.app.selectionManager.selectElement(r,!1);let i=this.app.shadowRoot.querySelector(`.tool-btn[data-tool="select"]`);i&&i.click()}showCropModal(e){this.targetImageElement=e;let t=e.querySelector(`img`);t&&(this.cropperImageTarget.src=t.src,this.cropModal.classList.add(`visible`),setTimeout(()=>{this.cropperInstance&&this.cropperInstance.destroy(),this.cropperInstance=new un.default(this.cropperImageTarget,{viewMode:1,autoCropArea:1,background:!1})},100))}hideCropModal(){this.cropModal.classList.remove(`visible`),this.cropperInstance&&=(this.cropperInstance.destroy(),null),this.targetImageElement=null}async applyCrop(){if(!(!this.cropperInstance||!this.targetImageElement)){this.cropLoading.classList.remove(`hidden`),this.confirmCropBtn.disabled=!0;try{let e=this.cropperInstance.getCroppedCanvas(),t=await new Promise(t=>e.toBlob(t,`image/png`)),n=new File([t],`cropped.png`,{type:`image/png`}),r=await this.uploadToUploadThing(n);if(r){let e=this.targetImageElement.querySelector(`img`);e&&(e.src=r);let t=this.cropperInstance.getCropBoxData();t.width&&t.height&&(this.targetImageElement.style.width=t.width+`px`,this.targetImageElement.style.height=t.height+`px`),this.app.saveBoardState()}}catch(e){console.error(`Crop upload failed`,e),alert(`Falha ao salvar o corte.`)}finally{this.cropLoading.classList.add(`hidden`),this.confirmCropBtn.disabled=!1,this.hideCropModal()}}}},hn=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.shadowRoot.appendChild(nn.content.cloneNode(!0)),this.dashboardEl=this.shadowRoot.getElementById(`dashboard`),this.boardsGridEl=this.shadowRoot.getElementById(`boards-grid`),this.newBoardBtn=this.shadowRoot.getElementById(`new-board-btn`),this.boardViewEl=this.shadowRoot.getElementById(`board-view`),this.backBtn=this.shadowRoot.getElementById(`back-btn`),this.boardTitleInput=this.shadowRoot.getElementById(`board-title-input`),this.workspaceEl=this.shadowRoot.getElementById(`board-workspace`),this.workspaceContentEl=this.shadowRoot.getElementById(`workspace-content`),this.drawingLayer=this.shadowRoot.getElementById(`drawing-layer`),this.toolBtns=this.shadowRoot.querySelectorAll(`.toolbar .tool-btn`),this.penOptionsEl=this.shadowRoot.getElementById(`pen-options`),this.penColorInput=this.shadowRoot.getElementById(`pen-color`),this.penThicknessInput=this.shadowRoot.getElementById(`pen-thickness`),this.emojiOptionsEl=this.shadowRoot.getElementById(`emoji-options`),this.iconOptionsEl=this.shadowRoot.getElementById(`icon-options`),this.lockBtn=this.shadowRoot.getElementById(`lock-btn`),this.undoBtn=this.shadowRoot.getElementById(`undo-btn`),this.redoBtn=this.shadowRoot.getElementById(`redo-btn`),this.contextToolbar=this.shadowRoot.getElementById(`context-toolbar`),this.cropBtn=this.shadowRoot.getElementById(`crop-btn`),this.instanceId=this.generateInstanceId(),this.boardStore=new tn(this.instanceId),this.currentBoardId=null,this.currentTool=`select`,this.workspaceEl.dataset.tool=`select`,this.currentEmoji=`😀`,this.currentIcon=`fa-solid fa-star`,this.fontAwesomeIcons=`fa-solid fa-star.fa-regular fa-star.fa-solid fa-heart.fa-regular fa-heart.fa-solid fa-user.fa-solid fa-users.fa-solid fa-home.fa-solid fa-envelope.fa-solid fa-phone.fa-solid fa-magnifying-glass.fa-solid fa-bell.fa-solid fa-check.fa-solid fa-xmark.fa-solid fa-plus.fa-solid fa-minus.fa-solid fa-circle-exclamation.fa-solid fa-circle-info.fa-solid fa-circle-check.fa-solid fa-thumbs-up.fa-solid fa-thumbs-down.fa-solid fa-camera.fa-solid fa-video.fa-solid fa-image.fa-solid fa-music.fa-solid fa-comment.fa-solid fa-comments.fa-solid fa-paper-plane.fa-solid fa-file.fa-solid fa-folder.fa-solid fa-trash.fa-solid fa-pen.fa-solid fa-link.fa-solid fa-globe.fa-solid fa-cloud.fa-solid fa-bolt.fa-solid fa-fire.fa-solid fa-snowflake.fa-solid fa-sun.fa-solid fa-moon.fa-solid fa-car.fa-solid fa-plane.fa-solid fa-bicycle.fa-solid fa-cart-shopping.fa-solid fa-bag-shopping.fa-solid fa-gift.fa-solid fa-credit-card.fa-solid fa-wallet.fa-solid fa-money-bill.fa-solid fa-chart-line.fa-solid fa-chart-pie.fa-solid fa-chart-bar.fa-solid fa-clock.fa-solid fa-calendar.fa-solid fa-compass.fa-solid fa-map.fa-solid fa-location-dot.fa-solid fa-bookmark.fa-solid fa-tag.fa-solid fa-key.fa-solid fa-lock.fa-solid fa-unlock.fa-solid fa-gear.fa-solid fa-wrench.fa-solid fa-screwdriver-wrench.fa-solid fa-shield.fa-solid fa-shield-halved.fa-solid fa-award.fa-solid fa-medal.fa-solid fa-trophy.fa-solid fa-crown.fa-solid fa-lightbulb.fa-solid fa-power-off.fa-solid fa-battery-full.fa-solid fa-laptop.fa-solid fa-desktop.fa-solid fa-mobile-screen.fa-solid fa-tablet-screen.fa-solid fa-tv.fa-solid fa-gamepad.fa-solid fa-headset.fa-solid fa-microphone.fa-solid fa-print.fa-solid fa-clipboard.fa-solid fa-briefcase.fa-solid fa-graduation-cap.fa-solid fa-book.fa-solid fa-newspaper.fa-solid fa-flask.fa-solid fa-bug.fa-solid fa-code.fa-solid fa-terminal.fa-solid fa-robot.fa-solid fa-rocket.fa-solid fa-satellite.fa-solid fa-meteor.fa-solid fa-ghost.fa-solid fa-skull.fa-solid fa-alien.fa-solid fa-poop`.split(`.`),this.scale=1,this.panX=0,this.panY=0,this.isPanning=!1,this.isSpaceDown=!1,this.startX=0,this.startY=0,this.isDrawing=!1,this.currentPath=null,this.elements=[],this.selectedElements=[],this.undoStack=[],this.redoStack=[],this.isRestoringState=!1,this.isDraggingElement=!1,this.isResizingElement=!1,this.elementDragStartX=0,this.elementDragStartY=0,this.elementStartWidth=0,this.elementStartHeight=0,this.isDrawingSelection=!1,this.selectionBoxStartX=0,this.selectionBoxStartY=0,this.selectionBoxEl=null,this.clipboard=[],this.dashboardManager=new rn(this),this.workspaceManager=new an(this),this.selectionManager=new on(this),this.clipboardManager=new sn(this),this.drawingManager=new cn(this),this.elementFactory=new ln(this),this.imageManager=new mn(this)}generateInstanceId(){let e=localStorage.getItem(`miro_clone_instance_id`);return e||(e=Math.random().toString(36).substr(2,9),localStorage.setItem(`miro_clone_instance_id`,e)),e}handleGlobalKeyDown=e=>{e.code===`Space`&&!this.isSpaceDown&&e.target.tagName!==`INPUT`&&e.target.tagName!==`TEXTAREA`&&!e.target.isContentEditable&&(this.isSpaceDown=!0,this.currentTool===`select`&&(this.workspaceEl.style.cursor=`grab`)),this.clipboardManager.handleGlobalKeyDown(e)};handleGlobalKeyUp=e=>{e.code===`Space`&&(this.isSpaceDown=!1,this.workspaceManager.updateWorkspaceCursor())};connectedCallback(){this.bindEvents(),this.dashboardManager.renderDashboard()}disconnectedCallback(){this.unbindEvents()}bindEvents(){this.newBoardBtn.addEventListener(`click`,()=>this.dashboardManager.createNewBoard()),this.backBtn.addEventListener(`click`,()=>this.dashboardManager.showDashboard()),this.undoBtn.addEventListener(`click`,()=>this.undo()),this.redoBtn.addEventListener(`click`,()=>this.redo()),this.lockBtn.addEventListener(`click`,()=>this.toggleLock()),this.boardTitleInput.addEventListener(`change`,e=>{this.currentBoardId&&this.boardStore.updateBoard(this.currentBoardId,{title:e.target.value})}),this.shadowRoot.getElementById(`icon-color`).addEventListener(`input`,e=>{let t=e.target.value,n=!1;this.selectedElements.forEach(e=>{e.dataset.type===`icon`&&(e.style.color=t,e.dataset.color=t,n=!0)}),n&&this.saveBoardState()}),this.toolBtns.forEach(e=>{e.addEventListener(`click`,e=>{this.toolBtns.forEach(e=>e.classList.remove(`active`));let t=e.currentTarget;t.classList.add(`active`),this.currentTool=t.dataset.tool,this.workspaceEl.dataset.tool=this.currentTool,this.workspaceManager.updateWorkspaceCursor(),this.selectionManager.clearSelection(),this.currentTool===`pen`||this.currentTool===`line`?(this.penOptionsEl.classList.add(`visible`),this.emojiOptionsEl.classList.remove(`visible`),this.iconOptionsEl.classList.remove(`visible`)):this.currentTool===`emoji`?(this.penOptionsEl.classList.remove(`visible`),this.emojiOptionsEl.classList.add(`visible`),this.iconOptionsEl.classList.remove(`visible`)):this.currentTool===`icon`?(this.penOptionsEl.classList.remove(`visible`),this.emojiOptionsEl.classList.remove(`visible`),this.iconOptionsEl.classList.add(`visible`)):(this.penOptionsEl.classList.remove(`visible`),this.emojiOptionsEl.classList.remove(`visible`),this.iconOptionsEl.classList.remove(`visible`)),this.currentTool===`image`&&this.imageManager.showImageModal()})}),this.cropBtn.addEventListener(`click`,()=>{this.selectedElements.length===1&&this.selectedElements[0].dataset.type===`image`&&this.imageManager.showCropModal(this.selectedElements[0])});let e=this.shadowRoot.getElementById(`emoji-picker`);e&&e.addEventListener(`emoji-click`,e=>{this.currentEmoji=e.detail.unicode}),this.renderIconGrid(this.fontAwesomeIcons);let t=this.shadowRoot.getElementById(`icon-search`);t&&t.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase(),n=this.fontAwesomeIcons.filter(e=>e.includes(t));this.renderIconGrid(n)}),document.addEventListener(`keydown`,this.handleGlobalKeyDown),document.addEventListener(`keyup`,this.handleGlobalKeyUp),this.workspaceManager.bindEvents(),this.bindWorkspacePointerEvents()}updateContextToolbar(){if(this.selectedElements.length===1&&this.selectedElements[0].dataset.type===`image`){this.contextToolbar.classList.add(`visible`);let e=this.selectedElements[0].getBoundingClientRect(),t=this.workspaceContentEl.getBoundingClientRect();this.contextToolbar.style.top=e.top-t.top-50+`px`,this.contextToolbar.style.left=e.left-t.left+e.width/2+`px`}else this.contextToolbar.classList.remove(`visible`)}unbindEvents(){document.removeEventListener(`keydown`,this.handleGlobalKeyDown),document.removeEventListener(`keyup`,this.handleGlobalKeyUp),this.handlePointerMove&&window.removeEventListener(`pointermove`,this.handlePointerMove),this.handlePointerUp&&window.removeEventListener(`pointerup`,this.handlePointerUp)}renderIconGrid(e){let t=this.shadowRoot.getElementById(`icon-grid`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`button`);n.className=`palette-btn`,this.currentIcon===e&&n.classList.add(`selected`);let r=document.createElement(`i`);r.className=e,n.appendChild(r),n.addEventListener(`click`,()=>{this.shadowRoot.querySelectorAll(`#icon-grid .palette-btn`).forEach(e=>e.classList.remove(`selected`)),n.classList.add(`selected`),this.currentIcon=e}),t.appendChild(n)}))}bindWorkspacePointerEvents(){this.drawingLayer.addEventListener(`pointerdown`,e=>{let t=this.boardStore.getBoard(this.currentBoardId);if(t&&t.isLocked||this.currentTool!==`select`)return;let n=e.target;if(n.tagName.toLowerCase()===`line`||n.tagName.toLowerCase()===`path`){e.stopPropagation(),e.shiftKey?this.selectedElements.includes(n)?(this.selectedElements=this.selectedElements.filter(e=>e!==n),n.classList.remove(`selected`)):this.selectionManager.addToSelection(n):this.selectedElements.includes(n)||this.selectionManager.selectElement(n,!1),this.isDraggingElement=!0;let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.elementDragStartX=t.x,this.elementDragStartY=t.y,n.setPointerCapture(e.pointerId)}}),this.drawingLayer.addEventListener(`pointerup`,e=>{let t=e.target;t.hasPointerCapture&&t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)}),this.workspaceEl.addEventListener(`contextmenu`,e=>e.preventDefault()),this.workspaceEl.addEventListener(`pointerdown`,e=>{let t=e.target===this.workspaceEl||e.target===this.workspaceContentEl||e.target===this.drawingLayer,n=this.boardStore.getBoard(this.currentBoardId),r=n?n.isLocked:!1;if(e.button===1||e.button===2||e.button===0&&(this.isSpaceDown||r))this.isPanning=!0,this.startX=e.clientX-this.panX,this.startY=e.clientY-this.panY,this.workspaceEl.style.cursor=`grabbing`,r||this.selectionManager.clearSelection();else if(e.button===0&&!r){let n=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.currentTool===`select`&&t?this.selectedElements.length>0?(this.isDraggingElement=!0,this.didDragElement=!1,this.draggedFromWorkspace=!0,this.elementDragStartX=n.x,this.elementDragStartY=n.y):(this.isDrawingSelection=!0,this.selectionBoxStartX=n.x,this.selectionBoxStartY=n.y,e.shiftKey||this.selectionManager.clearSelection(),this.selectionBoxEl=document.createElement(`div`),this.selectionBoxEl.className=`selection-box`,this.workspaceContentEl.appendChild(this.selectionBoxEl),this.selectionManager.updateSelectionBox(n.x,n.y)):this.currentTool===`pen`||this.currentTool===`line`?(this.isDrawing=!0,this.drawingManager.startDrawing(n)):[`rect`,`circle`,`sticky`,`text`,`emoji`,`icon`].includes(this.currentTool)&&t&&(this.elementFactory.createElement(this.currentTool,n),this.toolBtns[0].click())}}),this.handlePointerMove=e=>{if(this.isPanning)this.panX=e.clientX-this.startX,this.panY=e.clientY-this.startY,this.workspaceManager.updateWorkspaceTransform();else if(this.isDrawing){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.drawingManager.continueDrawing(t)}else if(this.isDrawingSelection){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.selectionManager.updateSelectionBox(t.x,t.y)}else if(this.isDraggingElement&&this.selectedElements.length>0){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY;(Math.abs(n)>0||Math.abs(r)>0)&&(this.didDragElement=!0),this.selectedElements.forEach(e=>{if(e.tagName.toLowerCase()===`line`||e.tagName.toLowerCase()===`path`){let t=(e.getAttribute(`transform`)||``).match(/translate\(([^,]+),([^)]+)\)/),i=0,a=0;t&&(i=parseFloat(t[1]),a=parseFloat(t[2])),e.setAttribute(`transform`,`translate(${i+n}, ${a+r})`)}else{let t=parseFloat(e.style.left||0),i=parseFloat(e.style.top||0);e.style.left=t+n+`px`,e.style.top=i+r+`px`}}),this.updateContextToolbar(),this.elementDragStartX=t.x,this.elementDragStartY=t.y}else if(this.isResizingElement&&this.selectedElements.length>0){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY,i=Math.max(30,this.elementStartWidth+n),a=Math.max(30,this.elementStartHeight+r),o=this.selectedElements[0];if(o.dataset.type===`circle`){let e=Math.max(i,a);i=e,a=e}o.style.width=i+`px`,o.style.height=a+`px`,this.updateContextToolbar(),(o.dataset.type===`emoji`||o.dataset.type===`icon`)&&(o.style.fontSize=i*.8+`px`)}},window.addEventListener(`pointermove`,this.handlePointerMove),this.handlePointerUp=e=>{if(this.isPanning&&(this.isPanning=!1,this.workspaceManager.updateWorkspaceCursor()),this.isDrawing&&(this.isDrawing=!1,this.saveBoardState()),this.isDrawingSelection&&(this.isDrawingSelection=!1,this.selectionBoxEl)){let e=this.selectionBoxEl.getBoundingClientRect();this.workspaceContentEl.querySelectorAll(`.board-element, path, line`).forEach(t=>{let n=t.getBoundingClientRect();n.left<e.right&&n.right>e.left&&n.top<e.bottom&&n.bottom>e.top&&this.selectionManager.addToSelection(t)}),this.selectionBoxEl.remove(),this.selectionBoxEl=null}this.isDraggingElement&&(this.isDraggingElement=!1,this.draggedFromWorkspace&&!this.didDragElement&&!e.shiftKey?this.selectionManager.clearSelection():this.didDragElement&&this.saveBoardState(),this.didDragElement=!1,this.draggedFromWorkspace=!1),this.isResizingElement&&(this.isResizingElement=!1,this.saveBoardState())},window.addEventListener(`pointerup`,this.handlePointerUp)}saveBoardState(){if(!this.currentBoardId)return;if(!this.isRestoringState){let e=this.boardStore.getBoard(this.currentBoardId);e&&(this.undoStack.push({elements:JSON.parse(JSON.stringify(e.elements||[])),drawings:JSON.parse(JSON.stringify(e.drawings||[]))}),this.redoStack=[],this.updateUndoRedoButtons())}let e=[];this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(t=>{let n=t.dataset.type,r={type:n,x:parseFloat(t.style.left||0),y:parseFloat(t.style.top||0)};if((n===`rect`||n===`circle`||n===`sticky`||n===`image`||n===`emoji`||n===`icon`)&&(r.width=parseFloat(t.style.width||t.offsetWidth),r.height=parseFloat(t.style.height||t.offsetHeight)),(n===`sticky`||n===`text`)&&(r.content=t.querySelector(`.editable-content`).innerHTML),n===`emoji`&&(r.content=t.dataset.content,r.fontSize=parseFloat(t.style.fontSize||48)),n===`icon`&&(r.iconName=t.dataset.iconName,r.color=t.dataset.color,r.fontSize=parseFloat(t.style.fontSize||48)),n===`image`){let e=t.querySelector(`img`);e&&(r.url=e.src)}e.push(r)});let t=[];this.drawingLayer.querySelectorAll(`path, line`).forEach(e=>{let n=e.tagName.toLowerCase()===`line`,r={type:n?`line`:`path`,stroke:e.getAttribute(`stroke`),strokeWidth:e.getAttribute(`stroke-width`)};n?(r.x1=e.getAttribute(`x1`),r.y1=e.getAttribute(`y1`),r.x2=e.getAttribute(`x2`),r.y2=e.getAttribute(`y2`)):r.d=e.getAttribute(`d`),r.transform=e.getAttribute(`transform`)||``,t.push(r)}),this.boardStore.updateBoard(this.currentBoardId,{elements:e,drawings:t})}loadBoardState(){this.undoStack=[],this.redoStack=[],this.updateUndoRedoButtons(),this.renderCurrentBoard()}undo(){let e=this.boardStore.getBoard(this.currentBoardId);if(e&&e.isLocked||this.undoStack.length===0)return;let t=e;this.redoStack.push({elements:JSON.parse(JSON.stringify(t.elements||[])),drawings:JSON.parse(JSON.stringify(t.drawings||[]))});let n=this.undoStack.pop();this.isRestoringState=!0,this.boardStore.updateBoard(this.currentBoardId,n),this.renderCurrentBoard(),this.isRestoringState=!1,this.updateUndoRedoButtons()}redo(){let e=this.boardStore.getBoard(this.currentBoardId);if(e&&e.isLocked||this.redoStack.length===0)return;let t=e;this.undoStack.push({elements:JSON.parse(JSON.stringify(t.elements||[])),drawings:JSON.parse(JSON.stringify(t.drawings||[]))});let n=this.redoStack.pop();this.isRestoringState=!0,this.boardStore.updateBoard(this.currentBoardId,n),this.renderCurrentBoard(),this.isRestoringState=!1,this.updateUndoRedoButtons()}updateUndoRedoButtons(){this.undoBtn.disabled=this.undoStack.length===0,this.redoBtn.disabled=this.redoStack.length===0}toggleLock(){if(!this.currentBoardId)return;let e=!this.boardStore.getBoard(this.currentBoardId).isLocked;this.boardStore.updateBoard(this.currentBoardId,{isLocked:e}),this.applyLockState(e)}applyLockState(e){e?(this.lockBtn.textContent=`🔒`,this.lockBtn.title=`Desbloquear Quadro`,this.boardViewEl.classList.add(`locked`),this.boardTitleInput.readOnly=!0,this.selectionManager.clearSelection()):(this.lockBtn.textContent=`🔓`,this.lockBtn.title=`Bloquear Quadro`,this.boardViewEl.classList.remove(`locked`),this.boardTitleInput.readOnly=!1)}renderCurrentBoard(){let e=this.boardStore.getBoard(this.currentBoardId);e&&(this.applyLockState(e.isLocked||!1),this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(e=>e.remove()),this.drawingLayer.innerHTML=``,this.panX=0,this.panY=0,this.scale=1,this.workspaceManager.updateWorkspaceTransform(),e.drawings&&e.drawings.forEach(e=>{if(e.d&&e.d.includes("${")||e.x1&&typeof e.x1==`string`&&e.x1.includes("${"))return;let t;e.type===`line`?(t=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),t.setAttribute(`x1`,e.x1),t.setAttribute(`y1`,e.y1),t.setAttribute(`x2`,e.x2),t.setAttribute(`y2`,e.y2)):(t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),t.setAttribute(`d`,e.d),t.setAttribute(`fill`,`none`),t.setAttribute(`stroke-linejoin`,`round`)),t.setAttribute(`stroke`,e.stroke||`#050038`),t.setAttribute(`stroke-width`,e.strokeWidth||`4`),t.setAttribute(`stroke-linecap`,`round`),e.transform&&t.setAttribute(`transform`,e.transform),this.drawingLayer.appendChild(t)}),e.elements&&e.elements.forEach(e=>{this.elementFactory.createElement(e.type,null,e)}))}};customElements.define(`miro-clone`,hn)})();