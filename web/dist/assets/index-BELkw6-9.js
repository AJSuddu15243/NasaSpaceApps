(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))s(u);new MutationObserver(u=>{for(const f of u)if(f.type==="childList")for(const d of f.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function a(u){const f={};return u.integrity&&(f.integrity=u.integrity),u.referrerPolicy&&(f.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?f.credentials="include":u.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function s(u){if(u.ep)return;u.ep=!0;const f=a(u);fetch(u.href,f)}})();function xM(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var $d={exports:{}},fe={};var kg;function gM(){if(kg)return fe;kg=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),u=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),p=Symbol.for("react.activity"),S=Symbol.for("react.view_transition"),M=Symbol.iterator;function A(E){return E===null||typeof E!="object"?null:(E=M&&E[M]||E["@@iterator"],typeof E=="function"?E:null)}var C={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y=Object.assign,v={};function L(E,G,B){this.props=E,this.context=G,this.refs=v,this.updater=B||C}L.prototype.isReactComponent={},L.prototype.setState=function(E,G){if(typeof E!="object"&&typeof E!="function"&&E!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,E,G,"setState")},L.prototype.forceUpdate=function(E){this.updater.enqueueForceUpdate(this,E,"forceUpdate")};function O(){}O.prototype=L.prototype;function z(E,G,B){this.props=E,this.context=G,this.refs=v,this.updater=B||C}var V=z.prototype=new O;V.constructor=z,y(V,L.prototype),V.isPureReactComponent=!0;var N=Array.isArray;function I(){}var Y={H:null,A:null,T:null,S:null},D=Object.prototype.hasOwnProperty;function w(E,G,B){var k=B.ref;return{$$typeof:o,type:E,key:G,ref:k!==void 0?k:null,props:B}}function q(E,G){return w(E.type,G,E.props)}function at(E){return typeof E=="object"&&E!==null&&E.$$typeof===o}function ut(E){var G={"=":"=0",":":"=2"};return"$"+E.replace(/[=:]/g,function(B){return G[B]})}var gt=/\/+/g;function ct(E,G){return typeof E=="object"&&E!==null&&E.key!=null?ut(""+E.key):G.toString(36)}function K(E){switch(E.status){case"fulfilled":return E.value;case"rejected":throw E.reason;default:switch(typeof E.status=="string"?E.then(I,I):(E.status="pending",E.then(function(G){E.status==="pending"&&(E.status="fulfilled",E.value=G)},function(G){E.status==="pending"&&(E.status="rejected",E.reason=G)})),E.status){case"fulfilled":return E.value;case"rejected":throw E.reason}}throw E}function rt(E,G,B,k,dt){var bt=typeof E;(bt==="undefined"||bt==="boolean")&&(E=null);var vt=!1;if(E===null)vt=!0;else switch(bt){case"bigint":case"string":case"number":vt=!0;break;case"object":switch(E.$$typeof){case o:case e:vt=!0;break;case _:return vt=E._init,rt(vt(E._payload),G,B,k,dt)}}if(vt)return dt=dt(E),vt=k===""?"."+ct(E,0):k,N(dt)?(B="",vt!=null&&(B=vt.replace(gt,"$&/")+"/"),rt(dt,G,B,"",function(ae){return ae})):dt!=null&&(at(dt)&&(dt=q(dt,B+(dt.key==null||E&&E.key===dt.key?"":(""+dt.key).replace(gt,"$&/")+"/")+vt)),G.push(dt)),1;vt=0;var Mt=k===""?".":k+":";if(N(E))for(var Lt=0;Lt<E.length;Lt++)k=E[Lt],bt=Mt+ct(k,Lt),vt+=rt(k,G,B,bt,dt);else if(Lt=A(E),typeof Lt=="function")for(E=Lt.call(E),Lt=0;!(k=E.next()).done;)k=k.value,bt=Mt+ct(k,Lt++),vt+=rt(k,G,B,bt,dt);else if(bt==="object"){if(typeof E.then=="function")return rt(K(E),G,B,k,dt);throw G=String(E),Error("Objects are not valid as a React child (found: "+(G==="[object Object]"?"object with keys {"+Object.keys(E).join(", ")+"}":G)+"). If you meant to render a collection of children, use an array instead.")}return vt}function J(E,G,B){if(E==null)return E;var k=[],dt=0;return rt(E,k,"","",function(bt){return G.call(B,bt,dt++)}),k}function St(E){if(E._status===-1){var G=E._result,B=G();B.then(function(k){(E._status===0||E._status===-1)&&(E._status=1,E._result=k,B.status===void 0&&(B.status="fulfilled",B.value=k))},function(k){(E._status===0||E._status===-1)&&(E._status=2,E._result=k,B.status===void 0&&(B.status="rejected",B.reason=k))}),E._status===-1&&(E._status=0,E._result=B)}if(E._status===1)return E._result.default;throw E._result}var _t=typeof reportError=="function"?reportError:function(E){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var G=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof E=="object"&&E!==null&&typeof E.message=="string"?String(E.message):String(E),error:E});if(!window.dispatchEvent(G))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",E);return}console.error(E)};function Vt(E){var G=Y.T,B={};B.types=G!==null?G.types:null,Y.T=B;try{var k=E(),dt=Y.S;dt!==null&&dt(B,k),typeof k=="object"&&k!==null&&typeof k.then=="function"&&k.then(I,_t)}catch(bt){_t(bt)}finally{G!==null&&B.types!==null&&(G.types=B.types),Y.T=G}}function le(E){var G=Y.T;if(G!==null){var B=G.types;B===null?G.types=[E]:B.indexOf(E)===-1&&B.push(E)}else Vt(le.bind(null,E))}var Ee={map:J,forEach:function(E,G,B){J(E,function(){G.apply(this,arguments)},B)},count:function(E){var G=0;return J(E,function(){G++}),G},toArray:function(E){return J(E,function(G){return G})||[]},only:function(E){if(!at(E))throw Error("React.Children.only expected to receive a single React element child.");return E}};return fe.Activity=p,fe.Children=Ee,fe.Component=L,fe.Fragment=a,fe.Profiler=u,fe.PureComponent=z,fe.StrictMode=s,fe.Suspense=g,fe.ViewTransition=S,fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Y,fe.__COMPILER_RUNTIME={__proto__:null,c:function(E){return Y.H.useMemoCache(E)}},fe.addTransitionType=le,fe.cache=function(E){return function(){return E.apply(null,arguments)}},fe.cacheSignal=function(){return null},fe.cloneElement=function(E,G,B){if(E==null)throw Error("The argument must be a React element, but you passed "+E+".");var k=y({},E.props),dt=E.key;if(G!=null)for(bt in G.key!==void 0&&(dt=""+G.key),G)!D.call(G,bt)||bt==="key"||bt==="__self"||bt==="__source"||bt==="ref"&&G.ref===void 0||(k[bt]=G[bt]);var bt=arguments.length-2;if(bt===1)k.children=B;else if(1<bt){for(var vt=Array(bt),Mt=0;Mt<bt;Mt++)vt[Mt]=arguments[Mt+2];k.children=vt}return w(E.type,dt,k)},fe.createContext=function(E){return E={$$typeof:d,_currentValue:E,_currentValue2:E,_threadCount:0,Provider:null,Consumer:null},E.Provider=E,E.Consumer={$$typeof:f,_context:E},E},fe.createElement=function(E,G,B){var k,dt={},bt=null;if(G!=null)for(k in G.key!==void 0&&(bt=""+G.key),G)D.call(G,k)&&k!=="key"&&k!=="__self"&&k!=="__source"&&(dt[k]=G[k]);var vt=arguments.length-2;if(vt===1)dt.children=B;else if(1<vt){for(var Mt=Array(vt),Lt=0;Lt<vt;Lt++)Mt[Lt]=arguments[Lt+2];dt.children=Mt}if(E&&E.defaultProps)for(k in vt=E.defaultProps,vt)dt[k]===void 0&&(dt[k]=vt[k]);return w(E,bt,dt)},fe.createRef=function(){return{current:null}},fe.forwardRef=function(E){return{$$typeof:h,render:E}},fe.isValidElement=at,fe.lazy=function(E){return{$$typeof:_,_payload:{_status:-1,_result:E},_init:St}},fe.memo=function(E,G){return{$$typeof:x,type:E,compare:G===void 0?null:G}},fe.startTransition=Vt,fe.unstable_useCacheRefresh=function(){return Y.H.useCacheRefresh()},fe.use=function(E){return Y.H.use(E)},fe.useActionState=function(E,G,B){return Y.H.useActionState(E,G,B)},fe.useCallback=function(E,G){return Y.H.useCallback(E,G)},fe.useContext=function(E){return Y.H.useContext(E)},fe.useDebugValue=function(){},fe.useDeferredValue=function(E,G){return Y.H.useDeferredValue(E,G)},fe.useEffect=function(E,G){return Y.H.useEffect(E,G)},fe.useEffectEvent=function(E){return Y.H.useEffectEvent(E)},fe.useId=function(){return Y.H.useId()},fe.useImperativeHandle=function(E,G,B){return Y.H.useImperativeHandle(E,G,B)},fe.useInsertionEffect=function(E,G){return Y.H.useInsertionEffect(E,G)},fe.useLayoutEffect=function(E,G){return Y.H.useLayoutEffect(E,G)},fe.useMemo=function(E,G){return Y.H.useMemo(E,G)},fe.useOptimistic=function(E,G){return Y.H.useOptimistic(E,G)},fe.useReducer=function(E,G,B){return Y.H.useReducer(E,G,B)},fe.useRef=function(E){return Y.H.useRef(E)},fe.useState=function(E){return Y.H.useState(E)},fe.useSyncExternalStore=function(E,G,B){return Y.H.useSyncExternalStore(E,G,B)},fe.useTransition=function(){return Y.H.useTransition()},fe.version="19.3.1",fe}var qg;function Rp(){return qg||(qg=1,$d.exports=gM()),$d.exports}var Wr=Rp();const ht=xM(Wr);var th={exports:{}},Jo={},eh={exports:{}},nh={};var Yg;function _M(){return Yg||(Yg=1,(function(o){function e(K,rt){var J=K.length;K.push(rt);t:for(;0<J;){var St=J-1>>>1,_t=K[St];if(0<u(_t,rt))K[St]=rt,K[J]=_t,J=St;else break t}}function a(K){return K.length===0?null:K[0]}function s(K){if(K.length===0)return null;var rt=K[0],J=K.pop();if(J!==rt){K[0]=J;t:for(var St=0,_t=K.length,Vt=_t>>>1;St<Vt;){var le=2*(St+1)-1,Ee=K[le],E=le+1,G=K[E];if(0>u(Ee,J))E<_t&&0>u(G,Ee)?(K[St]=G,K[E]=J,St=E):(K[St]=Ee,K[le]=J,St=le);else if(E<_t&&0>u(G,J))K[St]=G,K[E]=J,St=E;else break t}}return rt}function u(K,rt){var J=K.sortIndex-rt.sortIndex;return J!==0?J:K.id-rt.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;o.unstable_now=function(){return f.now()}}else{var d=Date,h=d.now();o.unstable_now=function(){return d.now()-h}}var g=[],x=[],_=1,p=null,S=3,M=!1,A=!1,C=!1,y=!1,v=typeof setTimeout=="function"?setTimeout:null,L=typeof clearTimeout=="function"?clearTimeout:null,O=typeof setImmediate<"u"?setImmediate:null;function z(K){for(var rt=a(x);rt!==null;){if(rt.callback===null)s(x);else if(rt.startTime<=K)s(x),rt.sortIndex=rt.expirationTime,e(g,rt);else break;rt=a(x)}}function V(K){if(C=!1,z(K),!A)if(a(g)!==null)A=!0,N||(N=!0,at());else{var rt=a(x);rt!==null&&ct(V,rt.startTime-K)}}var N=!1,I=-1,Y=5,D=-1;function w(){return y?!0:!(o.unstable_now()-D<Y)}function q(){if(y=!1,N){var K=o.unstable_now();D=K;var rt=!0;try{t:{A=!1,C&&(C=!1,L(I),I=-1),M=!0;var J=S;try{e:{for(z(K),p=a(g);p!==null&&!(p.expirationTime>K&&w());){var St=p.callback;if(typeof St=="function"){p.callback=null,S=p.priorityLevel;var _t=St(p.expirationTime<=K);if(K=o.unstable_now(),typeof _t=="function"){p.callback=_t,z(K),rt=!0;break e}p===a(g)&&s(g),z(K)}else s(g);p=a(g)}if(p!==null)rt=!0;else{var Vt=a(x);Vt!==null&&ct(V,Vt.startTime-K),rt=!1}}break t}finally{p=null,S=J,M=!1}rt=void 0}}finally{rt?at():N=!1}}}var at;if(typeof O=="function")at=function(){O(q)};else if(typeof MessageChannel<"u"){var ut=new MessageChannel,gt=ut.port2;ut.port1.onmessage=q,at=function(){gt.postMessage(null)}}else at=function(){v(q,0)};function ct(K,rt){I=v(function(){K(o.unstable_now())},rt)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(K){K.callback=null},o.unstable_forceFrameRate=function(K){0>K||125<K?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Y=0<K?Math.floor(1e3/K):5},o.unstable_getCurrentPriorityLevel=function(){return S},o.unstable_next=function(K){switch(S){case 1:case 2:case 3:var rt=3;break;default:rt=S}var J=S;S=rt;try{return K()}finally{S=J}},o.unstable_requestPaint=function(){y=!0},o.unstable_runWithPriority=function(K,rt){switch(K){case 1:case 2:case 3:case 4:case 5:break;default:K=3}var J=S;S=K;try{return rt()}finally{S=J}},o.unstable_scheduleCallback=function(K,rt,J){var St=o.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?St+J:St):J=St,K){case 1:var _t=-1;break;case 2:_t=250;break;case 5:_t=1073741823;break;case 4:_t=1e4;break;default:_t=5e3}return _t=J+_t,K={id:_++,callback:rt,priorityLevel:K,startTime:J,expirationTime:_t,sortIndex:-1},J>St?(K.sortIndex=J,e(x,K),a(g)===null&&K===a(x)&&(C?(L(I),I=-1):C=!0,ct(V,J-St))):(K.sortIndex=_t,e(g,K),A||M||(A=!0,N||(N=!0,at()))),K},o.unstable_shouldYield=w,o.unstable_wrapCallback=function(K){var rt=S;return function(){var J=S;S=rt;try{return K.apply(this,arguments)}finally{S=J}}}})(nh)),nh}var Wg;function vM(){return Wg||(Wg=1,eh.exports=_M()),eh.exports}var ih={exports:{}},Un={};var jg;function SM(){if(jg)return Un;jg=1;var o=Rp();function e(_){var p="https://react.dev/errors/"+_;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var S=2;S<arguments.length;S++)p+="&args[]="+encodeURIComponent(arguments[S])}return"Minified React error #"+_+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function a(){}var s={d:{f:a,r:function(){throw Error(e(522))},D:a,C:a,L:a,m:a,X:a,S:a,M:a},p:0,findDOMNode:null},u=Symbol.for("react.portal"),f=Symbol.for("react.recoverable"),d=Symbol.for("react.optimistic_key");function h(_,p,S){var M=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:u,key:M==null?null:M===d?d:""+M,children:_,containerInfo:p,implementation:S}}var g=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function x(_,p){if(_==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Un.browser=function(_){return{$$typeof:f,_reason:_}},Un.createPortal=function(_,p){var S=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(e(299));return h(_,p,null,S)},Un.flushSync=function(_){var p=g.T,S=s.p;try{if(g.T=null,s.p=2,_)return _()}finally{g.T=p,s.p=S,s.d.f()}},Un.preconnect=function(_,p){typeof _=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(_,p))},Un.prefetchDNS=function(_){typeof _=="string"&&s.d.D(_)},Un.preinit=function(_,p){if(typeof _=="string"&&p&&typeof p.as=="string"){var S=p.as,M=x(S,p.crossOrigin),A=typeof p.integrity=="string"?p.integrity:void 0,C=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;S==="style"?s.d.S(_,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:M,integrity:A,fetchPriority:C}):S==="script"&&s.d.X(_,{crossOrigin:M,integrity:A,fetchPriority:C,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Un.preinitModule=function(_,p){if(typeof _=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var S=x(p.as,p.crossOrigin);s.d.M(_,{crossOrigin:S,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0})}}else p==null&&s.d.M(_)},Un.preload=function(_,p){if(typeof _=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var S=p.as,M=x(S,p.crossOrigin);s.d.L(_,S,{crossOrigin:M,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Un.preloadModule=function(_,p){if(typeof _=="string")if(p){var S=x(p.as,p.crossOrigin);s.d.m(_,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:S,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0})}else s.d.m(_)},Un.requestFormReset=function(_){s.d.r(_)},Un.unstable_batchedUpdates=function(_,p){return _(p)},Un.useFormState=function(_,p,S){return g.H.useFormState(_,p,S)},Un.useFormStatus=function(){return g.H.useHostTransitionStatus()},Un.version="19.3.1",Un}var Zg;function yM(){if(Zg)return ih.exports;Zg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),ih.exports=SM(),ih.exports}var Kg;function MM(){if(Kg)return Jo;Kg=1;var o=vM(),e=Rp(),a=yM();function s(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)n+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function f(t){for(var n=t,i=n;i&&!i.alternate;)n=i,(n.flags&4098)!==0&&(t=n.return),i=n.return;for(;n.return;)n=n.return;return n.tag===3?t:null}function d(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function h(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function g(t){if(f(t)!==t)throw Error(s(188))}function x(t){var n=t.alternate;if(!n){if(n=f(t),n===null)throw Error(s(188));return n!==t?null:t}for(var i=t,r=n;;){var l=i.return;if(l===null)break;var c=l.alternate;if(c===null){if(r=l.return,r!==null){i=r;continue}break}if(l.child===c.child){for(c=l.child;c;){if(c===i)return g(l),t;if(c===r)return g(l),n;c=c.sibling}throw Error(s(188))}if(i.return!==r.return)i=l,r=c;else{for(var m=!1,b=l.child;b;){if(b===i){m=!0,i=l,r=c;break}if(b===r){m=!0,r=l,i=c;break}b=b.sibling}if(!m){for(b=c.child;b;){if(b===i){m=!0,i=c,r=l;break}if(b===r){m=!0,r=c,i=l;break}b=b.sibling}if(!m)throw Error(s(189))}}if(i.alternate!==r)throw Error(s(190))}if(i.tag!==3)throw Error(s(188));return i.stateNode.current===i?t:n}function _(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=_(t),n!==null)return n;t=t.sibling}return null}function p(t,n,i,r,l,c){for(;t!==null;){if((t.tag===5||t.tag===27||t.tag===6)&&i(t,r,l,c)||(t.tag!==22||t.memoizedState===null)&&(n||t.tag!==5&&t.tag!==27)&&p(t.child,n,i,r,l,c))return!0;t=t.sibling}return!1}function S(t){for(t=t.return;t!==null;){if(t.tag===3||t.tag===5||t.tag===27)return t;t=t.return}return null}function M(t){var n=!1;for(t=t.return;t!==null&&(t.tag===4&&(n=!0),!(t.tag===3||t.tag===5||t.tag===27));)t=t.return;return n}function A(t){var n=[null,null],i=S(t);return i===null||C(n,t,i.child,{foundSelf:!1}),n}function C(t,n,i,r){for(;i!==null;){if(i===n)r.foundSelf=!0;else if(i.tag===5||i.tag===27||i.tag===6){if(r.foundSelf)return t[1]=i,!0;t[0]=i}else if((i.tag!==22||i.memoizedState===null)&&C(t,n,i.child,r))return!0;i=i.sibling}return!1}function y(t){switch(t.tag){case 5:case 27:case 6:return t.stateNode;case 3:return t.stateNode.containerInfo;default:throw Error(s(559))}}var v=null,L=null;function O(t,n,i){return t===i?!0:t===n?(v=t,!0):!1}function z(t,n,i){return t===i?(L=t,!1):t===n?(L!==null&&(v=t),!0):!1}function V(t){if(t===null)return null;do t=t===null?null:t.return;while(t&&t.tag!==5&&t.tag!==27&&t.tag!==3);return t||null}function N(t,n,i){for(var r=0,l=t;l;l=i(l))r++;l=0;for(var c=n;c;c=i(c))l++;for(;0<r-l;)t=i(t),r--;for(;0<l-r;)n=i(n),l--;for(;r--;){if(t===n||n!==null&&t===n.alternate)return t;t=i(t),n=i(n)}return null}var I=Object.assign,Y=Symbol.for("react.element"),D=Symbol.for("react.transitional.element"),w=Symbol.for("react.portal"),q=Symbol.for("react.fragment"),at=Symbol.for("react.strict_mode"),ut=Symbol.for("react.profiler"),gt=Symbol.for("react.consumer"),ct=Symbol.for("react.context"),K=Symbol.for("react.forward_ref"),rt=Symbol.for("react.suspense"),J=Symbol.for("react.suspense_list"),St=Symbol.for("react.memo"),_t=Symbol.for("react.lazy"),Vt=Symbol.for("react.activity"),le=Symbol.for("react.legacy_hidden"),Ee=Symbol.for("react.memo_cache_sentinel"),E=Symbol.for("react.view_transition"),G=Symbol.for("react.recoverable"),B=Symbol.iterator;function k(t){return t===null||typeof t!="object"?null:(t=B&&t[B]||t["@@iterator"],typeof t=="function"?t:null)}var dt=Symbol.for("react.client.reference");function bt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===dt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case q:return"Fragment";case ut:return"Profiler";case at:return"StrictMode";case rt:return"Suspense";case J:return"SuspenseList";case Vt:return"Activity";case E:return"ViewTransition"}if(typeof t=="object")switch(t.$$typeof){case w:return"Portal";case ct:return t.displayName||"Context";case gt:return(t._context.displayName||"Context")+".Consumer";case K:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case St:return n=t.displayName||null,n!==null?n:bt(t.type)||"Memo";case _t:n=t._payload,t=t._init;try{return bt(t(n))}catch{}}return null}var vt=Array.isArray,Mt=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Lt=a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ae={pending:!1,data:null,method:null,action:null},qe=[],H=-1;function ue(t){return{current:t}}function Jt(t){0>H||(t.current=qe[H],qe[H]=null,H--)}function te(t,n){H++,qe[H]=t.current,t.current=n}var Ft=ue(null),He=ue(null),Yt=ue(null),se=ue(null);function U(t,n){switch(te(Yt,n),te(He,t),te(Ft,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?$x(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=$x(n),t=tg(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Jt(Ft),te(Ft,t)}function T(){Jt(Ft),Jt(He),Jt(Yt)}function nt(t){var n=t.memoizedState;n!==null&&(Ns._currentValue=n.memoizedState,te(se,t)),n=Ft.current;var i=tg(n,t.type);n!==i&&(te(He,t),te(Ft,i))}function xt(t){He.current===t&&(Jt(Ft),Jt(He)),se.current===t&&(Jt(se),Ns._currentValue=ae)}var Et,ft;function Xt(t){if(Et===void 0)try{throw Error()}catch(i){var n=i.stack.trim().match(/\n( *(at )?)/);Et=n&&n[1]||"",ft=-1<i.stack.indexOf(`
    at`)?" (<anonymous>)":-1<i.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Et+t+ft}var Ot=!1;function Kt(t,n){if(!t||Ot)return"";Ot=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(n){var mt=function(){throw Error()};if(Object.defineProperty(mt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(mt,[])}catch(Nt){var W=Nt}Reflect.construct(t,[],mt)}else{try{mt.call()}catch(Nt){W=Nt}mt=!1;try{var et=Object.getOwnPropertyDescriptor(t.prototype,"props");Object.defineProperty(t.prototype,"props",{configurable:!0,set:function(){throw Error()}}),mt=!0,new t}finally{mt&&(et!==void 0?Object.defineProperty(t.prototype,"props",et):delete t.prototype.props)}}}else{try{throw Error()}catch(Nt){W=Nt}(mt=t())&&typeof mt.catch=="function"&&mt.catch(function(){})}}catch(Nt){if(Nt&&W&&typeof Nt.stack=="string")return[Nt.stack,W.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var l=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");l&&l.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var c=r.DetermineComponentFrameRoot(),m=c[0],b=c[1];if(m&&b){var P=m.split(`
`),Z=b.split(`
`);for(l=r=0;r<P.length&&!P[r].includes("DetermineComponentFrameRoot");)r++;for(;l<Z.length&&!Z[l].includes("DetermineComponentFrameRoot");)l++;if(r===P.length||l===Z.length)for(r=P.length-1,l=Z.length-1;1<=r&&0<=l&&P[r]!==Z[l];)l--;for(;1<=r&&0<=l;r--,l--)if(P[r]!==Z[l]){if(r!==1||l!==1)do if(r--,l--,0>l||P[r]!==Z[l]){var it=`
`+P[r].replace(" at new "," at ");return t.displayName&&it.includes("<anonymous>")&&(it=it.replace("<anonymous>",t.displayName)),it}while(1<=r&&0<=l);break}}}finally{Ot=!1,Error.prepareStackTrace=i}return(i=t?t.displayName||t.name:"")?Xt(i):""}function Wt(t,n){switch(t.tag){case 26:case 27:case 5:return Xt(t.type);case 16:return Xt("Lazy");case 13:return t.child!==n&&n!==null?Xt("Suspense Fallback"):Xt("Suspense");case 19:return Xt("SuspenseList");case 0:case 15:return Kt(t.type,!1);case 11:return Kt(t.type.render,!1);case 1:return Kt(t.type,!0);case 31:return Xt("Activity");case 30:return Xt("ViewTransition");default:return""}}function Tt(t){try{var n="",i=null;do n+=Wt(t,i),i=t,t=t.return;while(t);return n}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var wt=Object.prototype.hasOwnProperty,ee=o.unstable_scheduleCallback,$t=o.unstable_cancelCallback,Ht=o.unstable_shouldYield,oe=o.unstable_requestPaint,F=o.unstable_now,Pt=o.unstable_getCurrentPriorityLevel,Dt=o.unstable_ImmediatePriority,Ut=o.unstable_UserBlockingPriority,At=o.unstable_NormalPriority,yt=o.unstable_LowPriority,kt=o.unstable_IdlePriority,ce=o.log,je=o.unstable_setDisableYieldValue,De=null,tn=null;function fn(t){if(typeof ce=="function"&&je(t),tn&&typeof tn.setStrictMode=="function")try{tn.setStrictMode(De,t)}catch{}}var In=Math.clz32?Math.clz32:ea,gl=Math.log,_l=Math.LN2;function ea(t){return t>>>=0,t===0?32:31-(gl(t)/_l|0)|0}var wa=256,hr=262144,pr=4194304;function fi(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&-t;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function mr(t,n,i){var r=t.pendingLanes;if(r===0)return 0;var l=0,c=t.suspendedLanes,m=t.pingedLanes;t=t.warmLanes;var b=r&134217727;return b!==0?(r=b&~c,r!==0?l=fi(r):(m&=b,m!==0?l=fi(m):i||(i=b&~t,i!==0&&(l=fi(i))))):(b=r&~c,b!==0?l=fi(b):m!==0?l=fi(m):i||(i=r&~t,i!==0&&(l=fi(i)))),l===0?0:n!==0&&n!==l&&(n&c)===0&&(c=l&-l,i=n&-n,c>=i||c===32&&(i&4194048)!==0)?n:l}function Bi(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function so(t,n){(n&8)!==0&&(n|=n&32);var i=t.entangledLanes;if(i!==0)for(t=t.entanglements,i&=n;0<i;){var r=31-In(i),l=1<<r;n|=t[r],i&=~l}return n}function vl(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Sl(){var t=pr;return pr<<=1,(pr&62914560)===0&&(pr=4194304),t}function oo(t){for(var n=[],i=0;31>i;i++)n.push(t);return n}function xr(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Rc(t,n,i,r,l,c){var m=t.pendingLanes;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=i,t.entangledLanes&=i,t.errorRecoveryDisabledLanes&=i,t.shellSuspendCounter=0;var b=t.entanglements,P=t.expirationTimes,Z=t.hiddenUpdates;for(i=m&~i;0<i;){var it=31-In(i),mt=1<<it;b[it]=0,P[it]=-1;var W=Z[it];if(W!==null)for(Z[it]=null,it=0;it<W.length;it++){var et=W[it];et!==null&&(et.lane&=-536870913)}i&=~mt}r!==0&&yl(t,r,0),c!==0&&l===0&&t.tag!==0&&(t.suspendedLanes|=c&~(m&~n))}function yl(t,n,i){t.pendingLanes|=n,t.suspendedLanes&=~n;var r=31-In(n);t.entangledLanes|=n,t.entanglements[r]=t.entanglements[r]|1073741824|i&261930}function Ml(t,n){var i=t.entangledLanes|=n;for(t=t.entanglements;i;){var r=31-In(i),l=1<<r;l&n|t[r]&n&&(t[r]|=n),i&=~l}}function R(t,n){var i=n&-n;return i=(i&42)!==0?1:Q(i),(i&(t.suspendedLanes|n))!==0?0:i}function Q(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function st(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function ot(){var t=Lt.p;return t!==0?t:(t=window.event,t===void 0?32:Ig(t.type))}function $(t,n){var i=Lt.p;try{return Lt.p=t,n()}finally{Lt.p=i}}var Rt=Math.random().toString(36).slice(2),Ct="__reactFiber$"+Rt,zt="__reactProps$"+Rt,Bt="__reactContainer$"+Rt,ne="__reactEvents$"+Rt,re="__reactListeners$"+Rt,Qt="__reactHandles$"+Rt,Se="__reactResources$"+Rt,Ue="__reactMarker$"+Rt,Ze="__reactLoad$"+Rt;function Ke(t){delete t[Ct],delete t[zt],delete t[re],delete t[Qt]}function Ce(t){var n;if(n=t[Ct])return n;for(var i=t.parentNode;i;){if(n=i[Bt]||i[Ct]){if(i=n.alternate,n.child!==null||i!==null&&i.child!==null)for(t=gg(t);t!==null;){if(i=t[Ct])return i;t=gg(t)}return n}t=i,i=t.parentNode}return null}function jt(t){if(t=t[Ct]||t[Bt]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function Ge(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(s(33))}function ye(t){var n=t[Se];return n||(n=t[Se]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Le(t){t[Ue]=!0}function na(t){t[Ze]=void 0}var Ln=new Set,Da={};function Ie(t,n){ln(t,n),ln(t+"Capture",n)}function ln(t,n){for(Da[t]=n,t=0;t<n.length;t++)Ln.add(n[t])}var kn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Sn={},Tn={};function lo(t){return wt.call(Tn,t)?!0:wt.call(Sn,t)?!1:kn.test(t)?Tn[t]=!0:(Sn[t]=!0,!1)}var ge=!1;function Fp(){var t=ge;return ge=!1,t}function El(t,n,i){if(lo(n))if(i===null)t.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var r=n.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,i)}}function bl(t,n,i){if(i===null)t.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,i)}}function ia(t,n,i,r){if(r===null)t.removeAttribute(i);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(i);return}t.setAttributeNS(n,i,r)}}function Jn(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Hp(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function zv(t,n,i){var r=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var l=r.get,c=r.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return l.call(this)},set:function(m){i=""+m,c.call(this,m)}}),Object.defineProperty(t,n,{enumerable:r.enumerable}),{getValue:function(){return i},setValue:function(m){i=""+m},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Cc(t){if(!t._valueTracker){var n=Hp(t)?"checked":"value";t._valueTracker=zv(t,n,""+t[n])}}function Gp(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var i=n.getValue(),r="";return t&&(r=Hp(t)?t.checked?"true":"false":t.value),t=r,t!==i?(n.setValue(t),!0):!1}var Iv=/[\n"\\]/g;function di(t){return t.replace(Iv,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function wc(t,n,i,r,l,c,m,b){t.name="",m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"?t.type=m:t.removeAttribute("type"),n!=null?m==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+Jn(n)):t.value!==""+Jn(n)&&(t.value=""+Jn(n)):m!=="submit"&&m!=="reset"||t.removeAttribute("value"),n!=null?m==="number"&&t.value==n?Dc(t,Jn(t.value)):Dc(t,Jn(n)):i!=null?Dc(t,Jn(i)):r!=null&&t.removeAttribute("value"),l==null&&c!=null&&(t.defaultChecked=!!c),l!=null&&(t.checked=l&&typeof l!="function"&&typeof l!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?t.name=""+Jn(b):t.removeAttribute("name")}function Vp(t,n,i,r,l,c,m,b){if(c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(t.type=c),n!=null||i!=null){if(!(c!=="submit"&&c!=="reset"||n!=null)){Cc(t);return}i=i!=null?""+Jn(i):"",n=n!=null?""+Jn(n):i,b||n===t.value||(t.value=n),t.defaultValue=n}r=r??l,r=typeof r!="function"&&typeof r!="symbol"&&!!r,t.checked=b?t.checked:!!r,t.defaultChecked=!!r,m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"&&(t.name=m),Cc(t)}function Dc(t,n){t.defaultValue!==""+n&&(t.defaultValue=""+n)}function Kr(t,n,i,r){if(t=t.options,n){n={};for(var l=0;l<i.length;l++)n["$"+i[l]]=!0;for(i=0;i<t.length;i++)l=n.hasOwnProperty("$"+t[i].value),t[i].selected!==l&&(t[i].selected=l),l&&r&&(t[i].defaultSelected=!0)}else{for(i=""+Jn(i),n=null,l=0;l<t.length;l++){if(t[l].value===i){t[l].selected=!0,r&&(t[l].defaultSelected=!0);return}n!==null||t[l].disabled||(n=t[l])}n!==null&&(n.selected=!0)}}function Xp(t,n,i){if(n!=null&&(n=""+Jn(n),n!==t.value&&(t.value=n),i==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=i!=null?""+Jn(i):""}function kp(t,n,i,r){if(n==null){if(r!=null){if(i!=null)throw Error(s(92));if(vt(r)){if(1<r.length)throw Error(s(93));r=r[0]}i=r}i==null&&(i=""),n=i}i=Jn(n),t.defaultValue=i,r=t.textContent,r===i&&r!==""&&r!==null&&(t.value=r),Cc(t)}function Qr(t,n){if(n){var i=t.firstChild;if(i&&i===t.lastChild&&i.nodeType===3){i.nodeValue=n;return}}t.textContent=n}var Bv=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function qp(t,n,i){var r=n.indexOf("--")===0;i==null||typeof i=="boolean"||i===""?r?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":r?t.setProperty(n,i):typeof i!="number"||i===0||Bv.has(n)?n==="float"?t.cssFloat=i:t[n]=(""+i).trim():t[n]=i+"px"}function Yp(t,n,i){if(n!=null&&typeof n!="object")throw Error(s(62));if(t=t.style,i!=null){for(var r in i)!i.hasOwnProperty(r)||n!=null&&n.hasOwnProperty(r)||(r.indexOf("--")===0?t.setProperty(r,""):r==="float"?t.cssFloat="":t[r]="",ge=!0);for(var l in n)r=n[l],n.hasOwnProperty(l)&&i[l]!==r&&(qp(t,l,r),ge=!0)}else for(var c in n)n.hasOwnProperty(c)&&qp(t,c,n[c])}function Uc(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fv=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Hv=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Tl(t){return Hv.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Fi(){}var Nc=null;function Lc(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Jr=null,$r=null;function Wp(t){var n=jt(t);if(n&&(t=n.stateNode)){var i=t[zt]||null;t:switch(t=n.stateNode,n.type){case"input":if(wc(t,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name),n=i.name,i.type==="radio"&&n!=null){for(i=t;i.parentNode;)i=i.parentNode;for(i=i.querySelectorAll('input[name="'+di(""+n)+'"][type="radio"]'),n=0;n<i.length;n++){var r=i[n];if(r!==t&&r.form===t.form){var l=r[zt]||null;if(!l)throw Error(s(90));wc(r,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name)}}for(n=0;n<i.length;n++)r=i[n],r.form===t.form&&Gp(r)}break t;case"textarea":Xp(t,i.value,i.defaultValue);break t;case"select":n=i.value,n!=null&&Kr(t,!!i.multiple,n,!1)}}}var Oc=!1;function jp(t,n,i){if(Oc)return t(n,i);Oc=!0;try{var r=t(n);return r}finally{if(Oc=!1,(Jr!==null||$r!==null)&&(Tu(),Jr&&(n=Jr,t=$r,$r=Jr=null,Wp(n),t)))for(n=0;n<t.length;n++)Wp(t[n])}}function uo(t,n){var i=t.stateNode;if(i===null)return null;var r=i[zt]||null;if(r===null)return null;i=r[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break t;default:t=!1}if(t)return null;if(i&&typeof i!="function")throw Error(s(231,n,typeof i));return i}var aa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Pc=!1;if(aa)try{var co={};Object.defineProperty(co,"passive",{get:function(){Pc=!0}}),window.addEventListener("test",co,co),window.removeEventListener("test",co,co)}catch{Pc=!1}var Ua=null,zc=null,Al=null;function Zp(){if(Al)return Al;var t,n=zc,i=n.length,r,l="value"in Ua?Ua.value:Ua.textContent,c=l.length;for(t=0;t<i&&n[t]===l[t];t++);var m=i-t;for(r=1;r<=m&&n[i-r]===l[c-r];r++);return Al=l.slice(t,1<r?1-r:void 0)}function Rl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Cl(){return!0}function Kp(){return!1}function Bn(t){function n(i,r,l,c,m){this._reactName=i,this._targetInst=l,this.type=r,this.nativeEvent=c,this.target=m,this.currentTarget=null;for(var b in t)t.hasOwnProperty(b)&&(i=t[b],this[b]=i?i(c):c[b]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?Cl:Kp,this.isPropagationStopped=Kp,this}return I(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var i=this.nativeEvent;i&&(i.preventDefault?i.preventDefault():typeof i.returnValue!="unknown"&&(i.returnValue=!1),this.isDefaultPrevented=Cl)},stopPropagation:function(){var i=this.nativeEvent;i&&(i.stopPropagation?i.stopPropagation():typeof i.cancelBubble!="unknown"&&(i.cancelBubble=!0),this.isPropagationStopped=Cl)},persist:function(){},isPersistent:Cl}),n}var Na={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wl=Bn(Na),fo=I({},Na,{view:0,detail:0}),Gv=Bn(fo),Ic,Bc,ho,Dl=I({},fo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Hc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ho&&(ho&&t.type==="mousemove"?(Ic=t.screenX-ho.screenX,Bc=t.screenY-ho.screenY):Bc=Ic=0,ho=t),Ic)},movementY:function(t){return"movementY"in t?t.movementY:Bc}}),Qp=Bn(Dl),Vv=I({},Dl,{dataTransfer:0}),Xv=Bn(Vv),kv=I({},fo,{relatedTarget:0}),Fc=Bn(kv),qv=I({},Na,{animationName:0,elapsedTime:0,pseudoElement:0}),Yv=Bn(qv),Wv=I({},Na,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),jv=Bn(Wv),Zv=I({},Na,{data:0}),Jp=Bn(Zv),Kv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Qv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function $v(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Jv[t])?!!n[t]:!1}function Hc(){return $v}var tS=I({},fo,{key:function(t){if(t.key){var n=Kv[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Rl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Qv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Hc,charCode:function(t){return t.type==="keypress"?Rl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Rl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),eS=Bn(tS),nS=I({},Dl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),$p=Bn(nS),iS=I({},Na,{submitter:0}),aS=Bn(iS),rS=I({},fo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Hc}),sS=Bn(rS),oS=I({},Na,{propertyName:0,elapsedTime:0,pseudoElement:0}),lS=Bn(oS),uS=I({},Dl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),cS=Bn(uS),fS=I({},Na,{newState:0,oldState:0,source:0}),dS=Bn(fS),hS=[9,13,27,32],Gc=aa&&"CompositionEvent"in window,po=null;aa&&"documentMode"in document&&(po=document.documentMode);var pS=aa&&"TextEvent"in window&&!po,t0=aa&&(!Gc||po&&8<po&&11>=po),e0=" ",n0=!1;function i0(t,n){switch(t){case"keyup":return hS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function a0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ts=!1;function mS(t,n){switch(t){case"compositionend":return a0(n);case"keypress":return n.which!==32?null:(n0=!0,e0);case"textInput":return t=n.data,t===e0&&n0?null:t;default:return null}}function xS(t,n){if(ts)return t==="compositionend"||!Gc&&i0(t,n)?(t=Zp(),Al=zc=Ua=null,ts=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return t0&&n.locale!=="ko"?null:n.data;default:return null}}var gS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function r0(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!gS[t.type]:n==="textarea"}function s0(t,n,i,r){Jr?$r?$r.push(r):$r=[r]:Jr=r,n=Uu(n,"onChange"),0<n.length&&(i=new wl("onChange","change",null,i,r),t.push({event:i,listeners:n}))}var mo=null,xo=null;function _S(t){Wx(t,0)}function Ul(t){var n=Ge(t);if(Gp(n))return t}function o0(t,n){if(t==="change")return n}var l0=!1;if(aa){var Vc;if(aa){var Xc="oninput"in document;if(!Xc){var u0=document.createElement("div");u0.setAttribute("oninput","return;"),Xc=typeof u0.oninput=="function"}Vc=Xc}else Vc=!1;l0=Vc&&(!document.documentMode||9<document.documentMode)}function c0(){mo&&(mo.detachEvent("onpropertychange",f0),xo=mo=null)}function f0(t){if(t.propertyName==="value"&&Ul(xo)){var n=[];s0(n,xo,t,Lc(t)),jp(_S,n)}}function vS(t,n,i){t==="focusin"?(c0(),mo=n,xo=i,mo.attachEvent("onpropertychange",f0)):t==="focusout"&&c0()}function SS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ul(xo)}function yS(t,n){if(t==="click")return Ul(n)}function MS(t,n){if(t==="input"||t==="change")return Ul(n)}function ES(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var $n=typeof Object.is=="function"?Object.is:ES;function go(t,n){if($n(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var i=Object.keys(t),r=Object.keys(n);if(i.length!==r.length)return!1;for(r=0;r<i.length;r++){var l=i[r];if(!wt.call(n,l)||!$n(t[l],n[l]))return!1}return!0}function kc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function d0(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function h0(t,n){var i=d0(t);t=0;for(var r;i;){if(i.nodeType===3){if(r=t+i.textContent.length,t<=n&&r>=n)return{node:i,offset:n-t};t=r}t:{for(;i;){if(i.nextSibling){i=i.nextSibling;break t}i=i.parentNode}i=void 0}i=d0(i)}}function p0(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?p0(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function m0(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=kc(t.document);n instanceof t.HTMLIFrameElement;){try{var i=typeof n.contentWindow.location.href=="string"}catch{i=!1}if(i)t=n.contentWindow;else break;n=kc(t.document)}return n}function qc(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var bS=aa&&"documentMode"in document&&11>=document.documentMode,es=null,Yc=null,_o=null,Wc=!1;function x0(t,n,i){var r=i.window===i?i.document:i.nodeType===9?i:i.ownerDocument;Wc||es==null||es!==kc(r)||(r=es,"selectionStart"in r&&qc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),_o&&go(_o,r)||(_o=r,r=Uu(Yc,"onSelect"),0<r.length&&(n=new wl("onSelect","select",null,n,i),t.push({event:n,listeners:r}),n.target=es)))}function gr(t,n){var i={};return i[t.toLowerCase()]=n.toLowerCase(),i["Webkit"+t]="webkit"+n,i["Moz"+t]="moz"+n,i}var ns={animationend:gr("Animation","AnimationEnd"),animationiteration:gr("Animation","AnimationIteration"),animationstart:gr("Animation","AnimationStart"),transitionrun:gr("Transition","TransitionRun"),transitionstart:gr("Transition","TransitionStart"),transitioncancel:gr("Transition","TransitionCancel"),transitionend:gr("Transition","TransitionEnd")},jc={},g0={};aa&&(g0=document.createElement("div").style,"AnimationEvent"in window||(delete ns.animationend.animation,delete ns.animationiteration.animation,delete ns.animationstart.animation),"TransitionEvent"in window||delete ns.transitionend.transition);function _r(t){if(jc[t])return jc[t];if(!ns[t])return t;var n=ns[t],i;for(i in n)if(n.hasOwnProperty(i)&&i in g0)return jc[t]=n[i];return t}var _0=_r("animationend"),v0=_r("animationiteration"),S0=_r("animationstart"),TS=_r("transitionrun"),AS=_r("transitionstart"),RS=_r("transitioncancel"),y0=_r("transitionend"),M0=new Map,Zc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Zc.push("scrollEnd");function Ti(t,n){M0.set(t,n),Ie(n,[t])}var CS=0;function ra(t,n){if(t.name!=null&&t.name!=="auto")return t.name;if(n.autoName!==null)return n.autoName;t=wi.identifierPrefix;var i=CS++;return t="_"+t+"t_"+i.toString(32)+"_",n.autoName=t}function E0(t){if(t==null||typeof t=="string")return t;var n=null,i=Ms;if(i!==null)for(var r=0;r<i.length;r++){var l=t[i[r]];if(l!=null){if(l==="none")return"none";n=n==null?l:n+(" "+l)}}return n??t.default}function sa(t,n){return t=E0(t),n=E0(n),n==null?t==="auto"?null:t:n==="auto"?null:n}var Nl=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},hi=[],is=0,Kc=0;function Ll(){for(var t=is,n=Kc=is=0;n<t;){var i=hi[n];hi[n++]=null;var r=hi[n];hi[n++]=null;var l=hi[n];hi[n++]=null;var c=hi[n];if(hi[n++]=null,r!==null&&l!==null){var m=r.pending;m===null?l.next=l:(l.next=m.next,m.next=l),r.pending=l}c!==0&&b0(i,l,c)}}function Ol(t,n,i,r){hi[is++]=t,hi[is++]=n,hi[is++]=i,hi[is++]=r,Kc|=r,t.lanes|=r,t=t.alternate,t!==null&&(t.lanes|=r)}function Qc(t,n,i,r){return Ol(t,n,i,r),Pl(t)}function vr(t,n){return Ol(t,null,null,n),Pl(t)}function b0(t,n,i){t.lanes|=i;var r=t.alternate;r!==null&&(r.lanes|=i);for(var l=!1,c=t.return;c!==null;)c.childLanes|=i,r=c.alternate,r!==null&&(r.childLanes|=i),c.tag===22&&(t=c.stateNode,t===null||t._visibility&1||(l=!0)),t=c,c=c.return;return t.tag===3?(c=t.stateNode,l&&n!==null&&(l=31-In(i),t=c.hiddenUpdates,r=t[l],r===null?t[l]=[n]:r.push(n),n.lane=i|536870912),c):null}function Pl(t){if(50<Ho)throw Ho=0,bu=null,Error(s(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var as={};function wS(t,n,i,r){this.tag=t,this.key=i,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function qn(t,n,i,r){return new wS(t,n,i,r)}function Jc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function oa(t,n){var i=t.alternate;return i===null?(i=qn(t.tag,n,t.key,t.mode),i.elementType=t.elementType,i.type=t.type,i.stateNode=t.stateNode,i.alternate=t,t.alternate=i):(i.pendingProps=n,i.type=t.type,i.flags=0,i.subtreeFlags=0,i.deletions=null),i.flags=t.flags&1206910976,i.childLanes=t.childLanes,i.lanes=t.lanes,i.child=t.child,i.memoizedProps=t.memoizedProps,i.memoizedState=t.memoizedState,i.updateQueue=t.updateQueue,n=t.dependencies,i.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},i.sibling=t.sibling,i.index=t.index,i.ref=t.ref,i.refCleanup=t.refCleanup,i}function T0(t,n){t.flags&=1206910978;var i=t.alternate;return i===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=i.childLanes,t.lanes=i.lanes,t.child=i.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=i.memoizedProps,t.memoizedState=i.memoizedState,t.updateQueue=i.updateQueue,t.type=i.type,n=i.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function zl(t,n,i,r,l,c){var m=0;if(r=t,typeof r=="function")Jc(r)&&(m=1);else if(typeof r=="string")m=iM(t,i,Ft.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(r){case Vt:return t=qn(31,i,n,l),t.elementType=Vt,t.lanes=c,t;case q:return Sr(i.children,l,c,n);case at:m=8,l|=24;break;case ut:return t=qn(12,i,n,l|2),t.elementType=ut,t.lanes=c,t;case rt:return t=qn(13,i,n,l),t.elementType=rt,t.lanes=c,t;case J:return t=qn(19,i,n,l),t.elementType=J,t.lanes=c,t;case le:case E:return t=l|32,t=qn(30,i,n,t),t.elementType=E,t.lanes=c,t.stateNode={autoName:null,paired:null,clones:null,ref:null},t;default:if(typeof r=="object"&&r!==null)switch(r.$$typeof){case ct:m=10;break t;case gt:m=9;break t;case K:m=11;break t;case St:m=14;break t;case _t:m=16,r=null;break t}m=29,i=Error(s(130,t===null?"null":typeof t,"")),r=null}return n=qn(m,i,n,l),n.elementType=t,n.type=r,n.lanes=c,n}function Sr(t,n,i,r){return t=qn(7,t,r,n),t.lanes=i,t}function $c(t,n,i){return t=qn(6,t,null,n),t.lanes=i,t}function A0(t){var n=qn(18,null,null,0);return n.stateNode=t,n}function tf(t,n,i){return n=qn(4,t.children!==null?t.children:[],t.key,n),n.lanes=i,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var R0=new WeakMap;function pi(t,n){if(typeof t=="object"&&t!==null){var i=R0.get(t);return i!==void 0?i:(n={value:t,source:n,stack:Tt(n)},R0.set(t,n),n)}return{value:t,source:n,stack:Tt(n)}}var rs=[],ss=0,Il=null,vo=0,mi=[],xi=0,La=null,Hi=1,Gi="";function la(t,n){rs[ss++]=vo,rs[ss++]=Il,Il=t,vo=n}function C0(t,n,i){mi[xi++]=Hi,mi[xi++]=Gi,mi[xi++]=La,La=t;var r=Hi;t=Gi;var l=32-In(r)-1;r&=~(1<<l),i+=1;var c=32-In(n)+l;if(30<c){var m=l-l%5;c=(r&(1<<m)-1).toString(32),r>>=m,l-=m,Hi=1<<32-In(n)+l|i<<l|r,Gi=c+t}else Hi=1<<c|i<<l|r,Gi=t}function Bl(t){t.return!==null&&(la(t,1),C0(t,1,0))}function ef(t){for(;t===Il;)Il=rs[--ss],rs[ss]=null,vo=rs[--ss],rs[ss]=null;for(;t===La;)La=mi[--xi],mi[xi]=null,Gi=mi[--xi],mi[xi]=null,Hi=mi[--xi],mi[xi]=null}function w0(t,n){mi[xi++]=Hi,mi[xi++]=Gi,mi[xi++]=La,Hi=n.id,Gi=n.overflow,La=t}var yn=null,Je=null,Me=!1,Oa=null,gi=!1,nf=Error(s(519));function Pa(t){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw So(pi(n,t)),nf}function D0(t){var n=t.stateNode,i=t.type,r=t.memoizedProps;switch(n[Ct]=t,n[zt]=r,i){case"dialog":Te("cancel",n),Te("close",n);break;case"iframe":case"object":case"embed":Te("load",n);break;case"video":case"audio":for(i=0;i<Vo.length;i++)Te(Vo[i],n);break;case"source":Te("error",n);break;case"img":case"image":case"link":Te("error",n),Te("load",n);break;case"details":Te("toggle",n);break;case"input":Te("invalid",n),Vp(n,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":Te("invalid",n);break;case"textarea":Te("invalid",n),kp(n,r.value,r.defaultValue,r.children)}i=r.children,typeof i!="string"&&typeof i!="number"&&typeof i!="bigint"||n.textContent===""+i||r.suppressHydrationWarning===!0||Qx(n.textContent,i)?(r.popover!=null&&(Te("beforetoggle",n),Te("toggle",n)),r.onScroll!=null&&Te("scroll",n),r.onScrollEnd!=null&&Te("scrollend",n),r.onClick!=null&&(n.onclick=Fi),n=!0):n=!1,n||Pa(t,!0)}function Fl(t){for(yn=t.return;yn;)switch(yn.tag){case 5:case 31:case 13:gi=!1;return;case 27:case 3:gi=!0;return;default:yn=yn.return}}function os(t){if(t!==yn)return!1;if(!Me)return Fl(t),Me=!0,!1;var n=t.tag,i;if((i=n!==3&&n!==27)&&((i=n===5)&&(i=t.type,i=!(i!=="form"&&i!=="button")||Ld(t.type,t.memoizedProps)),i=!i),i&&Je&&Pa(t),Fl(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));Je=xg(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));Je=xg(t)}else n===27?(n=Je,Qa(t.type)?(t=Vd,Vd=null,Je=t):Je=n):Je=yn?vi(t.stateNode.nextSibling):null;return!0}function yr(){Je=yn=null,Me=!1}function af(){var t=Oa;return t!==null&&(jn===null?jn=t:jn.push.apply(jn,t),Oa=null),t}function So(t){Oa===null?Oa=[t]:Oa.push(t)}var rf=ue(null),Mr=null,ua=null;function za(t,n,i){te(rf,n._currentValue),n._currentValue=i}function ca(t){t._currentValue=rf.current,Jt(rf)}function Hl(t,n,i){for(;t!==null;){var r=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),t===i)break;t=t.return}}function sf(t,n,i,r){var l=t.child;for(l!==null&&(l.return=t);l!==null;){var c=l.dependencies;if(c!==null){var m=l.child;c=c.firstContext;t:for(;c!==null;){var b=c;c=l;for(var P=0;P<n.length;P++)if(b.context===n[P]){c.lanes|=i,b=c.alternate,b!==null&&(b.lanes|=i),Hl(c.return,i,t),r||(m=null);break t}c=b.next}}else if(l.tag===18){if(m=l.return,m===null)throw Error(s(341));m.lanes|=i,c=m.alternate,c!==null&&(c.lanes|=i),Hl(m,i,t),m=null}else l.tag===13&&l.memoizedState!==null&&l.memoizedState.dehydrated===null?(l.lanes|=i,m=l.alternate,m!==null&&(m.lanes|=i),Hl(l.return,i,t),m=l.child,m=m!==null?m.sibling:null):m=l.child;if(m!==null)m.return=l;else for(m=l;m!==null;){if(m===t){m=null;break}if(l=m.sibling,l!==null){l.return=m.return,m=l;break}m=m.return}l=m}}function Er(t,n,i,r){t=null;for(var l=n,c=!1;l!==null;){if(!c){if((l.flags&524288)!==0)c=!0;else if((l.flags&262144)!==0)break}if(l.tag===10){var m=l.alternate;if(m===null)throw Error(s(387));if(m=m.memoizedProps,m!==null){var b=l.type;$n(l.pendingProps.value,m.value)||(t!==null?t.push(b):t=[b])}}else if(l===se.current){if(m=l.alternate,m===null)throw Error(s(387));m.memoizedState.memoizedState!==l.memoizedState.memoizedState&&(t!==null?t.push(Ns):t=[Ns])}l=l.return}return t!==null&&sf(n,t,i,r),n.flags|=262144,t!==null}function Gl(t){for(t=t.firstContext;t!==null;){if(!$n(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function br(t){Mr=t,ua=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function An(t){return U0(Mr,t)}function Vl(t,n){return Mr===null&&br(t),U0(t,n)}function U0(t,n){var i=n._currentValue;if(n={context:n,memoizedValue:i,next:null},ua===null){if(t===null)throw Error(s(308));ua=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ua=ua.next=n;return i}var DS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(i,r){t.push(r)}};this.abort=function(){n.aborted=!0,t.forEach(function(i){return i()})}},US=o.unstable_scheduleCallback,NS=o.unstable_NormalPriority,dn={$$typeof:ct,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function of(){return{controller:new DS,data:new Map,refCount:0}}function yo(t){t.refCount--,t.refCount===0&&US(NS,function(){t.controller.abort()})}function N0(t,n){if((t.pendingLanes&4194048)!==0){var i=t.transitionTypes;for(i===null&&(i=t.transitionTypes=[]),t=0;t<n.length;t++){var r=n[t];i.indexOf(r)===-1&&i.push(r)}}}var Mo=null;function LS(t){var n=t.transitionTypes;return t.transitionTypes=null,n}var Eo=null,lf=0,Tr=0,ls=null;function OS(t,n){if(Eo===null){var i=Eo=[];lf=0,Tr=bd(),ls={status:"pending",value:void 0,then:function(r){i.push(r)}}}return lf++,n.then(L0,L0),n}function L0(){if(--lf===0&&(Mo=null,Eo!==null)){ls!==null&&(ls.status="fulfilled");var t=Eo;Eo=null,Tr=0,ls=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function PS(t,n){var i=[],r={status:"pending",value:null,reason:null,then:function(l){i.push(l)}};return t.then(function(){r.status="fulfilled",r.value=n;for(var l=0;l<i.length;l++)(0,i[l])(n)},function(l){for(r.status="rejected",r.reason=l,l=0;l<i.length;l++)(0,i[l])(void 0)}),r}var O0=Mt.S;Mt.S=function(t,n){if(Ax=F(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&OS(t,n),Mo!==null)for(var i=As;i!==null;)N0(i,Mo),i=i.next;if(i=t.types,i!==null){for(var r=As;r!==null;)N0(r,i),r=r.next;if(Tr!==0){r=Mo,r===null&&(r=Mo=[]);for(var l=0;l<i.length;l++){var c=i[l];r.indexOf(c)===-1&&r.push(c)}}}O0!==null&&O0(t,n)};var Ar=ue(null);function uf(){var t=Ar.current;return t!==null?t:Qe.pooledCache}function Xl(t,n){n===null?te(Ar,Ar.current):te(Ar,n.pool)}function P0(){var t=uf();return t===null?null:{parent:dn._currentValue,pool:t}}var us=Error(s(460)),cf=Error(s(474)),kl=Error(s(542)),ql={then:function(){}};function z0(t){return t=t.status,t==="fulfilled"||t==="rejected"}function I0(t,n,i){switch(i=t[i],i===void 0?t.push(n):i!==n&&(n.then(Fi,Fi),n=i),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,F0(t),t===void 0&&!("reason"in n)?Error(s(600)):t;default:if(typeof n.status=="string")n.then(Fi,Fi);else{if(t=Qe,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=n,t.status="pending",t.then(function(r){if(n.status==="pending"){var l=n;l.status="fulfilled",l.value=r}},function(r){if(n.status==="pending"){var l=n;l.status="rejected",l.reason=r}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,F0(t),t}throw Cr=n,us}}function Rr(t){try{var n=t._init;return n(t._payload)}catch(i){throw i!==null&&typeof i=="object"&&typeof i.then=="function"?(Cr=i,us):i}}var Cr=null;function B0(){if(Cr===null)throw Error(s(459));var t=Cr;return Cr=null,t}function F0(t){if(t===us||t===kl)throw Error(s(483))}var cs=null,bo=0;function Yl(t){var n=bo;return bo+=1,cs===null&&(cs=[]),I0(cs,t,n)}function Ia(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Wl(t,n){throw n.$$typeof===Y?Error(s(525)):(t=Object.prototype.toString.call(n),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function H0(t){function n(j,X){if(t){var tt=j.deletions;tt===null?(j.deletions=[X],j.flags|=16):tt.push(X)}}function i(j,X){if(!t)return null;for(;X!==null;)n(j,X),X=X.sibling;return null}function r(j){for(var X=new Map;j!==null;)j.key===null?X.set(j.index,j):X.set(j.key,j),j=j.sibling;return X}function l(j,X){return j=oa(j,X),j.index=0,j.sibling=null,j}function c(j,X,tt){return j.index=tt,t?(tt=j.alternate,tt!==null?(tt=tt.index,tt<X?(j.flags|=2,X):tt):(j.flags|=134217730,X)):(j.flags|=1048576,X)}function m(j){return t&&j.alternate===null&&(j.flags|=134217730),j}function b(j,X,tt,pt){return X===null||X.tag!==6?(X=$c(tt,j.mode,pt),X.return=j,X):(X=l(X,tt),X.return=j,X)}function P(j,X,tt,pt){var Gt=tt.type;return Gt===q?(j=it(j,X,tt.props.children,pt,tt.key),Ia(j,tt),j):X!==null&&(X.elementType===Gt||typeof Gt=="object"&&Gt!==null&&Gt.$$typeof===_t&&Rr(Gt)===X.type)?(X=l(X,tt.props),Ia(X,tt),X.return=j,X):(X=zl(tt.type,tt.key,tt.props,null,j.mode,pt),Ia(X,tt),X.return=j,X)}function Z(j,X,tt,pt){return X===null||X.tag!==4||X.stateNode.containerInfo!==tt.containerInfo||X.stateNode.implementation!==tt.implementation?(X=tf(tt,j.mode,pt),X.return=j,X):(X=l(X,tt.children||[]),X.return=j,X)}function it(j,X,tt,pt,Gt){return X===null||X.tag!==7?(X=Sr(tt,j.mode,pt,Gt),X.return=j,X):(X=l(X,tt),X.return=j,X)}function mt(j,X,tt){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=$c(""+X,j.mode,tt),X.return=j,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case D:return tt=zl(X.type,X.key,X.props,null,j.mode,tt),Ia(tt,X),tt.return=j,tt;case w:return X=tf(X,j.mode,tt),X.return=j,X;case _t:return X=Rr(X),mt(j,X,tt)}if(vt(X)||k(X))return X=Sr(X,j.mode,tt,null),X.return=j,X;if(typeof X.then=="function")return mt(j,Yl(X),tt);if(X.$$typeof===ct)return mt(j,Vl(j,X),tt);Wl(j,X)}return null}function W(j,X,tt,pt){var Gt=X!==null?X.key:null;if(typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint")return Gt!==null?null:b(j,X,""+tt,pt);if(typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case D:return tt.key===Gt?P(j,X,tt,pt):null;case w:return tt.key===Gt?Z(j,X,tt,pt):null;case _t:return tt=Rr(tt),W(j,X,tt,pt)}if(vt(tt)||k(tt))return Gt!==null?null:it(j,X,tt,pt,null);if(typeof tt.then=="function")return W(j,X,Yl(tt),pt);if(tt.$$typeof===ct)return W(j,X,Vl(j,tt),pt);Wl(j,tt)}return null}function et(j,X,tt,pt,Gt){if(typeof pt=="string"&&pt!==""||typeof pt=="number"||typeof pt=="bigint")return j=j.get(tt)||null,b(X,j,""+pt,Gt);if(typeof pt=="object"&&pt!==null){switch(pt.$$typeof){case D:return j=j.get(pt.key===null?tt:pt.key)||null,P(X,j,pt,Gt);case w:return j=j.get(pt.key===null?tt:pt.key)||null,Z(X,j,pt,Gt);case _t:return pt=Rr(pt),et(j,X,tt,pt,Gt)}if(vt(pt)||k(pt))return j=j.get(tt)||null,it(X,j,pt,Gt,null);if(typeof pt.then=="function")return et(j,X,tt,Yl(pt),Gt);if(pt.$$typeof===ct)return et(j,X,tt,Vl(X,pt),Gt);Wl(X,pt)}return null}function Nt(j,X,tt,pt){for(var Gt=null,Re=null,Zt=X,ie=X=0,mn=null;Zt!==null&&ie<tt.length;ie++){Zt.index>ie?(mn=Zt,Zt=null):mn=Zt.sibling;var Ne=W(j,Zt,tt[ie],pt);if(Ne===null){Zt===null&&(Zt=mn);break}t&&Zt&&Ne.alternate===null&&n(j,Zt),X=c(Ne,X,ie),Re===null?Gt=Ne:Re.sibling=Ne,Re=Ne,Zt=mn}if(ie===tt.length)return i(j,Zt),Me&&la(j,ie),Gt;if(Zt===null){for(;ie<tt.length;ie++)Zt=mt(j,tt[ie],pt),Zt!==null&&(X=c(Zt,X,ie),Re===null?Gt=Zt:Re.sibling=Zt,Re=Zt);return Me&&la(j,ie),Gt}for(Zt=r(Zt);ie<tt.length;ie++)mn=et(Zt,j,ie,tt[ie],pt),mn!==null&&(t&&(Ne=mn.alternate,Ne!==null&&Zt.delete(Ne.key===null?ie:Ne.key)),X=c(mn,X,ie),Re===null?Gt=mn:Re.sibling=mn,Re=mn);return t&&Zt.forEach(function(nr){return n(j,nr)}),Me&&la(j,ie),Gt}function qt(j,X,tt,pt){if(tt==null)throw Error(s(151));for(var Gt=null,Re=null,Zt=X,ie=X=0,mn=null,Ne=tt.next();Zt!==null&&!Ne.done;ie++,Ne=tt.next()){Zt.index>ie?(mn=Zt,Zt=null):mn=Zt.sibling;var nr=W(j,Zt,Ne.value,pt);if(nr===null){Zt===null&&(Zt=mn);break}t&&Zt&&nr.alternate===null&&n(j,Zt),X=c(nr,X,ie),Re===null?Gt=nr:Re.sibling=nr,Re=nr,Zt=mn}if(Ne.done)return i(j,Zt),Me&&la(j,ie),Gt;if(Zt===null){for(;!Ne.done;ie++,Ne=tt.next())Ne=mt(j,Ne.value,pt),Ne!==null&&(X=c(Ne,X,ie),Re===null?Gt=Ne:Re.sibling=Ne,Re=Ne);return Me&&la(j,ie),Gt}for(Zt=r(Zt);!Ne.done;ie++,Ne=tt.next())Ne=et(Zt,j,ie,Ne.value,pt),Ne!==null&&(t&&(mn=Ne.alternate,mn!==null&&Zt.delete(mn.key===null?ie:mn.key)),X=c(Ne,X,ie),Re===null?Gt=Ne:Re.sibling=Ne,Re=Ne);return t&&Zt.forEach(function(mM){return n(j,mM)}),Me&&la(j,ie),Gt}function pe(j,X,tt,pt){if(typeof tt=="object"&&tt!==null&&tt.type===q&&tt.key===null&&tt.props.ref===void 0&&(tt=tt.props.children),typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case D:t:{for(var Gt=tt.key;X!==null;){if(X.key===Gt){if(Gt=tt.type,Gt===q){if(X.tag===7){i(j,X.sibling),pt=l(X,tt.props.children),Ia(pt,tt),pt.return=j,j=pt;break t}}else if(X.elementType===Gt||typeof Gt=="object"&&Gt!==null&&Gt.$$typeof===_t&&Rr(Gt)===X.type){i(j,X.sibling),pt=l(X,tt.props),Ia(pt,tt),pt.return=j,j=pt;break t}i(j,X);break}else n(j,X);X=X.sibling}tt.type===q?(pt=Sr(tt.props.children,j.mode,pt,tt.key),Ia(pt,tt),pt.return=j,j=pt):(pt=zl(tt.type,tt.key,tt.props,null,j.mode,pt),Ia(pt,tt),pt.return=j,j=pt)}return m(j);case w:t:{for(Gt=tt.key;X!==null;){if(X.key===Gt)if(X.tag===4&&X.stateNode.containerInfo===tt.containerInfo&&X.stateNode.implementation===tt.implementation){i(j,X.sibling),pt=l(X,tt.children||[]),pt.return=j,j=pt;break t}else{i(j,X);break}else n(j,X);X=X.sibling}pt=tf(tt,j.mode,pt),pt.return=j,j=pt}return m(j);case _t:return tt=Rr(tt),pe(j,X,tt,pt)}if(vt(tt))return Nt(j,X,tt,pt);if(k(tt)){if(Gt=k(tt),typeof Gt!="function")throw Error(s(150));return tt=Gt.call(tt),qt(j,X,tt,pt)}if(typeof tt.then=="function")return pe(j,X,Yl(tt),pt);if(tt.$$typeof===ct)return pe(j,X,Vl(j,tt),pt);Wl(j,tt)}return typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint"?(tt=""+tt,X!==null&&X.tag===6?(i(j,X.sibling),pt=l(X,tt),pt.return=j,j=pt):(i(j,X),pt=$c(tt,j.mode,pt),pt.return=j,j=pt),m(j)):i(j,X)}return function(j,X,tt,pt){try{bo=0;var Gt=pe(j,X,tt,pt);return cs=null,Gt}catch(Zt){if(Zt===us||Zt===kl)throw Zt;var Re=qn(29,Zt,null,j.mode);return Re.lanes=pt,Re.return=j,Re}}}var wr=H0(!0),G0=H0(!1),Ba=!1;function ff(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function df(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Fa(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Ha(t,n,i){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,(Be&2)!==0){var l=r.pending;return l===null?n.next=n:(n.next=l.next,l.next=n),r.pending=n,n=Pl(t),b0(t,null,i),n}return Ol(t,r,n,i),Pl(t)}function To(t,n,i){if(n=n.updateQueue,n!==null&&(n=n.shared,(i&4194048)!==0)){var r=n.lanes;r&=t.pendingLanes,i|=r,n.lanes=i,Ml(t,i)}}function hf(t,n){var i=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,i===r)){var l=null,c=null;if(i=i.firstBaseUpdate,i!==null){do{var m={lane:i.lane,tag:i.tag,payload:i.payload,callback:null,next:null};c===null?l=c=m:c=c.next=m,i=i.next}while(i!==null);c===null?l=c=n:c=c.next=n}else l=c=n;i={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:c,shared:r.shared,callbacks:r.callbacks},t.updateQueue=i;return}t=i.lastBaseUpdate,t===null?i.firstBaseUpdate=n:t.next=n,i.lastBaseUpdate=n}var pf=!1;function Ao(){if(pf){var t=ls;if(t!==null)throw t}}function Ro(t,n,i,r){pf=!1;var l=t.updateQueue;Ba=!1;var c=l.firstBaseUpdate,m=l.lastBaseUpdate,b=l.shared.pending;if(b!==null){l.shared.pending=null;var P=b,Z=P.next;P.next=null,m===null?c=Z:m.next=Z,m=P;var it=t.alternate;it!==null&&(it=it.updateQueue,b=it.lastBaseUpdate,b!==m&&(b===null?it.firstBaseUpdate=Z:b.next=Z,it.lastBaseUpdate=P))}if(c!==null){var mt=l.baseState;m=0,it=Z=P=null,b=c;do{var W=b.lane&-536870913,et=W!==b.lane;if(et?(Ae&W)===W:(r&W)===W){W!==0&&W===Tr&&(pf=!0),it!==null&&(it=it.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});t:{var Nt=t,qt=b;W=n;var pe=i;switch(qt.tag){case 1:if(Nt=qt.payload,typeof Nt=="function"){mt=Nt.call(pe,mt,W);break t}mt=Nt;break t;case 3:Nt.flags=Nt.flags&-65537|128;case 0:if(Nt=qt.payload,W=typeof Nt=="function"?Nt.call(pe,mt,W):Nt,W==null)break t;mt=I({},mt,W);break t;case 2:Ba=!0}}W=b.callback,W!==null&&(t.flags|=64,et&&(t.flags|=8192),et=l.callbacks,et===null?l.callbacks=[W]:et.push(W))}else et={lane:W,tag:b.tag,payload:b.payload,callback:b.callback,next:null},it===null?(Z=it=et,P=mt):it=it.next=et,m|=W;if(b=b.next,b===null){if(b=l.shared.pending,b===null)break;et=b,b=et.next,et.next=null,l.lastBaseUpdate=et,l.shared.pending=null}}while(!0);it===null&&(P=mt),l.baseState=P,l.firstBaseUpdate=Z,l.lastBaseUpdate=it,c===null&&(l.shared.lanes=0),Wa|=m,t.lanes=m,t.memoizedState=mt}}function V0(t,n){if(typeof t!="function")throw Error(s(191,t));t.call(n)}function X0(t,n){var i=t.callbacks;if(i!==null)for(t.callbacks=null,t=0;t<i.length;t++)V0(i[t],n)}var Ga=ue(null),jl=ue(0);function k0(t,n){t=ma,te(jl,t),te(Ga,n),ma=t|n.baseLanes}function mf(){te(jl,ma),te(Ga,Ga.current)}function xf(){ma=jl.current,Jt(Ga),Jt(jl)}var Rn=ue(null),On=null;function Va(t){var n=t.alternate;te(Cn,Cn.current&1),te(Rn,t),On===null&&(n===null||Ga.current!==null||n.memoizedState!==null)&&(On=t)}function gf(t){te(Cn,Cn.current),te(Rn,t),On===null&&(On=t)}function q0(t){t.tag===22?(te(Cn,Cn.current),te(Rn,t),On===null&&(On=t)):Xa()}function Xa(){te(Cn,Cn.current),te(Rn,Rn.current)}function ti(t){Jt(Rn),On===t&&(On=null),Jt(Cn)}var Cn=ue(0);function Co(t,n){te(Rn,Rn.current),te(Cn,n)}function _f(t){Jt(Cn),Jt(Rn),On===t&&(On=null)}function Zl(t){for(var n=t;n!==null;){if(n.tag===13){var i=n.memoizedState;if(i!==null&&(i=i.dehydrated,i===null||Hd(i)||Gd(i)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var fa=0,he=null,Ye=null,hn=null,Kl=!1,fs=!1,Dr=!1,Ql=0,wo=0,ds=null,zS=0;function an(){throw Error(s(321))}function vf(t,n){if(n===null)return!1;for(var i=0;i<n.length&&i<t.length;i++)if(!$n(t[i],n[i]))return!1;return!0}function Sf(t,n,i,r,l,c){return fa=c,he=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Mt.H=t===null||t.memoizedState===null?Cm:wm,Dr=!1,c=i(r,l),Dr=!1,fs&&(c=W0(n,i,r,l)),Y0(t),c}function Y0(t){Mt.H=au;var n=Ye!==null&&Ye.next!==null;if(fa=0,hn=Ye=he=null,Kl=!1,wo=0,ds=null,n)throw Error(s(300));t===null||pn||(t=t.dependencies,t!==null&&Gl(t)&&(pn=!0))}function W0(t,n,i,r){he=t;var l=0;do{if(fs&&(ds=null),wo=0,fs=!1,25<=l)throw Error(s(301));if(l+=1,hn=Ye=null,t.updateQueue!=null){var c=t.updateQueue;c.lastEffect=null,c.events=null,c.stores=null,c.memoCache!=null&&(c.memoCache.index=0)}Mt.H=kS,c=n(i,r)}while(fs);return c}function IS(){var t=Mt.H,n=t.useState()[0];return n=typeof n.then=="function"?Do(n):n,t=t.useState()[0],(Ye!==null?Ye.memoizedState:null)!==t&&(he.flags|=1024),n}function yf(){var t=Ql!==0;return Ql=0,t}function Mf(t,n,i){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~i}function Ef(t){if(Kl){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Kl=!1}fa=0,hn=Ye=he=null,fs=!1,wo=Ql=0,ds=null}function Fn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return hn===null?he.memoizedState=hn=t:hn=hn.next=t,hn}function un(){if(Ye===null){var t=he.alternate;t=t!==null?t.memoizedState:null}else t=Ye.next;var n=hn===null?he.memoizedState:hn.next;if(n!==null)hn=n,Ye=t;else{if(t===null)throw he.alternate===null?Error(s(467)):Error(s(310));Ye=t,t={memoizedState:Ye.memoizedState,baseState:Ye.baseState,baseQueue:Ye.baseQueue,queue:Ye.queue,next:null},hn===null?he.memoizedState=hn=t:hn=hn.next=t}return hn}function Jl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Do(t){var n=wo;return wo+=1,ds===null&&(ds=[]),t=I0(ds,t,n),n=he,(hn===null?n.memoizedState:hn.next)===null&&(n=n.alternate,Mt.H=n===null||n.memoizedState===null?Cm:wm),t}function $l(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Do(t);if(t.$$typeof===G)return;if(t.$$typeof===ct)return An(t)}throw Error(s(438,String(t)))}function bf(t){var n=null,i=he.updateQueue;if(i!==null&&(n=i.memoCache),n==null){var r=he.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(n={data:r.data.map(function(l){return l.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),i===null&&(i=Jl(),he.updateQueue=i),i.memoCache=n,i=n.data[n.index],i===void 0)for(i=n.data[n.index]=Array(t),r=0;r<t;r++)i[r]=Ee;return n.index++,i}function da(t,n){return typeof n=="function"?n(t):n}function tu(t){var n=un();return Tf(n,Ye,t)}function Tf(t,n,i){var r=t.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=i;var l=t.baseQueue,c=r.pending;if(c!==null){if(l!==null){var m=l.next;l.next=c.next,c.next=m}n.baseQueue=l=c,r.pending=null}if(c=t.baseState,l===null)t.memoizedState=c;else{n=l.next;var b=m=null,P=null,Z=n,it=!1;do{var mt=Z.lane&-536870913;if(mt!==Z.lane?(Ae&mt)===mt:(fa&mt)===mt){var W=Z.revertLane;if(W===0)P!==null&&(P=P.next={lane:0,revertLane:0,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null}),mt===Tr&&(it=!0);else if((fa&W)===W){Z=Z.next,W===Tr&&(it=!0);continue}else mt={lane:0,revertLane:Z.revertLane,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},P===null?(b=P=mt,m=c):P=P.next=mt,he.lanes|=W,Wa|=W;mt=Z.action,Dr&&i(c,mt),c=Z.hasEagerState?Z.eagerState:i(c,mt)}else W={lane:mt,revertLane:Z.revertLane,gesture:Z.gesture,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},P===null?(b=P=W,m=c):P=P.next=W,he.lanes|=mt,Wa|=mt;Z=Z.next}while(Z!==null&&Z!==n);if(P===null?m=c:P.next=b,!$n(c,t.memoizedState)&&(pn=!0,it&&(i=ls,i!==null)))throw i;t.memoizedState=c,t.baseState=m,t.baseQueue=P,r.lastRenderedState=c}return l===null&&(r.lanes=0),[t.memoizedState,r.dispatch]}function Af(t){var n=un(),i=n.queue;if(i===null)throw Error(s(311));i.lastRenderedReducer=t;var r=i.dispatch,l=i.pending,c=n.memoizedState;if(l!==null){i.pending=null;var m=l=l.next;do c=t(c,m.action),m=m.next;while(m!==l);$n(c,n.memoizedState)||(pn=!0),n.memoizedState=c,n.baseQueue===null&&(n.baseState=c),i.lastRenderedState=c}return[c,r]}function j0(t,n,i){var r=he,l=un(),c=Me;if(c){if(i===void 0)throw Error(s(407));i=i()}else i=n();var m=!$n((Ye||l).memoizedState,i);if(m&&(l.memoizedState=i,pn=!0),l=l.queue,wf(Q0.bind(null,r,l,t),[t]),t=l.getSnapshot!==n||m||hn!==null&&(hn.memoizedState.tag&1)!==0,hs(t?9:8,{destroy:void 0},K0.bind(null,r,l,i,n),null),t){if(r.flags|=2048,Qe===null)throw Error(s(349));c||(fa&127)!==0||Z0(r,n,i)}return i}function Z0(t,n,i){t.flags|=16384,t={getSnapshot:n,value:i},n=he.updateQueue,n===null?(n=Jl(),he.updateQueue=n,n.stores=[t]):(i=n.stores,i===null?n.stores=[t]:i.push(t))}function K0(t,n,i,r){n.value=i,n.getSnapshot=r,J0(n)&&$0(t)}function Q0(t,n,i){return i(function(){J0(n)&&$0(t)})}function J0(t){var n=t.getSnapshot;t=t.value;try{var i=n();return!$n(t,i)}catch{return!0}}function $0(t){var n=vr(t,2);n!==null&&Zn(n,t,2)}function Rf(t){var n=Fn();if(typeof t=="function"){var i=t;if(t=i(),Dr){fn(!0);try{i()}finally{fn(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:t},n}function tm(t,n,i,r){return t.baseState=i,Tf(t,Ye,typeof r=="function"?r:da)}function BS(t,n,i,r,l){if(iu(t))throw Error(s(485));if(t=n.action,t!==null){var c={payload:l,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(m){c.listeners.push(m)}};Mt.T!==null?i(!0):c.isTransition=!1,r(c),i=n.pending,i===null?(c.next=n.pending=c,em(n,c)):(c.next=i.next,n.pending=i.next=c)}}function em(t,n){var i=n.action,r=n.payload,l=t.state;if(n.isTransition){var c=Mt.T,m={};m.types=c!==null?c.types:null,Mt.T=m;try{var b=i(l,r),P=Mt.S;P!==null&&P(m,b),nm(t,n,b)}catch(Z){Cf(t,n,Z)}finally{c!==null&&m.types!==null&&(c.types=m.types),Mt.T=c}}else try{c=i(l,r),nm(t,n,c)}catch(Z){Cf(t,n,Z)}}function nm(t,n,i){i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(function(r){im(t,n,r)},function(r){return Cf(t,n,r)}):im(t,n,i)}function im(t,n,i){n.status="fulfilled",n.value=i,am(n),t.state=i,n=t.pending,n!==null&&(i=n.next,i===n?t.pending=null:(i=i.next,n.next=i,em(t,i)))}function Cf(t,n,i){var r=t.pending;if(t.pending=null,r!==null){r=r.next;do n.status="rejected",n.reason=i,am(n),n=n.next;while(n!==r)}t.action=null}function am(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function rm(t,n){return n}function sm(t,n){if(Me){var i=Qe.formState;if(i!==null){t:{var r=he;if(Me){if(Je){e:{for(var l=Je,c=gi;l.nodeType!==8;){if(!c){l=null;break e}if(l=vi(l.nextSibling),l===null){l=null;break e}}c=l.data,l=c==="F!"||c==="F"?l:null}if(l){Je=vi(l.nextSibling),r=l.data==="F!";break t}}Pa(r)}r=!1}r&&(n=i[0])}}return i=Fn(),i.memoizedState=i.baseState=n,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rm,lastRenderedState:n},i.queue=r,i=Tm.bind(null,he,r),r.dispatch=i,r=Rf(!1),c=Of.bind(null,he,!1,r.queue),r=Fn(),l={state:n,dispatch:null,action:t,pending:null},r.queue=l,i=BS.bind(null,he,l,c,i),l.dispatch=i,r.memoizedState=t,[n,i,!1]}function om(t){var n=un();return lm(n,Ye,t)}function lm(t,n,i){if(n=Tf(t,n,rm)[0],t=tu(da)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var r=Do(n)}catch(m){throw m===us?kl:m}else r=n;n=un();var l=n.queue,c=l.dispatch;return i!==n.memoizedState&&(he.flags|=2048,hs(9,{destroy:void 0},FS.bind(null,l,i),null)),[r,c,t]}function FS(t,n){t.action=n}function um(t){var n=un(),i=Ye;if(i!==null)return lm(n,i,t);un(),n=n.memoizedState,i=un();var r=i.queue.dispatch;return i.memoizedState=t,[n,r,!1]}function hs(t,n,i,r){return t={tag:t,create:i,deps:r,inst:n,next:null},n=he.updateQueue,n===null&&(n=Jl(),he.updateQueue=n),i=n.lastEffect,i===null?n.lastEffect=t.next=t:(r=i.next,i.next=t,t.next=r,n.lastEffect=t),t}function cm(){return un().memoizedState}function eu(t,n,i,r){var l=Fn();he.flags|=t,l.memoizedState=hs(1|n,{destroy:void 0},i,r===void 0?null:r)}function nu(t,n,i,r){var l=un();r=r===void 0?null:r;var c=l.memoizedState.inst;Ye!==null&&r!==null&&vf(r,Ye.memoizedState.deps)?l.memoizedState=hs(n,c,i,r):(he.flags|=t,l.memoizedState=hs(1|n,c,i,r))}function fm(t,n){eu(8390656,8,t,n)}function wf(t,n){nu(2048,8,t,n)}function HS(t){he.flags|=4;var n=he.updateQueue;if(n===null)n=Jl(),he.updateQueue=n,n.events=[t];else{var i=n.events;i===null?n.events=[t]:i.push(t)}}function dm(t){var n=un().memoizedState;return HS({ref:n,nextImpl:t}),function(){if((Be&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function hm(t,n){return nu(4,2,t,n)}function pm(t,n){return nu(4,4,t,n)}function mm(t,n){if(typeof n=="function"){t=t();var i=n(t);return function(){typeof i=="function"?i():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function xm(t,n,i){i=i!=null?i.concat([t]):null,nu(4,4,mm.bind(null,n,t),i)}function Df(){}function gm(t,n){var i=un();n=n===void 0?null:n;var r=i.memoizedState;return n!==null&&vf(n,r[1])?r[0]:(i.memoizedState=[t,n],t)}function _m(t,n){var i=un();n=n===void 0?null:n;var r=i.memoizedState;if(n!==null&&vf(n,r[1]))return r[0];if(r=t(),Dr){fn(!0);try{t()}finally{fn(!1)}}return i.memoizedState=[r,n],r}function Uf(t,n,i){return i===void 0||(fa&1073741824)!==0&&(Ae&261930)===0?t.memoizedState=n:(t.memoizedState=i,t=Cx(),he.lanes|=t,Wa|=t,i)}function vm(t,n,i,r){return $n(i,n)?i:Ga.current!==null?(t=Uf(t,i,r),$n(t,n)||(pn=!0),t):(fa&106)===0||(fa&1073741824)!==0&&(Ae&261930)===0?(pn=!0,t.memoizedState=i):(t=Cx(),he.lanes|=t,Wa|=t,n)}function Sm(t,n,i,r,l){var c=Lt.p;Lt.p=c!==0&&8>c?c:8;var m=Mt.T,b={};b.types=m!==null?m.types:null,Mt.T=b,Of(t,!1,n,i);try{var P=l(),Z=Mt.S;if(Z!==null&&Z(b,P),P!==null&&typeof P=="object"&&typeof P.then=="function"){var it=PS(P,r);Uo(t,n,it,ai(t))}else Uo(t,n,r,ai(t))}catch(mt){Uo(t,n,{then:function(){},status:"rejected",reason:mt},ai())}finally{Lt.p=c,m!==null&&b.types!==null&&(m.types=b.types),Mt.T=m}}function GS(){}function Nf(t,n,i,r){if(t.tag!==5)throw Error(s(476));var l=ym(t).queue;Sm(t,l,n,ae,i===null?GS:function(){return Mm(t),i(r)})}function ym(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:ae,baseState:ae,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:ae},next:null};var i={};return n.next={memoizedState:i,baseState:i,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:i},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function Mm(t){var n=ym(t);n.next===null&&(n=t.alternate.memoizedState),Uo(t,n.next.queue,{},ai())}function Lf(){return An(Ns)}function Em(){return un().memoizedState}function bm(){return un().memoizedState}function VS(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var i=ai();t=Fa(i);var r=Ha(n,t,i);r!==null&&(Zn(r,n,i),To(r,n,i)),n={cache:of()},t.payload=n;return}n=n.return}}function XS(t,n,i){var r=ai();i={lane:r,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},iu(t)?Am(n,i):(i=Qc(t,n,i,r),i!==null&&(Zn(i,t,r),Rm(i,n,r)))}function Tm(t,n,i){var r=ai();Uo(t,n,i,r)}function Uo(t,n,i,r){var l={lane:r,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null};if(iu(t))Am(n,l);else{var c=t.alternate;if(t.lanes===0&&(c===null||c.lanes===0)&&(c=n.lastRenderedReducer,c!==null))try{var m=n.lastRenderedState,b=c(m,i);if(l.hasEagerState=!0,l.eagerState=b,$n(b,m))return Ol(t,n,l,0),Qe===null&&Ll(),!1}catch{}if(i=Qc(t,n,l,r),i!==null)return Zn(i,t,r),Rm(i,n,r),!0}return!1}function Of(t,n,i,r){if(r={lane:2,revertLane:bd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},iu(t)){if(n)throw Error(s(479))}else n=Qc(t,i,r,2),n!==null&&Zn(n,t,2)}function iu(t){var n=t.alternate;return t===he||n!==null&&n===he}function Am(t,n){fs=Kl=!0;var i=t.pending;i===null?n.next=n:(n.next=i.next,i.next=n),t.pending=n}function Rm(t,n,i){if((i&4194048)!==0){var r=n.lanes;r&=t.pendingLanes,i|=r,n.lanes=i,Ml(t,i)}}var au={readContext:An,use:$l,useCallback:an,useContext:an,useEffect:an,useImperativeHandle:an,useLayoutEffect:an,useInsertionEffect:an,useMemo:an,useReducer:an,useRef:an,useState:an,useDebugValue:an,useDeferredValue:an,useTransition:an,useSyncExternalStore:an,useId:an,useHostTransitionStatus:an,useFormState:an,useActionState:an,useOptimistic:an,useMemoCache:an,useCacheRefresh:an,useEffectEvent:an},Cm={readContext:An,use:$l,useCallback:function(t,n){return Fn().memoizedState=[t,n===void 0?null:n],t},useContext:An,useEffect:fm,useImperativeHandle:function(t,n,i){i=i!=null?i.concat([t]):null,eu(4194308,4,mm.bind(null,n,t),i)},useLayoutEffect:function(t,n){return eu(4194308,4,t,n)},useInsertionEffect:function(t,n){eu(4,2,t,n)},useMemo:function(t,n){var i=Fn();n=n===void 0?null:n;var r=t();if(Dr){fn(!0);try{t()}finally{fn(!1)}}return i.memoizedState=[r,n],r},useReducer:function(t,n,i){var r=Fn();if(i!==void 0){var l=i(n);if(Dr){fn(!0);try{i(n)}finally{fn(!1)}}}else l=n;return r.memoizedState=r.baseState=l,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:l},r.queue=t,t=t.dispatch=XS.bind(null,he,t),[r.memoizedState,t]},useRef:function(t){var n=Fn();return t={current:t},n.memoizedState=t},useState:function(t){t=Rf(t);var n=t.queue,i=Tm.bind(null,he,n);return n.dispatch=i,[t.memoizedState,i]},useDebugValue:Df,useDeferredValue:function(t,n){var i=Fn();return Uf(i,t,n)},useTransition:function(){var t=Rf(!1);return t=Sm.bind(null,he,t.queue,!0,!1),Fn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,i){var r=he,l=Fn();if(Me){if(i===void 0)throw Error(s(407));i=i()}else{if(i=n(),Qe===null)throw Error(s(349));(Ae&127)!==0||Z0(r,n,i)}l.memoizedState=i;var c={value:i,getSnapshot:n};return l.queue=c,fm(Q0.bind(null,r,c,t),[t]),r.flags|=2048,hs(9,{destroy:void 0},K0.bind(null,r,c,i,n),null),i},useId:function(){var t=Fn(),n=Qe.identifierPrefix;if(Me){var i=Gi,r=Hi;i=(r&~(1<<32-In(r)-1)).toString(32)+i,n="_"+n+"R_"+i,i=Ql++,0<i&&(n+="H"+i.toString(32)),n+="_"}else i=zS++,n="_"+n+"r_"+i.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Lf,useFormState:sm,useActionState:sm,useOptimistic:function(t){var n=Fn();n.memoizedState=n.baseState=t;var i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=i,n=Of.bind(null,he,!0,i),i.dispatch=n,[t,n]},useMemoCache:bf,useCacheRefresh:function(){return Fn().memoizedState=VS.bind(null,he)},useEffectEvent:function(t){var n=Fn(),i={impl:t};return n.memoizedState=i,function(){if((Be&2)!==0)throw Error(s(440));return i.impl.apply(void 0,arguments)}}},wm={readContext:An,use:$l,useCallback:gm,useContext:An,useEffect:wf,useImperativeHandle:xm,useInsertionEffect:hm,useLayoutEffect:pm,useMemo:_m,useReducer:tu,useRef:cm,useState:function(){return tu(da)},useDebugValue:Df,useDeferredValue:function(t,n){var i=un();return vm(i,Ye.memoizedState,t,n)},useTransition:function(){var t=tu(da)[0],n=un().memoizedState;return[typeof t=="boolean"?t:Do(t),n]},useSyncExternalStore:j0,useId:Em,useHostTransitionStatus:Lf,useFormState:om,useActionState:om,useOptimistic:function(t,n){var i=un();return tm(i,Ye,t,n)},useMemoCache:bf,useCacheRefresh:bm,useEffectEvent:dm},kS={readContext:An,use:$l,useCallback:gm,useContext:An,useEffect:wf,useImperativeHandle:xm,useInsertionEffect:hm,useLayoutEffect:pm,useMemo:_m,useReducer:Af,useRef:cm,useState:function(){return Af(da)},useDebugValue:Df,useDeferredValue:function(t,n){var i=un();return Ye===null?Uf(i,t,n):vm(i,Ye.memoizedState,t,n)},useTransition:function(){var t=Af(da)[0],n=un().memoizedState;return[typeof t=="boolean"?t:Do(t),n]},useSyncExternalStore:j0,useId:Em,useHostTransitionStatus:Lf,useFormState:um,useActionState:um,useOptimistic:function(t,n){var i=un();return Ye!==null?tm(i,Ye,t,n):(i.baseState=t,[t,i.queue.dispatch])},useMemoCache:bf,useCacheRefresh:bm,useEffectEvent:dm};function Pf(t,n,i,r){n=t.memoizedState,i=i(r,n),i=i==null?n:I({},n,i),t.memoizedState=i,t.lanes===0&&(t.updateQueue.baseState=i)}var zf={enqueueSetState:function(t,n,i){t=t._reactInternals;var r=ai(),l=Fa(r);l.payload=n,i!=null&&(l.callback=i),n=Ha(t,l,r),n!==null&&(Zn(n,t,r),To(n,t,r))},enqueueReplaceState:function(t,n,i){t=t._reactInternals;var r=ai(),l=Fa(r);l.tag=1,l.payload=n,i!=null&&(l.callback=i),n=Ha(t,l,r),n!==null&&(Zn(n,t,r),To(n,t,r))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var i=ai(),r=Fa(i);r.tag=2,n!=null&&(r.callback=n),n=Ha(t,r,i),n!==null&&(Zn(n,t,i),To(n,t,i))}};function Dm(t,n,i,r,l,c,m){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,c,m):n.prototype&&n.prototype.isPureReactComponent?!go(i,r)||!go(l,c):!0}function Um(t,n,i,r){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(i,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(i,r),n.state!==t&&zf.enqueueReplaceState(n,n.state,null)}function Ur(t,n){var i=n;if("ref"in n){i={};for(var r in n)r!=="ref"&&(i[r]=n[r])}if(t=t.defaultProps){i===n&&(i=I({},i));for(var l in t)i[l]===void 0&&(i[l]=t[l])}return i}function Nm(t){Nl(t)}function Lm(t){console.error(t)}function Om(t){Nl(t)}function ru(t,n){try{var i=t.onUncaughtError;i(n.value,{componentStack:n.stack})}catch(r){setTimeout(function(){throw r})}}function Pm(t,n,i){try{var r=t.onCaughtError;r(i.value,{componentStack:i.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(l){setTimeout(function(){throw l})}}function If(t,n,i){return i=Fa(i),i.tag=3,i.payload={element:null},i.callback=function(){ru(t,n)},i}function zm(t){return t=Fa(t),t.tag=3,t}function Im(t,n,i,r){var l=i.type.getDerivedStateFromError;if(typeof l=="function"){var c=r.value;t.payload=function(){return l(c)},t.callback=function(){Pm(n,i,r)}}var m=i.stateNode;m!==null&&typeof m.componentDidCatch=="function"&&(t.callback=function(){Pm(n,i,r),typeof l!="function"&&(ja===null?ja=new Set([this]):ja.add(this));var b=r.stack;this.componentDidCatch(r.value,{componentStack:b!==null?b:""})})}function qS(t,n,i,r,l){if(i.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(n=i.alternate,n!==null&&Er(n,i,l,!0),i=Rn.current,i!==null){switch(i.tag){case 31:case 13:case 19:return On===null?Au():i.alternate===null&&rn===0&&(rn=3),i.flags&=-257,i.flags|=65536,i.lanes=l,r===ql?i.flags|=16384:(n=i.updateQueue,n===null?i.updateQueue=new Set([r]):n.add(r),yd(t,r,l)),!1;case 22:return i.flags|=65536,r===ql?i.flags|=16384:(n=i.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([r])},i.updateQueue=n):(i=n.retryQueue,i===null?n.retryQueue=new Set([r]):i.add(r)),yd(t,r,l)),!1}throw Error(s(435,i.tag))}return yd(t,r,l),Au(),!1}if(Me)return n=Rn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=l,r!==nf&&(t=Error(s(422),{cause:r}),So(pi(t,i)))):(r!==nf&&(n=Error(s(423),{cause:r}),So(pi(n,i))),t=t.current.alternate,t.flags|=65536,l&=-l,t.lanes|=l,r=pi(r,i),l=If(t.stateNode,r,l),hf(t,l),rn!==4&&(rn=2)),!1;var c=Error(s(520),{cause:r});if(c=pi(c,i),Fo===null?Fo=[c]:Fo.push(c),rn!==4&&(rn=2),n===null)return!0;r=pi(r,i),i=n;do{switch(i.tag){case 3:return i.flags|=65536,t=l&-l,i.lanes|=t,t=If(i.stateNode,r,t),hf(i,t),!1;case 1:if(n=i.type,c=i.stateNode,(i.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(ja===null||!ja.has(c))))return i.flags|=65536,l&=-l,i.lanes|=l,l=zm(l),Im(l,t,i,r),hf(i,l),!1;break;case 22:if(i.memoizedState!==null)return i.flags|=65536,!1}i=i.return}while(i!==null);return!1}var Bf=Error(s(461)),pn=!1;function gn(t,n,i,r){n.child=t===null?G0(n,null,i,r):wr(n,t.child,i,r)}function Bm(t,n,i,r,l){i=i.render;var c=n.ref;if("ref"in r){var m={};for(var b in r)b!=="ref"&&(m[b]=r[b])}else m=r;return br(n),r=Sf(t,n,i,m,c,l),b=yf(),t!==null&&!pn?(Mf(t,n,l),ha(t,n,l)):(Me&&b&&Bl(n),n.flags|=1,gn(t,n,r,l),n.child)}function Fm(t,n,i,r,l){if(t===null){var c=i.type;return typeof c=="function"&&!Jc(c)&&c.defaultProps===void 0&&i.compare===null?(n.tag=15,n.type=c,Hm(t,n,c,r,l)):(t=zl(i.type,null,r,n,n.mode,l),t.ref=n.ref,t.return=n,n.child=t)}if(c=t.child,!Yf(t,l)){var m=c.memoizedProps;if(i=i.compare,i=i!==null?i:go,i(m,r)&&t.ref===n.ref)return ha(t,n,l)}return n.flags|=1,t=oa(c,r),t.ref=n.ref,t.return=n,n.child=t}function Hm(t,n,i,r,l){if(t!==null){var c=t.memoizedProps;if(go(c,r)&&t.ref===n.ref)if(pn=!1,n.pendingProps=r=c,Yf(t,l))(t.flags&131072)!==0&&(pn=!0);else return n.lanes=t.lanes,ha(t,n,l)}return Ff(t,n,i,r,l)}function Gm(t,n,i,r){var l=r.children,c=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((n.flags&128)!==0){if(c=c!==null?c.baseLanes|i:i,t!==null){for(r=n.child=t.child,l=0;r!==null;)l=l|r.lanes|r.childLanes,r=r.sibling;r=l&~c}else r=0,n.child=null;return Vm(t,n,c,i,r)}if((i&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Xl(n,c!==null?c.cachePool:null),c!==null?k0(n,c):mf(),q0(n);else return r=n.lanes=536870912,Vm(t,n,c!==null?c.baseLanes|i:i,i,r)}else c!==null?(Xl(n,c.cachePool),k0(n,c),Xa(),n.memoizedState=null):(t!==null&&Xl(n,null),mf(),Xa());return gn(t,n,l,i),n.child}function No(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Vm(t,n,i,r,l){var c=uf();return c=c===null?null:{parent:dn._currentValue,pool:c},n.memoizedState={baseLanes:i,cachePool:c},t!==null&&Xl(n,null),mf(),q0(n),t!==null&&Er(t,n,r,!0),n.childLanes=l,null}function su(t,n){return n=ou({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function Xm(t,n,i){return wr(n,t.child,null,i),t=su(n,n.pendingProps),t.flags|=2,ti(n),n.memoizedState=null,t}function YS(t,n,i){var r=n.pendingProps,l=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(Me){if(r.mode==="hidden")return t=su(n,r),n.lanes=536870912,t.memoizedState={baseLanes:0,cachePool:null},No(null,t);if(gf(n),(t=Je)?(t=mg(t,gi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:La!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},i=A0(t),i.return=n,n.child=i,yn=n,Je=null)):t=null,t===null)throw Pa(n);return n.lanes=536870912,null}return su(n,r)}var c=t.memoizedState;if(c!==null){var m=c.dehydrated;if(gf(n),l)if(n.flags&256)n.flags&=-257,n=Xm(t,n,i);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(s(558));else if(pn||Er(t,n,i,!1),l=(i&t.childLanes)!==0,pn||l){if(Ga.current===null){if(r=Qe,r!==null&&(m=R(r,i),m!==0&&m!==c.retryLane))throw c.retryLane=m,vr(t,m),Zn(r,t,m),Bf;Au()}n=Xm(t,n,i)}else t=c.treeContext,Je=vi(m.nextSibling),yn=n,Me=!0,Oa=null,gi=!1,t!==null&&w0(n,t),n=su(n,r),n.flags|=134221824;return n}return t=oa(t.child,{mode:r.mode,children:r.children}),t.ref=n.ref,n.child=t,t.return=n,t}function ps(t,n){var i=n.ref;if(i===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof i!="function"&&typeof i!="object")throw Error(s(284));(t===null||t.ref!==i)&&(n.flags|=4194816)}}function Ff(t,n,i,r,l){return br(n),i=Sf(t,n,i,r,void 0,l),r=yf(),t!==null&&!pn?(Mf(t,n,l),ha(t,n,l)):(Me&&r&&Bl(n),n.flags|=1,gn(t,n,i,l),n.child)}function km(t,n,i,r,l,c){return br(n),n.updateQueue=null,i=W0(n,r,i,l),Y0(t),r=yf(),t!==null&&!pn?(Mf(t,n,c),ha(t,n,c)):(Me&&r&&Bl(n),n.flags|=1,gn(t,n,i,c),n.child)}function qm(t,n,i,r,l){if(br(n),n.stateNode===null){var c=as,m=i.contextType;typeof m=="object"&&m!==null&&(c=An(m)),c=new i(r,c),n.memoizedState=c.state!==null&&c.state!==void 0?c.state:null,c.updater=zf,n.stateNode=c,c._reactInternals=n,c=n.stateNode,c.props=r,c.state=n.memoizedState,c.refs={},ff(n),m=i.contextType,c.context=typeof m=="object"&&m!==null?An(m):as,c.state=n.memoizedState,m=i.getDerivedStateFromProps,typeof m=="function"&&(Pf(n,i,m,r),c.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof c.getSnapshotBeforeUpdate=="function"||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(m=c.state,typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount(),m!==c.state&&zf.enqueueReplaceState(c,c.state,null),Ro(n,r,c,l),Ao(),c.state=n.memoizedState),typeof c.componentDidMount=="function"&&(n.flags|=4194308),r=!0}else if(t===null){c=n.stateNode;var b=n.memoizedProps,P=Ur(i,b);c.props=P;var Z=c.context,it=i.contextType;m=as,typeof it=="object"&&it!==null&&(m=An(it));var mt=i.getDerivedStateFromProps;it=typeof mt=="function"||typeof c.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,it||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(b||Z!==m)&&Um(n,c,r,m),Ba=!1;var W=n.memoizedState;c.state=W,Ro(n,r,c,l),Ao(),Z=n.memoizedState,b||W!==Z||Ba?(typeof mt=="function"&&(Pf(n,i,mt,r),Z=n.memoizedState),(P=Ba||Dm(n,i,P,r,W,Z,m))?(it||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount()),typeof c.componentDidMount=="function"&&(n.flags|=4194308)):(typeof c.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=Z),c.props=r,c.state=Z,c.context=m,r=P):(typeof c.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{c=n.stateNode,df(t,n),m=n.memoizedProps,it=Ur(i,m),c.props=it,mt=n.pendingProps,W=c.context,Z=i.contextType,P=as,typeof Z=="object"&&Z!==null&&(P=An(Z)),b=i.getDerivedStateFromProps,(Z=typeof b=="function"||typeof c.getSnapshotBeforeUpdate=="function")||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(m!==mt||W!==P)&&Um(n,c,r,P),Ba=!1,W=n.memoizedState,c.state=W,Ro(n,r,c,l),Ao();var et=n.memoizedState;m!==mt||W!==et||Ba||t!==null&&t.dependencies!==null&&Gl(t.dependencies)?(typeof b=="function"&&(Pf(n,i,b,r),et=n.memoizedState),(it=Ba||Dm(n,i,it,r,W,et,P)||t!==null&&t.dependencies!==null&&Gl(t.dependencies))?(Z||typeof c.UNSAFE_componentWillUpdate!="function"&&typeof c.componentWillUpdate!="function"||(typeof c.componentWillUpdate=="function"&&c.componentWillUpdate(r,et,P),typeof c.UNSAFE_componentWillUpdate=="function"&&c.UNSAFE_componentWillUpdate(r,et,P)),typeof c.componentDidUpdate=="function"&&(n.flags|=4),typeof c.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof c.componentDidUpdate!="function"||m===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||m===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=et),c.props=r,c.state=et,c.context=P,r=it):(typeof c.componentDidUpdate!="function"||m===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||m===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),r=!1)}return c=r,ps(t,n),r=(n.flags&128)!==0,c||r?(c=n.stateNode,i=r&&typeof i.getDerivedStateFromError!="function"?null:c.render(),n.flags|=1,t!==null&&r?(n.child=wr(n,t.child,null,l),n.child=wr(n,null,i,l)):gn(t,n,i,l),n.memoizedState=c.state,t=n.child):t=ha(t,n,l),t}function Ym(t,n,i,r){return yr(),n.flags|=256,gn(t,n,i,r),n.child}var Hf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Gf(t){return{baseLanes:t,cachePool:P0()}}function Vf(t,n,i){return t=t!==null?t.childLanes&~i:0,n&&(t|=ii),t}function Wm(t,n,i){var r=n.pendingProps,l=!1,c=(n.flags&128)!==0,m;if((m=c)||(m=t!==null&&t.memoizedState===null?!1:(Cn.current&2)!==0),m&&(l=!0,n.flags&=-129),m=(n.flags&32)!==0,n.flags&=-33,t===null){if(Me){if(l?Va(n):Xa(),(t=Je)?(t=mg(t,gi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:La!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},i=A0(t),i.return=n,n.child=i,yn=n,Je=null)):t=null,t===null)throw Pa(n);return Gd(t)?n.lanes=32:n.lanes=536870912,null}return c=r.children,r=r.fallback,l?(Xa(),l=n.mode,c=ou({mode:"hidden",children:c},l),r=Sr(r,l,i,null),c.return=n,r.return=n,c.sibling=r,n.child=c,r=n.child,r.memoizedState=Gf(i),r.childLanes=Vf(t,m,i),n.memoizedState=Hf,No(null,r)):(Va(n),Xf(n,c))}var b=t.memoizedState;if(b!==null){var P=b.dehydrated;if(P!==null)return WS(t,n,c,m,r,P,b,i)}return l?(Xa(),l=r.fallback,c=n.mode,b=t.child,P=b.sibling,r=oa(b,{mode:"hidden",children:r.children}),r.subtreeFlags=b.subtreeFlags&1206910976,P!==null?l=oa(P,l):(l=Sr(l,c,i,null),l.flags|=2),l.return=n,r.return=n,r.sibling=l,n.child=r,No(null,r),r=n.child,l=t.child.memoizedState,l===null?l=Gf(i):(c=l.cachePool,c!==null?(b=dn._currentValue,c=c.parent!==b?{parent:b,pool:b}:c):c=P0(),l={baseLanes:l.baseLanes|i,cachePool:c}),r.memoizedState=l,r.childLanes=Vf(t,m,i),n.memoizedState=Hf,No(t.child,r)):(Va(n),i=t.child,t=i.sibling,i=oa(i,{mode:"visible",children:r.children}),i.return=n,i.sibling=null,t!==null&&(m=n.deletions,m===null?(n.deletions=[t],n.flags|=16):m.push(t)),n.child=i,n.memoizedState=null,i)}function Xf(t,n){return n=ou({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function ou(t,n){return t=qn(22,t,null,n),t.lanes=0,t}function lu(t,n,i){return wr(n,t.child,null,i),t=Xf(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function WS(t,n,i,r,l,c,m,b){if(i)return n.flags&256?(Va(n),n.flags&=-257,lu(t,n,b)):n.memoizedState!==null?(Xa(),n.child=t.child,n.flags|=128,null):(Xa(),c=l.fallback,m=n.mode,l=ou({mode:"visible",children:l.children},m),c=Sr(c,m,b,null),c.flags|=2,l.return=n,c.return=n,l.sibling=c,n.child=l,wr(n,t.child,null,b),l=n.child,l.memoizedState=Gf(b),l.childLanes=Vf(t,r,b),n.memoizedState=Hf,No(null,l));if(Va(n),Gd(c)){if(r=c.nextSibling&&c.nextSibling.dataset,r)var P=r.dgst;return r=P,r!==""&&(l=Error(s(419)),l.stack="",l.digest=r,So({value:l,source:null,stack:null})),lu(t,n,b)}if(pn||Er(t,n,b,!1),r=(b&t.childLanes)!==0,pn||r){if(Ga.current!==null)return lu(t,n,b);if(r=Qe,r!==null&&(l=R(r,b),l!==0&&l!==m.retryLane))throw m.retryLane=l,vr(t,l),Zn(r,t,l),Bf;return Hd(c)||Au(),lu(t,n,b)}return Hd(c)?(n.flags|=192,n.child=t.child,null):(t=m.treeContext,Je=vi(c.nextSibling),yn=n,Me=!0,Oa=null,gi=!1,t!==null&&w0(n,t),n=Xf(n,l.children),n.flags|=134221824,n)}function jm(t,n,i){t.lanes|=n;var r=t.alternate;r!==null&&(r.lanes|=n),Hl(t.return,n,i)}function Zm(t){for(var n=null;t!==null;){var i=t.alternate;i!==null&&Zl(i)===null&&(n=t),t=t.sibling}return n}function uu(t,n,i,r,l,c){var m=t.memoizedState;m===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:i,tailMode:l,treeForkCount:c}:(m.isBackwards=n,m.rendering=null,m.renderingStartTime=0,m.last=r,m.tail=i,m.tailMode=l,m.treeForkCount=c)}function kf(t){var n=t.child;for(t.child=null;n!==null;){var i=n.sibling;n.sibling=t.child,t.child=n,n=i}}function qf(t,n,i){var r=n.pendingProps,l=r.revealOrder,c=r.tail;r=r.children;var m=Cn.current;if(n.flags&128)return Co(n,m),null;var b=(m&2)!==0;if(b?(m=m&1|2,n.flags|=128):m&=1,Co(n,m),l==="backwards"&&t!==null?(kf(t),gn(t,n,r,i),kf(t)):gn(t,n,r,i),r=Me?vo:0,!b&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&jm(t,i,n);else if(t.tag===19)jm(t,i,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(l){case"backwards":i=Zm(n.child),i===null?(l=n.child,n.child=null):(l=i.sibling,i.sibling=null,kf(n)),uu(n,!0,l,null,c,r);break;case"unstable_legacy-backwards":for(i=null,l=n.child,n.child=null;l!==null;){if(t=l.alternate,t!==null&&Zl(t)===null){n.child=l;break}t=l.sibling,l.sibling=i,i=l,l=t}uu(n,!0,i,null,c,r);break;case"together":uu(n,!1,null,null,void 0,r);break;case"independent":n.memoizedState=null;break;default:i=Zm(n.child),i===null?(l=n.child,n.child=null):(l=i.sibling,i.sibling=null),uu(n,!1,l,i,c,r)}return n.child}function Km(t,n,i){var r=n.pendingProps;return za(n,n.type,r.value),gn(t,n,r.children,i),n.child}function ha(t,n,i){if(t!==null&&(n.dependencies=t.dependencies),Wa|=n.lanes,(i&n.childLanes)===0)if(t!==null){if(Er(t,n,i,!1),(i&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(s(153));if(n.child!==null){for(t=n.child,i=oa(t,t.pendingProps),n.child=i,i.return=n;t.sibling!==null;)t=t.sibling,i=i.sibling=oa(t,t.pendingProps),i.return=n;i.sibling=null}return n.child}function Yf(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Gl(t)))}function jS(t,n,i){switch(n.tag){case 3:U(n,n.stateNode.containerInfo),za(n,dn,t.memoizedState.cache),yr();break;case 27:case 5:nt(n);break;case 4:U(n,n.stateNode.containerInfo);break;case 10:za(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,gf(n),null;break;case 13:var r=n.memoizedState;if(r!==null){if(r.dehydrated!==null)return Va(n),n.flags|=128,null;r=Er(t,n,i,!1);var l=n.child.childLanes;return r||(i&l)!==0?Wm(t,n,i):(Va(n),t=ha(t,n,i),t!==null?t.sibling:null)}Va(n);break;case 19:if(n.flags&128)return qf(t,n,i);if(l=(t.flags&128)!==0,r=(i&n.childLanes)!==0,r||(Er(t,n,i,!1),r=(i&n.childLanes)!==0),l){if(r)return qf(t,n,i);n.flags|=128}if(l=n.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),Co(n,Cn.current),r)break;return null;case 22:return n.lanes=0,Gm(t,n,i,n.pendingProps);case 24:za(n,dn,t.memoizedState.cache)}return ha(t,n,i)}function Qm(t,n,i){if(t!==null)if(t.memoizedProps!==n.pendingProps)pn=!0;else{if(!Yf(t,i)&&(n.flags&128)===0)return pn=!1,jS(t,n,i);pn=(t.flags&131072)!==0}else pn=!1,Me&&(n.flags&1048576)!==0&&C0(n,vo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var r=n.pendingProps;if(t=Rr(n.elementType),n.type=t,typeof t=="function")Jc(t)?(r=Ur(t,r),n.tag=1,n=qm(null,n,t,r,i)):(n.tag=0,n=Ff(null,n,t,r,i));else{if(t!=null){var l=t.$$typeof;if(l===K){n.tag=11,n=Bm(null,n,t,r,i);break t}else if(l===St){n.tag=14,n=Fm(null,n,t,r,i);break t}else if(l===ct){n.tag=10,n.type=t,n=Km(null,n,i);break t}}throw n=bt(t)||t,Error(s(306,n,""))}}return n;case 0:return Ff(t,n,n.type,n.pendingProps,i);case 1:return r=n.type,l=Ur(r,n.pendingProps),qm(t,n,r,l,i);case 3:t:{if(U(n,n.stateNode.containerInfo),t===null)throw Error(s(387));r=n.pendingProps;var c=n.memoizedState;l=c.element,df(t,n),Ro(n,r,null,i);var m=n.memoizedState;if(r=m.cache,za(n,dn,r),r!==c.cache&&sf(n,[dn],i,!0),Ao(),r=m.element,c.isDehydrated)if(c={element:r,isDehydrated:!1,cache:m.cache},n.updateQueue.baseState=c,n.memoizedState=c,n.flags&256){n=Ym(t,n,r,i);break t}else if(r!==l){l=pi(Error(s(424)),n),So(l),n=Ym(t,n,r,i);break t}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,Je=vi(t.firstChild),yn=n,Me=!0,Oa=null,gi=!0,i=G0(n,null,r,i),n.child=i;i;)i.flags=i.flags&-3|134221824,i=i.sibling;else{if(yr(),r===l){n=ha(t,n,i);break t}gn(t,n,r,i)}n=n.child}return n;case 26:return ps(t,n),t===null?(i=Mg(n.type,null,n.pendingProps,null))?n.memoizedState=i:Me||(n.stateNode=eg(n.type,n.pendingProps,Yt.current,n)):n.memoizedState=Mg(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return nt(n),t===null&&Me&&(r=n.stateNode=_g(n.type,n.pendingProps,Yt.current),yn=n,gi=!0,l=Je,Qa(n.type)?(Vd=l,Je=vi(r.firstChild)):Je=l),gn(t,n,n.pendingProps.children,i),ps(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Me&&((l=r=Je)&&(r=Vy(r,n.type,n.pendingProps,gi),r!==null?(n.stateNode=r,yn=n,Je=vi(r.firstChild),gi=!1,l=!0):l=!1),l||Pa(n)),nt(n),l=n.type,c=n.pendingProps,m=t!==null?t.memoizedProps:null,r=c.children,Ld(l,c)?r=null:m!==null&&Ld(l,m)&&(n.flags|=32),n.memoizedState!==null&&(l=Sf(t,n,IS,null,null,i),Ns._currentValue=l),ps(t,n),gn(t,n,r,i),n.child;case 6:return t===null&&Me&&((t=i=Je)&&(i=Xy(i,n.pendingProps,gi),i!==null?(n.stateNode=i,yn=n,Je=null,t=!0):t=!1),t||Pa(n)),null;case 13:return Wm(t,n,i);case 4:return U(n,n.stateNode.containerInfo),r=n.pendingProps,t===null?n.child=wr(n,null,r,i):gn(t,n,r,i),n.child;case 11:return Bm(t,n,n.type,n.pendingProps,i);case 7:return r=n.pendingProps,ps(t,n),gn(t,n,r,i),n.child;case 8:return gn(t,n,n.pendingProps.children,i),n.child;case 12:return gn(t,n,n.pendingProps.children,i),n.child;case 10:return Km(t,n,i);case 9:return l=n.type._context,r=n.pendingProps.children,br(n),l=An(l),r=r(l),n.flags|=1,gn(t,n,r,i),n.child;case 14:return Fm(t,n,n.type,n.pendingProps,i);case 15:return Hm(t,n,n.type,n.pendingProps,i);case 19:return qf(t,n,i);case 31:return YS(t,n,i);case 22:return Gm(t,n,i,n.pendingProps);case 24:return br(n),r=An(dn),t===null?(l=uf(),l===null&&(l=Qe,c=of(),l.pooledCache=c,c.refCount++,c!==null&&(l.pooledCacheLanes|=i),l=c),n.memoizedState={parent:r,cache:l},ff(n),za(n,dn,l)):((t.lanes&i)!==0&&(df(t,n),Ro(n,null,null,i),Ao()),l=t.memoizedState,c=n.memoizedState,l.parent!==r?(l={parent:r,cache:r},n.memoizedState=l,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=l),za(n,dn,r)):(r=c.cache,za(n,dn,r),r!==l.cache&&sf(n,[dn],i,!0))),gn(t,n,n.pendingProps.children,i),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=n.pendingProps,r.name!=null&&r.name!=="auto"?n.flags|=t===null?18882560:18874368:Me&&Bl(n),t!==null&&t.memoizedProps.name!==r.name?n.flags|=4194816:ps(t,n),gn(t,n,r.children,i),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function pa(t){t.flags|=4}function Wf(t,n,i,r,l){var c;if((c=(t.mode&32)!==0)&&(c=i===null?Ag(n,r):Ag(n,r)&&(r.src!==i.src||r.srcSet!==i.srcSet)),c){if(t.flags|=16777216,(l&335544128)===l)if(t.stateNode.complete)t.flags|=8192;else if(Nx())t.flags|=8192;else throw Cr=ql,cf}else t.flags&=-16777217}function Jm(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Rg(n))if(Nx())t.flags|=8192;else throw Cr=ql,cf}function cu(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?Sl():536870912,t.lanes|=n,vs|=n)}function Lo(t,n){if(!Me)switch(t.tailMode){case"visible":break;case"collapsed":for(var i=t.tail,r=null;i!==null;)i.alternate!==null&&(r=i),i=i.sibling;r===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null;break;default:for(n=t.tail,i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t.tail=null:i.sibling=null}}function $e(t){var n=t.alternate!==null&&t.alternate.child===t.child,i=0,r=0;if(n)for(var l=t.child;l!==null;)i|=l.lanes|l.childLanes,r|=l.subtreeFlags&1206910976,r|=l.flags&1206910976,l.return=t,l=l.sibling;else for(l=t.child;l!==null;)i|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=t,l=l.sibling;return t.subtreeFlags|=r,t.childLanes=i,n}function ZS(t,n,i){var r=n.pendingProps;switch(ef(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $e(n),null;case 1:return $e(n),null;case 3:return i=n.stateNode,r=null,t!==null&&(r=t.memoizedState.cache),n.memoizedState.cache!==r&&(n.flags|=2048),ca(dn),T(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(os(n)?pa(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,af())),$e(n),null;case 26:var l=n.type,c=n.memoizedState;return t===null?(pa(n),c!==null?($e(n),Jm(n,c)):($e(n),Wf(n,l,null,r,i))):c?c!==t.memoizedState?(pa(n),$e(n),Jm(n,c)):($e(n),n.flags&=-16777217):(t=t.memoizedProps,t!==r&&pa(n),$e(n),Wf(n,l,t,r,i)),null;case 27:if(xt(n),i=Yt.current,l=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==r&&pa(n);else{if(!r){if(n.stateNode===null)throw Error(s(166));return $e(n),n.subtreeFlags&=-33554433,null}t=Ft.current,os(n)?D0(n):(t=_g(l,r,i),n.stateNode=t,pa(n))}return $e(n),n.subtreeFlags&=-33554433,null;case 5:if(xt(n),l=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==r&&pa(n);else{if(!r){if(n.stateNode===null)throw Error(s(166));return $e(n),n.subtreeFlags&=-33554433,null}if(c=Ft.current,os(n))D0(n);else{var m=ko(Yt.current);switch(c){case 1:c=m.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:c=m.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":c=m.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":c=m.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":c=m.createElement("div"),c.innerHTML="<script><\/script>",c=c.removeChild(c.firstChild);break;case"select":c=typeof r.is=="string"?m.createElement("select",{is:r.is}):m.createElement("select"),r.multiple?c.multiple=!0:r.size&&(c.size=r.size);break;default:c=typeof r.is=="string"?m.createElement(l,{is:r.is}):m.createElement(l)}}c[Ct]=n,c[zt]=r;t:for(m=n.child;m!==null;){if(m.tag===5||m.tag===6)c.appendChild(m.stateNode);else if(m.tag!==4&&m.tag!==27&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===n)break t;for(;m.sibling===null;){if(m.return===null||m.return===n)break t;m=m.return}m.sibling.return=m.return,m=m.sibling}n.stateNode=c;t:switch(Dn(c,l,r),l){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break t;case"img":r=!0;break t;default:r=!1}r&&pa(n)}}return $e(n),n.subtreeFlags&=-33554433,Wf(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,i),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==r&&pa(n);else{if(typeof r!="string"&&n.stateNode===null)throw Error(s(166));if(t=Yt.current,os(n)){if(t=n.stateNode,i=n.memoizedProps,r=null,l=yn,l!==null)switch(l.tag){case 27:case 5:r=l.memoizedProps}t[Ct]=n,t=!!(t.nodeValue===i||r!==null&&r.suppressHydrationWarning===!0||Qx(t.nodeValue,i)),t||Pa(n,!0)}else t=ko(t).createTextNode(r),t[Ct]=n,n.stateNode=t}return $e(n),null;case 31:if(i=n.memoizedState,t===null||t.memoizedState!==null){if(r=os(n),i!==null){if(t===null){if(!r)throw Error(s(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(557));t[Ct]=n}else yr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;$e(n),t=!1}else i=af(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=i),t=!0;if(!t)return n.flags&256?(ti(n),n):(ti(n),null);if((n.flags&128)!==0)throw Error(s(558))}return $e(n),null;case 13:if(r=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(l=os(n),r!==null&&r.dehydrated!==null){if(t===null){if(!l)throw Error(s(318));if(l=n.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(s(317));l[Ct]=n}else yr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;$e(n),l=!1}else l=af(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=l),l=!0;if(!l)return n.flags&256?(ti(n),n):(ti(n),null)}return ti(n),(n.flags&128)!==0?(n.lanes=i,n):(i=r!==null,t=t!==null&&t.memoizedState!==null,i&&(r=n.child,l=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(l=r.alternate.memoizedState.cachePool.pool),c=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(c=r.memoizedState.cachePool.pool),c!==l&&(r.flags|=2048)),i!==t&&i&&(n.child.flags|=8192),cu(n,n.updateQueue),$e(n),null);case 4:return T(),t===null&&Cd(n.stateNode.containerInfo),n.flags|=67108864,$e(n),null;case 10:return ca(n.type),$e(n),null;case 19:if(_f(n),r=n.memoizedState,r===null)return $e(n),null;if(l=(n.flags&128)!==0,c=r.rendering,c===null)if(l)Lo(r,!1);else{if(rn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(c=Zl(t),c!==null){for(n.flags|=128,Lo(r,!1),t=c.updateQueue,n.updateQueue=t,cu(n,t),n.subtreeFlags=0,t=i,i=n.child;i!==null;)T0(i,t),i=i.sibling;return Co(n,Cn.current&1|2),Me&&la(n,r.treeForkCount),n.child}t=t.sibling}r.tail!==null&&F()>Mu&&(n.flags|=128,l=!0,Lo(r,!1),n.lanes=4194304)}else{if(!l)if(t=Zl(c),t!==null){if(n.flags|=128,l=!0,t=t.updateQueue,n.updateQueue=t,cu(n,t),Lo(r,!0),r.tail===null&&r.tailMode!=="collapsed"&&r.tailMode!=="visible"&&!c.alternate&&!Me)return $e(n),null}else 2*F()-r.renderingStartTime>Mu&&i!==536870912&&(n.flags|=128,l=!0,Lo(r,!1),n.lanes=4194304);r.isBackwards?(c.sibling=n.child,n.child=c):(t=r.last,t!==null?t.sibling=c:n.child=c,r.last=c)}if(r.tail!==null){t=r.tail;t:{for(i=t;i!==null;){if(i.alternate!==null){i=!1;break t}i=i.sibling}i=!0}return r.rendering=t,r.tail=t.sibling,r.renderingStartTime=F(),t.sibling=null,c=Cn.current,c=l?c&1|2:c&1,r.tailMode==="visible"||r.tailMode==="collapsed"||!i||Me?Co(n,c):(i=c,te(Rn,n),te(Cn,i),On===null&&(On=n)),Me&&la(n,r.treeForkCount),t}return $e(n),null;case 22:case 23:return ti(n),xf(),r=n.memoizedState!==null,t!==null?t.memoizedState!==null!==r&&(n.flags|=8192):r&&(n.flags|=8192),r?(i&536870912)!==0&&(n.flags&128)===0&&($e(n),n.subtreeFlags&6&&(n.flags|=8192)):$e(n),i=n.updateQueue,i!==null&&cu(n,i.retryQueue),i=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),r=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(r=n.memoizedState.cachePool.pool),r!==i&&(n.flags|=2048),t!==null&&Jt(Ar),null;case 24:return i=null,t!==null&&(i=t.memoizedState.cache),n.memoizedState.cache!==i&&(n.flags|=2048),ca(dn),$e(n),null;case 25:return null;case 30:return n.flags|=33554432,$e(n),null}throw Error(s(156,n.tag))}function KS(t,n){switch(ef(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return ca(dn),T(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return xt(n),null;case 31:if(n.memoizedState!==null){if(ti(n),n.alternate===null)throw Error(s(340));yr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(ti(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(s(340));yr()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return _f(n),t=n.flags,t&65536?(n.flags=t&-65537|128,t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null),n.flags|=4,n):null;case 4:return T(),null;case 10:return ca(n.type),null;case 22:case 23:return ti(n),xf(),t!==null&&Jt(Ar),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return ca(dn),null;case 25:return null;default:return null}}function $m(t,n){switch(ef(n),n.tag){case 3:ca(dn),T();break;case 26:case 27:case 5:xt(n);break;case 4:T();break;case 31:n.memoizedState!==null&&ti(n);break;case 13:ti(n);break;case 19:_f(n);break;case 10:ca(n.type);break;case 22:case 23:ti(n),xf(),t!==null&&Jt(Ar);break;case 24:ca(dn)}}function Oo(t,n){try{var i=n.updateQueue,r=i!==null?i.lastEffect:null;if(r!==null){var l=r.next;i=l;do{if((i.tag&t)===t){r=void 0;var c=i.create,m=i.inst;r=c(),m.destroy=r}i=i.next}while(i!==l)}}catch(b){Xe(n,n.return,b)}}function ka(t,n,i){try{var r=n.updateQueue,l=r!==null?r.lastEffect:null;if(l!==null){var c=l.next;r=c;do{if((r.tag&t)===t){var m=r.inst,b=m.destroy;if(b!==void 0){m.destroy=void 0,l=n;var P=i,Z=b;try{Z()}catch(it){Xe(l,P,it)}}}r=r.next}while(r!==c)}}catch(it){Xe(n,n.return,it)}}function tx(t){var n=t.updateQueue;if(n!==null){var i=t.stateNode;try{X0(n,i)}catch(r){Xe(t,t.return,r)}}}function ex(t,n,i){i.props=Ur(t.type,t.memoizedProps),i.state=t.memoizedState;try{i.componentWillUnmount()}catch(r){Xe(t,n,r)}}function Vi(t,n){try{var i=t.ref;if(i!==null){switch(t.tag){case 26:case 27:case 5:var r=t.stateNode;break;case 30:var l=t.stateNode,c=ra(t.memoizedProps,l);(l.ref===null||l.ref.name!==c)&&(l.ref=lg(c)),r=l.ref;break;case 7:if(t.stateNode===null){var m=new ri(t);p(t.child,!1,Hy,m,void 0,void 0),t.stateNode=m}r=t.stateNode;break;default:r=t.stateNode}typeof i=="function"?t.refCleanup=i(r):i.current=r}}catch(b){Xe(t,n,b)}}function wn(t,n){var i=t.ref,r=t.refCleanup;if(i!==null)if(typeof r=="function")try{r()}catch(l){Xe(t,n,l)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof i=="function")try{i(null)}catch(l){Xe(t,n,l)}else i.current=null}function fu(t,n){if((t.tag===5||t.tag===27||t.tag===6)&&t.alternate===null&&n!==null)for(var i=0;i<n.length;i++)pg(t.stateNode,n[i])}function nx(t){for(var n=t.return;n!==null&&(Zf(n)&&pg(t.stateNode,n.stateNode),!jf(n));)n=n.return}function Po(t){for(var n=t.return;n!==null&&(Zf(n)&&Gy(t.stateNode,n.stateNode),!jf(n));)n=n.return}function jf(t){return t.tag===5||t.tag===3||t.tag===27}function Zf(t){return t&&t.tag===7&&t.stateNode!==null}function Kf(t){var n=t.type,i=t.memoizedProps,r=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":i.autoFocus&&r.focus();break t;case"img":i.src?r.src=i.src:i.srcSet&&(r.srcset=i.srcSet)}}catch(l){Xe(t,t.return,l)}}function Qf(t,n,i){try{var r=t.stateNode;My(r,t.type,i,n),r[zt]=n}catch(l){Xe(t,t.return,l)}}function ix(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Qa(t.type)||t.tag===4}function Jf(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||ix(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Qa(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function $f(t,n,i,r){var l=t.tag;if(l===5||l===6)l=t.stateNode,n?(i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i).insertBefore(l,n):(n=i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i,n.appendChild(l),i=i._reactRootContainer,i!=null||n.onclick!==null||(n.onclick=Fi)),fu(t,r),ge=!0;else if(l!==4&&(l===27&&(fu(t,r),r=null,Qa(t.type)&&(i=t.stateNode,n=null)),t=t.child,t!==null))for($f(t,n,i,r),t=t.sibling;t!==null;)$f(t,n,i,r),t=t.sibling}function du(t,n,i,r){var l=t.tag;if(l===5||l===6)l=t.stateNode,n?i.insertBefore(l,n):i.appendChild(l),fu(t,r),ge=!0;else if(l!==4&&(l===27&&(fu(t,r),r=null,Qa(t.type)&&(i=t.stateNode)),t=t.child,t!==null))for(du(t,n,i,r),t=t.sibling;t!==null;)du(t,n,i,r),t=t.sibling}function ax(t){var n=t.stateNode,i=t.memoizedProps;try{for(var r=t.type,l=n.attributes;l.length;)n.removeAttributeNode(l[0]);Dn(n,r,i),n[Ct]=t,n[zt]=i}catch(c){Xe(t,t.return,c)}}var hu=!1,ei=null;function rx(t){(t.tag===30||(t.subtreeFlags&33554432)!==0)&&(hu=!0)}var Xi=null;function sx(){var t=Xi;return Xi=null,t}var Yn=0;function ms(t,n,i,r,l){return Yn=0,ox(t.child,n,i,r,l)}function ox(t,n,i,r,l){for(var c=!1;t!==null;){if(t.tag===5){var m=t.stateNode;if(r!==null){var b=zd(m);r.push(b),b.view&&(c=!0)}else c||zd(m).view&&(c=!0);hu=!0,sg(m,Yn===0?n:n+"_"+Yn,i),Yn++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&l||ox(t.child,n,i,r,l)&&(c=!0));t=t.sibling}return c}function ki(t,n){for(;t!==null;)t.tag===5?og(t.stateNode,t.memoizedProps):(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&n||ki(t.child,n)),t=t.sibling}function pu(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if((t.tag!==22||t.memoizedState===null)&&(pu(t),t.tag===30&&(t.flags&18874368)!==0&&t.stateNode.paired)){var n=t.memoizedProps;if(n.name==null||n.name==="auto")throw Error(s(544));var i=n.name;n=sa(n.default,n.share),n!=="none"&&(ms(t,i,n,null,!1)||ki(t.child,!1))}t=t.sibling}}function td(t,n){if(t.tag===30){var i=t.stateNode,r=t.memoizedProps,l=ra(r,i),c=sa(r.default,i.paired?r.share:r.enter);c!=="none"?ms(t,l,c,null,!1)?(pu(t),i.paired||n||Es(t,r.onEnter)):ki(t.child,!1):pu(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)td(t,n),t=t.sibling;else pu(t)}function ed(t){if(ei!==null&&ei.size!==0){var n=ei;if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var i=t.memoizedProps,r=i.name;if(r!=null&&r!=="auto"){var l=n.get(r);if(l!==void 0){var c=sa(i.default,i.share);if(c!=="none"&&(ms(t,r,c,null,!1)?(c=t.stateNode,l.paired=c,c.paired=l,Es(t,i.onShare)):ki(t.child,!1)),n.delete(r),n.size===0)break}}}ed(t)}t=t.sibling}}}function nd(t){if(t.tag===30){var n=t.memoizedProps,i=ra(n,t.stateNode),r=ei!==null?ei.get(i):void 0,l=sa(n.default,r!==void 0?n.share:n.exit);l!=="none"&&(ms(t,i,l,null,!1)?r!==void 0?(l=t.stateNode,r.paired=l,l.paired=r,ei.delete(i),Es(t,n.onShare)):Es(t,n.onExit):ki(t.child,!1)),ei!==null&&ed(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)nd(t),t=t.sibling;else ei!==null&&ed(t)}function lx(t){for(t=t.child;t!==null;){if(t.tag===30){var n=t.memoizedProps,i=ra(n,t.stateNode);n=sa(n.default,n.update),t.flags&=-5,n!=="none"&&ms(t,i,n,t.memoizedState=[],!1)}else(t.subtreeFlags&33554432)!==0&&lx(t);t=t.sibling}}function id(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var n=t.stateNode;n.paired!==null&&(n.paired=null,ki(t.child,!1))}id(t)}t=t.sibling}}function mu(t){if(t.tag===30)t.stateNode.paired=null,ki(t.child,!1),id(t);else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)mu(t),t=t.sibling;else id(t)}function ux(t){for(t=t.child;t!==null;)t.tag===30?ki(t.child,!1):(t.subtreeFlags&33554432)!==0&&ux(t),t=t.sibling}function ad(t,n,i,r,l,c,m){for(var b=!1;n!==null;){if(n.tag===5){var P=n.stateNode;if(c!==null&&Yn<c.length){var Z=c[Yn],it=zd(P);(Z.view||it.view)&&(b=!0);var mt;if(mt=(t.flags&4)===0)if(it.clip)mt=!0;else{mt=Z.rect;var W=it.rect;mt=mt.y!==W.y||mt.x!==W.x||mt.height!==W.height||mt.width!==W.width}mt&&(t.flags|=4),it.abs?it=!Z.abs:(Z=Z.rect,it=it.rect,it=Z.height!==it.height||Z.width!==it.width),it&&(t.flags|=32)}else t.flags|=32;(t.flags&4)!==0&&sg(P,Yn===0?i:i+"_"+Yn,l),b&&(t.flags&4)!==0||(Xi===null&&(Xi=[]),Xi.push(P,Yn===0?r:r+"_"+Yn,n.memoizedProps)),Yn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&m?t.flags|=n.flags&32:ad(t,n.child,i,r,l,c,m)&&(b=!0));n=n.sibling}return b}function cx(t,n){for(t=t.child;t!==null;){if(t.tag===30){var i=t.memoizedProps,r=t.stateNode,l=ra(i,r),c=sa(i.default,i.update),m;m=t.memoizedState,t.memoizedState=null,r=t;var b=t.child;Yn=0,l=ad(r,b,l,l,c,m,!1),(t.flags&4)!==0&&l&&Es(t,i.onUpdate)}else(t.subtreeFlags&33554432)!==0&&cx(t);t=t.sibling}}var Mn=!1,Fe=!1,qi=!1,rd=!1,fx=typeof WeakSet=="function"?WeakSet:Set,En=null,Yi=!1,zo=!1,xu=!1,sd=!1;function QS(t,n,i){if(t=t.containerInfo,Ud=Ls,t=m0(t),qc(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else t:{r=(r=t.ownerDocument)&&r.defaultView||window;var l=r.getSelection&&r.getSelection();if(l&&l.rangeCount!==0){r=l.anchorNode;var c=l.anchorOffset,m=l.focusNode;l=l.focusOffset;try{r.nodeType,m.nodeType}catch{r=null;break t}var b=0,P=-1,Z=-1,it=0,mt=0,W=t,et=null;e:for(;;){for(var Nt;W!==r||c!==0&&W.nodeType!==3||(P=b+c),W!==m||l!==0&&W.nodeType!==3||(Z=b+l),W.nodeType===3&&(b+=W.nodeValue.length),(Nt=W.firstChild)!==null;)et=W,W=Nt;for(;;){if(W===t)break e;if(et===r&&++it===c&&(P=b),et===m&&++mt===l&&(Z=b),(Nt=W.nextSibling)!==null)break;W=et,et=W.parentNode}W=Nt}r=P===-1||Z===-1?null:{start:P,end:Z}}else r=null}r=r||{start:0,end:0}}else r=null;for(Nd={focusedElem:t,selectionRange:r},Ls=!1,i=(i&335544064)===i,En=n,n=i?9270:1024;En!==null;){if(t=En,i&&(r=t.deletions,r!==null))for(c=0;c<r.length;c++)i&&nd(r[c]);if(t.alternate===null&&(t.flags&2)!==0)i&&rx(t),gu(i);else{if(t.tag===22){if(r=t.alternate,t.memoizedState!==null){r!==null&&r.memoizedState===null&&i&&nd(r),gu(i);continue}else if(r!==null&&r.memoizedState!==null){i&&rx(t),gu(i);continue}}r=t.child,(t.subtreeFlags&n)!==0&&r!==null?(r.return=t,En=r):(i&&lx(t),gu(i))}}ei=null}function gu(t){for(;En!==null;){var n=En,i=t,r=n.alternate,l=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((l&1024)!==0&&r!==null){i=void 0,l=r.memoizedProps,r=r.memoizedState;var c=n.stateNode;try{var m=Ur(n.type,l);i=c.getSnapshotBeforeUpdate(m,r),c.__reactInternalSnapshotBeforeUpdate=i}catch(b){Xe(n,n.return,b)}}break;case 3:if((l&1024)!==0){if(r=n.stateNode.containerInfo,i=r.nodeType,i===9)Fd(r);else if(i===1)switch(r.nodeName){case"HEAD":case"HTML":case"BODY":Fd(r);break;default:r.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:i&&r!==null&&(i=ra(r.memoizedProps,r.stateNode),l=n.memoizedProps,l=sa(l.default,l.update),l!=="none"&&ms(r,i,l,r.memoizedState=[],!0));break;default:if((l&1024)!==0)throw Error(s(163))}if(r=n.sibling,r!==null){r.return=n.return,En=r;break}En=n.return}}function dx(t,n,i){var r=i.flags;switch(i.tag){case 0:case 11:case 15:Wi(t,i),r&4&&Oo(5,i);break;case 1:if(Wi(t,i),r&4)if(t=i.stateNode,n===null)try{t.componentDidMount()}catch(m){Xe(i,i.return,m)}else{var l=Ur(i.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(l,n,t.__reactInternalSnapshotBeforeUpdate)}catch(m){Xe(i,i.return,m)}}r&64&&tx(i),r&512&&Vi(i,i.return);break;case 3:if(Wi(t,i),r&64&&(t=i.updateQueue,t!==null)){if(n=null,i.child!==null)switch(i.child.tag){case 27:case 5:n=i.child.stateNode;break;case 1:n=i.child.stateNode}try{X0(t,n)}catch(m){Xe(i,i.return,m)}}break;case 27:n===null&&r&4&&ax(i);case 26:case 5:Wi(t,i),n===null&&r&4&&Kf(i),r&512&&Vi(i,i.return);break;case 12:Wi(t,i);break;case 31:Wi(t,i),r&4&&xx(t,i);break;case 13:Wi(t,i),r&4&&gx(t,i),r&64&&(t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(i=uy.bind(null,i),ky(t,i))));break;case 22:if(r=i.memoizedState!==null||Mn,!r){var c=n!==null&&n.memoizedState!==null||Fe;n=Mn,l=Fe,Mn=r,(Fe=c)&&!l?(r=2,(i.subtreeFlags&8772)!==0&&(r|=1),Ci(t,i,r)):Wi(t,i),Mn=n,Fe=l}break;case 30:Wi(t,i),r&512&&Vi(i,i.return);break;case 7:r&512&&Vi(i,i.return);default:Wi(t,i)}}function od(t,n){for(t=t.child;t!==null;)hx(t,n),t=t.sibling}function hx(t,n){switch(t.tag){case 5:case 26:try{var i=t.stateNode;if(n){var r=i.style;typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none"}else{var l=t.stateNode,c=t.memoizedProps.style,m=c!=null&&c.hasOwnProperty("display")?c.display:null;l.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(P){Xe(t,t.return,P)}ld(t,n);break;case 6:try{t.stateNode.nodeValue=n?"":t.memoizedProps,ge=!0}catch(P){Xe(t,t.return,P)}break;case 18:try{var b=t.stateNode;n?rg(b,!0):rg(t.stateNode,!1)}catch(P){Xe(t,t.return,P)}break;case 22:case 23:t.memoizedState===null&&od(t,n);break;default:od(t,n)}}function ld(t,n){if(t.subtreeFlags&67108864)for(t=t.child;t!==null;){t:{var i=t,r=n;switch(i.tag){case 4:hx(i,r);break t;case 22:i.memoizedState===null&&ld(i,r);break t;default:ld(i,r)}}t=t.sibling}}function px(t){var n=t.alternate;n!==null&&(t.alternate=null,px(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Ke(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var en=null,Wn=!1;function Ai(t,n,i){for(i=i.child;i!==null;)mx(t,n,i),i=i.sibling}function mx(t,n,i){if(tn&&typeof tn.onCommitFiberUnmount=="function")try{tn.onCommitFiberUnmount(De,i)}catch{}switch(i.tag){case 26:Fe||wn(i,n),Ai(t,n,i),i.memoizedState?i.memoizedState.count--:i.stateNode&&!Fe&&(i=i.stateNode,i.parentNode.removeChild(i));break;case 27:Fe||wn(i,n),Po(i);var r=en,l=Wn;Qa(i.type)&&(en=i.stateNode,Wn=!1),Ai(t,n,i),vg(i.stateNode,i.type,i.memoizedProps),en=r,Wn=l;break;case 5:Fe||wn(i,n),Po(i);case 6:if(i.tag===6&&Po(i),r=en,l=Wn,en=null,Ai(t,n,i),en=r,Wn=l,en!==null)if(Wn)try{(en.nodeType===9?en.body:en.nodeName==="HTML"?en.ownerDocument.body:en).removeChild(i.stateNode),ge=!0}catch(c){Xe(i,n,c)}else try{en.removeChild(i.stateNode),ge=!0}catch(c){Xe(i,n,c)}break;case 18:en!==null&&(Wn?(t=en,ag(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,i.stateNode),Os(t)):ag(en,i.stateNode));break;case 4:r=en,l=Wn,en=i.stateNode.containerInfo,Wn=!0,Ai(t,n,i),en=r,Wn=l;break;case 0:case 11:case 14:case 15:ka(2,i,n),Fe||ka(4,i,n),Ai(t,n,i);break;case 1:Fe||(wn(i,n),r=i.stateNode,typeof r.componentWillUnmount=="function"&&ex(i,n,r)),Ai(t,n,i);break;case 21:Ai(t,n,i);break;case 22:Fe=(r=Fe)||i.memoizedState!==null,Ai(t,n,i),Fe=r;break;case 30:wn(i,n),Ai(t,n,i);break;case 7:Fe||wn(i,n),Ai(t,n,i);break;default:Ai(t,n,i)}}function xx(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Os(t)}catch(i){Xe(n,n.return,i)}}}function gx(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Os(t)}catch(i){Xe(n,n.return,i)}}function JS(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new fx),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new fx),n;default:throw Error(s(435,t.tag))}}function _u(t,n){var i=JS(t);n.forEach(function(r){if(!i.has(r)){i.add(r);var l=cy.bind(null,t,r);r.then(l,l)}})}function Hn(t,n,i){var r=n.deletions;if(r!==null)for(var l=0;l<r.length;l++){var c=r[l],m=t,b=n,P=b;t:for(;P!==null;){switch(P.tag){case 27:if(Qa(P.type)){en=P.stateNode,Wn=!1;break t}break;case 5:en=P.stateNode,Wn=!1;break t;case 3:case 4:en=P.stateNode.containerInfo,Wn=!0;break t}P=P.return}if(en===null)throw Error(s(160));mx(m,b,c),en=null,Wn=!1,m=c.alternate,m!==null&&(m.return=null),c.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)_x(n,t,i),n=n.sibling}var Ri=null;function _x(t,n,i){var r=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(l&4&&(r=t.updateQueue,r=r!==null?r.events:null,r!==null))for(var c=0;c<r.length;c++){var m=r[c];m.ref.impl=m.nextImpl}Hn(n,t,i),Gn(t),l&4&&(ka(3,t,t.return),Oo(3,t),ka(5,t,t.return));break;case 1:Hn(n,t,i),Gn(t),l&512&&(Fe||r===null||wn(r,r.return)),l&64&&Mn&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(i=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=i===null?n:i.concat(n))));break;case 26:if(c=Ri,Hn(n,t,i),Gn(t),l&512&&(Fe||r===null||wn(r,r.return)),l&4)if(l=r!==null?r.memoizedState:null,i=t.memoizedState,r===null)if(i===null)if(t.stateNode===null)if(Mn)t.stateNode=eg(t.type,t.memoizedProps,n.containerInfo,t);else{t:{n=t.type,i=t.memoizedProps,l=c.ownerDocument||c;e:switch(n){case"title":r=l.getElementsByTagName("title")[0],(!r||r[Ue]||r[Ct]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=l.createElement(n),l.head.insertBefore(r,l.querySelector("head > title"))),Dn(r,n,i),r[Ct]=t,Le(r),n=r;break t;case"link":if(c=Tg("link","href",l).get(n+(i.href||""))){for(m=0;m<c.length;m++)if(r=c[m],r.getAttribute("href")===(i.href==null||i.href===""?null:i.href)&&r.getAttribute("rel")===(i.rel==null?null:i.rel)&&r.getAttribute("title")===(i.title==null?null:i.title)&&r.getAttribute("crossorigin")===(i.crossOrigin==null?null:i.crossOrigin)){c.splice(m,1);break e}}r=l.createElement(n),Dn(r,n,i),l.head.appendChild(r);break;case"meta":if(c=Tg("meta","content",l).get(n+(i.content||""))){for(m=0;m<c.length;m++)if(r=c[m],r.getAttribute("content")===(i.content==null?null:""+i.content)&&r.getAttribute("name")===(i.name==null?null:i.name)&&r.getAttribute("property")===(i.property==null?null:i.property)&&r.getAttribute("http-equiv")===(i.httpEquiv==null?null:i.httpEquiv)&&r.getAttribute("charset")===(i.charSet==null?null:i.charSet)){c.splice(m,1);break e}}r=l.createElement(n),Dn(r,n,i),l.head.appendChild(r);break;default:throw Error(s(468,n))}r[Ct]=t,Le(r),n=r}t.stateNode=n}else Mn||Yd(c,t.type,t.stateNode);else t.stateNode=bg(c,i,t.memoizedProps);else l!==i?(l===null?(n=r.stateNode,n===null||Fe||n.parentNode.removeChild(n)):l.count--,i===null?Mn||Yd(c,t.type,t.stateNode):bg(c,i,t.memoizedProps)):i===null&&t.stateNode!==null&&Qf(t,t.memoizedProps,r.memoizedProps);break;case 27:Hn(n,t,i),Gn(t),l&512&&(Fe||r===null||wn(r,r.return)),r!==null&&l&4&&Qf(t,t.memoizedProps,r.memoizedProps);break;case 5:if(c=qi,qi=!1,Hn(n,t,i),qi=c,Gn(t),l&512&&(Fe||r===null||wn(r,r.return)),t.flags&32){n=t.stateNode;try{Qr(n,""),ge=!0}catch(it){Xe(t,t.return,it)}}l&4&&t.stateNode!=null&&(n=t.memoizedProps,Qf(t,n,r!==null?r.memoizedProps:n)),l&1024&&(rd=!0);break;case 6:if(Hn(n,t,i),Gn(t),l&4){if(t.stateNode===null)throw Error(s(162));n=t.memoizedProps,i=t.stateNode;try{i.nodeValue=n,ge=!0}catch(it){Xe(t,t.return,it)}}break;case 3:if(ge=!1,Lu=null,c=Ri,Ri=qo(n.containerInfo),Hn(n,t,i),Ri=c,Gn(t),l&4&&r!==null&&r.memoizedState.isDehydrated)try{Os(n.containerInfo)}catch(it){Xe(t,t.return,it)}rd&&(rd=!1,vx(t)),ge=!1;break;case 4:l=qi,qi=Mn,r=Fp(),c=Ri,Ri=qo(t.stateNode.containerInfo),Hn(n,t,i),Gn(t),Ri=c,ge&&zo&&(xu=!0),ge=r,qi=l;break;case 12:Hn(n,t,i),Gn(t);break;case 31:Hn(n,t,i),Gn(t),l&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,_u(t,n)));break;case 13:Hn(n,t,i),Gn(t),t.child.flags&8192&&t.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(yu=F()),l&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,_u(t,n)));break;case 22:c=t.memoizedState!==null,m=r!==null&&r.memoizedState!==null;var b=Mn,P=Fe,Z=qi;Mn=b||c,qi=Z||c,Fe=P||m,Hn(n,t,i),Fe=P,qi=Z,Mn=b,Gn(t),l&8192&&(n=t.stateNode,n._visibility=c?n._visibility&-2:n._visibility|1,!c||r===null||m||Mn||Fe||(n=m||Fe,i=Mn,r=Fe,Mn=c||Mn,Fe=n,qa(t,2),Mn=i,Fe=r),!c&&qi||od(t,c)),l&4&&(n=t.updateQueue,n!==null&&(i=n.retryQueue,i!==null&&(n.retryQueue=null,_u(t,i))));break;case 19:Hn(n,t,i),Gn(t),l&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,_u(t,n)));break;case 30:l&512&&(Fe||r===null||wn(r,r.return)),l=Fp(),c=zo,m=(i&335544064)===i,b=t.memoizedProps,zo=m&&sa(b.default,b.update)!=="none",Hn(n,t,i),Gn(t),m&&r!==null&&ge&&(t.flags|=4),zo=c,ge=l;break;case 21:break;case 7:l&512&&(Fe||r===null||wn(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=t);default:Hn(n,t,i),Gn(t)}}function Gn(t){var n=t.flags;if(n&2){try{for(var i,r=t.return;r!==null;){if(ix(r)){i=r;break}r=r.return}r=null;for(var l=t.return;l!==null;){if(Zf(l)){var c=l.stateNode;r===null?r=[c]:r.push(c)}if(jf(l))break;l=l.return}var m=r;if(i==null)throw Error(s(160));switch(i.tag){case 27:var b=i.stateNode,P=Jf(t);du(t,P,b,m);break;case 5:var Z=i.stateNode;i.flags&32&&(Qr(Z,""),i.flags&=-33);var it=Jf(t);du(t,it,Z,m);break;case 3:case 4:var mt=i.stateNode.containerInfo,W=Jf(t);$f(t,W,mt,m);break;default:throw Error(s(161))}}catch(et){Xe(t,t.return,et)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function vx(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;vx(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Ls=!0,n.reset(),Ls=!1),t=t.sibling}}function xs(t,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)Sx(n,t),n=n.sibling;else cx(n)}function Sx(t,n){var i=t.alternate;if(i===null)td(t,!1);else switch(t.tag){case 3:if(sd=Yi=!1,sx(),xs(n,t),!Yi&&!xu){if(t=Xi,t!==null)for(var r=0;r<t.length;r+=3){i=t[r];var l=t[r+1];og(i,t[r+2]),i=i.ownerDocument.documentElement,i!==null&&i.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+l+")"})}t=n.containerInfo,t=t.nodeType===9?t.documentElement:t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName===""&&(t.style.viewTransitionName="none",t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),t.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),sd=!0}Xi=null;break;case 5:xs(n,t);break;case 4:r=Yi,Yi=!1,xs(n,t),Yi&&(xu=!0),Yi=r;break;case 22:t.memoizedState===null&&(i.memoizedState!==null?td(t,!1):xs(n,t));break;case 30:r=Yi,l=sx(),Yi=!1,xs(n,t),Yi&&(t.flags|=4);var c=t.memoizedProps,m=t.stateNode;n=ra(c,m),m=ra(i.memoizedProps,m);var b=sa(c.default,c.update);b==="none"?n=!1:(c=i.memoizedState,i.memoizedState=null,i=t.child,Yn=0,n=ad(t,i,n,m,b,c,!0),Yn!==(c===null?0:c.length)&&(t.flags|=32)),(t.flags&4)!==0&&n?(Es(t,t.memoizedProps.onUpdate),Xi=l):l!==null&&(l.push.apply(l,Xi),Xi=l),Yi=(t.flags&32)!==0?!0:r;break;default:xs(n,t)}}function Wi(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)dx(t,n.alternate,n),n=n.sibling}function qa(t,n){for(t=t.child;t!==null;){var i=t,r=n;switch(i.tag){case 0:case 11:case 14:case 15:ka(4,i,i.return),qa(i,r);break;case 1:wn(i,i.return);var l=i.stateNode;typeof l.componentWillUnmount=="function"&&ex(i,i.return,l),qa(i,r);break;case 27:(r&2)!==0&&vg(i.stateNode,i.type,i.memoizedProps);case 5:wn(i,i.return),i.tag!==5&&i.tag!==27||Po(i),qa(i,r);break;case 6:Po(i);break;case 26:wn(i,i.return),l=i.stateNode,i.memoizedState!==null||l===null||Fe||l.parentNode.removeChild(l),qa(i,r);break;case 22:i.memoizedState===null&&qa(i,r);break;case 30:wn(i,i.return),qa(i,r);break;case 7:wn(i,i.return);default:qa(i,r)}t=t.sibling}}function Ci(t,n,i){for(i=(n.subtreeFlags&8772)!==0?i:i&-2,n=n.child;n!==null;){var r=n.alternate,l=t,c=n,m=c.flags,b=(i&1)!==0;switch(c.tag){case 0:case 11:case 15:Ci(l,c,i),Oo(4,c);break;case 1:if(Ci(l,c,i),r=c,l=r.stateNode,typeof l.componentDidMount=="function")try{l.componentDidMount()}catch(it){Xe(r,r.return,it)}if(r=c,l=r.updateQueue,l!==null){var P=r.stateNode;try{var Z=l.shared.hiddenCallbacks;if(Z!==null)for(l.shared.hiddenCallbacks=null,l=0;l<Z.length;l++)V0(Z[l],P)}catch(it){Xe(r,r.return,it)}}b&&m&64&&tx(c),Vi(c,c.return);break;case 27:(i&2)!==0&&ax(c);case 5:c.tag!==5&&c.tag!==27||nx(c),Ci(l,c,i),b&&r===null&&m&4&&Kf(c),Vi(c,c.return);break;case 6:nx(c);break;case 26:P=c.stateNode,c.memoizedState!==null||P===null||Mn||Yd(qo(P.ownerDocument),c.type,P),Ci(l,c,i),b&&r===null&&m&4&&Kf(c),Vi(c,c.return);break;case 12:Ci(l,c,i);break;case 31:Ci(l,c,i),b&&m&4&&xx(l,c);break;case 13:Ci(l,c,i),b&&m&4&&gx(l,c);break;case 22:c.memoizedState===null&&Ci(l,c,i),Vi(c,c.return);break;case 30:Ci(l,c,i),Vi(c,c.return);break;case 7:Vi(c,c.return);default:Ci(l,c,i)}n=n.sibling}}function ud(t,n){var i=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==i&&(t!=null&&t.refCount++,i!=null&&yo(i))}function cd(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&yo(t))}function _i(t,n,i,r){var l=(i&335544064)===i;if(n.subtreeFlags&(l?10262:10256))for(n=n.child;n!==null;)yx(t,n,i,r),n=n.sibling;else l&&ux(n)}function yx(t,n,i,r){var l=(i&335544064)===i;l&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&mu(n);var c=n.flags;switch(n.tag){case 0:case 11:case 15:_i(t,n,i,r),c&2048&&Oo(9,n);break;case 1:_i(t,n,i,r);break;case 3:_i(t,n,i,r),l&&sd&&(t=t.containerInfo,t=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,t.style.viewTransitionName==="root"&&(t.style.viewTransitionName=""),t=t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName==="none"&&(t.style.viewTransitionName="")),c&2048&&(c=null,n.alternate!==null&&(c=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==c&&(n.refCount++,c!=null&&yo(c)));break;case 12:if(c&2048){_i(t,n,i,r),c=n.stateNode;try{var m=n.memoizedProps,b=m.id,P=m.onPostCommit;typeof P=="function"&&P(b,n.alternate===null?"mount":"update",c.passiveEffectDuration,-0)}catch(Z){Xe(n,n.return,Z)}}else _i(t,n,i,r);break;case 31:_i(t,n,i,r);break;case 13:_i(t,n,i,r);break;case 23:break;case 22:m=n.stateNode,b=n.alternate,n.memoizedState!==null?(l&&b!==null&&b.memoizedState===null&&mu(b),m._visibility&2?_i(t,n,i,r):Io(t,n)):(l&&b!==null&&b.memoizedState!==null&&mu(n),m._visibility&2?_i(t,n,i,r):(m._visibility|=2,gs(t,n,i,r,(n.subtreeFlags&10256)!==0||!1))),c&2048&&ud(b,n);break;case 24:_i(t,n,i,r),c&2048&&cd(n.alternate,n);break;case 30:l&&(c=n.alternate,c!==null&&(ki(c.child,!0),ki(n.child,!0))),_i(t,n,i,r);break;default:_i(t,n,i,r)}}function gs(t,n,i,r,l){for(l=l&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var c=t,m=n,b=i,P=r,Z=m.flags;switch(m.tag){case 0:case 11:case 15:gs(c,m,b,P,l),Oo(8,m);break;case 23:break;case 22:var it=m.stateNode;m.memoizedState!==null?it._visibility&2?gs(c,m,b,P,l):Io(c,m):(it._visibility|=2,gs(c,m,b,P,l)),l&&Z&2048&&ud(m.alternate,m);break;case 24:gs(c,m,b,P,l),l&&Z&2048&&cd(m.alternate,m);break;default:gs(c,m,b,P,l)}n=n.sibling}}function Io(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var i=t,r=n,l=r.flags;switch(r.tag){case 22:Io(i,r),l&2048&&ud(r.alternate,r);break;case 24:Io(i,r),l&2048&&cd(r.alternate,r);break;default:Io(i,r)}n=n.sibling}}var Nr=8192;function Lr(t,n,i){if(t.subtreeFlags&Nr)for(t=t.child;t!==null;)Mx(t,n,i),t=t.sibling}function Mx(t,n,i){switch(t.tag){case 26:Lr(t,n,i),t.flags&Nr&&(t.memoizedState!==null?aM(i,Ri,t.memoizedState,t.memoizedProps):(t=t.stateNode,(n&335544128)===n&&wg(i,t)));break;case 5:Lr(t,n,i),t.flags&Nr&&(t=t.stateNode,(n&335544128)===n&&wg(i,t));break;case 3:case 4:var r=Ri;Ri=qo(t.stateNode.containerInfo),Lr(t,n,i),Ri=r;break;case 22:t.memoizedState===null&&(r=t.alternate,r!==null&&r.memoizedState!==null?(r=Nr,Nr=16777216,Lr(t,n,i),Nr=r):Lr(t,n,i));break;case 30:if((t.flags&Nr)!==0&&(r=t.memoizedProps.name,r!=null&&r!=="auto")){var l=t.stateNode;l.paired=null,ei===null&&(ei=new Map),ei.set(r,l)}Lr(t,n,i);break;default:Lr(t,n,i)}}function Ex(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Bo(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];En=r,Tx(r,t)}Ex(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)bx(t),t=t.sibling}function bx(t){switch(t.tag){case 0:case 11:case 15:Bo(t),t.flags&2048&&ka(9,t,t.return);break;case 3:Bo(t);break;case 12:Bo(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,vu(t)):Bo(t);break;default:Bo(t)}}function vu(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];En=r,Tx(r,t)}Ex(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:ka(8,n,n.return),vu(n);break;case 22:i=n.stateNode,i._visibility&2&&(i._visibility&=-3,vu(n));break;default:vu(n)}t=t.sibling}}function Tx(t,n){for(;En!==null;){var i=En;switch(i.tag){case 0:case 11:case 15:ka(8,i,n);break;case 23:case 22:if(i.memoizedState!==null&&i.memoizedState.cachePool!==null){var r=i.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:yo(i.memoizedState.cache)}if(r=i.child,r!==null)r.return=i,En=r;else t:for(i=t;En!==null;){r=En;var l=r.sibling,c=r.return;if(px(r),r===i){En=null;break t}if(l!==null){l.return=c,En=l;break t}En=c}}}var $S={getCacheForType:function(t){var n=An(dn),i=n.data.get(t);return i===void 0&&(i=t(),n.data.set(t,i)),i},cacheSignal:function(){return An(dn).controller.signal}},ty=typeof WeakMap=="function"?WeakMap:Map,Be=0,Qe=null,be=null,Ae=0,Ve=0,ni=null,Ya=!1,_s=!1,fd=!1,ma=0,rn=0,Wa=0,Or=0,Su=0,ii=0,vs=0,Fo=null,jn=null,dd=!1,yu=0,Ax=0,Mu=1/0,Eu=null,ja=null,nn=0,wi=null,Pr=null,ji=0,hd=0,pd=null,Rx=null,Ss=null,ys=null,Ms=null,Ho=0,bu=null;function ai(){return(Be&2)!==0&&Ae!==0?Ae&-Ae:Mt.T!==null?bd():ot()}function Cx(){if(ii===0)if((Ae&536870912)===0||Me){var t=hr;hr<<=1,(hr&3932160)===0&&(hr=262144),ii=t}else ii=536870912;return t=Rn.current,t!==null&&(t.flags|=32),ii}function Es(t,n){if(n!=null){var i=t.stateNode,r=i.ref;r===null&&(r=i.ref=lg(ra(t.memoizedProps,i))),ys===null&&(ys=[]),ys.push(n.bind(null,r))}}function Zn(t,n,i){(t===Qe&&(Ve===2||Ve===9)||t.cancelPendingCommit!==null)&&(bs(t,0),Za(t,Ae,ii,!1)),xr(t,i),((Be&2)===0||t!==Qe)&&(t===Qe&&((Be&2)===0&&(Or|=i),rn===4&&Za(t,Ae,ii,!1)),Zi(t))}function wx(t,n,i){if((Be&6)!==0)throw Error(s(327));var r=!i&&(n&127)===0&&(n&t.expiredLanes)===0||Bi(t,n),l=r?iy(t,n):xd(t,n,!0),c=r;do{if(l===0){_s&&!r&&Za(t,n,0,!1);break}else{if(i=t.current.alternate,c&&!ey(i)){l=xd(t,n,!1),c=!1;continue}if(l===2){if(c=n,t.errorRecoveryDisabledLanes&c)var m=0;else m=t.pendingLanes&-536870913,m=m!==0?m:m&536870912?536870912:0;if(m!==0){n=m;t:{var b=t;l=Fo;var P=b.current.memoizedState.isDehydrated;if(P&&(bs(b,m).flags|=256),m=xd(b,m,!1),m!==2&&m!==6){if(fd&&!P){b.errorRecoveryDisabledLanes|=c,Or|=c,l=4;break t}c=jn,jn=l,c!==null&&(jn===null?jn=c:jn.push.apply(jn,c))}l=m}if(c=!1,l!==2)continue}}if(l===1){bs(t,0),Za(t,n,0,!0);break}t:{switch(r=t,c=l,c){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:Za(r,n,ii,!Ya);break t;case 2:jn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(l=yu+300-F(),10<l)){if(Za(r,n,ii,!Ya),mr(r,0,!0)!==0)break t;ji=n,r.timeoutHandle=Pd(Dx.bind(null,r,i,jn,Eu,dd,n,ii,Or,vs,Ya,c,"Throttled",-0,0),l);break t}Dx(r,i,jn,Eu,dd,n,ii,Or,vs,Ya,c,null,-0,0)}}break}while(!0);Zi(t)}function Dx(t,n,i,r,l,c,m,b,P,Z,it,mt,W,et){t.timeoutHandle=-1;var Nt=n.subtreeFlags,qt=(c&335544064)===c;if(mt=null,(qt||Nt&8192||(Nt&16785408)===16785408)&&(mt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Fi},ei=null,Mx(n,c,mt),qt&&(Nt=mt,qt=t.containerInfo,qt=(qt.nodeType===9?qt:qt.ownerDocument).__reactViewTransition,qt!=null&&(Nt.count++,Nt.waitingForViewTransition=!0,Nt=jo.bind(Nt),qt.finished.then(Nt,Nt))),Nt=(c&62914560)===c?yu-F():(c&4194048)===c?Ax-F():0,Nt=rM(mt,Nt),Nt!==null)){ji=c,t.cancelPendingCommit=Nt(Bx.bind(null,t,n,c,i,r,l,m,b,P,Z,it,mt,null,W,et)),Za(t,c,m,!Z);return}Bx(t,n,c,i,r,l,m,b,P,Z,it,mt)}function ey(t){for(var n=t;;){var i=n.tag;if((i===0||i===11||i===15)&&n.flags&16384&&(i=n.updateQueue,i!==null&&(i=i.stores,i!==null)))for(var r=0;r<i.length;r++){var l=i[r],c=l.getSnapshot;l=l.value;try{if(!$n(c(),l))return!1}catch{return!1}}if(i=n.child,n.subtreeFlags&16384&&i!==null)i.return=n,n=i;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Za(t,n,i,r){n=so(t,n),n&=~Su,n&=~Or,t.suspendedLanes|=n,t.pingedLanes&=~n,r&&(t.warmLanes|=n),r=t.expirationTimes;for(var l=n;0<l;){var c=31-In(l),m=1<<c;r[c]=-1,l&=~m}i!==0&&yl(t,i,n)}function Tu(){return(Be&6)===0?(Go(0),!1):!0}function md(){if(be!==null){if(Ve===0)var t=be.return;else t=be,ua=Mr=null,Ef(t),cs=null,bo=0,t=be;for(;t!==null;)$m(t.alternate,t),t=t.return;be=null}}function bs(t,n){var i=t.timeoutHandle;return i!==-1&&(t.timeoutHandle=-1,Ty(i)),i=t.cancelPendingCommit,i!==null&&(t.cancelPendingCommit=null,i()),ji=0,md(),Qe=t,be=i=oa(t.current,null),Ae=n,Ve=0,ni=null,Ya=!1,_s=Bi(t,n),fd=!1,vs=ii=Su=Or=Wa=rn=0,jn=Fo=null,dd=!1,ma=so(t,n),Ll(),i}function Ux(t,n){he=null,Mt.H=au,n===us||n===kl?(n=B0(),Ve=3):n===cf?(n=B0(),Ve=4):Ve=n===Bf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ni=n,be===null&&(rn=1,ru(t,pi(n,t.current)))}function Nx(){var t=Rn.current;return t===null?!0:(Ae&4194048)===Ae?On===null:(Ae&62914560)===Ae||(Ae&536870912)!==0?t===On:!1}function Lx(){var t=Mt.H;return Mt.H=au,t===null?au:t}function Ox(){var t=Mt.A;return Mt.A=$S,t}function Au(){rn=4,Ya||(Ae&4194048)!==Ae&&Rn.current!==null||(_s=!0),(Wa&134217727)===0&&(Or&134217727)===0||Qe===null||Za(Qe,Ae,ii,!1)}function xd(t,n,i){var r=Be;Be|=2;var l=Lx(),c=Ox();(Qe!==t||Ae!==n)&&(Eu=null,bs(t,n)),n=!1;var m=rn;t:do try{if(Ve!==0&&be!==null){var b=be,P=ni;switch(Ve){case 8:md(),m=6;break t;case 3:case 2:case 9:case 6:Rn.current===null&&(n=!0);var Z=Ve;if(Ve=0,ni=null,Ts(t,b,P,Z),i&&_s){m=0;break t}break;default:Z=Ve,Ve=0,ni=null,Ts(t,b,P,Z)}}ny(),m=rn;break}catch(it){Ux(t,it)}while(!0);return n&&t.shellSuspendCounter++,ua=Mr=null,Be=r,Mt.H=l,Mt.A=c,be===null&&(Qe=null,Ae=0,Ll()),m}function ny(){for(;be!==null;)Px(be)}function iy(t,n){var i=Be;Be|=2;var r=Lx(),l=Ox();Qe!==t||Ae!==n?(Eu=null,Mu=F()+500,bs(t,n)):_s=Bi(t,n);t:do try{if(Ve!==0&&be!==null){n=be;var c=ni;e:switch(Ve){case 1:Ve=0,ni=null,Ts(t,n,c,1);break;case 2:case 9:if(z0(c)){Ve=0,ni=null,zx(n);break}n=function(){Ve!==2&&Ve!==9||Qe!==t||(Ve=7),Zi(t)},c.then(n,n);break t;case 3:Ve=7;break t;case 4:Ve=5;break t;case 7:z0(c)?(Ve=0,ni=null,zx(n)):(Ve=0,ni=null,Ts(t,n,c,7));break;case 5:var m=null;switch(be.tag){case 26:m=be.memoizedState;case 5:case 27:var b=be;if(m?Rg(m):b.stateNode.complete){Ve=0,ni=null;var P=b.sibling;if(P!==null)be=P;else{var Z=b.return;Z!==null?(be=Z,Ru(Z)):be=null}break e}}Ve=0,ni=null,Ts(t,n,c,5);break;case 6:Ve=0,ni=null,Ts(t,n,c,6);break;case 8:md(),rn=6;break t;default:throw Error(s(462))}}ay();break}catch(it){Ux(t,it)}while(!0);return ua=Mr=null,Mt.H=r,Mt.A=l,Be=i,be!==null?0:(Qe=null,Ae=0,Ll(),rn)}function ay(){for(;be!==null&&!Ht();)Px(be)}function Px(t){var n=Qm(t.alternate,t,ma);t.memoizedProps=t.pendingProps,n===null?Ru(t):be=n}function zx(t){var n=t,i=n.alternate;switch(n.tag){case 15:case 0:n=km(i,n,n.pendingProps,n.type,void 0,Ae);break;case 11:n=km(i,n,n.pendingProps,n.type.render,n.ref,Ae);break;case 5:Ef(n);var r=n;r===yn&&(Me?(Fl(r),r.tag===5&&r.stateNode!=null&&(Je=r.stateNode)):(Fl(r),Me=!0));default:$m(i,n),n=be=T0(n,ma),n=Qm(i,n,ma)}t.memoizedProps=t.pendingProps,n===null?Ru(t):be=n}function Ts(t,n,i,r){ua=Mr=null,Ef(n),cs=null,bo=0;var l=n.return;try{if(qS(t,l,n,i,Ae)){rn=1,ru(t,pi(i,t.current)),be=null;return}}catch(c){if(l!==null)throw be=l,c;rn=1,ru(t,pi(i,t.current)),be=null;return}n.flags&32768?(Me||r===1?t=!0:_s||(Ae&536870912)!==0?t=!1:(Ya=t=!0,(r===2||r===9||r===3||r===6)&&(r=Rn.current,r!==null&&r.tag===13&&(r.flags|=16384))),Ix(n,t)):Ru(n)}function Ru(t){var n=t;do{if((n.flags&32768)!==0){Ix(n,Ya);return}t=n.return;var i=ZS(n.alternate,n,ma);if(i!==null){be=i;return}if(n=n.sibling,n!==null){be=n;return}be=n=t}while(n!==null);rn===0&&(rn=5)}function Ix(t,n){do{var i=KS(t.alternate,t);if(i!==null){i.flags&=32767,be=i;return}if(i=t.return,i!==null&&(i.flags|=32768,i.subtreeFlags=0,i.deletions=null),!n&&(t=t.sibling,t!==null)){be=t;return}be=t=i}while(t!==null);rn=6,be=null}function Bx(t,n,i,r,l,c,m,b,P,Z,it,mt){t.cancelPendingCommit=null;do Cu();while(nn!==0);if((Be&6)!==0)throw Error(s(327));if(n!==null){if(n===t.current)throw Error(s(177));t===Qe&&(be=Qe=null,Ae=0),Pr=n,wi=t,ji=i,pd=l,Rx=r,ry(t,n,i,m,b,P,mt)}}function ry(t,n,i,r,l,c,m){var b=n.lanes|n.childLanes;if(hd=b,b|=Kc,Rc(t,i,b,r,l,c),ys=null,(i&335544064)===i?(Ms=LS(t),r=10262):(Ms=null,r=10256),(n.subtreeFlags&r)!==0||(n.flags&r)!==0?(t.callbackNode=null,t.callbackPriority=0,fy(At,function(){return Sd(),null})):(t.callbackNode=null,t.callbackPriority=0),hu=!1,r=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||r){r=Mt.T,Mt.T=null,l=Lt.p,Lt.p=2,c=Be,Be|=4;try{QS(t,n,i)}finally{Be=c,Lt.p=l,Mt.T=r}}nn=1,hu?Ss=Uy(m,t.containerInfo,Ms,gd,_d,oy,vd,Sd,sy):(gd(),_d(),vd())}function sy(t){if(nn!==0){var n=wi.onRecoverableError;n(t,{componentStack:null})}}function oy(){nn===3&&(nn=0,Sx(Pr,wi),nn=4)}function gd(){if(nn===1){nn=0;var t=wi,n=Pr,i=ji,r=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||r){r=Mt.T,Mt.T=null;var l=Lt.p;Lt.p=2;var c=Be;Be|=4;try{zo=xu=!1,_x(n,t,i),i=Nd;var m=m0(t.containerInfo),b=i.focusedElem,P=i.selectionRange;if(m!==b&&b&&b.ownerDocument&&p0(b.ownerDocument.documentElement,b)){if(P!==null&&qc(b)){var Z=P.start,it=P.end;if(it===void 0&&(it=Z),"selectionStart"in b)b.selectionStart=Z,b.selectionEnd=Math.min(it,b.value.length);else{var mt=b.ownerDocument||document,W=mt&&mt.defaultView||window;if(W.getSelection){var et=W.getSelection(),Nt=b.textContent.length,qt=Math.min(P.start,Nt),pe=P.end===void 0?qt:Math.min(P.end,Nt);!et.extend&&qt>pe&&(m=pe,pe=qt,qt=m);var j=h0(b,qt),X=h0(b,pe);if(j&&X&&(et.rangeCount!==1||et.anchorNode!==j.node||et.anchorOffset!==j.offset||et.focusNode!==X.node||et.focusOffset!==X.offset)){var tt=mt.createRange();tt.setStart(j.node,j.offset),et.removeAllRanges(),qt>pe?(et.addRange(tt),et.extend(X.node,X.offset)):(tt.setEnd(X.node,X.offset),et.addRange(tt))}}}}for(mt=[],et=b;et=et.parentNode;)et.nodeType===1&&mt.push({element:et,left:et.scrollLeft,top:et.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<mt.length;b++){var pt=mt[b];pt.element.scrollLeft=pt.left,pt.element.scrollTop=pt.top}}Ls=!!Ud,Nd=Ud=null}finally{Be=c,Lt.p=l,Mt.T=r}}t.current=n,nn=2}}function _d(){if(nn===2){nn=0;var t=wi,n=Pr,i=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||i){i=Mt.T,Mt.T=null;var r=Lt.p;Lt.p=2;var l=Be;Be|=4;try{dx(t,n.alternate,n)}finally{Be=l,Lt.p=r,Mt.T=i}}nn=3}}function vd(){if(nn===4||nn===3){nn=0;var t=Ss;Ss=null,oe();var n=wi,i=Pr,r=ji,l=Rx,c=(r&335544064)===r?10262:10256;if((i.subtreeFlags&c)!==0||(i.flags&c)!==0?nn=5:(nn=0,Pr=wi=null,Fx(n,n.pendingLanes)),c=n.pendingLanes,c===0&&(ja=null),st(r),i=i.stateNode,tn&&typeof tn.onCommitFiberRoot=="function")try{tn.onCommitFiberRoot(De,i,void 0,(i.current.flags&128)===128)}catch{}if(l!==null){i=Mt.T,c=Lt.p,Lt.p=2,Mt.T=null;try{for(var m=n.onRecoverableError,b=0;b<l.length;b++){var P=l[b];m(P.value,{componentStack:P.stack})}}finally{Mt.T=i,Lt.p=c}}if(l=ys,m=Ms,Ms=null,l!==null&&(ys=null,m===null&&(m=[]),t!==null))for(P=0;P<l.length;P++)i=(0,l[P])(m),i!==void 0&&t.finished.finally(i);(ji&3)!==0&&Cu(),Zi(n),c=n.pendingLanes,(r&261930)!==0&&(c&42)!==0?n===bu?Ho++:(Ho=0,bu=n):(Ho=0,bu=null),Go(0)}}function Fx(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,yo(n)))}function Cu(){return Ss!==null&&(Ss.skipTransition(),Ss=null),gd(),_d(),vd(),Sd()}function Sd(){if(nn!==5)return!1;var t=wi,n=hd;hd=0;var i=st(ji),r=Mt.T,l=Lt.p;try{Lt.p=32>i?32:i,Mt.T=null,i=pd,pd=null;var c=wi,m=ji;if(nn=0,Pr=wi=null,ji=0,(Be&6)!==0)throw Error(s(331));var b=Be;if(Be|=4,bx(c.current),yx(c,c.current,m,i),Be=b,Go(0,!1),tn&&typeof tn.onPostCommitFiberRoot=="function")try{tn.onPostCommitFiberRoot(De,c)}catch{}return!0}finally{Lt.p=l,Mt.T=r,Fx(t,n)}}function Hx(t,n,i){n=pi(i,n),n=If(t.stateNode,n,2),t=Ha(t,n,2),t!==null&&(xr(t,2),Zi(t))}function Xe(t,n,i){if(t.tag===3)Hx(t,t,i);else for(;n!==null;){if(n.tag===3){Hx(n,t,i);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ja===null||!ja.has(r))){t=pi(i,t),i=zm(2),r=Ha(n,i,2),r!==null&&(Im(i,r,n,t),xr(r,2),Zi(r));break}}n=n.return}}function yd(t,n,i){var r=t.pingCache;if(r===null){r=t.pingCache=new ty;var l=new Set;r.set(n,l)}else l=r.get(n),l===void 0&&(l=new Set,r.set(n,l));l.has(i)||(fd=!0,l.add(i),t=ly.bind(null,t,n,i),n.then(t,t))}function ly(t,n,i){var r=t.pingCache;r!==null&&r.delete(n),t.pingedLanes|=t.suspendedLanes&i,t.warmLanes&=~i,Qe===t&&(Ae&i)===i&&((rn===4||rn===3&&(Ae&62914560)===Ae&&300>F()-yu)&&(Be&2)===0?bs(t,0):Su|=i,vs===Ae&&(vs=0)),Zi(t)}function Gx(t,n){n===0&&(n=Sl()),t=vr(t,n),t!==null&&(xr(t,n),Zi(t))}function uy(t){var n=t.memoizedState,i=0;n!==null&&(i=n.retryLane),Gx(t,i)}function cy(t,n){var i=0;switch(t.tag){case 31:case 13:var r=t.stateNode,l=t.memoizedState;l!==null&&(i=l.retryLane);break;case 19:r=t.stateNode;break;case 22:r=t.stateNode._retryCache;break;default:throw Error(s(314))}r!==null&&r.delete(n),Gx(t,i)}function fy(t,n){return ee(t,n)}var As=null,Rs=null,Md=!1,wu=!1,Ed=!1,Ka=0;function Zi(t){t!==Rs&&t.next===null&&(Rs===null?As=Rs=t:Rs=Rs.next=t),wu=!0,Md||(Md=!0,hy())}function Go(t,n){if(!Ed&&wu){Ed=!0;do for(var i=!1,r=As;r!==null;){if(t!==0){var l=r.pendingLanes;if(l===0)var c=0;else{var m=r.suspendedLanes,b=r.pingedLanes;c=(1<<31-In(42|t)+1)-1,c&=l&~(m&~b),c=c&201326741?c&201326741|1:c?c|2:0}c!==0&&(i=!0,qx(r,c))}else c=Ae,c=mr(r,r===Qe?c:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(c&3)===0||Bi(r,c)||(i=!0,qx(r,c));r=r.next}while(i);Ed=!1}}function dy(){Vx()}function Vx(){wu=Md=!1;var t=0;Ka!==0&&by()&&(t=Ka);for(var n=F(),i=null,r=As;r!==null;){var l=r.next,c=Xx(r,n);c===0?(r.next=null,i===null?As=l:i.next=l,l===null&&(Rs=i)):(i=r,(t!==0||(c&3)!==0)&&(wu=!0)),r=l}nn!==0&&nn!==5||Go(t),Ka!==0&&(Ka=0)}function Xx(t,n){for(var i=t.suspendedLanes,r=t.pingedLanes,l=t.expirationTimes,c=t.pendingLanes&-62914561;0<c;){var m=31-In(c),b=1<<m,P=l[m];P===-1?((b&i)===0||(b&r)!==0)&&(l[m]=vl(b,n)):P<=n&&(t.expiredLanes|=b),c&=~b}if(n=Qe,i=Ae,i=mr(t,t===n?i:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),r=t.callbackNode,i===0||t===n&&(Ve===2||Ve===9)||t.cancelPendingCommit!==null)return r!==null&&r!==null&&$t(r),t.callbackNode=null,t.callbackPriority=0;if((i&3)===0||Bi(t,i)){if(n=i&-i,n===t.callbackPriority)return n;switch(r!==null&&$t(r),st(i)){case 2:case 8:i=Ut;break;case 32:i=At;break;case 268435456:i=kt;break;default:i=At}return r=kx.bind(null,t),i=ee(i,r),t.callbackPriority=n,t.callbackNode=i,n}return r!==null&&r!==null&&$t(r),t.callbackPriority=2,t.callbackNode=null,2}function kx(t,n){if(nn!==0&&nn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var i=t.callbackNode;if(Cu()&&t.callbackNode!==i)return null;var r=Ae;return r=mr(t,t===Qe?r:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),r===0?null:(wx(t,r,n),Xx(t,F()),t.callbackNode!=null&&t.callbackNode===i?kx.bind(null,t):null)}function qx(t,n){if(Cu())return null;wx(t,n,!0)}function hy(){Ay(function(){(Be&6)!==0?ee(Dt,dy):Vx()})}function bd(){if(Ka===0){var t=Tr;t===0&&(t=wa,wa<<=1,(wa&261888)===0&&(wa=256)),Ka=t}return Ka}function Yx(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Tl(t)}function py(t,n,i,r,l){if(n==="submit"&&i&&i.stateNode===l){var c=Yx((l[zt]||null).action),m=r.submitter;m&&(n=(n=m[zt]||null)?Yx(n.formAction):m.getAttribute("formAction"),n!==null&&(c=n,m=null));var b=new wl("action","action",null,r,l);t.push({event:b,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Ka!==0){var P=new FormData(l,m);Nf(i,{pending:!0,data:P,method:l.method,action:c},null,P)}}else typeof c=="function"&&(b.preventDefault(),P=new FormData(l,m),Nf(i,{pending:!0,data:P,method:l.method,action:c},c,P))},currentTarget:l}]})}}for(var Td=0;Td<Zc.length;Td++){var Ad=Zc[Td],my=Ad.toLowerCase(),xy=Ad[0].toUpperCase()+Ad.slice(1);Ti(my,"on"+xy)}Ti(_0,"onAnimationEnd"),Ti(v0,"onAnimationIteration"),Ti(S0,"onAnimationStart"),Ti("dblclick","onDoubleClick"),Ti("focusin","onFocus"),Ti("focusout","onBlur"),Ti(TS,"onTransitionRun"),Ti(AS,"onTransitionStart"),Ti(RS,"onTransitionCancel"),Ti(y0,"onTransitionEnd"),ln("onMouseEnter",["mouseout","mouseover"]),ln("onMouseLeave",["mouseout","mouseover"]),ln("onPointerEnter",["pointerout","pointerover"]),ln("onPointerLeave",["pointerout","pointerover"]),Ie("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ie("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ie("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ie("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ie("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ie("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Vo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gy=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Vo));function Wx(t,n){n=(n&4)!==0;for(var i=0;i<t.length;i++){var r=t[i],l=r.event;r=r.listeners;t:{var c=void 0;if(n)for(var m=r.length-1;0<=m;m--){var b=r[m],P=b.instance,Z=b.currentTarget;if(b=b.listener,P!==c&&l.isPropagationStopped())break t;c=b,l.currentTarget=Z;try{c(l)}catch(it){Nl(it)}l.currentTarget=null,c=P}else for(m=0;m<r.length;m++){if(b=r[m],P=b.instance,Z=b.currentTarget,b=b.listener,P!==c&&l.isPropagationStopped())break t;c=b,l.currentTarget=Z;try{c(l)}catch(it){Nl(it)}l.currentTarget=null,c=P}}}}function Te(t,n){var i=n[ne];i===void 0&&(i=n[ne]=new Set);var r=t+"__bubble";i.has(r)||(jx(n,t,2,!1),i.add(r))}function Rd(t,n,i){var r=0;n&&(r|=4),jx(i,t,r,n)}var Du="_reactListening"+Math.random().toString(36).slice(2);function Cd(t){if(!t[Du]){t[Du]=!0,Ln.forEach(function(i){i!=="selectionchange"&&(gy.has(i)||Rd(i,!1,t),Rd(i,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Du]||(n[Du]=!0,Rd("selectionchange",!1,n))}}function jx(t,n,i,r){switch(Ig(n)){case 2:var l=uM;break;case 8:l=cM;break;default:l=jd}i=l.bind(null,n,i,t),l=void 0,!Pc||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(l=!0),r?l!==void 0?t.addEventListener(n,i,{capture:!0,passive:l}):t.addEventListener(n,i,!0):l!==void 0?t.addEventListener(n,i,{passive:l}):t.addEventListener(n,i,!1)}function wd(t,n,i,r,l){var c=r;if((n&1)===0&&(n&2)===0&&r!==null)t:for(;;){if(r===null)return;var m=r.tag;if(m===3||m===4){var b=r.stateNode.containerInfo;if(b===l)break;if(m===4)for(m=r.return;m!==null;){var P=m.tag;if((P===3||P===4)&&m.stateNode.containerInfo===l)return;m=m.return}for(;b!==null;){if(m=Ce(b),m===null)return;if(P=m.tag,P===5||P===6||P===26||P===27){r=c=m;continue t}b=b.parentNode}}r=r.return}jp(function(){var Z=c,it=Lc(i),mt=[];t:{var W=M0.get(t);if(W!==void 0){var et=wl,Nt=t;switch(t){case"keypress":if(Rl(i)===0)break t;case"keydown":case"keyup":et=eS;break;case"focusin":Nt="focus",et=Fc;break;case"focusout":Nt="blur",et=Fc;break;case"beforeblur":case"afterblur":et=Fc;break;case"click":if(i.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":et=Qp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":et=Xv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":et=sS;break;case _0:case v0:case S0:et=Yv;break;case y0:et=lS;break;case"scroll":case"scrollend":et=Gv;break;case"wheel":et=cS;break;case"copy":case"cut":case"paste":et=jv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":et=$p;break;case"submit":et=aS;break;case"toggle":case"beforetoggle":et=dS}var qt=(n&4)!==0,pe=!qt&&(t==="scroll"||t==="scrollend"),j=qt?W!==null?W+"Capture":null:W;qt=[];for(var X=Z,tt;X!==null;){var pt=X;if(tt=pt.stateNode,pt=pt.tag,pt!==5&&pt!==26&&pt!==27||tt===null||j===null||(pt=uo(X,j),pt!=null&&qt.push(Xo(X,pt,tt))),pe)break;X=X.return}0<qt.length&&(W=new et(W,Nt,null,i,it),mt.push({event:W,listeners:qt}))}}if((n&7)===0){t:{if(et=t==="mouseover"||t==="pointerover",W=t==="mouseout"||t==="pointerout",et&&i!==Nc&&(Nt=i.relatedTarget||i.fromElement)&&(Ce(Nt)||Nt[Bt]))break t;(W||et)&&(Nt=it.window===it?it:(et=it.ownerDocument)?et.defaultView||et.parentWindow:window,W?(et=i.relatedTarget||i.toElement,W=Z,et=et?Ce(et):null,et!==null&&(pe=f(et),qt=et.tag,et!==pe||qt!==5&&qt!==27&&qt!==6)&&(et=null)):(W=null,et=Z),W!==et&&(qt=Qp,pt="onMouseLeave",j="onMouseEnter",X="mouse",(t==="pointerout"||t==="pointerover")&&(qt=$p,pt="onPointerLeave",j="onPointerEnter",X="pointer"),pe=W==null?Nt:Ge(W),tt=et==null?Nt:Ge(et),Nt=new qt(pt,X+"leave",W,i,it),Nt.target=pe,Nt.relatedTarget=tt,pt=null,Ce(it)===Z&&(qt=new qt(j,X+"enter",et,i,it),qt.target=tt,qt.relatedTarget=pe,pt=qt),pe=pt,qt=W&&et?N(W,et,_y):null,W!==null&&Zx(mt,Nt,W,qt,!1),et!==null&&pe!==null&&Zx(mt,pe,et,qt,!0)))}t:{if(W=Z?Ge(Z):window,et=W.nodeName&&W.nodeName.toLowerCase(),et==="select"||et==="input"&&W.type==="file")var Gt=o0;else if(r0(W))if(l0)Gt=MS;else{Gt=SS;var Re=vS}else et=W.nodeName,!et||et.toLowerCase()!=="input"||W.type!=="checkbox"&&W.type!=="radio"?Z&&Uc(Z.elementType)&&(Gt=o0):Gt=yS;if(Gt&&(Gt=Gt(t,Z))){s0(mt,Gt,i,it);break t}Re&&Re(t,W,Z)}switch(Re=Z?Ge(Z):window,t){case"focusin":(r0(Re)||Re.contentEditable==="true")&&(es=Re,Yc=Z,_o=null);break;case"focusout":_o=Yc=es=null;break;case"mousedown":Wc=!0;break;case"contextmenu":case"mouseup":case"dragend":Wc=!1,x0(mt,i,it);break;case"selectionchange":if(bS)break;case"keydown":case"keyup":x0(mt,i,it)}var Zt;if(Gc)t:{switch(t){case"compositionstart":var ie="onCompositionStart";break t;case"compositionend":ie="onCompositionEnd";break t;case"compositionupdate":ie="onCompositionUpdate";break t}ie=void 0}else ts?i0(t,i)&&(ie="onCompositionEnd"):t==="keydown"&&i.keyCode===229&&(ie="onCompositionStart");ie&&(t0&&i.locale!=="ko"&&(ts||ie!=="onCompositionStart"?ie==="onCompositionEnd"&&ts&&(Zt=Zp()):(Ua=it,zc="value"in Ua?Ua.value:Ua.textContent,ts=!0)),Re=Uu(Z,ie),0<Re.length&&(ie=new Jp(ie,t,null,i,it),mt.push({event:ie,listeners:Re}),Zt?ie.data=Zt:(Zt=a0(i),Zt!==null&&(ie.data=Zt)))),(Zt=pS?mS(t,i):xS(t,i))&&(ie=Uu(Z,"onBeforeInput"),0<ie.length&&(Re=new Jp("onBeforeInput","beforeinput",null,i,it),mt.push({event:Re,listeners:ie}),Re.data=Zt)),py(mt,t,Z,i,it)}Wx(mt,n)})}function Xo(t,n,i){return{instance:t,listener:n,currentTarget:i}}function Uu(t,n){for(var i=n+"Capture",r=[];t!==null;){var l=t,c=l.stateNode;if(l=l.tag,l!==5&&l!==26&&l!==27||c===null||(l=uo(t,i),l!=null&&r.unshift(Xo(t,l,c)),l=uo(t,n),l!=null&&r.push(Xo(t,l,c))),t.tag===3)return r;t=t.return}return[]}function _y(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Zx(t,n,i,r,l){for(var c=n._reactName,m=[];i!==null&&i!==r;){var b=i,P=b.alternate,Z=b.stateNode;if(b=b.tag,P!==null&&P===r)break;b!==5&&b!==26&&b!==27||Z===null||(P=Z,l?(Z=uo(i,c),Z!=null&&m.unshift(Xo(i,Z,P))):l||(Z=uo(i,c),Z!=null&&m.push(Xo(i,Z,P)))),i=i.return}m.length!==0&&t.push({event:n,listeners:m})}var vy=/\r\n?/g,Sy=/\u0000|\uFFFD/g;function Kx(t){return(typeof t=="string"?t:""+t).replace(vy,`
`).replace(Sy,"")}function Qx(t,n){return n=Kx(n),Kx(t)===n}function ke(t,n,i,r,l,c){switch(i){case"children":if(typeof r=="string")n==="body"||n==="textarea"&&r===""||Qr(t,r);else if(typeof r=="number"||typeof r=="bigint")n!=="body"&&Qr(t,""+r);else return;break;case"className":bl(t,"class",r);break;case"tabIndex":bl(t,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":bl(t,i,r);break;case"style":Yp(t,r,c);return;case"data":if(n!=="object"){bl(t,"data",r);break}case"src":case"href":if(r===""&&(n!=="a"||i!=="href")){t.removeAttribute(i);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){t.removeAttribute(i);break}r=Tl(r),t.setAttribute(i,r);break;case"action":case"formAction":if(typeof r=="function"){t.setAttribute(i,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof c=="function"&&(i==="formAction"?(n!=="input"&&ke(t,n,"name",l.name,l,null),ke(t,n,"formEncType",l.formEncType,l,null),ke(t,n,"formMethod",l.formMethod,l,null),ke(t,n,"formTarget",l.formTarget,l,null)):(ke(t,n,"encType",l.encType,l,null),ke(t,n,"method",l.method,l,null),ke(t,n,"target",l.target,l,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){t.removeAttribute(i);break}r=Tl(r),t.setAttribute(i,r);break;case"onClick":r!=null&&(t.onclick=Fi);return;case"onScroll":r!=null&&Te("scroll",t);return;case"onScrollEnd":r!=null&&Te("scrollend",t);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(s(61));if(i=r.__html,i!=null){if(l.children!=null)throw Error(s(60));c?.__html!==i&&(t.innerHTML=i)}}break;case"multiple":t.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":t.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){t.removeAttribute("xlink:href");break}i=Tl(r),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",i);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(i,r):t.removeAttribute(i);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(i,""):t.removeAttribute(i);break;case"capture":case"download":r===!0?t.setAttribute(i,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(i,r):t.removeAttribute(i);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?t.setAttribute(i,r):t.removeAttribute(i);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?t.removeAttribute(i):t.setAttribute(i,r);break;case"popover":Te("beforetoggle",t),Te("toggle",t),El(t,"popover",r);break;case"xlinkActuate":ia(t,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":ia(t,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":ia(t,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":ia(t,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":ia(t,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":ia(t,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":ia(t,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":ia(t,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":ia(t,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":El(t,"is",r);break;case"innerText":case"textContent":return;default:if(!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")i=Fv.get(i)||i,El(t,i,r);else return}ge=!0}function Dd(t,n,i,r,l,c){switch(i){case"style":Yp(t,r,c);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(s(61));if(i=r.__html,i!=null){if(l.children!=null)throw Error(s(60));c?.__html!==i&&(t.innerHTML=i)}}break;case"children":if(typeof r=="string")Qr(t,r);else if(typeof r=="number"||typeof r=="bigint")Qr(t,""+r);else return;break;case"onScroll":r!=null&&Te("scroll",t);return;case"onScrollEnd":r!=null&&Te("scrollend",t);return;case"onClick":r!=null&&(t.onclick=Fi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Da.hasOwnProperty(i))t:{if(i[0]==="o"&&i[1]==="n"&&(l=i.endsWith("Capture"),c=i.slice(2,l?i.length-7:void 0),n=t[zt]||null,n=n!=null?n[i]:null,typeof n=="function"&&t.removeEventListener(c,n,l),typeof r=="function")){typeof n!="function"&&n!==null&&(i in t?t[i]=null:t.hasAttribute(i)&&t.removeAttribute(i)),t.addEventListener(c,r,l);break t}ge=!0,i in t?t[i]=r:r===!0?t.setAttribute(i,""):El(t,i,r)}return}ge=!0}function Dn(t,n,i){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Te("error",t),Te("load",t);var r=!1,l=!1,c;for(c in i)if(i.hasOwnProperty(c)){var m=i[c];if(m!=null)switch(c){case"src":r=!0;break;case"srcSet":l=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:ke(t,n,c,m,i,null)}}l&&ke(t,n,"srcSet",i.srcSet,i,null),r&&ke(t,n,"src",i.src,i,null);return;case"input":Te("invalid",t);var b=c=m=l=null,P=null,Z=null;for(r in i)if(i.hasOwnProperty(r)){var it=i[r];if(it!=null)switch(r){case"name":l=it;break;case"type":m=it;break;case"checked":P=it;break;case"defaultChecked":Z=it;break;case"value":c=it;break;case"defaultValue":b=it;break;case"children":case"dangerouslySetInnerHTML":if(it!=null)throw Error(s(137,n));break;default:ke(t,n,r,it,i,null)}}Vp(t,c,b,P,Z,m,l,!1);return;case"select":Te("invalid",t),r=m=c=null;for(l in i)if(i.hasOwnProperty(l)&&(b=i[l],b!=null))switch(l){case"value":c=b;break;case"defaultValue":m=b;break;case"multiple":r=b;default:ke(t,n,l,b,i,null)}n=c,i=m,t.multiple=!!r,n!=null?Kr(t,!!r,n,!1):i!=null&&Kr(t,!!r,i,!0);return;case"textarea":Te("invalid",t),c=l=r=null;for(m in i)if(i.hasOwnProperty(m)&&(b=i[m],b!=null))switch(m){case"value":r=b;break;case"defaultValue":l=b;break;case"children":c=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(s(91));break;default:ke(t,n,m,b,i,null)}kp(t,r,l,c);return;case"option":for(P in i)i.hasOwnProperty(P)&&(r=i[P],r!=null)&&(P==="selected"?t.selected=r&&typeof r!="function"&&typeof r!="symbol":ke(t,n,P,r,i,null));return;case"dialog":Te("beforetoggle",t),Te("toggle",t),Te("cancel",t),Te("close",t);break;case"iframe":case"object":Te("load",t);break;case"video":case"audio":for(r=0;r<Vo.length;r++)Te(Vo[r],t);break;case"image":Te("error",t),Te("load",t);break;case"details":Te("toggle",t);break;case"embed":case"source":case"link":Te("error",t),Te("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(Z in i)if(i.hasOwnProperty(Z)&&(r=i[Z],r!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:ke(t,n,Z,r,i,null)}return;default:if(Uc(n)){for(it in i)i.hasOwnProperty(it)&&(r=i[it],r!==void 0&&Dd(t,n,it,r,i,void 0));return}}for(b in i)i.hasOwnProperty(b)&&(r=i[b],r!=null&&ke(t,n,b,r,i,null))}var yy={};function My(t,n,i,r){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var l=null,c=null,m=null,b=null,P=null,Z=null,it=null;for(et in i){var mt=i[et];if(i.hasOwnProperty(et)&&mt!=null)switch(et){case"checked":break;case"value":break;case"defaultValue":P=mt;default:r.hasOwnProperty(et)||ke(t,n,et,null,r,mt)}}for(var W in r){var et=r[W];if(mt=i[W],r.hasOwnProperty(W)&&(et!=null||mt!=null))switch(W){case"type":et!==mt&&(ge=!0),c=et;break;case"name":et!==mt&&(ge=!0),l=et;break;case"checked":et!==mt&&(ge=!0),Z=et;break;case"defaultChecked":et!==mt&&(ge=!0),it=et;break;case"value":et!==mt&&(ge=!0),m=et;break;case"defaultValue":et!==mt&&(ge=!0),b=et;break;case"children":case"dangerouslySetInnerHTML":if(et!=null)throw Error(s(137,n));break;default:et!==mt&&ke(t,n,W,et,r,mt)}}wc(t,m,b,P,Z,it,c,l);return;case"select":et=m=b=W=null;for(c in i)if(P=i[c],i.hasOwnProperty(c)&&P!=null)switch(c){case"value":break;case"multiple":et=P;default:r.hasOwnProperty(c)||ke(t,n,c,null,r,P)}for(l in r)if(c=r[l],P=i[l],r.hasOwnProperty(l)&&(c!=null||P!=null))switch(l){case"value":c!==P&&(ge=!0),W=c;break;case"defaultValue":c!==P&&(ge=!0),b=c;break;case"multiple":c!==P&&(ge=!0),m=c;default:c!==P&&ke(t,n,l,c,r,P)}n=b,i=m,r=et,W!=null?Kr(t,!!i,W,!1):!!r!=!!i&&(n!=null?Kr(t,!!i,n,!0):Kr(t,!!i,i?[]:"",!1));return;case"textarea":et=W=null;for(b in i)if(l=i[b],i.hasOwnProperty(b)&&l!=null&&!r.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:ke(t,n,b,null,r,l)}for(m in r)if(l=r[m],c=i[m],r.hasOwnProperty(m)&&(l!=null||c!=null))switch(m){case"value":l!==c&&(ge=!0),W=l;break;case"defaultValue":l!==c&&(ge=!0),et=l;break;case"children":break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(s(91));break;default:l!==c&&ke(t,n,m,l,r,c)}Xp(t,W,et);return;case"option":for(var Nt in i)W=i[Nt],i.hasOwnProperty(Nt)&&W!=null&&!r.hasOwnProperty(Nt)&&(Nt==="selected"?t.selected=!1:ke(t,n,Nt,null,r,W));for(P in r)W=r[P],et=i[P],r.hasOwnProperty(P)&&W!==et&&(W!=null||et!=null)&&(P==="selected"?(W!==et&&(ge=!0),t.selected=W&&typeof W!="function"&&typeof W!="symbol"):ke(t,n,P,W,r,et));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var qt in i)W=i[qt],i.hasOwnProperty(qt)&&W!=null&&!r.hasOwnProperty(qt)&&ke(t,n,qt,null,r,W);for(Z in r)if(W=r[Z],et=i[Z],r.hasOwnProperty(Z)&&W!==et&&(W!=null||et!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":if(W!=null)throw Error(s(137,n));break;default:ke(t,n,Z,W,r,et)}return;default:if(Uc(n)){for(var pe in i)W=i[pe],i.hasOwnProperty(pe)&&W!==void 0&&!r.hasOwnProperty(pe)&&Dd(t,n,pe,void 0,r,W);for(it in r)W=r[it],et=i[it],!r.hasOwnProperty(it)||W===et||W===void 0&&et===void 0||Dd(t,n,it,W,r,et);return}}for(var j in i)W=i[j],i.hasOwnProperty(j)&&W!=null&&!r.hasOwnProperty(j)&&ke(t,n,j,null,r,W);for(mt in r)W=r[mt],et=i[mt],!r.hasOwnProperty(mt)||W===et||W==null&&et==null||ke(t,n,mt,W,r,et)}function Jx(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Ey(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,i=performance.getEntriesByType("resource"),r=0;r<i.length;r++){var l=i[r],c=l.transferSize,m=l.initiatorType,b=l.duration;if(c&&b&&Jx(m)){for(m=0,b=l.responseEnd,r+=1;r<i.length;r++){var P=i[r],Z=P.startTime;if(Z>b)break;var it=P.transferSize,mt=P.initiatorType;it&&Jx(mt)&&(P=P.responseEnd,m+=it*(P<b?1:(b-Z)/(P-Z)))}if(--r,n+=8*(c+m)/(l.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Ud=null,Nd=null;function ko(t){return t.nodeType===9?t:t.ownerDocument}function $x(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function tg(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function eg(t,n,i,r){return i=ko(i).createElement(t),i[Ct]=r,i[zt]=n,Dn(i,t,n),Le(i),i}function Ld(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Od=null;function by(){var t=window.event;return t&&t.type==="popstate"?t===Od?!1:(Od=t,!0):(Od=null,!1)}var Pd=typeof setTimeout=="function"?setTimeout:void 0,Ty=typeof clearTimeout=="function"?clearTimeout:void 0,ng=typeof Promise=="function"?Promise:void 0,ig=typeof requestAnimationFrame=="function"?requestAnimationFrame:Pd,Ay=typeof queueMicrotask=="function"?queueMicrotask:typeof ng<"u"?function(t){return ng.resolve(null).then(t).catch(Ry)}:Pd;function Ry(t){setTimeout(function(){throw t})}function Qa(t){return t==="head"}function ag(t,n){var i=n,r=0;do{var l=i.nextSibling;if(t.removeChild(i),l&&l.nodeType===8)if(i=l.data,i==="/$"||i==="/&"){if(r===0){t.removeChild(l),Os(n);return}r--}else if(i==="$"||i==="$?"||i==="$~"||i==="$!"||i==="&")r++;else if(i==="html")Xd(t.ownerDocument.documentElement);else if(i==="head"){i=t.ownerDocument.head,Xd(i);for(var c=i.firstChild;c;){var m=c.nextSibling,b=c.nodeName;c[Ue]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&c.rel.toLowerCase()==="stylesheet"||i.removeChild(c),c=m}}else i==="body"&&Xd(t.ownerDocument.body);i=l}while(i);Os(n)}function rg(t,n){var i=t;t=0;do{var r=i.nextSibling;if(i.nodeType===1?n?(i._stashedDisplay=i.style.display,i.style.display="none"):(i.style.display=i._stashedDisplay||"",i.getAttribute("style")===""&&i.removeAttribute("style")):i.nodeType===3&&(n?(i._stashedText=i.nodeValue,i.nodeValue=""):i.nodeValue=i._stashedText||""),r&&r.nodeType===8)if(i=r.data,i==="/$"){if(t===0)break;t--}else i!=="$"&&i!=="$?"&&i!=="$~"&&i!=="$!"||t++;i=r}while(i)}function sg(t,n,i){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,t.style.viewTransitionName=n,i!=null&&(t.style.viewTransitionClass=i),i=getComputedStyle(t),i.display==="inline"){if(n=t.getClientRects(),n.length===1)var r=1;else for(var l=r=0;l<n.length;l++){var c=n[l];0<c.width&&0<c.height&&r++}r===1&&(t=t.style,t.display=n.length===1?"inline-block":"block",t.marginTop="-"+i.paddingTop,t.marginBottom="-"+i.paddingBottom)}}function og(t,n){t=t.style,n=n.style;var i=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;t.viewTransitionName=i==null||typeof i=="boolean"?"":(""+i).trim(),i=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,t.viewTransitionClass=i==null||typeof i=="boolean"?"":(""+i).trim(),t.display==="inline-block"&&(n==null?t.display=t.margin="":(i=n.display,t.display=i==null||typeof i=="boolean"?"":i,i=n.margin,i!=null?t.margin=i:(i=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],t.marginTop=i==null||typeof i=="boolean"?"":i,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],t.marginBottom=n==null||typeof n=="boolean"?"":n)))}function Cy(t,n,i){return i=i.ownerDocument.defaultView,{rect:t,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=t.bottom&&0<=t.right&&t.top<=i.innerHeight&&t.left<=i.innerWidth}}function zd(t){var n=t.getBoundingClientRect(),i=getComputedStyle(t);return Cy(n,i,t)}function wy(t){return t.documentElement.clientHeight}function Dy(t){this.addEventListener("load",t),this.addEventListener("error",t)}function Uy(t,n,i,r,l,c,m,b,P){var Z=n.nodeType===9?n:n.ownerDocument;try{var it=Z.startViewTransition({update:function(){var W=Z.defaultView,et=W.navigation&&W.navigation.transition,Nt=Z.fonts.status;r();var qt=[];if(Nt==="loaded"&&(wy(Z),Z.fonts.status==="loading"&&qt.push(Z.fonts.ready)),Nt=qt.length,t!==null)for(var pe=t.suspenseyImages,j=0,X=0;X<pe.length;X++){var tt=pe[X];if(!tt.complete){var pt=tt.getBoundingClientRect();if(0<pt.bottom&&0<pt.right&&pt.top<W.innerHeight&&pt.left<W.innerWidth){if(j+=Cg(tt),j>Ou){qt.length=Nt;break}tt=new Promise(Dy.bind(tt)),qt.push(tt)}}}if(0<qt.length)return W=Promise.race([Promise.all(qt),new Promise(function(Gt){return setTimeout(Gt,500)})]).then(l,l),(et?Promise.allSettled([et.finished,W]):W).then(c,c);if(l(),et)return et.finished.then(c,c);c()},types:i});Z.__reactViewTransition=it;var mt=[];return it.ready.then(function(){for(var W=Z.documentElement.getAnimations({subtree:!0}),et=0;et<W.length;et++){var Nt=W[et],qt=Nt.effect,pe=qt.pseudoElement;if(pe!=null&&pe.startsWith("::view-transition")){mt.push(Nt),Nt=qt.getKeyframes();for(var j=pe=void 0,X=!0,tt=0;tt<Nt.length;tt++){var pt=Nt[tt],Gt=pt.width;if(pe===void 0)pe=Gt;else if(pe!==Gt){X=!1;break}if(Gt=pt.height,j===void 0)j=Gt;else if(j!==Gt){X=!1;break}delete pt.width,delete pt.height,pt.transform==="none"&&delete pt.transform}X&&pe!==void 0&&j!==void 0&&(qt.setKeyframes(Nt),X=getComputedStyle(qt.target,qt.pseudoElement),X.width!==pe||X.height!==j)&&(X=Nt[0],X.width=pe,X.height=j,X=Nt[Nt.length-1],X.width=pe,X.height=j,qt.setKeyframes(Nt))}}m()},function(W){Z.__reactViewTransition===it&&(Z.__reactViewTransition=null);try{typeof W=="object"&&W!==null&&W.name==="InvalidStateError"&&(W.message==="View transition was skipped because document visibility state is hidden."||W.message==="Skipping view transition because document visibility state has become hidden."||W.message==="Skipping view transition because viewport size changed."||W.message==="Transition was aborted because of invalid state")&&(W=null),W!==null&&P(W)}finally{r(),l(),m()}}),it.finished.finally(function(){for(var W=0;W<mt.length;W++)mt[W].cancel();Z.__reactViewTransition===it&&(Z.__reactViewTransition=null),b()}),it}catch{return r(),l(),m(),null}}function zr(t,n){this._scope=document.documentElement,this._selector="::view-transition-"+t+"("+n+")"}zr.prototype.animate=function(t,n){return n=typeof n=="number"?{duration:n}:I({},n),n.pseudoElement=this._selector,this._scope.animate(t,n)},zr.prototype.getAnimations=function(){for(var t=this._scope,n=this._selector,i=t.getAnimations({subtree:!0}),r=[],l=0;l<i.length;l++){var c=i[l].effect;c!==null&&c.target===t&&c.pseudoElement===n&&r.push(i[l])}return r},zr.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function lg(t){return{name:t,group:new zr("group",t),imagePair:new zr("image-pair",t),old:new zr("old",t),new:new zr("new",t)}}function ri(t){this._fragmentFiber=t,this._observers=this._eventListeners=null}ri.prototype.addEventListener=function(t,n,i){var r=null,l=null;if(!(i!=null&&typeof i!="boolean"&&(r=i.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var c=this._eventListeners;if(cg(c,t,n,i)===-1){var m=this,b=n;i!=null&&typeof i!="boolean"&&i.once===!0&&(b=function(P){m.removeEventListener(t,n,i),typeof n=="function"?n.call(this,P):n.handleEvent(P)}),r!==null&&(l=m.removeEventListener.bind(m,t,n,i),r.addEventListener("abort",l,{once:!0}),l=r.removeEventListener.bind(r,"abort",l)),r=Cs(i),c.push({type:t,listener:n,optionsOrUseCapture:i,attachedListener:b,cleanup:l}),p(this._fragmentFiber.child,!1,Ny,t,b,r)}this._eventListeners=c}};function Ny(t,n,i,r){return y(t).addEventListener(n,i,r),!1}ri.prototype.removeEventListener=function(t,n,i){var r=this._eventListeners;if(r!==null&&(n=cg(r,t,n,i),n!==-1)){var l=r[n];i=l.attachedListener;var c=l.cleanup;l=Cs(l.optionsOrUseCapture),p(this._fragmentFiber.child,!1,Ly,t,i,l),r.splice(n,1),c!==null&&c()}};function Ly(t,n,i,r){return y(t).removeEventListener(n,i,r),!1}function Cs(t){return t!=null&&typeof t!="boolean"&&(t.once===!0||t.signal instanceof AbortSignal)?{capture:t.capture,passive:t.passive}:t}function ug(t){return t==null?"c=0":typeof t=="boolean"?"c="+(t?"1":"0"):"c="+(t.capture?"1":"0")}function cg(t,n,i,r){if(t.length===0)return-1;r=ug(r);for(var l=0;l<t.length;l++){var c=t[l];if(c.type===n&&c.listener===i&&ug(c.optionsOrUseCapture)===r)return l}return-1}ri.prototype.dispatchEvent=function(t){var n=S(this._fragmentFiber);if(n===null)return!0;n=y(n);var i=this._eventListeners;if(i!==null&&0<i.length||!t.bubbles){var r=n.nodeType===9?n.createComment(""):document.createTextNode("");if(i)for(var l=0;l<i.length;l++){var c=i[l];r.addEventListener(c.type,c.attachedListener,Cs(c.optionsOrUseCapture))}if(n.appendChild(r),t=r.dispatchEvent(t),i)for(l=0;l<i.length;l++)c=i[l],r.removeEventListener(c.type,c.attachedListener,Cs(c.optionsOrUseCapture));return n.removeChild(r),t}return n.dispatchEvent(t)},ri.prototype.focus=function(t){p(this._fragmentFiber.child,!0,fg,t,void 0,void 0)};function fg(t,n){return t.tag===6?!1:(t=y(t),qy(t,n))}ri.prototype.focusLast=function(t){var n=[];p(this._fragmentFiber.child,!0,Id,n,void 0,void 0);for(var i=n.length-1;0<=i&&!fg(n[i],t);i--);};function Id(t,n){return n.push(t),!1}ri.prototype.blur=function(){var t=S(this._fragmentFiber);t!==null&&(t=y(t),t=ko(t).activeElement,t!==null&&p(this._fragmentFiber.child,!1,Oy,t,void 0,void 0))};function Oy(t,n){return t.tag===6?!1:(t=y(t),t===n||t.contains(n)?(n.blur(),!0):!1)}ri.prototype.observeUsing=function(t){this._observers===null&&(this._observers=new Set),this._observers.add(t),p(this._fragmentFiber.child,!1,Py,t,void 0,void 0)};function Py(t,n){return t.tag===6||(t=y(t),n.observe(t)),!1}ri.prototype.unobserveUsing=function(t){var n=this._observers;if(n!==null&&n.has(t)){n.delete(t),p(this._fragmentFiber.child,!1,zy,t,void 0,void 0);for(var i=n=0;i<Di.length;i++){var r=Di[i];r.fragmentInstance===this&&r.observer===t?t.unobserve(r.instance):Di[n++]=r}Di.length=n}};function zy(t,n){return t.tag===6||(t=y(t),n.unobserve(t)),!1}var Di=[],Bd=!1;function Iy(t,n,i){Di.push({fragmentInstance:t,observer:n,instance:i}),Bd||(Bd=!0,Yy(function(){Bd=!1;var r=Di;Di=[];for(var l=0;l<r.length;l++){var c=r[l];c.observer.unobserve(c.instance)}}))}ri.prototype.getClientRects=function(){var t=[];return p(this._fragmentFiber.child,!1,By,t,void 0,void 0),t};function By(t,n){if(t.tag===6){t=t.stateNode;var i=t.ownerDocument.createRange();i.selectNodeContents(t),n.push.apply(n,i.getClientRects())}else t=y(t),n.push.apply(n,t.getClientRects());return!1}ri.prototype.getRootNode=function(t){var n=S(this._fragmentFiber);return n===null?this:y(n).getRootNode(t)},ri.prototype.compareDocumentPosition=function(t){var n=S(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var i=[];p(this._fragmentFiber.child,!1,Id,i,void 0,void 0);var r=y(n);if(i.length===0){if(i=r,M(this._fragmentFiber)){t:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break t}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(i=n)}n=this._fragmentFiber;var l=r=i.compareDocumentPosition(t);return i===t?l=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(i=A(n)[1],i===null?l=Node.DOCUMENT_POSITION_PRECEDING:(t=y(i).compareDocumentPosition(t),l=t===0||t&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),l|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=y(i[0]),l=y(i[i.length-1]);var c=M(this._fragmentFiber)?n.parentElement:r;if(c==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=c.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,c=c.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_CONTAINED_BY;var m=n.compareDocumentPosition(t),b=l.compareDocumentPosition(t),P=m&Node.DOCUMENT_POSITION_CONTAINED_BY||b&Node.DOCUMENT_POSITION_CONTAINED_BY;return b=r&&c&&m&Node.DOCUMENT_POSITION_FOLLOWING&&b&Node.DOCUMENT_POSITION_PRECEDING,n=r&&n===t||c&&l===t||P||b?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&n===t||!c&&l===t?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:m,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Fy(n,this._fragmentFiber,i[0],i[i.length-1],t)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Fy(t,n,i,r,l){var c=Ce(l);if(t&Node.DOCUMENT_POSITION_CONTAINED_BY){if(i=!!c)t:{for(;c!==null;){if(c.tag===7&&(c===n||c.alternate===n)){i=!0;break t}c=c.return}i=!1}return i}if(t&Node.DOCUMENT_POSITION_CONTAINS){if(c===null)return c=l.ownerDocument,l===c||l===c.documentElement||l===c.body;t:{for(c=n,n=S(n);c!==null;){if(!(c.tag!==5&&c.tag!==3&&c.tag!==27||c!==n&&c.alternate!==n)){c=!0;break t}c=c.return}c=!1}return c}return t&Node.DOCUMENT_POSITION_PRECEDING?((n=!!c)&&!(n=c===i)&&(n=N(i,c,V),n===null?n=!1:(p(n,!0,O,c,i),c=v,v=null,n=c!==null)),n):t&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!c)&&!(n=c===r)&&(n=N(r,c,V),n===null?n=!1:(p(n,!0,z,c,r),c=v,L=v=null,n=c!==null)),n):!1}function dg(t,n){var i=t.ownerDocument.createRange();i.selectNodeContents(t),t=i.getBoundingClientRect(),window.scrollTo(window.scrollX+t.left,n?window.scrollY+t.top:window.scrollY+t.bottom-window.innerHeight)}ri.prototype.scrollIntoView=function(t){if(typeof t=="object")throw Error(s(566));var n=[];p(this._fragmentFiber.child,!1,Id,n,void 0,void 0);var i=t!==!1;if(n.length===0){var r=A(this._fragmentFiber);if(r=i?r[1]||r[0]||S(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){t=y(r),dg(t,i);return}if(r=y(r),r.nodeType!==9){if(r.nodeType===11){i="host"in r?r.host:null,i!==null&&i.scrollIntoView(t);return}r.scrollIntoView(t)}}for(r=i?n.length-1:0;r!==(i?-1:n.length);){var l=n[r];l.tag===6?(l=y(l),dg(l,i)):y(l).scrollIntoView(t),r+=i?-1:1}};function Hy(t,n){return t=y(t),hg(t,n),!1}function hg(t,n){t.reactFragments==null&&(t.reactFragments=new Set),t.reactFragments.add(n)}function pg(t,n){var i=n._eventListeners;if(i!==null)for(var r=0;r<i.length;r++){var l=i[r];t.addEventListener(l.type,l.attachedListener,Cs(l.optionsOrUseCapture))}t.nodeType!==3&&(i=n._observers,i!==null&&i.forEach(function(c){for(var m=0,b=0;b<Di.length;b++){var P=Di[b];(P.fragmentInstance!==n||P.observer!==c||P.instance!==t)&&(Di[m++]=P)}Di.length=m,c.observe(t)}),hg(t,n))}function Gy(t,n){var i=n._eventListeners;if(i!==null)for(var r=0;r<i.length;r++){var l=i[r];t.removeEventListener(l.type,l.attachedListener,Cs(l.optionsOrUseCapture))}t.nodeType!==3&&(i=n._observers,i!==null&&i.forEach(function(c){typeof c.rootMargin=="string"?Iy(n,c,t):c.unobserve(t)}),t.reactFragments!=null&&t.reactFragments.delete(n))}function Fd(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var i=n;switch(n=n.nextSibling,i.nodeName){case"HTML":case"HEAD":case"BODY":Fd(i),Ke(i);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(i.rel.toLowerCase()==="stylesheet")continue}t.removeChild(i)}}function Vy(t,n,i,r){for(;t.nodeType===1;){var l=i;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!r&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(r){if(!t[Ue])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(c=t.getAttribute("rel"),c==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(c!==l.rel||t.getAttribute("href")!==(l.href==null||l.href===""?null:l.href)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin)||t.getAttribute("title")!==(l.title==null?null:l.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(c=t.getAttribute("src"),(c!==(l.src==null?null:l.src)||t.getAttribute("type")!==(l.type==null?null:l.type)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin))&&c&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var c=l.name==null?null:""+l.name;if(l.type==="hidden"&&t.getAttribute("name")===c)return t}else return t;if(t=vi(t.nextSibling),t===null)break}return null}function Xy(t,n,i){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!i||(t=vi(t.nextSibling),t===null))return null;return t}function mg(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=vi(t.nextSibling),t===null))return null;return t}function Hd(t){return t.data==="$?"||t.data==="$~"}function Gd(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function ky(t,n){var i=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||i.readyState!=="loading")n();else{var r=function(){n(),i.removeEventListener("DOMContentLoaded",r)};i.addEventListener("DOMContentLoaded",r),t._reactRetry=r}}function vi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Vd=null;function xg(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var i=t.data;if(i==="/$"||i==="/&"){if(n===0)return vi(t.nextSibling);n--}else i!=="$"&&i!=="$!"&&i!=="$?"&&i!=="$~"&&i!=="&"||n++}t=t.nextSibling}return null}function gg(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var i=t.data;if(i==="$"||i==="$!"||i==="$?"||i==="$~"||i==="&"){if(n===0)return t;n--}else i!=="/$"&&i!=="/&"||n++}t=t.previousSibling}return null}function qy(t,n){function i(){r=!0}if(t.ownerDocument.activeElement===t)return!0;var r=!1;try{t.ownerDocument.addEventListener("focus",i,!0),(t.focus||HTMLElement.prototype.focus).call(t,n)}finally{t.ownerDocument.removeEventListener("focus",i,!0)}return r}function Yy(t){ig(function(){ig(function(n){return t(n)})})}function _g(t,n,i){switch(n=ko(i),t){case"html":if(t=n.documentElement,!t)throw Error(s(452));return t;case"head":if(t=n.head,!t)throw Error(s(453));return t;case"body":if(t=n.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function vg(t,n,i){for(var r in i){var l=i[r];i.hasOwnProperty(r)&&l!=null&&ke(t,n,r,null,yy,l)}i.dangerouslySetInnerHTML!=null&&(t.textContent=""),t.onclick===Fi&&(t.onclick=null),Ke(t)}function Xd(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Ke(t)}var Si=new Map,Sg=new Set;function qo(t){if(typeof t.getRootNode=="function"){var n=t.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return t.nodeType===9?t:t.ownerDocument}var xa=Lt.d;Lt.d={f:Wy,r:jy,D:Zy,C:Ky,L:Qy,m:Jy,X:tM,S:$y,M:eM};function Wy(){var t=xa.f(),n=Tu();return t||n}function jy(t){var n=jt(t);n!==null&&n.tag===5&&n.type==="form"?Mm(n):xa.r(t)}var ws=typeof document>"u"?null:document;function yg(t,n,i){var r=ws;if(r&&typeof n=="string"&&n){var l=di(n);l='link[rel="'+t+'"][href="'+l+'"]',typeof i=="string"&&(l+='[crossorigin="'+i+'"]'),Sg.has(l)||(Sg.add(l),t={rel:t,crossOrigin:i,href:n},r.querySelector(l)===null&&(n=r.createElement("link"),Dn(n,"link",t),Le(n),r.head.appendChild(n)))}}function Zy(t){xa.D(t),yg("dns-prefetch",t,null)}function Ky(t,n){xa.C(t,n),yg("preconnect",t,n)}function Qy(t,n,i){xa.L(t,n,i);var r=ws;if(r&&t&&n){var l='link[rel="preload"][as="'+di(n)+'"]';n==="image"&&i&&i.imageSrcSet?(l+='[imagesrcset="'+di(i.imageSrcSet)+'"]',typeof i.imageSizes=="string"&&(l+='[imagesizes="'+di(i.imageSizes)+'"]')):l+='[href="'+di(t)+'"]';var c=l;switch(n){case"style":c=Ds(t);break;case"script":c=Us(t)}if(!(Si.has(c)||(t=I({rel:"preload",href:n==="image"&&i&&i.imageSrcSet?void 0:t,as:n},i),Si.set(c,t),r.querySelector(l)!==null||n==="style"&&r.querySelector(Yo(c))||n==="script"&&r.querySelector(Wo(c))))){var m=r.createElement("link");Dn(m,"link",t),n==="style"&&(m[Ze]=!0,m.onload=m.onerror=function(){na(m)}),Le(m),r.head.appendChild(m)}}}function Jy(t,n){xa.m(t,n);var i=ws;if(i&&t){var r=n&&typeof n.as=="string"?n.as:"script",l='link[rel="modulepreload"][as="'+di(r)+'"][href="'+di(t)+'"]',c=l;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":c=Us(t)}if(!Si.has(c)&&(t=I({rel:"modulepreload",href:t},n),Si.set(c,t),i.querySelector(l)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(i.querySelector(Wo(c)))return}r=i.createElement("link"),Dn(r,"link",t),Le(r),i.head.appendChild(r)}}}function $y(t,n,i){xa.S(t,n,i);var r=ws;if(r&&t){var l=ye(r).hoistableStyles,c=Ds(t);n=n||"default";var m=l.get(c);if(!m){var b={loading:0,preload:null};if(m=r.querySelector(Yo(c)))b.loading=5;else{t=I({rel:"stylesheet",href:t,"data-precedence":n},i),(i=Si.get(c))&&kd(t,i);var P=m=r.createElement("link");Le(P),Dn(P,"link",t),P._p=new Promise(function(Z,it){P.onload=Z,P.onerror=it}),P.addEventListener("load",function(){b.loading|=1}),P.addEventListener("error",function(){b.loading|=2}),b.loading|=4,Nu(m,n,r)}m={type:"stylesheet",instance:m,count:1,state:b},l.set(c,m)}}}function tM(t,n){xa.X(t,n);var i=ws;if(i&&t){var r=ye(i).hoistableScripts,l=Us(t),c=r.get(l);c||(c=i.querySelector(Wo(l)),c||(t=I({src:t,async:!0},n),(n=Si.get(l))&&qd(t,n),c=i.createElement("script"),Le(c),Dn(c,"link",t),i.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},r.set(l,c))}}function eM(t,n){xa.M(t,n);var i=ws;if(i&&t){var r=ye(i).hoistableScripts,l=Us(t),c=r.get(l);c||(c=i.querySelector(Wo(l)),c||(t=I({src:t,async:!0,type:"module"},n),(n=Si.get(l))&&qd(t,n),c=i.createElement("script"),Le(c),Dn(c,"link",t),i.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},r.set(l,c))}}function Mg(t,n,i,r){var l=(l=Yt.current)?qo(l):null;if(!l)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof i.precedence=="string"&&typeof i.href=="string"?(i=Ds(i.href),n=ye(l).hoistableStyles,r=n.get(i),r||(r={type:"style",instance:null,count:0,state:null},n.set(i,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(i.rel==="stylesheet"&&typeof i.href=="string"&&typeof i.precedence=="string"){t=Ds(i.href);var c=ye(l).hoistableStyles,m=c.get(t);if(m||(l=l.ownerDocument||l,m={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},c.set(t,m),(c=l.querySelector(Yo(t)))?c._p||(m.instance=c,m.state.loading=5):(c=Si.get(t),c||(c={rel:"preload",as:"style",href:i.href,crossOrigin:i.crossOrigin,integrity:i.integrity,media:i.media,hrefLang:i.hrefLang,referrerPolicy:i.referrerPolicy},Si.set(t,c)),nM(l,t,c,m.state))),n&&r===null)throw Error(s(528,""));return m}if(n&&r!==null)throw Error(s(529,""));return null;case"script":return n=i.async,i=i.src,typeof i=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(i=Us(i),n=ye(l).hoistableScripts,r=n.get(i),r||(r={type:"script",instance:null,count:0,state:null},n.set(i,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function Ds(t){return'href="'+di(t)+'"'}function Yo(t){return'link[rel="stylesheet"]['+t+"]"}function Eg(t){return I({},t,{"data-precedence":t.precedence,precedence:null})}function nM(t,n,i,r){if(n=t.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ze]!==!0){r.loading=1;return}}else n=t.createElement("link"),n[Ze]=!0,n.onload=n.onerror=na.bind(null,n),Dn(n,"link",i),Le(n),t.head.appendChild(n);r.preload=n,n.addEventListener("load",function(){return r.loading|=1}),n.addEventListener("error",function(){return r.loading|=2})}function Us(t){return'[src="'+di(t)+'"]'}function Wo(t){return"script[async]"+t}function bg(t,n,i){if(n.count++,n.instance===null)switch(n.type){case"style":var r=t.querySelector('style[data-href~="'+di(i.href)+'"]');if(r)return n.instance=r,Le(r),r;var l=I({},i,{"data-href":i.href,"data-precedence":i.precedence,href:null,precedence:null});return r=(t.ownerDocument||t).createElement("style"),Le(r),Dn(r,"style",l),Nu(r,i.precedence,t),n.instance=r;case"stylesheet":l=Ds(i.href);var c=t.querySelector(Yo(l));if(c)return n.state.loading|=4,n.instance=c,Le(c),c;r=Eg(i),(l=Si.get(l))&&kd(r,l),c=(t.ownerDocument||t).createElement("link"),Le(c);var m=c;return m._p=new Promise(function(b,P){m.onload=b,m.onerror=P}),Dn(c,"link",r),n.state.loading|=4,Nu(c,i.precedence,t),n.instance=c;case"script":return c=Us(i.src),(l=t.querySelector(Wo(c)))?(n.instance=l,Le(l),l):(r=i,(l=Si.get(c))&&(r=I({},i),qd(r,l)),t=t.ownerDocument||t,l=t.createElement("script"),Le(l),Dn(l,"link",r),t.head.appendChild(l),n.instance=l);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(r=n.instance,n.state.loading|=4,Nu(r,i.precedence,t));return n.instance}function Nu(t,n,i){for(var r=i.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),l=r.length?r[r.length-1]:null,c=l,m=0;m<r.length;m++){var b=r[m];if(b.dataset.precedence===n)c=b;else if(c!==l)break}c?c.parentNode.insertBefore(t,c.nextSibling):(n=i.nodeType===9?i.head:i,n.insertBefore(t,n.firstChild))}function kd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function qd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Lu=null;function Tg(t,n,i){if(Lu===null){var r=new Map,l=Lu=new Map;l.set(i,r)}else l=Lu,r=l.get(i),r||(r=new Map,l.set(i,r));if(r.has(t))return r;for(r.set(t,null),i=i.getElementsByTagName(t),l=0;l<i.length;l++){var c=i[l];if(!(c[Ue]||c[Ct]||t==="link"&&c.getAttribute("rel")==="stylesheet")&&c.namespaceURI!=="http://www.w3.org/2000/svg"){var m=c.getAttribute(n)||"";m=t+m;var b=r.get(m);b?b.push(c):r.set(m,[c])}}return r}function Yd(t,n,i){t=t.ownerDocument||t,t.head.insertBefore(i,n==="title"?t.querySelector("head > title"):null)}function iM(t,n,i){if(i===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Ag(t,n){return t==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function Rg(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function Cg(t){return(t.width||100)*(t.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function wg(t,n){typeof n.decode=="function"&&(t.imgCount++,n.complete||(t.imgBytes+=Cg(n),t.suspenseyImages.push(n)),t=sM.bind(t),n.decode().then(t,t))}function aM(t,n,i,r){if(i.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(i.state.loading&4)===0){if(i.instance===null){var l=Ds(r.href),c=n.querySelector(Yo(l));if(c){n=c._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=jo.bind(t),n.then(t,t)),i.state.loading|=4,i.instance=c,Le(c);return}c=n.ownerDocument||n,r=Eg(r),(l=Si.get(l))&&kd(r,l),c=c.createElement("link"),Le(c);var m=c;m._p=new Promise(function(b,P){m.onload=b,m.onerror=P}),Dn(c,"link",r),i.instance=c}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(i,n),(n=i.state.preload)&&(i.state.loading&3)===0&&(t.count++,i=jo.bind(t),n.addEventListener("load",i),n.addEventListener("error",i))}}var Ou=0;function rM(t,n){return t.stylesheets&&t.count===0&&zu(t,t.stylesheets),0<t.count||0<t.imgCount?function(i){var r=setTimeout(function(){if(t.stylesheets&&zu(t,t.stylesheets),t.unsuspend){var c=t.unsuspend;t.unsuspend=null,c()}},6e4+n);0<t.imgBytes&&Ou===0&&(Ou=62500*Ey());var l=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&zu(t,t.stylesheets),t.unsuspend)){var c=t.unsuspend;t.unsuspend=null,c()}},(t.imgBytes>Ou?50:800)+n);return t.unsuspend=i,function(){t.unsuspend=null,clearTimeout(r),clearTimeout(l)}}:null}function Dg(t){if(t.count===0&&(t.imgCount===0||!t.waitingForImages)){if(t.stylesheets)zu(t,t.stylesheets);else if(t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}}}function jo(){this.count--,Dg(this)}function sM(){this.imgCount--,Dg(this)}var Pu=null;function zu(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Pu=new Map,n.forEach(oM,t),Pu=null,jo.call(t))}function oM(t,n){if(!(n.state.loading&4)){var i=Pu.get(t);if(i)var r=i.get(null);else{i=new Map,Pu.set(t,i);for(var l=t.querySelectorAll("link[data-precedence],style[data-precedence]"),c=0;c<l.length;c++){var m=l[c];(m.nodeName==="LINK"||m.getAttribute("media")!=="not all")&&(i.set(m.dataset.precedence,m),r=m)}r&&i.set(null,r)}l=n.instance,m=l.getAttribute("data-precedence"),c=i.get(m)||r,c===r&&i.set(null,l),i.set(m,l),this.count++,r=jo.bind(this),l.addEventListener("load",r),l.addEventListener("error",r),c?c.parentNode.insertBefore(l,c.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(l,t.firstChild)),n.state.loading|=4}}var Ns={$$typeof:ct,Provider:null,Consumer:null,_currentValue:ae,_currentValue2:ae,_threadCount:0};function lM(t,n,i,r,l,c,m,b,P){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=oo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=oo(0),this.hiddenUpdates=oo(null),this.identifierPrefix=r,this.onUncaughtError=l,this.onCaughtError=c,this.onRecoverableError=m,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=P,this.transitionTypes=null,this.incompleteTransitions=new Map}function Ug(t,n,i,r,l,c,m,b,P,Z,it,mt){return t=new lM(t,n,i,m,P,Z,it,mt,b),n=1,c===!0&&(n|=24),c=qn(3,null,null,n),t.current=c,c.stateNode=t,n=of(),n.refCount++,t.pooledCache=n,n.refCount++,c.memoizedState={element:r,isDehydrated:i,cache:n},ff(c),t}function Ng(t){return t?(t=as,t):as}function Lg(t,n,i,r,l,c){l=Ng(l),r.context===null?r.context=l:r.pendingContext=l,r=Fa(n),r.payload={element:i},c=c===void 0?null:c,c!==null&&(r.callback=c),i=Ha(t,r,n),i!==null&&(Zn(i,t,n),To(i,t,n))}function Og(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var i=t.retryLane;t.retryLane=i!==0&&i<n?i:n}}function Wd(t,n){Og(t,n),(t=t.alternate)&&Og(t,n)}function Pg(t){if(t.tag===13||t.tag===31){var n=vr(t,67108864);n!==null&&Zn(n,t,67108864),Wd(t,67108864)}}function zg(t){if(t.tag===13||t.tag===31){var n=ai();n=Q(n);var i=vr(t,n);i!==null&&Zn(i,t,n),Wd(t,n)}}var Ls=!0;function uM(t,n,i,r){var l=Mt.T;Mt.T=null;var c=Lt.p;try{Lt.p=2,jd(t,n,i,r)}finally{Lt.p=c,Mt.T=l}}function cM(t,n,i,r){var l=Mt.T;Mt.T=null;var c=Lt.p;try{Lt.p=8,jd(t,n,i,r)}finally{Lt.p=c,Mt.T=l}}function jd(t,n,i,r){if(Ls){var l=Zd(r);if(l===null)wd(t,n,r,Iu,i),Bg(t,r);else if(dM(l,t,n,i,r))r.stopPropagation();else if(Bg(t,r),n&4&&-1<fM.indexOf(t)){for(;l!==null;){var c=jt(l);if(c!==null)switch(c.tag){case 3:if(c=c.stateNode,c.current.memoizedState.isDehydrated){var m=fi(c.pendingLanes);if(m!==0){var b=c;for(b.pendingLanes|=2,b.entangledLanes|=2;m;){var P=1<<31-In(m);b.entanglements[1]|=P,m&=~P}Zi(c),(Be&6)===0&&(Mu=F()+500,Go(0))}}break;case 31:case 13:b=vr(c,2),b!==null&&Zn(b,c,2),Tu(),Wd(c,2)}if(c=Zd(r),c===null&&wd(t,n,r,Iu,i),c===l)break;l=c}l!==null&&r.stopPropagation()}else wd(t,n,r,null,i)}}function Zd(t){return t=Lc(t),Kd(t)}var Iu=null;function Kd(t){if(Iu=null,t=Ce(t),t!==null){var n=f(t);if(n===null)t=null;else{var i=n.tag;if(i===13){if(t=d(n),t!==null)return t;t=null}else if(i===31){if(t=h(n),t!==null)return t;t=null}else if(i===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Iu=t,null}function Ig(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Pt()){case Dt:return 2;case Ut:return 8;case At:case yt:return 32;case kt:return 268435456;default:return 32}default:return 32}}var Qd=!1,Ja=null,$a=null,tr=null,Zo=new Map,Ko=new Map,er=[],fM="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Bg(t,n){switch(t){case"focusin":case"focusout":Ja=null;break;case"dragenter":case"dragleave":$a=null;break;case"mouseover":case"mouseout":tr=null;break;case"pointerover":case"pointerout":Zo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ko.delete(n.pointerId)}}function Qo(t,n,i,r,l,c){return t===null||t.nativeEvent!==c?(t={blockedOn:n,domEventName:i,eventSystemFlags:r,nativeEvent:c,targetContainers:[l]},n!==null&&(n=jt(n),n!==null&&Pg(n)),t):(t.eventSystemFlags|=r,n=t.targetContainers,l!==null&&n.indexOf(l)===-1&&n.push(l),t)}function dM(t,n,i,r,l){switch(n){case"focusin":return Ja=Qo(Ja,t,n,i,r,l),!0;case"dragenter":return $a=Qo($a,t,n,i,r,l),!0;case"mouseover":return tr=Qo(tr,t,n,i,r,l),!0;case"pointerover":var c=l.pointerId;return Zo.set(c,Qo(Zo.get(c)||null,t,n,i,r,l)),!0;case"gotpointercapture":return c=l.pointerId,Ko.set(c,Qo(Ko.get(c)||null,t,n,i,r,l)),!0}return!1}function Fg(t){var n=Ce(t.target);if(n!==null){var i=f(n);if(i!==null){if(n=i.tag,n===13){if(n=d(i),n!==null){t.blockedOn=n,$(t.priority,function(){zg(i)});return}}else if(n===31){if(n=h(i),n!==null){t.blockedOn=n,$(t.priority,function(){zg(i)});return}}else if(n===3&&i.stateNode.current.memoizedState.isDehydrated){t.blockedOn=i.tag===3?i.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Bu(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var i=Zd(t.nativeEvent);if(i===null){i=t.nativeEvent;var r=new i.constructor(i.type,i);Nc=r,i.target.dispatchEvent(r),Nc=null}else return n=jt(i),n!==null&&Pg(n),t.blockedOn=i,!1;n.shift()}return!0}function Hg(t,n,i){Bu(t)&&i.delete(n)}function hM(){Qd=!1,Ja!==null&&Bu(Ja)&&(Ja=null),$a!==null&&Bu($a)&&($a=null),tr!==null&&Bu(tr)&&(tr=null),Zo.forEach(Hg),Ko.forEach(Hg)}function Fu(t,n){t.blockedOn===n&&(t.blockedOn=null,Qd||(Qd=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,hM)))}var Hu=null;function Gg(t){Hu!==t&&(Hu=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){Hu===t&&(Hu=null);for(var n=0;n<t.length;n+=3){var i=t[n],r=t[n+1],l=t[n+2];if(typeof r!="function"){if(Kd(r||i)===null)continue;break}var c=jt(i);c!==null&&(t.splice(n,3),n-=3,Nf(c,{pending:!0,data:l,method:i.method,action:r},r,l))}}))}function Os(t){function n(P){return Fu(P,t)}Ja!==null&&Fu(Ja,t),$a!==null&&Fu($a,t),tr!==null&&Fu(tr,t),Zo.forEach(n),Ko.forEach(n);for(var i=0;i<er.length;i++){var r=er[i];r.blockedOn===t&&(r.blockedOn=null)}for(;0<er.length&&(i=er[0],i.blockedOn===null);)Fg(i),i.blockedOn===null&&er.shift();if(i=(t.ownerDocument||t).$$reactFormReplay,i!=null)for(r=0;r<i.length;r+=3){var l=i[r],c=i[r+1],m=l[zt]||null;if(typeof c=="function")m||Gg(i);else if(m){var b=null;if(c&&c.hasAttribute("formAction")){if(l=c,m=c[zt]||null)b=m.formAction;else if(Kd(l)!==null)continue}else b=m.action;typeof b=="function"?i[r+1]=b:(i.splice(r,3),r-=3),Gg(i)}}}function Vg(){function t(c){c.canIntercept&&c.info==="react-transition"&&c.intercept({handler:function(){return new Promise(function(m){return l=m})},focusReset:"manual",scroll:"manual"})}function n(){l!==null&&(l(),l=null),r||setTimeout(i,20)}function i(){if(!r&&!navigation.transition){var c=navigation.currentEntry;c&&c.url!=null&&navigation.navigate(c.url,{state:c.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,l=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(i,100),function(){r=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),l!==null&&(l(),l=null)}}}function Jd(t){this._internalRoot=t}Gu.prototype.render=Jd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(s(409));var i=n.current,r=ai();Lg(i,r,t,n,null,null)},Gu.prototype.unmount=Jd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;Lg(t.current,2,null,t,null,null),Tu(),n[Bt]=null}};function Gu(t){this._internalRoot=t}Gu.prototype.unstable_scheduleHydration=function(t){if(t){var n=ot();t={blockedOn:null,target:t,priority:n};for(var i=0;i<er.length&&n!==0&&n<er[i].priority;i++);er.splice(i,0,t),i===0&&Fg(t)}};var Xg=e.version;if(Xg!=="19.3.1")throw Error(s(527,Xg,"19.3.1"));Lt.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=x(n),t=t!==null?_(t):null,t=t===null?null:t.stateNode,t};var pM={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:Mt,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vu.isDisabled&&Vu.supportsFiber)try{De=Vu.inject(pM),tn=Vu}catch{}}return Jo.createRoot=function(t,n){if(!u(t))throw Error(s(299));var i=!1,r="",l=Nm,c=Lm,m=Om;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(m=n.onRecoverableError)),n=Ug(t,1,!1,null,null,i,r,null,l,c,m,Vg),t[Bt]=n.current,Cd(t),new Jd(n)},Jo.hydrateRoot=function(t,n,i){if(!u(t))throw Error(s(299));var r=!1,l="",c=Nm,m=Lm,b=Om,P=null;return i!=null&&(i.unstable_strictMode===!0&&(r=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onUncaughtError!==void 0&&(c=i.onUncaughtError),i.onCaughtError!==void 0&&(m=i.onCaughtError),i.onRecoverableError!==void 0&&(b=i.onRecoverableError),i.formState!==void 0&&(P=i.formState)),n=Ug(t,1,!0,n,i??null,r,l,P,c,m,b,Vg),n.context=Ng(null),i=n.current,r=ai(),r=Q(r),l=Fa(r),l.callback=null,Ha(i,l,r),i=r,n.current.lanes=i,xr(n,i),Zi(n),t[Bt]=n.current,Cd(t),new Gu(n)},Jo.version="19.3.1",Jo}var Qg;function EM(){if(Qg)return th.exports;Qg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),th.exports=MM(),th.exports}var bM=EM();const Cp="181",TM=0,Jg=1,AM=2,iv=1,RM=2,Ea=3,dr=0,Qn=1,Qi=2,Aa=0,Zs=1,$g=2,t_=3,e_=4,CM=5,kr=100,wM=101,DM=102,UM=103,NM=104,LM=200,OM=201,PM=202,zM=203,Ih=204,Bh=205,IM=206,BM=207,FM=208,HM=209,GM=210,VM=211,XM=212,kM=213,qM=214,Fh=0,Hh=1,Gh=2,Qs=3,Vh=4,Xh=5,kh=6,qh=7,av=0,YM=1,WM=2,fr=0,jM=1,ZM=2,KM=3,QM=4,JM=5,$M=6,tE=7,rv=300,Js=301,$s=302,Yh=303,Wh=304,Mc=306,jh=1e3,ba=1001,Zh=1002,ui=1003,eE=1004,Xu=1005,Ei=1006,ah=1007,Yr=1008,$i=1009,sv=1010,ov=1011,ll=1012,wp=1013,jr=1014,Ta=1015,no=1016,Dp=1017,Up=1018,ul=1020,lv=35902,uv=35899,cv=1021,fv=1022,Pi=1023,cl=1026,fl=1027,dv=1028,Np=1029,Lp=1030,Op=1031,Pp=1033,dc=33776,hc=33777,pc=33778,mc=33779,Kh=35840,Qh=35841,Jh=35842,$h=35843,tp=36196,ep=37492,np=37496,ip=37808,ap=37809,rp=37810,sp=37811,op=37812,lp=37813,up=37814,cp=37815,fp=37816,dp=37817,hp=37818,pp=37819,mp=37820,xp=37821,gp=36492,_p=36494,vp=36495,Sp=36283,yp=36284,Mp=36285,Ep=36286,nE=3200,iE=3201,hv=0,aE=1,ur="",li="srgb",to="srgb-linear",gc="linear",We="srgb",Ps=7680,n_=519,rE=512,sE=513,oE=514,pv=515,lE=516,uE=517,cE=518,fE=519,i_=35044,a_="300 es",Ji=2e3,_c=2001;function mv(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function vc(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function dE(){const o=vc("canvas");return o.style.display="block",o}const r_={};function s_(...o){const e="THREE."+o.shift();console.log(e,...o)}function me(...o){const e="THREE."+o.shift();console.warn(e,...o)}function cn(...o){const e="THREE."+o.shift();console.error(e,...o)}function dl(...o){const e=o.join(" ");e in r_||(r_[e]=!0,me(...o))}function hE(o,e,a){return new Promise(function(s,u){function f(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:u();break;case o.TIMEOUT_EXPIRED:setTimeout(f,a);break;default:s()}}setTimeout(f,a)})}class io{addEventListener(e,a){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(a)===-1&&s[e].push(a)}hasEventListener(e,a){const s=this._listeners;return s===void 0?!1:s[e]!==void 0&&s[e].indexOf(a)!==-1}removeEventListener(e,a){const s=this._listeners;if(s===void 0)return;const u=s[e];if(u!==void 0){const f=u.indexOf(a);f!==-1&&u.splice(f,1)}}dispatchEvent(e){const a=this._listeners;if(a===void 0)return;const s=a[e.type];if(s!==void 0){e.target=this;const u=s.slice(0);for(let f=0,d=u.length;f<d;f++)u[f].call(this,e);e.target=null}}}const Pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rh=Math.PI/180,bp=180/Math.PI;function hl(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,a=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(Pn[o&255]+Pn[o>>8&255]+Pn[o>>16&255]+Pn[o>>24&255]+"-"+Pn[e&255]+Pn[e>>8&255]+"-"+Pn[e>>16&15|64]+Pn[e>>24&255]+"-"+Pn[a&63|128]+Pn[a>>8&255]+"-"+Pn[a>>16&255]+Pn[a>>24&255]+Pn[s&255]+Pn[s>>8&255]+Pn[s>>16&255]+Pn[s>>24&255]).toLowerCase()}function we(o,e,a){return Math.max(e,Math.min(a,o))}function pE(o,e){return(o%e+e)%e}function sh(o,e,a){return(1-a)*o+a*e}function $o(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Kn(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}class ze{constructor(e=0,a=0){ze.prototype.isVector2=!0,this.x=e,this.y=a}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,a){return this.x=e,this.y=a,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const a=this.x,s=this.y,u=e.elements;return this.x=u[0]*a+u[3]*s+u[6],this.y=u[1]*a+u[4]*s+u[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,a){return this.x=we(this.x,e.x,a.x),this.y=we(this.y,e.y,a.y),this}clampScalar(e,a){return this.x=we(this.x,e,a),this.y=we(this.y,e,a),this}clampLength(e,a){const s=this.length();return this.divideScalar(s||1).multiplyScalar(we(s,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const a=Math.sqrt(this.lengthSq()*e.lengthSq());if(a===0)return Math.PI/2;const s=this.dot(e)/a;return Math.acos(we(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const a=this.x-e.x,s=this.y-e.y;return a*a+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this}lerpVectors(e,a,s){return this.x=e.x+(a.x-e.x)*s,this.y=e.y+(a.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this}rotateAround(e,a){const s=Math.cos(a),u=Math.sin(a),f=this.x-e.x,d=this.y-e.y;return this.x=f*s-d*u+e.x,this.y=f*u+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pl{constructor(e=0,a=0,s=0,u=1){this.isQuaternion=!0,this._x=e,this._y=a,this._z=s,this._w=u}static slerpFlat(e,a,s,u,f,d,h){let g=s[u+0],x=s[u+1],_=s[u+2],p=s[u+3],S=f[d+0],M=f[d+1],A=f[d+2],C=f[d+3];if(h<=0){e[a+0]=g,e[a+1]=x,e[a+2]=_,e[a+3]=p;return}if(h>=1){e[a+0]=S,e[a+1]=M,e[a+2]=A,e[a+3]=C;return}if(p!==C||g!==S||x!==M||_!==A){let y=g*S+x*M+_*A+p*C;y<0&&(S=-S,M=-M,A=-A,C=-C,y=-y);let v=1-h;if(y<.9995){const L=Math.acos(y),O=Math.sin(L);v=Math.sin(v*L)/O,h=Math.sin(h*L)/O,g=g*v+S*h,x=x*v+M*h,_=_*v+A*h,p=p*v+C*h}else{g=g*v+S*h,x=x*v+M*h,_=_*v+A*h,p=p*v+C*h;const L=1/Math.sqrt(g*g+x*x+_*_+p*p);g*=L,x*=L,_*=L,p*=L}}e[a]=g,e[a+1]=x,e[a+2]=_,e[a+3]=p}static multiplyQuaternionsFlat(e,a,s,u,f,d){const h=s[u],g=s[u+1],x=s[u+2],_=s[u+3],p=f[d],S=f[d+1],M=f[d+2],A=f[d+3];return e[a]=h*A+_*p+g*M-x*S,e[a+1]=g*A+_*S+x*p-h*M,e[a+2]=x*A+_*M+h*S-g*p,e[a+3]=_*A-h*p-g*S-x*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,a,s,u){return this._x=e,this._y=a,this._z=s,this._w=u,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,a=!0){const s=e._x,u=e._y,f=e._z,d=e._order,h=Math.cos,g=Math.sin,x=h(s/2),_=h(u/2),p=h(f/2),S=g(s/2),M=g(u/2),A=g(f/2);switch(d){case"XYZ":this._x=S*_*p+x*M*A,this._y=x*M*p-S*_*A,this._z=x*_*A+S*M*p,this._w=x*_*p-S*M*A;break;case"YXZ":this._x=S*_*p+x*M*A,this._y=x*M*p-S*_*A,this._z=x*_*A-S*M*p,this._w=x*_*p+S*M*A;break;case"ZXY":this._x=S*_*p-x*M*A,this._y=x*M*p+S*_*A,this._z=x*_*A+S*M*p,this._w=x*_*p-S*M*A;break;case"ZYX":this._x=S*_*p-x*M*A,this._y=x*M*p+S*_*A,this._z=x*_*A-S*M*p,this._w=x*_*p+S*M*A;break;case"YZX":this._x=S*_*p+x*M*A,this._y=x*M*p+S*_*A,this._z=x*_*A-S*M*p,this._w=x*_*p-S*M*A;break;case"XZY":this._x=S*_*p-x*M*A,this._y=x*M*p-S*_*A,this._z=x*_*A+S*M*p,this._w=x*_*p+S*M*A;break;default:me("Quaternion: .setFromEuler() encountered an unknown order: "+d)}return a===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,a){const s=a/2,u=Math.sin(s);return this._x=e.x*u,this._y=e.y*u,this._z=e.z*u,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const a=e.elements,s=a[0],u=a[4],f=a[8],d=a[1],h=a[5],g=a[9],x=a[2],_=a[6],p=a[10],S=s+h+p;if(S>0){const M=.5/Math.sqrt(S+1);this._w=.25/M,this._x=(_-g)*M,this._y=(f-x)*M,this._z=(d-u)*M}else if(s>h&&s>p){const M=2*Math.sqrt(1+s-h-p);this._w=(_-g)/M,this._x=.25*M,this._y=(u+d)/M,this._z=(f+x)/M}else if(h>p){const M=2*Math.sqrt(1+h-s-p);this._w=(f-x)/M,this._x=(u+d)/M,this._y=.25*M,this._z=(g+_)/M}else{const M=2*Math.sqrt(1+p-s-h);this._w=(d-u)/M,this._x=(f+x)/M,this._y=(g+_)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,a){let s=e.dot(a)+1;return s<1e-8?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*a.z-e.z*a.y,this._y=e.z*a.x-e.x*a.z,this._z=e.x*a.y-e.y*a.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(we(this.dot(e),-1,1)))}rotateTowards(e,a){const s=this.angleTo(e);if(s===0)return this;const u=Math.min(1,a/s);return this.slerp(e,u),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,a){const s=e._x,u=e._y,f=e._z,d=e._w,h=a._x,g=a._y,x=a._z,_=a._w;return this._x=s*_+d*h+u*x-f*g,this._y=u*_+d*g+f*h-s*x,this._z=f*_+d*x+s*g-u*h,this._w=d*_-s*h-u*g-f*x,this._onChangeCallback(),this}slerp(e,a){if(a<=0)return this;if(a>=1)return this.copy(e);let s=e._x,u=e._y,f=e._z,d=e._w,h=this.dot(e);h<0&&(s=-s,u=-u,f=-f,d=-d,h=-h);let g=1-a;if(h<.9995){const x=Math.acos(h),_=Math.sin(x);g=Math.sin(g*x)/_,a=Math.sin(a*x)/_,this._x=this._x*g+s*a,this._y=this._y*g+u*a,this._z=this._z*g+f*a,this._w=this._w*g+d*a,this._onChangeCallback()}else this._x=this._x*g+s*a,this._y=this._y*g+u*a,this._z=this._z*g+f*a,this._w=this._w*g+d*a,this.normalize();return this}slerpQuaternions(e,a,s){return this.copy(e).slerp(a,s)}random(){const e=2*Math.PI*Math.random(),a=2*Math.PI*Math.random(),s=Math.random(),u=Math.sqrt(1-s),f=Math.sqrt(s);return this.set(u*Math.sin(e),u*Math.cos(e),f*Math.sin(a),f*Math.cos(a))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,a=0){return this._x=e[a],this._y=e[a+1],this._z=e[a+2],this._w=e[a+3],this._onChangeCallback(),this}toArray(e=[],a=0){return e[a]=this._x,e[a+1]=this._y,e[a+2]=this._z,e[a+3]=this._w,e}fromBufferAttribute(e,a){return this._x=e.getX(a),this._y=e.getY(a),this._z=e.getZ(a),this._w=e.getW(a),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class lt{constructor(e=0,a=0,s=0){lt.prototype.isVector3=!0,this.x=e,this.y=a,this.z=s}set(e,a,s){return s===void 0&&(s=this.z),this.x=e,this.y=a,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;case 2:this.z=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this.z=e.z+a.z,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this.z+=e.z*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this.z=e.z-a.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,a){return this.x=e.x*a.x,this.y=e.y*a.y,this.z=e.z*a.z,this}applyEuler(e){return this.applyQuaternion(o_.setFromEuler(e))}applyAxisAngle(e,a){return this.applyQuaternion(o_.setFromAxisAngle(e,a))}applyMatrix3(e){const a=this.x,s=this.y,u=this.z,f=e.elements;return this.x=f[0]*a+f[3]*s+f[6]*u,this.y=f[1]*a+f[4]*s+f[7]*u,this.z=f[2]*a+f[5]*s+f[8]*u,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const a=this.x,s=this.y,u=this.z,f=e.elements,d=1/(f[3]*a+f[7]*s+f[11]*u+f[15]);return this.x=(f[0]*a+f[4]*s+f[8]*u+f[12])*d,this.y=(f[1]*a+f[5]*s+f[9]*u+f[13])*d,this.z=(f[2]*a+f[6]*s+f[10]*u+f[14])*d,this}applyQuaternion(e){const a=this.x,s=this.y,u=this.z,f=e.x,d=e.y,h=e.z,g=e.w,x=2*(d*u-h*s),_=2*(h*a-f*u),p=2*(f*s-d*a);return this.x=a+g*x+d*p-h*_,this.y=s+g*_+h*x-f*p,this.z=u+g*p+f*_-d*x,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const a=this.x,s=this.y,u=this.z,f=e.elements;return this.x=f[0]*a+f[4]*s+f[8]*u,this.y=f[1]*a+f[5]*s+f[9]*u,this.z=f[2]*a+f[6]*s+f[10]*u,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,a){return this.x=we(this.x,e.x,a.x),this.y=we(this.y,e.y,a.y),this.z=we(this.z,e.z,a.z),this}clampScalar(e,a){return this.x=we(this.x,e,a),this.y=we(this.y,e,a),this.z=we(this.z,e,a),this}clampLength(e,a){const s=this.length();return this.divideScalar(s||1).multiplyScalar(we(s,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this.z+=(e.z-this.z)*a,this}lerpVectors(e,a,s){return this.x=e.x+(a.x-e.x)*s,this.y=e.y+(a.y-e.y)*s,this.z=e.z+(a.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,a){const s=e.x,u=e.y,f=e.z,d=a.x,h=a.y,g=a.z;return this.x=u*g-f*h,this.y=f*d-s*g,this.z=s*h-u*d,this}projectOnVector(e){const a=e.lengthSq();if(a===0)return this.set(0,0,0);const s=e.dot(this)/a;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return oh.copy(this).projectOnVector(e),this.sub(oh)}reflect(e){return this.sub(oh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const a=Math.sqrt(this.lengthSq()*e.lengthSq());if(a===0)return Math.PI/2;const s=this.dot(e)/a;return Math.acos(we(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const a=this.x-e.x,s=this.y-e.y,u=this.z-e.z;return a*a+s*s+u*u}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,a,s){const u=Math.sin(a)*e;return this.x=u*Math.sin(s),this.y=Math.cos(a)*e,this.z=u*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,a,s){return this.x=e*Math.sin(a),this.y=s,this.z=e*Math.cos(a),this}setFromMatrixPosition(e){const a=e.elements;return this.x=a[12],this.y=a[13],this.z=a[14],this}setFromMatrixScale(e){const a=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),u=this.setFromMatrixColumn(e,2).length();return this.x=a,this.y=s,this.z=u,this}setFromMatrixColumn(e,a){return this.fromArray(e.elements,a*4)}setFromMatrix3Column(e,a){return this.fromArray(e.elements,a*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this.z=e[a+2],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e[a+2]=this.z,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this.z=e.getZ(a),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,a=Math.random()*2-1,s=Math.sqrt(1-a*a);return this.x=s*Math.cos(e),this.y=a,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oh=new lt,o_=new pl;class xe{constructor(e,a,s,u,f,d,h,g,x){xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,a,s,u,f,d,h,g,x)}set(e,a,s,u,f,d,h,g,x){const _=this.elements;return _[0]=e,_[1]=u,_[2]=h,_[3]=a,_[4]=f,_[5]=g,_[6]=s,_[7]=d,_[8]=x,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const a=this.elements,s=e.elements;return a[0]=s[0],a[1]=s[1],a[2]=s[2],a[3]=s[3],a[4]=s[4],a[5]=s[5],a[6]=s[6],a[7]=s[7],a[8]=s[8],this}extractBasis(e,a,s){return e.setFromMatrix3Column(this,0),a.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const a=e.elements;return this.set(a[0],a[4],a[8],a[1],a[5],a[9],a[2],a[6],a[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,a){const s=e.elements,u=a.elements,f=this.elements,d=s[0],h=s[3],g=s[6],x=s[1],_=s[4],p=s[7],S=s[2],M=s[5],A=s[8],C=u[0],y=u[3],v=u[6],L=u[1],O=u[4],z=u[7],V=u[2],N=u[5],I=u[8];return f[0]=d*C+h*L+g*V,f[3]=d*y+h*O+g*N,f[6]=d*v+h*z+g*I,f[1]=x*C+_*L+p*V,f[4]=x*y+_*O+p*N,f[7]=x*v+_*z+p*I,f[2]=S*C+M*L+A*V,f[5]=S*y+M*O+A*N,f[8]=S*v+M*z+A*I,this}multiplyScalar(e){const a=this.elements;return a[0]*=e,a[3]*=e,a[6]*=e,a[1]*=e,a[4]*=e,a[7]*=e,a[2]*=e,a[5]*=e,a[8]*=e,this}determinant(){const e=this.elements,a=e[0],s=e[1],u=e[2],f=e[3],d=e[4],h=e[5],g=e[6],x=e[7],_=e[8];return a*d*_-a*h*x-s*f*_+s*h*g+u*f*x-u*d*g}invert(){const e=this.elements,a=e[0],s=e[1],u=e[2],f=e[3],d=e[4],h=e[5],g=e[6],x=e[7],_=e[8],p=_*d-h*x,S=h*g-_*f,M=x*f-d*g,A=a*p+s*S+u*M;if(A===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=p*C,e[1]=(u*x-_*s)*C,e[2]=(h*s-u*d)*C,e[3]=S*C,e[4]=(_*a-u*g)*C,e[5]=(u*f-h*a)*C,e[6]=M*C,e[7]=(s*g-x*a)*C,e[8]=(d*a-s*f)*C,this}transpose(){let e;const a=this.elements;return e=a[1],a[1]=a[3],a[3]=e,e=a[2],a[2]=a[6],a[6]=e,e=a[5],a[5]=a[7],a[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const a=this.elements;return e[0]=a[0],e[1]=a[3],e[2]=a[6],e[3]=a[1],e[4]=a[4],e[5]=a[7],e[6]=a[2],e[7]=a[5],e[8]=a[8],this}setUvTransform(e,a,s,u,f,d,h){const g=Math.cos(f),x=Math.sin(f);return this.set(s*g,s*x,-s*(g*d+x*h)+d+e,-u*x,u*g,-u*(-x*d+g*h)+h+a,0,0,1),this}scale(e,a){return this.premultiply(lh.makeScale(e,a)),this}rotate(e){return this.premultiply(lh.makeRotation(-e)),this}translate(e,a){return this.premultiply(lh.makeTranslation(e,a)),this}makeTranslation(e,a){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,a,0,0,1),this}makeRotation(e){const a=Math.cos(e),s=Math.sin(e);return this.set(a,-s,0,s,a,0,0,0,1),this}makeScale(e,a){return this.set(e,0,0,0,a,0,0,0,1),this}equals(e){const a=this.elements,s=e.elements;for(let u=0;u<9;u++)if(a[u]!==s[u])return!1;return!0}fromArray(e,a=0){for(let s=0;s<9;s++)this.elements[s]=e[s+a];return this}toArray(e=[],a=0){const s=this.elements;return e[a]=s[0],e[a+1]=s[1],e[a+2]=s[2],e[a+3]=s[3],e[a+4]=s[4],e[a+5]=s[5],e[a+6]=s[6],e[a+7]=s[7],e[a+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const lh=new xe,l_=new xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),u_=new xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mE(){const o={enabled:!0,workingColorSpace:to,spaces:{},convert:function(u,f,d){return this.enabled===!1||f===d||!f||!d||(this.spaces[f].transfer===We&&(u.r=Ra(u.r),u.g=Ra(u.g),u.b=Ra(u.b)),this.spaces[f].primaries!==this.spaces[d].primaries&&(u.applyMatrix3(this.spaces[f].toXYZ),u.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===We&&(u.r=Ks(u.r),u.g=Ks(u.g),u.b=Ks(u.b))),u},workingToColorSpace:function(u,f){return this.convert(u,this.workingColorSpace,f)},colorSpaceToWorking:function(u,f){return this.convert(u,f,this.workingColorSpace)},getPrimaries:function(u){return this.spaces[u].primaries},getTransfer:function(u){return u===ur?gc:this.spaces[u].transfer},getToneMappingMode:function(u){return this.spaces[u].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(u,f=this.workingColorSpace){return u.fromArray(this.spaces[f].luminanceCoefficients)},define:function(u){Object.assign(this.spaces,u)},_getMatrix:function(u,f,d){return u.copy(this.spaces[f].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(u){return this.spaces[u].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(u=this.workingColorSpace){return this.spaces[u].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(u,f){return dl("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),o.workingToColorSpace(u,f)},toWorkingColorSpace:function(u,f){return dl("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),o.colorSpaceToWorking(u,f)}},e=[.64,.33,.3,.6,.15,.06],a=[.2126,.7152,.0722],s=[.3127,.329];return o.define({[to]:{primaries:e,whitePoint:s,transfer:gc,toXYZ:l_,fromXYZ:u_,luminanceCoefficients:a,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:e,whitePoint:s,transfer:We,toXYZ:l_,fromXYZ:u_,luminanceCoefficients:a,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),o}const Oe=mE();function Ra(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function Ks(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let zs;class xE{static getDataURL(e,a="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let s;if(e instanceof HTMLCanvasElement)s=e;else{zs===void 0&&(zs=vc("canvas")),zs.width=e.width,zs.height=e.height;const u=zs.getContext("2d");e instanceof ImageData?u.putImageData(e,0,0):u.drawImage(e,0,0,e.width,e.height),s=zs}return s.toDataURL(a)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const a=vc("canvas");a.width=e.width,a.height=e.height;const s=a.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const u=s.getImageData(0,0,e.width,e.height),f=u.data;for(let d=0;d<f.length;d++)f[d]=Ra(f[d]/255)*255;return s.putImageData(u,0,0),a}else if(e.data){const a=e.data.slice(0);for(let s=0;s<a.length;s++)a instanceof Uint8Array||a instanceof Uint8ClampedArray?a[s]=Math.floor(Ra(a[s]/255)*255):a[s]=Ra(a[s]);return{data:a,width:e.width,height:e.height}}else return me("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gE=0;class zp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gE++}),this.uuid=hl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const a=this.data;return typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement?e.set(a.videoWidth,a.videoHeight,0):a instanceof VideoFrame?e.set(a.displayHeight,a.displayWidth,0):a!==null?e.set(a.width,a.height,a.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const a=e===void 0||typeof e=="string";if(!a&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},u=this.data;if(u!==null){let f;if(Array.isArray(u)){f=[];for(let d=0,h=u.length;d<h;d++)u[d].isDataTexture?f.push(uh(u[d].image)):f.push(uh(u[d]))}else f=uh(u);s.url=f}return a||(e.images[this.uuid]=s),s}}function uh(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?xE.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(me("Texture: Unable to serialize Texture."),{})}let _E=0;const ch=new lt;class Xn extends io{constructor(e=Xn.DEFAULT_IMAGE,a=Xn.DEFAULT_MAPPING,s=ba,u=ba,f=Ei,d=Yr,h=Pi,g=$i,x=Xn.DEFAULT_ANISOTROPY,_=ur){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_E++}),this.uuid=hl(),this.name="",this.source=new zp(e),this.mipmaps=[],this.mapping=a,this.channel=0,this.wrapS=s,this.wrapT=u,this.magFilter=f,this.minFilter=d,this.anisotropy=x,this.format=h,this.internalFormat=null,this.type=g,this.offset=new ze(0,0),this.repeat=new ze(1,1),this.center=new ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ch).x}get height(){return this.source.getSize(ch).y}get depth(){return this.source.getSize(ch).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,a){this.updateRanges.push({start:e,count:a})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const a in e){const s=e[a];if(s===void 0){me(`Texture.setValues(): parameter '${a}' has value of undefined.`);continue}const u=this[a];if(u===void 0){me(`Texture.setValues(): property '${a}' does not exist.`);continue}u&&s&&u.isVector2&&s.isVector2||u&&s&&u.isVector3&&s.isVector3||u&&s&&u.isMatrix3&&s.isMatrix3?u.copy(s):this[a]=s}}toJSON(e){const a=e===void 0||typeof e=="string";if(!a&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),a||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==rv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case jh:e.x=e.x-Math.floor(e.x);break;case ba:e.x=e.x<0?0:1;break;case Zh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case jh:e.y=e.y-Math.floor(e.y);break;case ba:e.y=e.y<0?0:1;break;case Zh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=rv;Xn.DEFAULT_ANISOTROPY=1;class sn{constructor(e=0,a=0,s=0,u=1){sn.prototype.isVector4=!0,this.x=e,this.y=a,this.z=s,this.w=u}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,a,s,u){return this.x=e,this.y=a,this.z=s,this.w=u,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,a){switch(e){case 0:this.x=a;break;case 1:this.y=a;break;case 2:this.z=a;break;case 3:this.w=a;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,a){return this.x=e.x+a.x,this.y=e.y+a.y,this.z=e.z+a.z,this.w=e.w+a.w,this}addScaledVector(e,a){return this.x+=e.x*a,this.y+=e.y*a,this.z+=e.z*a,this.w+=e.w*a,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,a){return this.x=e.x-a.x,this.y=e.y-a.y,this.z=e.z-a.z,this.w=e.w-a.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const a=this.x,s=this.y,u=this.z,f=this.w,d=e.elements;return this.x=d[0]*a+d[4]*s+d[8]*u+d[12]*f,this.y=d[1]*a+d[5]*s+d[9]*u+d[13]*f,this.z=d[2]*a+d[6]*s+d[10]*u+d[14]*f,this.w=d[3]*a+d[7]*s+d[11]*u+d[15]*f,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const a=Math.sqrt(1-e.w*e.w);return a<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/a,this.y=e.y/a,this.z=e.z/a),this}setAxisAngleFromRotationMatrix(e){let a,s,u,f;const g=e.elements,x=g[0],_=g[4],p=g[8],S=g[1],M=g[5],A=g[9],C=g[2],y=g[6],v=g[10];if(Math.abs(_-S)<.01&&Math.abs(p-C)<.01&&Math.abs(A-y)<.01){if(Math.abs(_+S)<.1&&Math.abs(p+C)<.1&&Math.abs(A+y)<.1&&Math.abs(x+M+v-3)<.1)return this.set(1,0,0,0),this;a=Math.PI;const O=(x+1)/2,z=(M+1)/2,V=(v+1)/2,N=(_+S)/4,I=(p+C)/4,Y=(A+y)/4;return O>z&&O>V?O<.01?(s=0,u=.707106781,f=.707106781):(s=Math.sqrt(O),u=N/s,f=I/s):z>V?z<.01?(s=.707106781,u=0,f=.707106781):(u=Math.sqrt(z),s=N/u,f=Y/u):V<.01?(s=.707106781,u=.707106781,f=0):(f=Math.sqrt(V),s=I/f,u=Y/f),this.set(s,u,f,a),this}let L=Math.sqrt((y-A)*(y-A)+(p-C)*(p-C)+(S-_)*(S-_));return Math.abs(L)<.001&&(L=1),this.x=(y-A)/L,this.y=(p-C)/L,this.z=(S-_)/L,this.w=Math.acos((x+M+v-1)/2),this}setFromMatrixPosition(e){const a=e.elements;return this.x=a[12],this.y=a[13],this.z=a[14],this.w=a[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,a){return this.x=we(this.x,e.x,a.x),this.y=we(this.y,e.y,a.y),this.z=we(this.z,e.z,a.z),this.w=we(this.w,e.w,a.w),this}clampScalar(e,a){return this.x=we(this.x,e,a),this.y=we(this.y,e,a),this.z=we(this.z,e,a),this.w=we(this.w,e,a),this}clampLength(e,a){const s=this.length();return this.divideScalar(s||1).multiplyScalar(we(s,e,a))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,a){return this.x+=(e.x-this.x)*a,this.y+=(e.y-this.y)*a,this.z+=(e.z-this.z)*a,this.w+=(e.w-this.w)*a,this}lerpVectors(e,a,s){return this.x=e.x+(a.x-e.x)*s,this.y=e.y+(a.y-e.y)*s,this.z=e.z+(a.z-e.z)*s,this.w=e.w+(a.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,a=0){return this.x=e[a],this.y=e[a+1],this.z=e[a+2],this.w=e[a+3],this}toArray(e=[],a=0){return e[a]=this.x,e[a+1]=this.y,e[a+2]=this.z,e[a+3]=this.w,e}fromBufferAttribute(e,a){return this.x=e.getX(a),this.y=e.getY(a),this.z=e.getZ(a),this.w=e.getW(a),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vE extends io{constructor(e=1,a=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=e,this.height=a,this.depth=s.depth,this.scissor=new sn(0,0,e,a),this.scissorTest=!1,this.viewport=new sn(0,0,e,a);const u={width:e,height:a,depth:s.depth},f=new Xn(u);this.textures=[];const d=s.count;for(let h=0;h<d;h++)this.textures[h]=f.clone(),this.textures[h].isRenderTargetTexture=!0,this.textures[h].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(e={}){const a={minFilter:Ei,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(a.mapping=e.mapping),e.wrapS!==void 0&&(a.wrapS=e.wrapS),e.wrapT!==void 0&&(a.wrapT=e.wrapT),e.wrapR!==void 0&&(a.wrapR=e.wrapR),e.magFilter!==void 0&&(a.magFilter=e.magFilter),e.minFilter!==void 0&&(a.minFilter=e.minFilter),e.format!==void 0&&(a.format=e.format),e.type!==void 0&&(a.type=e.type),e.anisotropy!==void 0&&(a.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(a.colorSpace=e.colorSpace),e.flipY!==void 0&&(a.flipY=e.flipY),e.generateMipmaps!==void 0&&(a.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(a.internalFormat=e.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(a)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,a,s=1){if(this.width!==e||this.height!==a||this.depth!==s){this.width=e,this.height=a,this.depth=s;for(let u=0,f=this.textures.length;u<f;u++)this.textures[u].image.width=e,this.textures[u].image.height=a,this.textures[u].image.depth=s,this.textures[u].isData3DTexture!==!0&&(this.textures[u].isArrayTexture=this.textures[u].image.depth>1);this.dispose()}this.viewport.set(0,0,e,a),this.scissor.set(0,0,e,a)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let a=0,s=e.textures.length;a<s;a++){this.textures[a]=e.textures[a].clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;const u=Object.assign({},e.textures[a].image);this.textures[a].source=new zp(u)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zr extends vE{constructor(e=1,a=1,s={}){super(e,a,s),this.isWebGLRenderTarget=!0}}class xv extends Xn{constructor(e=null,a=1,s=1,u=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:a,height:s,depth:u},this.magFilter=ui,this.minFilter=ui,this.wrapR=ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class SE extends Xn{constructor(e=null,a=1,s=1,u=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:a,height:s,depth:u},this.magFilter=ui,this.minFilter=ui,this.wrapR=ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ml{constructor(e=new lt(1/0,1/0,1/0),a=new lt(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=a}set(e,a){return this.min.copy(e),this.max.copy(a),this}setFromArray(e){this.makeEmpty();for(let a=0,s=e.length;a<s;a+=3)this.expandByPoint(Ui.fromArray(e,a));return this}setFromBufferAttribute(e){this.makeEmpty();for(let a=0,s=e.count;a<s;a++)this.expandByPoint(Ui.fromBufferAttribute(e,a));return this}setFromPoints(e){this.makeEmpty();for(let a=0,s=e.length;a<s;a++)this.expandByPoint(e[a]);return this}setFromCenterAndSize(e,a){const s=Ui.copy(a).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,a=!1){return this.makeEmpty(),this.expandByObject(e,a)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,a=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const f=s.getAttribute("position");if(a===!0&&f!==void 0&&e.isInstancedMesh!==!0)for(let d=0,h=f.count;d<h;d++)e.isMesh===!0?e.getVertexPosition(d,Ui):Ui.fromBufferAttribute(f,d),Ui.applyMatrix4(e.matrixWorld),this.expandByPoint(Ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ku.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),ku.copy(s.boundingBox)),ku.applyMatrix4(e.matrixWorld),this.union(ku)}const u=e.children;for(let f=0,d=u.length;f<d;f++)this.expandByObject(u[f],a);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,a){return a.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ui),Ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let a,s;return e.normal.x>0?(a=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(a=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(a+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(a+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(a+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(a+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),a<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tl),qu.subVectors(this.max,tl),Is.subVectors(e.a,tl),Bs.subVectors(e.b,tl),Fs.subVectors(e.c,tl),ir.subVectors(Bs,Is),ar.subVectors(Fs,Bs),Ir.subVectors(Is,Fs);let a=[0,-ir.z,ir.y,0,-ar.z,ar.y,0,-Ir.z,Ir.y,ir.z,0,-ir.x,ar.z,0,-ar.x,Ir.z,0,-Ir.x,-ir.y,ir.x,0,-ar.y,ar.x,0,-Ir.y,Ir.x,0];return!fh(a,Is,Bs,Fs,qu)||(a=[1,0,0,0,1,0,0,0,1],!fh(a,Is,Bs,Fs,qu))?!1:(Yu.crossVectors(ir,ar),a=[Yu.x,Yu.y,Yu.z],fh(a,Is,Bs,Fs,qu))}clampPoint(e,a){return a.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ga[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ga[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ga[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ga[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ga[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ga[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ga[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ga[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ga),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ga=[new lt,new lt,new lt,new lt,new lt,new lt,new lt,new lt],Ui=new lt,ku=new ml,Is=new lt,Bs=new lt,Fs=new lt,ir=new lt,ar=new lt,Ir=new lt,tl=new lt,qu=new lt,Yu=new lt,Br=new lt;function fh(o,e,a,s,u){for(let f=0,d=o.length-3;f<=d;f+=3){Br.fromArray(o,f);const h=u.x*Math.abs(Br.x)+u.y*Math.abs(Br.y)+u.z*Math.abs(Br.z),g=e.dot(Br),x=a.dot(Br),_=s.dot(Br);if(Math.max(-Math.max(g,x,_),Math.min(g,x,_))>h)return!1}return!0}const yE=new ml,el=new lt,dh=new lt;class Ec{constructor(e=new lt,a=-1){this.isSphere=!0,this.center=e,this.radius=a}set(e,a){return this.center.copy(e),this.radius=a,this}setFromPoints(e,a){const s=this.center;a!==void 0?s.copy(a):yE.setFromPoints(e).getCenter(s);let u=0;for(let f=0,d=e.length;f<d;f++)u=Math.max(u,s.distanceToSquared(e[f]));return this.radius=Math.sqrt(u),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const a=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=a*a}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,a){const s=this.center.distanceToSquared(e);return a.copy(e),s>this.radius*this.radius&&(a.sub(this.center).normalize(),a.multiplyScalar(this.radius).add(this.center)),a}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;el.subVectors(e,this.center);const a=el.lengthSq();if(a>this.radius*this.radius){const s=Math.sqrt(a),u=(s-this.radius)*.5;this.center.addScaledVector(el,u/s),this.radius+=u}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(dh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(el.copy(e.center).add(dh)),this.expandByPoint(el.copy(e.center).sub(dh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const _a=new lt,hh=new lt,Wu=new lt,rr=new lt,ph=new lt,ju=new lt,mh=new lt;class gv{constructor(e=new lt,a=new lt(0,0,-1)){this.origin=e,this.direction=a}set(e,a){return this.origin.copy(e),this.direction.copy(a),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,a){return a.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_a)),this}closestPointToPoint(e,a){a.subVectors(e,this.origin);const s=a.dot(this.direction);return s<0?a.copy(this.origin):a.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const a=_a.subVectors(e,this.origin).dot(this.direction);return a<0?this.origin.distanceToSquared(e):(_a.copy(this.origin).addScaledVector(this.direction,a),_a.distanceToSquared(e))}distanceSqToSegment(e,a,s,u){hh.copy(e).add(a).multiplyScalar(.5),Wu.copy(a).sub(e).normalize(),rr.copy(this.origin).sub(hh);const f=e.distanceTo(a)*.5,d=-this.direction.dot(Wu),h=rr.dot(this.direction),g=-rr.dot(Wu),x=rr.lengthSq(),_=Math.abs(1-d*d);let p,S,M,A;if(_>0)if(p=d*g-h,S=d*h-g,A=f*_,p>=0)if(S>=-A)if(S<=A){const C=1/_;p*=C,S*=C,M=p*(p+d*S+2*h)+S*(d*p+S+2*g)+x}else S=f,p=Math.max(0,-(d*S+h)),M=-p*p+S*(S+2*g)+x;else S=-f,p=Math.max(0,-(d*S+h)),M=-p*p+S*(S+2*g)+x;else S<=-A?(p=Math.max(0,-(-d*f+h)),S=p>0?-f:Math.min(Math.max(-f,-g),f),M=-p*p+S*(S+2*g)+x):S<=A?(p=0,S=Math.min(Math.max(-f,-g),f),M=S*(S+2*g)+x):(p=Math.max(0,-(d*f+h)),S=p>0?f:Math.min(Math.max(-f,-g),f),M=-p*p+S*(S+2*g)+x);else S=d>0?-f:f,p=Math.max(0,-(d*S+h)),M=-p*p+S*(S+2*g)+x;return s&&s.copy(this.origin).addScaledVector(this.direction,p),u&&u.copy(hh).addScaledVector(Wu,S),M}intersectSphere(e,a){_a.subVectors(e.center,this.origin);const s=_a.dot(this.direction),u=_a.dot(_a)-s*s,f=e.radius*e.radius;if(u>f)return null;const d=Math.sqrt(f-u),h=s-d,g=s+d;return g<0?null:h<0?this.at(g,a):this.at(h,a)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const a=e.normal.dot(this.direction);if(a===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/a;return s>=0?s:null}intersectPlane(e,a){const s=this.distanceToPlane(e);return s===null?null:this.at(s,a)}intersectsPlane(e){const a=e.distanceToPoint(this.origin);return a===0||e.normal.dot(this.direction)*a<0}intersectBox(e,a){let s,u,f,d,h,g;const x=1/this.direction.x,_=1/this.direction.y,p=1/this.direction.z,S=this.origin;return x>=0?(s=(e.min.x-S.x)*x,u=(e.max.x-S.x)*x):(s=(e.max.x-S.x)*x,u=(e.min.x-S.x)*x),_>=0?(f=(e.min.y-S.y)*_,d=(e.max.y-S.y)*_):(f=(e.max.y-S.y)*_,d=(e.min.y-S.y)*_),s>d||f>u||((f>s||isNaN(s))&&(s=f),(d<u||isNaN(u))&&(u=d),p>=0?(h=(e.min.z-S.z)*p,g=(e.max.z-S.z)*p):(h=(e.max.z-S.z)*p,g=(e.min.z-S.z)*p),s>g||h>u)||((h>s||s!==s)&&(s=h),(g<u||u!==u)&&(u=g),u<0)?null:this.at(s>=0?s:u,a)}intersectsBox(e){return this.intersectBox(e,_a)!==null}intersectTriangle(e,a,s,u,f){ph.subVectors(a,e),ju.subVectors(s,e),mh.crossVectors(ph,ju);let d=this.direction.dot(mh),h;if(d>0){if(u)return null;h=1}else if(d<0)h=-1,d=-d;else return null;rr.subVectors(this.origin,e);const g=h*this.direction.dot(ju.crossVectors(rr,ju));if(g<0)return null;const x=h*this.direction.dot(ph.cross(rr));if(x<0||g+x>d)return null;const _=-h*rr.dot(mh);return _<0?null:this.at(_/d,f)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class on{constructor(e,a,s,u,f,d,h,g,x,_,p,S,M,A,C,y){on.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,a,s,u,f,d,h,g,x,_,p,S,M,A,C,y)}set(e,a,s,u,f,d,h,g,x,_,p,S,M,A,C,y){const v=this.elements;return v[0]=e,v[4]=a,v[8]=s,v[12]=u,v[1]=f,v[5]=d,v[9]=h,v[13]=g,v[2]=x,v[6]=_,v[10]=p,v[14]=S,v[3]=M,v[7]=A,v[11]=C,v[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new on().fromArray(this.elements)}copy(e){const a=this.elements,s=e.elements;return a[0]=s[0],a[1]=s[1],a[2]=s[2],a[3]=s[3],a[4]=s[4],a[5]=s[5],a[6]=s[6],a[7]=s[7],a[8]=s[8],a[9]=s[9],a[10]=s[10],a[11]=s[11],a[12]=s[12],a[13]=s[13],a[14]=s[14],a[15]=s[15],this}copyPosition(e){const a=this.elements,s=e.elements;return a[12]=s[12],a[13]=s[13],a[14]=s[14],this}setFromMatrix3(e){const a=e.elements;return this.set(a[0],a[3],a[6],0,a[1],a[4],a[7],0,a[2],a[5],a[8],0,0,0,0,1),this}extractBasis(e,a,s){return e.setFromMatrixColumn(this,0),a.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,a,s){return this.set(e.x,a.x,s.x,0,e.y,a.y,s.y,0,e.z,a.z,s.z,0,0,0,0,1),this}extractRotation(e){const a=this.elements,s=e.elements,u=1/Hs.setFromMatrixColumn(e,0).length(),f=1/Hs.setFromMatrixColumn(e,1).length(),d=1/Hs.setFromMatrixColumn(e,2).length();return a[0]=s[0]*u,a[1]=s[1]*u,a[2]=s[2]*u,a[3]=0,a[4]=s[4]*f,a[5]=s[5]*f,a[6]=s[6]*f,a[7]=0,a[8]=s[8]*d,a[9]=s[9]*d,a[10]=s[10]*d,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,this}makeRotationFromEuler(e){const a=this.elements,s=e.x,u=e.y,f=e.z,d=Math.cos(s),h=Math.sin(s),g=Math.cos(u),x=Math.sin(u),_=Math.cos(f),p=Math.sin(f);if(e.order==="XYZ"){const S=d*_,M=d*p,A=h*_,C=h*p;a[0]=g*_,a[4]=-g*p,a[8]=x,a[1]=M+A*x,a[5]=S-C*x,a[9]=-h*g,a[2]=C-S*x,a[6]=A+M*x,a[10]=d*g}else if(e.order==="YXZ"){const S=g*_,M=g*p,A=x*_,C=x*p;a[0]=S+C*h,a[4]=A*h-M,a[8]=d*x,a[1]=d*p,a[5]=d*_,a[9]=-h,a[2]=M*h-A,a[6]=C+S*h,a[10]=d*g}else if(e.order==="ZXY"){const S=g*_,M=g*p,A=x*_,C=x*p;a[0]=S-C*h,a[4]=-d*p,a[8]=A+M*h,a[1]=M+A*h,a[5]=d*_,a[9]=C-S*h,a[2]=-d*x,a[6]=h,a[10]=d*g}else if(e.order==="ZYX"){const S=d*_,M=d*p,A=h*_,C=h*p;a[0]=g*_,a[4]=A*x-M,a[8]=S*x+C,a[1]=g*p,a[5]=C*x+S,a[9]=M*x-A,a[2]=-x,a[6]=h*g,a[10]=d*g}else if(e.order==="YZX"){const S=d*g,M=d*x,A=h*g,C=h*x;a[0]=g*_,a[4]=C-S*p,a[8]=A*p+M,a[1]=p,a[5]=d*_,a[9]=-h*_,a[2]=-x*_,a[6]=M*p+A,a[10]=S-C*p}else if(e.order==="XZY"){const S=d*g,M=d*x,A=h*g,C=h*x;a[0]=g*_,a[4]=-p,a[8]=x*_,a[1]=S*p+C,a[5]=d*_,a[9]=M*p-A,a[2]=A*p-M,a[6]=h*_,a[10]=C*p+S}return a[3]=0,a[7]=0,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ME,e,EE)}lookAt(e,a,s){const u=this.elements;return si.subVectors(e,a),si.lengthSq()===0&&(si.z=1),si.normalize(),sr.crossVectors(s,si),sr.lengthSq()===0&&(Math.abs(s.z)===1?si.x+=1e-4:si.z+=1e-4,si.normalize(),sr.crossVectors(s,si)),sr.normalize(),Zu.crossVectors(si,sr),u[0]=sr.x,u[4]=Zu.x,u[8]=si.x,u[1]=sr.y,u[5]=Zu.y,u[9]=si.y,u[2]=sr.z,u[6]=Zu.z,u[10]=si.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,a){const s=e.elements,u=a.elements,f=this.elements,d=s[0],h=s[4],g=s[8],x=s[12],_=s[1],p=s[5],S=s[9],M=s[13],A=s[2],C=s[6],y=s[10],v=s[14],L=s[3],O=s[7],z=s[11],V=s[15],N=u[0],I=u[4],Y=u[8],D=u[12],w=u[1],q=u[5],at=u[9],ut=u[13],gt=u[2],ct=u[6],K=u[10],rt=u[14],J=u[3],St=u[7],_t=u[11],Vt=u[15];return f[0]=d*N+h*w+g*gt+x*J,f[4]=d*I+h*q+g*ct+x*St,f[8]=d*Y+h*at+g*K+x*_t,f[12]=d*D+h*ut+g*rt+x*Vt,f[1]=_*N+p*w+S*gt+M*J,f[5]=_*I+p*q+S*ct+M*St,f[9]=_*Y+p*at+S*K+M*_t,f[13]=_*D+p*ut+S*rt+M*Vt,f[2]=A*N+C*w+y*gt+v*J,f[6]=A*I+C*q+y*ct+v*St,f[10]=A*Y+C*at+y*K+v*_t,f[14]=A*D+C*ut+y*rt+v*Vt,f[3]=L*N+O*w+z*gt+V*J,f[7]=L*I+O*q+z*ct+V*St,f[11]=L*Y+O*at+z*K+V*_t,f[15]=L*D+O*ut+z*rt+V*Vt,this}multiplyScalar(e){const a=this.elements;return a[0]*=e,a[4]*=e,a[8]*=e,a[12]*=e,a[1]*=e,a[5]*=e,a[9]*=e,a[13]*=e,a[2]*=e,a[6]*=e,a[10]*=e,a[14]*=e,a[3]*=e,a[7]*=e,a[11]*=e,a[15]*=e,this}determinant(){const e=this.elements,a=e[0],s=e[4],u=e[8],f=e[12],d=e[1],h=e[5],g=e[9],x=e[13],_=e[2],p=e[6],S=e[10],M=e[14],A=e[3],C=e[7],y=e[11],v=e[15];return A*(+f*g*p-u*x*p-f*h*S+s*x*S+u*h*M-s*g*M)+C*(+a*g*M-a*x*S+f*d*S-u*d*M+u*x*_-f*g*_)+y*(+a*x*p-a*h*M-f*d*p+s*d*M+f*h*_-s*x*_)+v*(-u*h*_-a*g*p+a*h*S+u*d*p-s*d*S+s*g*_)}transpose(){const e=this.elements;let a;return a=e[1],e[1]=e[4],e[4]=a,a=e[2],e[2]=e[8],e[8]=a,a=e[6],e[6]=e[9],e[9]=a,a=e[3],e[3]=e[12],e[12]=a,a=e[7],e[7]=e[13],e[13]=a,a=e[11],e[11]=e[14],e[14]=a,this}setPosition(e,a,s){const u=this.elements;return e.isVector3?(u[12]=e.x,u[13]=e.y,u[14]=e.z):(u[12]=e,u[13]=a,u[14]=s),this}invert(){const e=this.elements,a=e[0],s=e[1],u=e[2],f=e[3],d=e[4],h=e[5],g=e[6],x=e[7],_=e[8],p=e[9],S=e[10],M=e[11],A=e[12],C=e[13],y=e[14],v=e[15],L=p*y*x-C*S*x+C*g*M-h*y*M-p*g*v+h*S*v,O=A*S*x-_*y*x-A*g*M+d*y*M+_*g*v-d*S*v,z=_*C*x-A*p*x+A*h*M-d*C*M-_*h*v+d*p*v,V=A*p*g-_*C*g-A*h*S+d*C*S+_*h*y-d*p*y,N=a*L+s*O+u*z+f*V;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/N;return e[0]=L*I,e[1]=(C*S*f-p*y*f-C*u*M+s*y*M+p*u*v-s*S*v)*I,e[2]=(h*y*f-C*g*f+C*u*x-s*y*x-h*u*v+s*g*v)*I,e[3]=(p*g*f-h*S*f-p*u*x+s*S*x+h*u*M-s*g*M)*I,e[4]=O*I,e[5]=(_*y*f-A*S*f+A*u*M-a*y*M-_*u*v+a*S*v)*I,e[6]=(A*g*f-d*y*f-A*u*x+a*y*x+d*u*v-a*g*v)*I,e[7]=(d*S*f-_*g*f+_*u*x-a*S*x-d*u*M+a*g*M)*I,e[8]=z*I,e[9]=(A*p*f-_*C*f-A*s*M+a*C*M+_*s*v-a*p*v)*I,e[10]=(d*C*f-A*h*f+A*s*x-a*C*x-d*s*v+a*h*v)*I,e[11]=(_*h*f-d*p*f-_*s*x+a*p*x+d*s*M-a*h*M)*I,e[12]=V*I,e[13]=(_*C*u-A*p*u+A*s*S-a*C*S-_*s*y+a*p*y)*I,e[14]=(A*h*u-d*C*u-A*s*g+a*C*g+d*s*y-a*h*y)*I,e[15]=(d*p*u-_*h*u+_*s*g-a*p*g-d*s*S+a*h*S)*I,this}scale(e){const a=this.elements,s=e.x,u=e.y,f=e.z;return a[0]*=s,a[4]*=u,a[8]*=f,a[1]*=s,a[5]*=u,a[9]*=f,a[2]*=s,a[6]*=u,a[10]*=f,a[3]*=s,a[7]*=u,a[11]*=f,this}getMaxScaleOnAxis(){const e=this.elements,a=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],u=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(a,s,u))}makeTranslation(e,a,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,a,0,0,1,s,0,0,0,1),this}makeRotationX(e){const a=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,a,-s,0,0,s,a,0,0,0,0,1),this}makeRotationY(e){const a=Math.cos(e),s=Math.sin(e);return this.set(a,0,s,0,0,1,0,0,-s,0,a,0,0,0,0,1),this}makeRotationZ(e){const a=Math.cos(e),s=Math.sin(e);return this.set(a,-s,0,0,s,a,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,a){const s=Math.cos(a),u=Math.sin(a),f=1-s,d=e.x,h=e.y,g=e.z,x=f*d,_=f*h;return this.set(x*d+s,x*h-u*g,x*g+u*h,0,x*h+u*g,_*h+s,_*g-u*d,0,x*g-u*h,_*g+u*d,f*g*g+s,0,0,0,0,1),this}makeScale(e,a,s){return this.set(e,0,0,0,0,a,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,a,s,u,f,d){return this.set(1,s,f,0,e,1,d,0,a,u,1,0,0,0,0,1),this}compose(e,a,s){const u=this.elements,f=a._x,d=a._y,h=a._z,g=a._w,x=f+f,_=d+d,p=h+h,S=f*x,M=f*_,A=f*p,C=d*_,y=d*p,v=h*p,L=g*x,O=g*_,z=g*p,V=s.x,N=s.y,I=s.z;return u[0]=(1-(C+v))*V,u[1]=(M+z)*V,u[2]=(A-O)*V,u[3]=0,u[4]=(M-z)*N,u[5]=(1-(S+v))*N,u[6]=(y+L)*N,u[7]=0,u[8]=(A+O)*I,u[9]=(y-L)*I,u[10]=(1-(S+C))*I,u[11]=0,u[12]=e.x,u[13]=e.y,u[14]=e.z,u[15]=1,this}decompose(e,a,s){const u=this.elements;let f=Hs.set(u[0],u[1],u[2]).length();const d=Hs.set(u[4],u[5],u[6]).length(),h=Hs.set(u[8],u[9],u[10]).length();this.determinant()<0&&(f=-f),e.x=u[12],e.y=u[13],e.z=u[14],Ni.copy(this);const x=1/f,_=1/d,p=1/h;return Ni.elements[0]*=x,Ni.elements[1]*=x,Ni.elements[2]*=x,Ni.elements[4]*=_,Ni.elements[5]*=_,Ni.elements[6]*=_,Ni.elements[8]*=p,Ni.elements[9]*=p,Ni.elements[10]*=p,a.setFromRotationMatrix(Ni),s.x=f,s.y=d,s.z=h,this}makePerspective(e,a,s,u,f,d,h=Ji,g=!1){const x=this.elements,_=2*f/(a-e),p=2*f/(s-u),S=(a+e)/(a-e),M=(s+u)/(s-u);let A,C;if(g)A=f/(d-f),C=d*f/(d-f);else if(h===Ji)A=-(d+f)/(d-f),C=-2*d*f/(d-f);else if(h===_c)A=-d/(d-f),C=-d*f/(d-f);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return x[0]=_,x[4]=0,x[8]=S,x[12]=0,x[1]=0,x[5]=p,x[9]=M,x[13]=0,x[2]=0,x[6]=0,x[10]=A,x[14]=C,x[3]=0,x[7]=0,x[11]=-1,x[15]=0,this}makeOrthographic(e,a,s,u,f,d,h=Ji,g=!1){const x=this.elements,_=2/(a-e),p=2/(s-u),S=-(a+e)/(a-e),M=-(s+u)/(s-u);let A,C;if(g)A=1/(d-f),C=d/(d-f);else if(h===Ji)A=-2/(d-f),C=-(d+f)/(d-f);else if(h===_c)A=-1/(d-f),C=-f/(d-f);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return x[0]=_,x[4]=0,x[8]=0,x[12]=S,x[1]=0,x[5]=p,x[9]=0,x[13]=M,x[2]=0,x[6]=0,x[10]=A,x[14]=C,x[3]=0,x[7]=0,x[11]=0,x[15]=1,this}equals(e){const a=this.elements,s=e.elements;for(let u=0;u<16;u++)if(a[u]!==s[u])return!1;return!0}fromArray(e,a=0){for(let s=0;s<16;s++)this.elements[s]=e[s+a];return this}toArray(e=[],a=0){const s=this.elements;return e[a]=s[0],e[a+1]=s[1],e[a+2]=s[2],e[a+3]=s[3],e[a+4]=s[4],e[a+5]=s[5],e[a+6]=s[6],e[a+7]=s[7],e[a+8]=s[8],e[a+9]=s[9],e[a+10]=s[10],e[a+11]=s[11],e[a+12]=s[12],e[a+13]=s[13],e[a+14]=s[14],e[a+15]=s[15],e}}const Hs=new lt,Ni=new on,ME=new lt(0,0,0),EE=new lt(1,1,1),sr=new lt,Zu=new lt,si=new lt,c_=new on,f_=new pl;class ta{constructor(e=0,a=0,s=0,u=ta.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=a,this._z=s,this._order=u}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,a,s,u=this._order){return this._x=e,this._y=a,this._z=s,this._order=u,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,a=this._order,s=!0){const u=e.elements,f=u[0],d=u[4],h=u[8],g=u[1],x=u[5],_=u[9],p=u[2],S=u[6],M=u[10];switch(a){case"XYZ":this._y=Math.asin(we(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-_,M),this._z=Math.atan2(-d,f)):(this._x=Math.atan2(S,x),this._z=0);break;case"YXZ":this._x=Math.asin(-we(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(h,M),this._z=Math.atan2(g,x)):(this._y=Math.atan2(-p,f),this._z=0);break;case"ZXY":this._x=Math.asin(we(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-p,M),this._z=Math.atan2(-d,x)):(this._y=0,this._z=Math.atan2(g,f));break;case"ZYX":this._y=Math.asin(-we(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(S,M),this._z=Math.atan2(g,f)):(this._x=0,this._z=Math.atan2(-d,x));break;case"YZX":this._z=Math.asin(we(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(-_,x),this._y=Math.atan2(-p,f)):(this._x=0,this._y=Math.atan2(h,M));break;case"XZY":this._z=Math.asin(-we(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(S,x),this._y=Math.atan2(h,f)):(this._x=Math.atan2(-_,M),this._y=0);break;default:me("Euler: .setFromRotationMatrix() encountered an unknown order: "+a)}return this._order=a,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,a,s){return c_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(c_,a,s)}setFromVector3(e,a=this._order){return this.set(e.x,e.y,e.z,a)}reorder(e){return f_.setFromEuler(this),this.setFromQuaternion(f_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],a=0){return e[a]=this._x,e[a+1]=this._y,e[a+2]=this._z,e[a+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ta.DEFAULT_ORDER="XYZ";class _v{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let bE=0;const d_=new lt,Gs=new pl,va=new on,Ku=new lt,nl=new lt,TE=new lt,AE=new pl,h_=new lt(1,0,0),p_=new lt(0,1,0),m_=new lt(0,0,1),x_={type:"added"},RE={type:"removed"},Vs={type:"childadded",child:null},xh={type:"childremoved",child:null};class Nn extends io{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bE++}),this.uuid=hl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nn.DEFAULT_UP.clone();const e=new lt,a=new ta,s=new pl,u=new lt(1,1,1);function f(){s.setFromEuler(a,!1)}function d(){a.setFromQuaternion(s,void 0,!1)}a._onChange(f),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:a},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:u},modelViewMatrix:{value:new on},normalMatrix:{value:new xe}}),this.matrix=new on,this.matrixWorld=new on,this.matrixAutoUpdate=Nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _v,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,a){this.quaternion.setFromAxisAngle(e,a)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,a){return Gs.setFromAxisAngle(e,a),this.quaternion.multiply(Gs),this}rotateOnWorldAxis(e,a){return Gs.setFromAxisAngle(e,a),this.quaternion.premultiply(Gs),this}rotateX(e){return this.rotateOnAxis(h_,e)}rotateY(e){return this.rotateOnAxis(p_,e)}rotateZ(e){return this.rotateOnAxis(m_,e)}translateOnAxis(e,a){return d_.copy(e).applyQuaternion(this.quaternion),this.position.add(d_.multiplyScalar(a)),this}translateX(e){return this.translateOnAxis(h_,e)}translateY(e){return this.translateOnAxis(p_,e)}translateZ(e){return this.translateOnAxis(m_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(va.copy(this.matrixWorld).invert())}lookAt(e,a,s){e.isVector3?Ku.copy(e):Ku.set(e,a,s);const u=this.parent;this.updateWorldMatrix(!0,!1),nl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?va.lookAt(nl,Ku,this.up):va.lookAt(Ku,nl,this.up),this.quaternion.setFromRotationMatrix(va),u&&(va.extractRotation(u.matrixWorld),Gs.setFromRotationMatrix(va),this.quaternion.premultiply(Gs.invert()))}add(e){if(arguments.length>1){for(let a=0;a<arguments.length;a++)this.add(arguments[a]);return this}return e===this?(cn("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(x_),Vs.child=e,this.dispatchEvent(Vs),Vs.child=null):cn("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const a=this.children.indexOf(e);return a!==-1&&(e.parent=null,this.children.splice(a,1),e.dispatchEvent(RE),xh.child=e,this.dispatchEvent(xh),xh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),va.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),va.multiply(e.parent.matrixWorld)),e.applyMatrix4(va),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(x_),Vs.child=e,this.dispatchEvent(Vs),Vs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,a){if(this[e]===a)return this;for(let s=0,u=this.children.length;s<u;s++){const d=this.children[s].getObjectByProperty(e,a);if(d!==void 0)return d}}getObjectsByProperty(e,a,s=[]){this[e]===a&&s.push(this);const u=this.children;for(let f=0,d=u.length;f<d;f++)u[f].getObjectsByProperty(e,a,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nl,e,TE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nl,AE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const a=this.matrixWorld.elements;return e.set(a[8],a[9],a[10]).normalize()}raycast(){}traverse(e){e(this);const a=this.children;for(let s=0,u=a.length;s<u;s++)a[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const a=this.children;for(let s=0,u=a.length;s<u;s++)a[s].traverseVisible(e)}traverseAncestors(e){const a=this.parent;a!==null&&(e(a),a.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const a=this.children;for(let s=0,u=a.length;s<u;s++)a[s].updateMatrixWorld(e)}updateWorldMatrix(e,a){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),a===!0){const u=this.children;for(let f=0,d=u.length;f<d;f++)u[f].updateWorldMatrix(!1,!0)}}toJSON(e){const a=e===void 0||typeof e=="string",s={};a&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const u={};u.uuid=this.uuid,u.type=this.type,this.name!==""&&(u.name=this.name),this.castShadow===!0&&(u.castShadow=!0),this.receiveShadow===!0&&(u.receiveShadow=!0),this.visible===!1&&(u.visible=!1),this.frustumCulled===!1&&(u.frustumCulled=!1),this.renderOrder!==0&&(u.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(u.userData=this.userData),u.layers=this.layers.mask,u.matrix=this.matrix.toArray(),u.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(u.matrixAutoUpdate=!1),this.isInstancedMesh&&(u.type="InstancedMesh",u.count=this.count,u.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(u.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(u.type="BatchedMesh",u.perObjectFrustumCulled=this.perObjectFrustumCulled,u.sortObjects=this.sortObjects,u.drawRanges=this._drawRanges,u.reservedRanges=this._reservedRanges,u.geometryInfo=this._geometryInfo.map(h=>({...h,boundingBox:h.boundingBox?h.boundingBox.toJSON():void 0,boundingSphere:h.boundingSphere?h.boundingSphere.toJSON():void 0})),u.instanceInfo=this._instanceInfo.map(h=>({...h})),u.availableInstanceIds=this._availableInstanceIds.slice(),u.availableGeometryIds=this._availableGeometryIds.slice(),u.nextIndexStart=this._nextIndexStart,u.nextVertexStart=this._nextVertexStart,u.geometryCount=this._geometryCount,u.maxInstanceCount=this._maxInstanceCount,u.maxVertexCount=this._maxVertexCount,u.maxIndexCount=this._maxIndexCount,u.geometryInitialized=this._geometryInitialized,u.matricesTexture=this._matricesTexture.toJSON(e),u.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(u.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(u.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(u.boundingBox=this.boundingBox.toJSON()));function f(h,g){return h[g.uuid]===void 0&&(h[g.uuid]=g.toJSON(e)),g.uuid}if(this.isScene)this.background&&(this.background.isColor?u.background=this.background.toJSON():this.background.isTexture&&(u.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(u.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){u.geometry=f(e.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const g=h.shapes;if(Array.isArray(g))for(let x=0,_=g.length;x<_;x++){const p=g[x];f(e.shapes,p)}else f(e.shapes,g)}}if(this.isSkinnedMesh&&(u.bindMode=this.bindMode,u.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(f(e.skeletons,this.skeleton),u.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let g=0,x=this.material.length;g<x;g++)h.push(f(e.materials,this.material[g]));u.material=h}else u.material=f(e.materials,this.material);if(this.children.length>0){u.children=[];for(let h=0;h<this.children.length;h++)u.children.push(this.children[h].toJSON(e).object)}if(this.animations.length>0){u.animations=[];for(let h=0;h<this.animations.length;h++){const g=this.animations[h];u.animations.push(f(e.animations,g))}}if(a){const h=d(e.geometries),g=d(e.materials),x=d(e.textures),_=d(e.images),p=d(e.shapes),S=d(e.skeletons),M=d(e.animations),A=d(e.nodes);h.length>0&&(s.geometries=h),g.length>0&&(s.materials=g),x.length>0&&(s.textures=x),_.length>0&&(s.images=_),p.length>0&&(s.shapes=p),S.length>0&&(s.skeletons=S),M.length>0&&(s.animations=M),A.length>0&&(s.nodes=A)}return s.object=u,s;function d(h){const g=[];for(const x in h){const _=h[x];delete _.metadata,g.push(_)}return g}}clone(e){return new this.constructor().copy(this,e)}copy(e,a=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),a===!0)for(let s=0;s<e.children.length;s++){const u=e.children[s];this.add(u.clone())}return this}}Nn.DEFAULT_UP=new lt(0,1,0);Nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Li=new lt,Sa=new lt,gh=new lt,ya=new lt,Xs=new lt,ks=new lt,g_=new lt,_h=new lt,vh=new lt,Sh=new lt,yh=new sn,Mh=new sn,Eh=new sn;class Oi{constructor(e=new lt,a=new lt,s=new lt){this.a=e,this.b=a,this.c=s}static getNormal(e,a,s,u){u.subVectors(s,a),Li.subVectors(e,a),u.cross(Li);const f=u.lengthSq();return f>0?u.multiplyScalar(1/Math.sqrt(f)):u.set(0,0,0)}static getBarycoord(e,a,s,u,f){Li.subVectors(u,a),Sa.subVectors(s,a),gh.subVectors(e,a);const d=Li.dot(Li),h=Li.dot(Sa),g=Li.dot(gh),x=Sa.dot(Sa),_=Sa.dot(gh),p=d*x-h*h;if(p===0)return f.set(0,0,0),null;const S=1/p,M=(x*g-h*_)*S,A=(d*_-h*g)*S;return f.set(1-M-A,A,M)}static containsPoint(e,a,s,u){return this.getBarycoord(e,a,s,u,ya)===null?!1:ya.x>=0&&ya.y>=0&&ya.x+ya.y<=1}static getInterpolation(e,a,s,u,f,d,h,g){return this.getBarycoord(e,a,s,u,ya)===null?(g.x=0,g.y=0,"z"in g&&(g.z=0),"w"in g&&(g.w=0),null):(g.setScalar(0),g.addScaledVector(f,ya.x),g.addScaledVector(d,ya.y),g.addScaledVector(h,ya.z),g)}static getInterpolatedAttribute(e,a,s,u,f,d){return yh.setScalar(0),Mh.setScalar(0),Eh.setScalar(0),yh.fromBufferAttribute(e,a),Mh.fromBufferAttribute(e,s),Eh.fromBufferAttribute(e,u),d.setScalar(0),d.addScaledVector(yh,f.x),d.addScaledVector(Mh,f.y),d.addScaledVector(Eh,f.z),d}static isFrontFacing(e,a,s,u){return Li.subVectors(s,a),Sa.subVectors(e,a),Li.cross(Sa).dot(u)<0}set(e,a,s){return this.a.copy(e),this.b.copy(a),this.c.copy(s),this}setFromPointsAndIndices(e,a,s,u){return this.a.copy(e[a]),this.b.copy(e[s]),this.c.copy(e[u]),this}setFromAttributeAndIndices(e,a,s,u){return this.a.fromBufferAttribute(e,a),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,u),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),Sa.subVectors(this.a,this.b),Li.cross(Sa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Oi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,a){return Oi.getBarycoord(e,this.a,this.b,this.c,a)}getInterpolation(e,a,s,u,f){return Oi.getInterpolation(e,this.a,this.b,this.c,a,s,u,f)}containsPoint(e){return Oi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Oi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,a){const s=this.a,u=this.b,f=this.c;let d,h;Xs.subVectors(u,s),ks.subVectors(f,s),_h.subVectors(e,s);const g=Xs.dot(_h),x=ks.dot(_h);if(g<=0&&x<=0)return a.copy(s);vh.subVectors(e,u);const _=Xs.dot(vh),p=ks.dot(vh);if(_>=0&&p<=_)return a.copy(u);const S=g*p-_*x;if(S<=0&&g>=0&&_<=0)return d=g/(g-_),a.copy(s).addScaledVector(Xs,d);Sh.subVectors(e,f);const M=Xs.dot(Sh),A=ks.dot(Sh);if(A>=0&&M<=A)return a.copy(f);const C=M*x-g*A;if(C<=0&&x>=0&&A<=0)return h=x/(x-A),a.copy(s).addScaledVector(ks,h);const y=_*A-M*p;if(y<=0&&p-_>=0&&M-A>=0)return g_.subVectors(f,u),h=(p-_)/(p-_+(M-A)),a.copy(u).addScaledVector(g_,h);const v=1/(y+C+S);return d=C*v,h=S*v,a.copy(s).addScaledVector(Xs,d).addScaledVector(ks,h)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},or={h:0,s:0,l:0},Qu={h:0,s:0,l:0};function bh(o,e,a){return a<0&&(a+=1),a>1&&(a-=1),a<1/6?o+(e-o)*6*a:a<1/2?e:a<2/3?o+(e-o)*6*(2/3-a):o}class Pe{constructor(e,a,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,a,s)}set(e,a,s){if(a===void 0&&s===void 0){const u=e;u&&u.isColor?this.copy(u):typeof u=="number"?this.setHex(u):typeof u=="string"&&this.setStyle(u)}else this.setRGB(e,a,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,a=li){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Oe.colorSpaceToWorking(this,a),this}setRGB(e,a,s,u=Oe.workingColorSpace){return this.r=e,this.g=a,this.b=s,Oe.colorSpaceToWorking(this,u),this}setHSL(e,a,s,u=Oe.workingColorSpace){if(e=pE(e,1),a=we(a,0,1),s=we(s,0,1),a===0)this.r=this.g=this.b=s;else{const f=s<=.5?s*(1+a):s+a-s*a,d=2*s-f;this.r=bh(d,f,e+1/3),this.g=bh(d,f,e),this.b=bh(d,f,e-1/3)}return Oe.colorSpaceToWorking(this,u),this}setStyle(e,a=li){function s(f){f!==void 0&&parseFloat(f)<1&&me("Color: Alpha component of "+e+" will be ignored.")}let u;if(u=/^(\w+)\(([^\)]*)\)/.exec(e)){let f;const d=u[1],h=u[2];switch(d){case"rgb":case"rgba":if(f=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(f[4]),this.setRGB(Math.min(255,parseInt(f[1],10))/255,Math.min(255,parseInt(f[2],10))/255,Math.min(255,parseInt(f[3],10))/255,a);if(f=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(f[4]),this.setRGB(Math.min(100,parseInt(f[1],10))/100,Math.min(100,parseInt(f[2],10))/100,Math.min(100,parseInt(f[3],10))/100,a);break;case"hsl":case"hsla":if(f=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(f[4]),this.setHSL(parseFloat(f[1])/360,parseFloat(f[2])/100,parseFloat(f[3])/100,a);break;default:me("Color: Unknown color model "+e)}}else if(u=/^\#([A-Fa-f\d]+)$/.exec(e)){const f=u[1],d=f.length;if(d===3)return this.setRGB(parseInt(f.charAt(0),16)/15,parseInt(f.charAt(1),16)/15,parseInt(f.charAt(2),16)/15,a);if(d===6)return this.setHex(parseInt(f,16),a);me("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,a);return this}setColorName(e,a=li){const s=vv[e.toLowerCase()];return s!==void 0?this.setHex(s,a):me("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ra(e.r),this.g=Ra(e.g),this.b=Ra(e.b),this}copyLinearToSRGB(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=li){return Oe.workingToColorSpace(zn.copy(this),e),Math.round(we(zn.r*255,0,255))*65536+Math.round(we(zn.g*255,0,255))*256+Math.round(we(zn.b*255,0,255))}getHexString(e=li){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,a=Oe.workingColorSpace){Oe.workingToColorSpace(zn.copy(this),a);const s=zn.r,u=zn.g,f=zn.b,d=Math.max(s,u,f),h=Math.min(s,u,f);let g,x;const _=(h+d)/2;if(h===d)g=0,x=0;else{const p=d-h;switch(x=_<=.5?p/(d+h):p/(2-d-h),d){case s:g=(u-f)/p+(u<f?6:0);break;case u:g=(f-s)/p+2;break;case f:g=(s-u)/p+4;break}g/=6}return e.h=g,e.s=x,e.l=_,e}getRGB(e,a=Oe.workingColorSpace){return Oe.workingToColorSpace(zn.copy(this),a),e.r=zn.r,e.g=zn.g,e.b=zn.b,e}getStyle(e=li){Oe.workingToColorSpace(zn.copy(this),e);const a=zn.r,s=zn.g,u=zn.b;return e!==li?`color(${e} ${a.toFixed(3)} ${s.toFixed(3)} ${u.toFixed(3)})`:`rgb(${Math.round(a*255)},${Math.round(s*255)},${Math.round(u*255)})`}offsetHSL(e,a,s){return this.getHSL(or),this.setHSL(or.h+e,or.s+a,or.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,a){return this.r=e.r+a.r,this.g=e.g+a.g,this.b=e.b+a.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,a){return this.r+=(e.r-this.r)*a,this.g+=(e.g-this.g)*a,this.b+=(e.b-this.b)*a,this}lerpColors(e,a,s){return this.r=e.r+(a.r-e.r)*s,this.g=e.g+(a.g-e.g)*s,this.b=e.b+(a.b-e.b)*s,this}lerpHSL(e,a){this.getHSL(or),e.getHSL(Qu);const s=sh(or.h,Qu.h,a),u=sh(or.s,Qu.s,a),f=sh(or.l,Qu.l,a);return this.setHSL(s,u,f),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const a=this.r,s=this.g,u=this.b,f=e.elements;return this.r=f[0]*a+f[3]*s+f[6]*u,this.g=f[1]*a+f[4]*s+f[7]*u,this.b=f[2]*a+f[5]*s+f[8]*u,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,a=0){return this.r=e[a],this.g=e[a+1],this.b=e[a+2],this}toArray(e=[],a=0){return e[a]=this.r,e[a+1]=this.g,e[a+2]=this.b,e}fromBufferAttribute(e,a){return this.r=e.getX(a),this.g=e.getY(a),this.b=e.getZ(a),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zn=new Pe;Pe.NAMES=vv;let CE=0;class ao extends io{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:CE++}),this.uuid=hl(),this.name="",this.type="Material",this.blending=Zs,this.side=dr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ih,this.blendDst=Bh,this.blendEquation=kr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=n_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ps,this.stencilZFail=Ps,this.stencilZPass=Ps,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const a in e){const s=e[a];if(s===void 0){me(`Material: parameter '${a}' has value of undefined.`);continue}const u=this[a];if(u===void 0){me(`Material: '${a}' is not a property of THREE.${this.type}.`);continue}u&&u.isColor?u.set(s):u&&u.isVector3&&s&&s.isVector3?u.copy(s):this[a]=s}}toJSON(e){const a=e===void 0||typeof e=="string";a&&(e={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Zs&&(s.blending=this.blending),this.side!==dr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Ih&&(s.blendSrc=this.blendSrc),this.blendDst!==Bh&&(s.blendDst=this.blendDst),this.blendEquation!==kr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Qs&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==n_&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ps&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Ps&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Ps&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function u(f){const d=[];for(const h in f){const g=f[h];delete g.metadata,d.push(g)}return d}if(a){const f=u(e.textures),d=u(e.images);f.length>0&&(s.textures=f),d.length>0&&(s.images=d)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const a=e.clippingPlanes;let s=null;if(a!==null){const u=a.length;s=new Array(u);for(let f=0;f!==u;++f)s[f]=a[f].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Sc extends ao{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ta,this.combine=av,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xn=new lt,Ju=new ze;let wE=0;class zi{constructor(e,a,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wE++}),this.name="",this.array=e,this.itemSize=a,this.count=e!==void 0?e.length/a:0,this.normalized=s,this.usage=i_,this.updateRanges=[],this.gpuType=Ta,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,a){this.updateRanges.push({start:e,count:a})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,a,s){e*=this.itemSize,s*=a.itemSize;for(let u=0,f=this.itemSize;u<f;u++)this.array[e+u]=a.array[s+u];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let a=0,s=this.count;a<s;a++)Ju.fromBufferAttribute(this,a),Ju.applyMatrix3(e),this.setXY(a,Ju.x,Ju.y);else if(this.itemSize===3)for(let a=0,s=this.count;a<s;a++)xn.fromBufferAttribute(this,a),xn.applyMatrix3(e),this.setXYZ(a,xn.x,xn.y,xn.z);return this}applyMatrix4(e){for(let a=0,s=this.count;a<s;a++)xn.fromBufferAttribute(this,a),xn.applyMatrix4(e),this.setXYZ(a,xn.x,xn.y,xn.z);return this}applyNormalMatrix(e){for(let a=0,s=this.count;a<s;a++)xn.fromBufferAttribute(this,a),xn.applyNormalMatrix(e),this.setXYZ(a,xn.x,xn.y,xn.z);return this}transformDirection(e){for(let a=0,s=this.count;a<s;a++)xn.fromBufferAttribute(this,a),xn.transformDirection(e),this.setXYZ(a,xn.x,xn.y,xn.z);return this}set(e,a=0){return this.array.set(e,a),this}getComponent(e,a){let s=this.array[e*this.itemSize+a];return this.normalized&&(s=$o(s,this.array)),s}setComponent(e,a,s){return this.normalized&&(s=Kn(s,this.array)),this.array[e*this.itemSize+a]=s,this}getX(e){let a=this.array[e*this.itemSize];return this.normalized&&(a=$o(a,this.array)),a}setX(e,a){return this.normalized&&(a=Kn(a,this.array)),this.array[e*this.itemSize]=a,this}getY(e){let a=this.array[e*this.itemSize+1];return this.normalized&&(a=$o(a,this.array)),a}setY(e,a){return this.normalized&&(a=Kn(a,this.array)),this.array[e*this.itemSize+1]=a,this}getZ(e){let a=this.array[e*this.itemSize+2];return this.normalized&&(a=$o(a,this.array)),a}setZ(e,a){return this.normalized&&(a=Kn(a,this.array)),this.array[e*this.itemSize+2]=a,this}getW(e){let a=this.array[e*this.itemSize+3];return this.normalized&&(a=$o(a,this.array)),a}setW(e,a){return this.normalized&&(a=Kn(a,this.array)),this.array[e*this.itemSize+3]=a,this}setXY(e,a,s){return e*=this.itemSize,this.normalized&&(a=Kn(a,this.array),s=Kn(s,this.array)),this.array[e+0]=a,this.array[e+1]=s,this}setXYZ(e,a,s,u){return e*=this.itemSize,this.normalized&&(a=Kn(a,this.array),s=Kn(s,this.array),u=Kn(u,this.array)),this.array[e+0]=a,this.array[e+1]=s,this.array[e+2]=u,this}setXYZW(e,a,s,u,f){return e*=this.itemSize,this.normalized&&(a=Kn(a,this.array),s=Kn(s,this.array),u=Kn(u,this.array),f=Kn(f,this.array)),this.array[e+0]=a,this.array[e+1]=s,this.array[e+2]=u,this.array[e+3]=f,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==i_&&(e.usage=this.usage),e}}class Sv extends zi{constructor(e,a,s){super(new Uint16Array(e),a,s)}}class yv extends zi{constructor(e,a,s){super(new Uint32Array(e),a,s)}}class ci extends zi{constructor(e,a,s){super(new Float32Array(e),a,s)}}let DE=0;const yi=new on,Th=new Nn,qs=new lt,oi=new ml,il=new ml,bn=new lt;class bi extends io{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:DE++}),this.uuid=hl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mv(e)?yv:Sv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,a){return this.attributes[e]=a,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,a,s=0){this.groups.push({start:e,count:a,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,a){this.drawRange.start=e,this.drawRange.count=a}applyMatrix4(e){const a=this.attributes.position;a!==void 0&&(a.applyMatrix4(e),a.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const f=new xe().getNormalMatrix(e);s.applyNormalMatrix(f),s.needsUpdate=!0}const u=this.attributes.tangent;return u!==void 0&&(u.transformDirection(e),u.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yi.makeRotationFromQuaternion(e),this.applyMatrix4(yi),this}rotateX(e){return yi.makeRotationX(e),this.applyMatrix4(yi),this}rotateY(e){return yi.makeRotationY(e),this.applyMatrix4(yi),this}rotateZ(e){return yi.makeRotationZ(e),this.applyMatrix4(yi),this}translate(e,a,s){return yi.makeTranslation(e,a,s),this.applyMatrix4(yi),this}scale(e,a,s){return yi.makeScale(e,a,s),this.applyMatrix4(yi),this}lookAt(e){return Th.lookAt(e),Th.updateMatrix(),this.applyMatrix4(Th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qs).negate(),this.translate(qs.x,qs.y,qs.z),this}setFromPoints(e){const a=this.getAttribute("position");if(a===void 0){const s=[];for(let u=0,f=e.length;u<f;u++){const d=e[u];s.push(d.x,d.y,d.z||0)}this.setAttribute("position",new ci(s,3))}else{const s=Math.min(e.length,a.count);for(let u=0;u<s;u++){const f=e[u];a.setXYZ(u,f.x,f.y,f.z||0)}e.length>a.count&&me("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),a.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ml);const e=this.attributes.position,a=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){cn("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new lt(-1/0,-1/0,-1/0),new lt(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),a)for(let s=0,u=a.length;s<u;s++){const f=a[s];oi.setFromBufferAttribute(f),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,oi.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,oi.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(oi.min),this.boundingBox.expandByPoint(oi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&cn('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ec);const e=this.attributes.position,a=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){cn("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new lt,1/0);return}if(e){const s=this.boundingSphere.center;if(oi.setFromBufferAttribute(e),a)for(let f=0,d=a.length;f<d;f++){const h=a[f];il.setFromBufferAttribute(h),this.morphTargetsRelative?(bn.addVectors(oi.min,il.min),oi.expandByPoint(bn),bn.addVectors(oi.max,il.max),oi.expandByPoint(bn)):(oi.expandByPoint(il.min),oi.expandByPoint(il.max))}oi.getCenter(s);let u=0;for(let f=0,d=e.count;f<d;f++)bn.fromBufferAttribute(e,f),u=Math.max(u,s.distanceToSquared(bn));if(a)for(let f=0,d=a.length;f<d;f++){const h=a[f],g=this.morphTargetsRelative;for(let x=0,_=h.count;x<_;x++)bn.fromBufferAttribute(h,x),g&&(qs.fromBufferAttribute(e,x),bn.add(qs)),u=Math.max(u,s.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(u),isNaN(this.boundingSphere.radius)&&cn('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,a=this.attributes;if(e===null||a.position===void 0||a.normal===void 0||a.uv===void 0){cn("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=a.position,u=a.normal,f=a.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zi(new Float32Array(4*s.count),4));const d=this.getAttribute("tangent"),h=[],g=[];for(let Y=0;Y<s.count;Y++)h[Y]=new lt,g[Y]=new lt;const x=new lt,_=new lt,p=new lt,S=new ze,M=new ze,A=new ze,C=new lt,y=new lt;function v(Y,D,w){x.fromBufferAttribute(s,Y),_.fromBufferAttribute(s,D),p.fromBufferAttribute(s,w),S.fromBufferAttribute(f,Y),M.fromBufferAttribute(f,D),A.fromBufferAttribute(f,w),_.sub(x),p.sub(x),M.sub(S),A.sub(S);const q=1/(M.x*A.y-A.x*M.y);isFinite(q)&&(C.copy(_).multiplyScalar(A.y).addScaledVector(p,-M.y).multiplyScalar(q),y.copy(p).multiplyScalar(M.x).addScaledVector(_,-A.x).multiplyScalar(q),h[Y].add(C),h[D].add(C),h[w].add(C),g[Y].add(y),g[D].add(y),g[w].add(y))}let L=this.groups;L.length===0&&(L=[{start:0,count:e.count}]);for(let Y=0,D=L.length;Y<D;++Y){const w=L[Y],q=w.start,at=w.count;for(let ut=q,gt=q+at;ut<gt;ut+=3)v(e.getX(ut+0),e.getX(ut+1),e.getX(ut+2))}const O=new lt,z=new lt,V=new lt,N=new lt;function I(Y){V.fromBufferAttribute(u,Y),N.copy(V);const D=h[Y];O.copy(D),O.sub(V.multiplyScalar(V.dot(D))).normalize(),z.crossVectors(N,D);const q=z.dot(g[Y])<0?-1:1;d.setXYZW(Y,O.x,O.y,O.z,q)}for(let Y=0,D=L.length;Y<D;++Y){const w=L[Y],q=w.start,at=w.count;for(let ut=q,gt=q+at;ut<gt;ut+=3)I(e.getX(ut+0)),I(e.getX(ut+1)),I(e.getX(ut+2))}}computeVertexNormals(){const e=this.index,a=this.getAttribute("position");if(a!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new zi(new Float32Array(a.count*3),3),this.setAttribute("normal",s);else for(let S=0,M=s.count;S<M;S++)s.setXYZ(S,0,0,0);const u=new lt,f=new lt,d=new lt,h=new lt,g=new lt,x=new lt,_=new lt,p=new lt;if(e)for(let S=0,M=e.count;S<M;S+=3){const A=e.getX(S+0),C=e.getX(S+1),y=e.getX(S+2);u.fromBufferAttribute(a,A),f.fromBufferAttribute(a,C),d.fromBufferAttribute(a,y),_.subVectors(d,f),p.subVectors(u,f),_.cross(p),h.fromBufferAttribute(s,A),g.fromBufferAttribute(s,C),x.fromBufferAttribute(s,y),h.add(_),g.add(_),x.add(_),s.setXYZ(A,h.x,h.y,h.z),s.setXYZ(C,g.x,g.y,g.z),s.setXYZ(y,x.x,x.y,x.z)}else for(let S=0,M=a.count;S<M;S+=3)u.fromBufferAttribute(a,S+0),f.fromBufferAttribute(a,S+1),d.fromBufferAttribute(a,S+2),_.subVectors(d,f),p.subVectors(u,f),_.cross(p),s.setXYZ(S+0,_.x,_.y,_.z),s.setXYZ(S+1,_.x,_.y,_.z),s.setXYZ(S+2,_.x,_.y,_.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let a=0,s=e.count;a<s;a++)bn.fromBufferAttribute(e,a),bn.normalize(),e.setXYZ(a,bn.x,bn.y,bn.z)}toNonIndexed(){function e(h,g){const x=h.array,_=h.itemSize,p=h.normalized,S=new x.constructor(g.length*_);let M=0,A=0;for(let C=0,y=g.length;C<y;C++){h.isInterleavedBufferAttribute?M=g[C]*h.data.stride+h.offset:M=g[C]*_;for(let v=0;v<_;v++)S[A++]=x[M++]}return new zi(S,_,p)}if(this.index===null)return me("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const a=new bi,s=this.index.array,u=this.attributes;for(const h in u){const g=u[h],x=e(g,s);a.setAttribute(h,x)}const f=this.morphAttributes;for(const h in f){const g=[],x=f[h];for(let _=0,p=x.length;_<p;_++){const S=x[_],M=e(S,s);g.push(M)}a.morphAttributes[h]=g}a.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,g=d.length;h<g;h++){const x=d[h];a.addGroup(x.start,x.count,x.materialIndex)}return a}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const g=this.parameters;for(const x in g)g[x]!==void 0&&(e[x]=g[x]);return e}e.data={attributes:{}};const a=this.index;a!==null&&(e.data.index={type:a.array.constructor.name,array:Array.prototype.slice.call(a.array)});const s=this.attributes;for(const g in s){const x=s[g];e.data.attributes[g]=x.toJSON(e.data)}const u={};let f=!1;for(const g in this.morphAttributes){const x=this.morphAttributes[g],_=[];for(let p=0,S=x.length;p<S;p++){const M=x[p];_.push(M.toJSON(e.data))}_.length>0&&(u[g]=_,f=!0)}f&&(e.data.morphAttributes=u,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(e.data.boundingSphere=h.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const a={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone());const u=e.attributes;for(const x in u){const _=u[x];this.setAttribute(x,_.clone(a))}const f=e.morphAttributes;for(const x in f){const _=[],p=f[x];for(let S=0,M=p.length;S<M;S++)_.push(p[S].clone(a));this.morphAttributes[x]=_}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let x=0,_=d.length;x<_;x++){const p=d[x];this.addGroup(p.start,p.count,p.materialIndex)}const h=e.boundingBox;h!==null&&(this.boundingBox=h.clone());const g=e.boundingSphere;return g!==null&&(this.boundingSphere=g.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const __=new on,Fr=new gv,$u=new Ec,v_=new lt,tc=new lt,ec=new lt,nc=new lt,Ah=new lt,ic=new lt,S_=new lt,ac=new lt;class Ii extends Nn{constructor(e=new bi,a=new Sc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=a,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,a){return super.copy(e,a),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const a=this.geometry.morphAttributes,s=Object.keys(a);if(s.length>0){const u=a[s[0]];if(u!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let f=0,d=u.length;f<d;f++){const h=u[f].name||String(f);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=f}}}}getVertexPosition(e,a){const s=this.geometry,u=s.attributes.position,f=s.morphAttributes.position,d=s.morphTargetsRelative;a.fromBufferAttribute(u,e);const h=this.morphTargetInfluences;if(f&&h){ic.set(0,0,0);for(let g=0,x=f.length;g<x;g++){const _=h[g],p=f[g];_!==0&&(Ah.fromBufferAttribute(p,e),d?ic.addScaledVector(Ah,_):ic.addScaledVector(Ah.sub(a),_))}a.add(ic)}return a}raycast(e,a){const s=this.geometry,u=this.material,f=this.matrixWorld;u!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),$u.copy(s.boundingSphere),$u.applyMatrix4(f),Fr.copy(e.ray).recast(e.near),!($u.containsPoint(Fr.origin)===!1&&(Fr.intersectSphere($u,v_)===null||Fr.origin.distanceToSquared(v_)>(e.far-e.near)**2))&&(__.copy(f).invert(),Fr.copy(e.ray).applyMatrix4(__),!(s.boundingBox!==null&&Fr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,a,Fr)))}_computeIntersections(e,a,s){let u;const f=this.geometry,d=this.material,h=f.index,g=f.attributes.position,x=f.attributes.uv,_=f.attributes.uv1,p=f.attributes.normal,S=f.groups,M=f.drawRange;if(h!==null)if(Array.isArray(d))for(let A=0,C=S.length;A<C;A++){const y=S[A],v=d[y.materialIndex],L=Math.max(y.start,M.start),O=Math.min(h.count,Math.min(y.start+y.count,M.start+M.count));for(let z=L,V=O;z<V;z+=3){const N=h.getX(z),I=h.getX(z+1),Y=h.getX(z+2);u=rc(this,v,e,s,x,_,p,N,I,Y),u&&(u.faceIndex=Math.floor(z/3),u.face.materialIndex=y.materialIndex,a.push(u))}}else{const A=Math.max(0,M.start),C=Math.min(h.count,M.start+M.count);for(let y=A,v=C;y<v;y+=3){const L=h.getX(y),O=h.getX(y+1),z=h.getX(y+2);u=rc(this,d,e,s,x,_,p,L,O,z),u&&(u.faceIndex=Math.floor(y/3),a.push(u))}}else if(g!==void 0)if(Array.isArray(d))for(let A=0,C=S.length;A<C;A++){const y=S[A],v=d[y.materialIndex],L=Math.max(y.start,M.start),O=Math.min(g.count,Math.min(y.start+y.count,M.start+M.count));for(let z=L,V=O;z<V;z+=3){const N=z,I=z+1,Y=z+2;u=rc(this,v,e,s,x,_,p,N,I,Y),u&&(u.faceIndex=Math.floor(z/3),u.face.materialIndex=y.materialIndex,a.push(u))}}else{const A=Math.max(0,M.start),C=Math.min(g.count,M.start+M.count);for(let y=A,v=C;y<v;y+=3){const L=y,O=y+1,z=y+2;u=rc(this,d,e,s,x,_,p,L,O,z),u&&(u.faceIndex=Math.floor(y/3),a.push(u))}}}}function UE(o,e,a,s,u,f,d,h){let g;if(e.side===Qn?g=s.intersectTriangle(d,f,u,!0,h):g=s.intersectTriangle(u,f,d,e.side===dr,h),g===null)return null;ac.copy(h),ac.applyMatrix4(o.matrixWorld);const x=a.ray.origin.distanceTo(ac);return x<a.near||x>a.far?null:{distance:x,point:ac.clone(),object:o}}function rc(o,e,a,s,u,f,d,h,g,x){o.getVertexPosition(h,tc),o.getVertexPosition(g,ec),o.getVertexPosition(x,nc);const _=UE(o,e,a,s,tc,ec,nc,S_);if(_){const p=new lt;Oi.getBarycoord(S_,tc,ec,nc,p),u&&(_.uv=Oi.getInterpolatedAttribute(u,h,g,x,p,new ze)),f&&(_.uv1=Oi.getInterpolatedAttribute(f,h,g,x,p,new ze)),d&&(_.normal=Oi.getInterpolatedAttribute(d,h,g,x,p,new lt),_.normal.dot(s.direction)>0&&_.normal.multiplyScalar(-1));const S={a:h,b:g,c:x,normal:new lt,materialIndex:0};Oi.getNormal(tc,ec,nc,S.normal),_.face=S,_.barycoord=p}return _}class xl extends bi{constructor(e=1,a=1,s=1,u=1,f=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:a,depth:s,widthSegments:u,heightSegments:f,depthSegments:d};const h=this;u=Math.floor(u),f=Math.floor(f),d=Math.floor(d);const g=[],x=[],_=[],p=[];let S=0,M=0;A("z","y","x",-1,-1,s,a,e,d,f,0),A("z","y","x",1,-1,s,a,-e,d,f,1),A("x","z","y",1,1,e,s,a,u,d,2),A("x","z","y",1,-1,e,s,-a,u,d,3),A("x","y","z",1,-1,e,a,s,u,f,4),A("x","y","z",-1,-1,e,a,-s,u,f,5),this.setIndex(g),this.setAttribute("position",new ci(x,3)),this.setAttribute("normal",new ci(_,3)),this.setAttribute("uv",new ci(p,2));function A(C,y,v,L,O,z,V,N,I,Y,D){const w=z/I,q=V/Y,at=z/2,ut=V/2,gt=N/2,ct=I+1,K=Y+1;let rt=0,J=0;const St=new lt;for(let _t=0;_t<K;_t++){const Vt=_t*q-ut;for(let le=0;le<ct;le++){const Ee=le*w-at;St[C]=Ee*L,St[y]=Vt*O,St[v]=gt,x.push(St.x,St.y,St.z),St[C]=0,St[y]=0,St[v]=N>0?1:-1,_.push(St.x,St.y,St.z),p.push(le/I),p.push(1-_t/Y),rt+=1}}for(let _t=0;_t<Y;_t++)for(let Vt=0;Vt<I;Vt++){const le=S+Vt+ct*_t,Ee=S+Vt+ct*(_t+1),E=S+(Vt+1)+ct*(_t+1),G=S+(Vt+1)+ct*_t;g.push(le,Ee,G),g.push(Ee,E,G),J+=6}h.addGroup(M,J,D),M+=J,S+=rt}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function eo(o){const e={};for(const a in o){e[a]={};for(const s in o[a]){const u=o[a][s];u&&(u.isColor||u.isMatrix3||u.isMatrix4||u.isVector2||u.isVector3||u.isVector4||u.isTexture||u.isQuaternion)?u.isRenderTargetTexture?(me("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[a][s]=null):e[a][s]=u.clone():Array.isArray(u)?e[a][s]=u.slice():e[a][s]=u}}return e}function Vn(o){const e={};for(let a=0;a<o.length;a++){const s=eo(o[a]);for(const u in s)e[u]=s[u]}return e}function NE(o){const e=[];for(let a=0;a<o.length;a++)e.push(o[a].clone());return e}function Mv(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Oe.workingColorSpace}const LE={clone:eo,merge:Vn};var OE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,PE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ca extends ao{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=OE,this.fragmentShader=PE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=eo(e.uniforms),this.uniformsGroups=NE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const a=super.toJSON(e);a.glslVersion=this.glslVersion,a.uniforms={};for(const u in this.uniforms){const d=this.uniforms[u].value;d&&d.isTexture?a.uniforms[u]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?a.uniforms[u]={type:"c",value:d.getHex()}:d&&d.isVector2?a.uniforms[u]={type:"v2",value:d.toArray()}:d&&d.isVector3?a.uniforms[u]={type:"v3",value:d.toArray()}:d&&d.isVector4?a.uniforms[u]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?a.uniforms[u]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?a.uniforms[u]={type:"m4",value:d.toArray()}:a.uniforms[u]={value:d}}Object.keys(this.defines).length>0&&(a.defines=this.defines),a.vertexShader=this.vertexShader,a.fragmentShader=this.fragmentShader,a.lights=this.lights,a.clipping=this.clipping;const s={};for(const u in this.extensions)this.extensions[u]===!0&&(s[u]=!0);return Object.keys(s).length>0&&(a.extensions=s),a}}class Ev extends Nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new on,this.projectionMatrix=new on,this.projectionMatrixInverse=new on,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,a){return super.copy(e,a),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,a){super.updateWorldMatrix(e,a),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const lr=new lt,y_=new ze,M_=new ze;class Mi extends Ev{constructor(e=50,a=1,s=.1,u=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=u,this.focus=10,this.aspect=a,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,a){return super.copy(e,a),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const a=.5*this.getFilmHeight()/e;this.fov=bp*2*Math.atan(a),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bp*2*Math.atan(Math.tan(rh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,a,s){lr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),a.set(lr.x,lr.y).multiplyScalar(-e/lr.z),lr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(lr.x,lr.y).multiplyScalar(-e/lr.z)}getViewSize(e,a){return this.getViewBounds(e,y_,M_),a.subVectors(M_,y_)}setViewOffset(e,a,s,u,f,d){this.aspect=e/a,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=a,this.view.offsetX=s,this.view.offsetY=u,this.view.width=f,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let a=e*Math.tan(rh*.5*this.fov)/this.zoom,s=2*a,u=this.aspect*s,f=-.5*u;const d=this.view;if(this.view!==null&&this.view.enabled){const g=d.fullWidth,x=d.fullHeight;f+=d.offsetX*u/g,a-=d.offsetY*s/x,u*=d.width/g,s*=d.height/x}const h=this.filmOffset;h!==0&&(f+=e*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(f,f+u,a,a-s,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const a=super.toJSON(e);return a.object.fov=this.fov,a.object.zoom=this.zoom,a.object.near=this.near,a.object.far=this.far,a.object.focus=this.focus,a.object.aspect=this.aspect,this.view!==null&&(a.object.view=Object.assign({},this.view)),a.object.filmGauge=this.filmGauge,a.object.filmOffset=this.filmOffset,a}}const Ys=-90,Ws=1;class zE extends Nn{constructor(e,a,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const u=new Mi(Ys,Ws,e,a);u.layers=this.layers,this.add(u);const f=new Mi(Ys,Ws,e,a);f.layers=this.layers,this.add(f);const d=new Mi(Ys,Ws,e,a);d.layers=this.layers,this.add(d);const h=new Mi(Ys,Ws,e,a);h.layers=this.layers,this.add(h);const g=new Mi(Ys,Ws,e,a);g.layers=this.layers,this.add(g);const x=new Mi(Ys,Ws,e,a);x.layers=this.layers,this.add(x)}updateCoordinateSystem(){const e=this.coordinateSystem,a=this.children.concat(),[s,u,f,d,h,g]=a;for(const x of a)this.remove(x);if(e===Ji)s.up.set(0,1,0),s.lookAt(1,0,0),u.up.set(0,1,0),u.lookAt(-1,0,0),f.up.set(0,0,-1),f.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),g.up.set(0,1,0),g.lookAt(0,0,-1);else if(e===_c)s.up.set(0,-1,0),s.lookAt(-1,0,0),u.up.set(0,-1,0),u.lookAt(1,0,0),f.up.set(0,0,1),f.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),g.up.set(0,-1,0),g.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const x of a)this.add(x),x.updateMatrixWorld()}update(e,a){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:u}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[f,d,h,g,x,_]=this.children,p=e.getRenderTarget(),S=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),A=e.xr.enabled;e.xr.enabled=!1;const C=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,u),e.render(a,f),e.setRenderTarget(s,1,u),e.render(a,d),e.setRenderTarget(s,2,u),e.render(a,h),e.setRenderTarget(s,3,u),e.render(a,g),e.setRenderTarget(s,4,u),e.render(a,x),s.texture.generateMipmaps=C,e.setRenderTarget(s,5,u),e.render(a,_),e.setRenderTarget(p,S,M),e.xr.enabled=A,s.texture.needsPMREMUpdate=!0}}class bv extends Xn{constructor(e=[],a=Js,s,u,f,d,h,g,x,_){super(e,a,s,u,f,d,h,g,x,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class IE extends Zr{constructor(e=1,a={}){super(e,e,a),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},u=[s,s,s,s,s,s];this.texture=new bv(u),this._setTextureOptions(a),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,a){this.texture.type=a.type,this.texture.colorSpace=a.colorSpace,this.texture.generateMipmaps=a.generateMipmaps,this.texture.minFilter=a.minFilter,this.texture.magFilter=a.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},u=new xl(5,5,5),f=new Ca({name:"CubemapFromEquirect",uniforms:eo(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Qn,blending:Aa});f.uniforms.tEquirect.value=a;const d=new Ii(u,f),h=a.minFilter;return a.minFilter===Yr&&(a.minFilter=Ei),new zE(1,10,this).update(e,d),a.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(e,a=!0,s=!0,u=!0){const f=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(a,s,u);e.setRenderTarget(f)}}class sl extends Nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const BE={type:"move"};class Rh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new sl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new sl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new lt,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new lt),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new sl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new lt,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new lt),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const a=this._hand;if(a)for(const s of e.hand.values())this._getHandJoint(a,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,a,s){let u=null,f=null,d=null;const h=this._targetRay,g=this._grip,x=this._hand;if(e&&a.session.visibilityState!=="visible-blurred"){if(x&&e.hand){d=!0;for(const C of e.hand.values()){const y=a.getJointPose(C,s),v=this._getHandJoint(x,C);y!==null&&(v.matrix.fromArray(y.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=y.radius),v.visible=y!==null}const _=x.joints["index-finger-tip"],p=x.joints["thumb-tip"],S=_.position.distanceTo(p.position),M=.02,A=.005;x.inputState.pinching&&S>M+A?(x.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!x.inputState.pinching&&S<=M-A&&(x.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else g!==null&&e.gripSpace&&(f=a.getPose(e.gripSpace,s),f!==null&&(g.matrix.fromArray(f.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,f.linearVelocity?(g.hasLinearVelocity=!0,g.linearVelocity.copy(f.linearVelocity)):g.hasLinearVelocity=!1,f.angularVelocity?(g.hasAngularVelocity=!0,g.angularVelocity.copy(f.angularVelocity)):g.hasAngularVelocity=!1));h!==null&&(u=a.getPose(e.targetRaySpace,s),u===null&&f!==null&&(u=f),u!==null&&(h.matrix.fromArray(u.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,u.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(u.linearVelocity)):h.hasLinearVelocity=!1,u.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(u.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(BE)))}return h!==null&&(h.visible=u!==null),g!==null&&(g.visible=f!==null),x!==null&&(x.visible=d!==null),this}_getHandJoint(e,a){if(e.joints[a.jointName]===void 0){const s=new sl;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[a.jointName]=s,e.add(s)}return e.joints[a.jointName]}}class FE extends Nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ta,this.environmentIntensity=1,this.environmentRotation=new ta,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,a){return super.copy(e,a),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const a=super.toJSON(e);return this.fog!==null&&(a.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(a.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(a.object.backgroundIntensity=this.backgroundIntensity),a.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(a.object.environmentIntensity=this.environmentIntensity),a.object.environmentRotation=this.environmentRotation.toArray(),a}}class HE extends Xn{constructor(e=null,a=1,s=1,u,f,d,h,g,x=ui,_=ui,p,S){super(null,d,h,g,x,_,u,f,p,S),this.isDataTexture=!0,this.image={data:e,width:a,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ch=new lt,GE=new lt,VE=new xe;class Xr{constructor(e=new lt(1,0,0),a=0){this.isPlane=!0,this.normal=e,this.constant=a}set(e,a){return this.normal.copy(e),this.constant=a,this}setComponents(e,a,s,u){return this.normal.set(e,a,s),this.constant=u,this}setFromNormalAndCoplanarPoint(e,a){return this.normal.copy(e),this.constant=-a.dot(this.normal),this}setFromCoplanarPoints(e,a,s){const u=Ch.subVectors(s,a).cross(GE.subVectors(e,a)).normalize();return this.setFromNormalAndCoplanarPoint(u,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,a){return a.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,a){const s=e.delta(Ch),u=this.normal.dot(s);if(u===0)return this.distanceToPoint(e.start)===0?a.copy(e.start):null;const f=-(e.start.dot(this.normal)+this.constant)/u;return f<0||f>1?null:a.copy(e.start).addScaledVector(s,f)}intersectsLine(e){const a=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return a<0&&s>0||s<0&&a>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,a){const s=a||VE.getNormalMatrix(e),u=this.coplanarPoint(Ch).applyMatrix4(e),f=this.normal.applyMatrix3(s).normalize();return this.constant=-u.dot(f),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hr=new Ec,XE=new ze(.5,.5),sc=new lt;class Ip{constructor(e=new Xr,a=new Xr,s=new Xr,u=new Xr,f=new Xr,d=new Xr){this.planes=[e,a,s,u,f,d]}set(e,a,s,u,f,d){const h=this.planes;return h[0].copy(e),h[1].copy(a),h[2].copy(s),h[3].copy(u),h[4].copy(f),h[5].copy(d),this}copy(e){const a=this.planes;for(let s=0;s<6;s++)a[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,a=Ji,s=!1){const u=this.planes,f=e.elements,d=f[0],h=f[1],g=f[2],x=f[3],_=f[4],p=f[5],S=f[6],M=f[7],A=f[8],C=f[9],y=f[10],v=f[11],L=f[12],O=f[13],z=f[14],V=f[15];if(u[0].setComponents(x-d,M-_,v-A,V-L).normalize(),u[1].setComponents(x+d,M+_,v+A,V+L).normalize(),u[2].setComponents(x+h,M+p,v+C,V+O).normalize(),u[3].setComponents(x-h,M-p,v-C,V-O).normalize(),s)u[4].setComponents(g,S,y,z).normalize(),u[5].setComponents(x-g,M-S,v-y,V-z).normalize();else if(u[4].setComponents(x-g,M-S,v-y,V-z).normalize(),a===Ji)u[5].setComponents(x+g,M+S,v+y,V+z).normalize();else if(a===_c)u[5].setComponents(g,S,y,z).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+a);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const a=e.geometry;a.boundingSphere===null&&a.computeBoundingSphere(),Hr.copy(a.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hr)}intersectsSprite(e){Hr.center.set(0,0,0);const a=XE.distanceTo(e.center);return Hr.radius=.7071067811865476+a,Hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hr)}intersectsSphere(e){const a=this.planes,s=e.center,u=-e.radius;for(let f=0;f<6;f++)if(a[f].distanceToPoint(s)<u)return!1;return!0}intersectsBox(e){const a=this.planes;for(let s=0;s<6;s++){const u=a[s];if(sc.x=u.normal.x>0?e.max.x:e.min.x,sc.y=u.normal.y>0?e.max.y:e.min.y,sc.z=u.normal.z>0?e.max.z:e.min.z,u.distanceToPoint(sc)<0)return!1}return!0}containsPoint(e){const a=this.planes;for(let s=0;s<6;s++)if(a[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Tv extends ao{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const E_=new on,Tp=new gv,oc=new Ec,lc=new lt;class kE extends Nn{constructor(e=new bi,a=new Tv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=a,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,a){return super.copy(e,a),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,a){const s=this.geometry,u=this.matrixWorld,f=e.params.Points.threshold,d=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),oc.copy(s.boundingSphere),oc.applyMatrix4(u),oc.radius+=f,e.ray.intersectsSphere(oc)===!1)return;E_.copy(u).invert(),Tp.copy(e.ray).applyMatrix4(E_);const h=f/((this.scale.x+this.scale.y+this.scale.z)/3),g=h*h,x=s.index,p=s.attributes.position;if(x!==null){const S=Math.max(0,d.start),M=Math.min(x.count,d.start+d.count);for(let A=S,C=M;A<C;A++){const y=x.getX(A);lc.fromBufferAttribute(p,y),b_(lc,y,g,u,e,a,this)}}else{const S=Math.max(0,d.start),M=Math.min(p.count,d.start+d.count);for(let A=S,C=M;A<C;A++)lc.fromBufferAttribute(p,A),b_(lc,A,g,u,e,a,this)}}updateMorphTargets(){const a=this.geometry.morphAttributes,s=Object.keys(a);if(s.length>0){const u=a[s[0]];if(u!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let f=0,d=u.length;f<d;f++){const h=u[f].name||String(f);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=f}}}}}function b_(o,e,a,s,u,f,d){const h=Tp.distanceSqToPoint(o);if(h<a){const g=new lt;Tp.closestPointToPoint(o,g),g.applyMatrix4(s);const x=u.ray.origin.distanceTo(g);if(x<u.near||x>u.far)return;f.push({distance:x,distanceToRay:Math.sqrt(h),point:g,index:e,face:null,faceIndex:null,barycoord:null,object:d})}}class Av extends Xn{constructor(e,a,s=jr,u,f,d,h=ui,g=ui,x,_=cl,p=1){if(_!==cl&&_!==fl)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const S={width:e,height:a,depth:p};super(S,u,f,d,h,g,_,s,x),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new zp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const a=super.toJSON(e);return this.compareFunction!==null&&(a.compareFunction=this.compareFunction),a}}class Rv extends Xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class bc extends bi{constructor(e=1,a=1,s=1,u=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:a,widthSegments:s,heightSegments:u};const f=e/2,d=a/2,h=Math.floor(s),g=Math.floor(u),x=h+1,_=g+1,p=e/h,S=a/g,M=[],A=[],C=[],y=[];for(let v=0;v<_;v++){const L=v*S-d;for(let O=0;O<x;O++){const z=O*p-f;A.push(z,-L,0),C.push(0,0,1),y.push(O/h),y.push(1-v/g)}}for(let v=0;v<g;v++)for(let L=0;L<h;L++){const O=L+x*v,z=L+x*(v+1),V=L+1+x*(v+1),N=L+1+x*v;M.push(O,z,N),M.push(z,V,N)}this.setIndex(M),this.setAttribute("position",new ci(A,3)),this.setAttribute("normal",new ci(C,3)),this.setAttribute("uv",new ci(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bc(e.width,e.height,e.widthSegments,e.heightSegments)}}class Bp extends bi{constructor(e=.5,a=1,s=32,u=1,f=0,d=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:a,thetaSegments:s,phiSegments:u,thetaStart:f,thetaLength:d},s=Math.max(3,s),u=Math.max(1,u);const h=[],g=[],x=[],_=[];let p=e;const S=(a-e)/u,M=new lt,A=new ze;for(let C=0;C<=u;C++){for(let y=0;y<=s;y++){const v=f+y/s*d;M.x=p*Math.cos(v),M.y=p*Math.sin(v),g.push(M.x,M.y,M.z),x.push(0,0,1),A.x=(M.x/a+1)/2,A.y=(M.y/a+1)/2,_.push(A.x,A.y)}p+=S}for(let C=0;C<u;C++){const y=C*(s+1);for(let v=0;v<s;v++){const L=v+y,O=L,z=L+s+1,V=L+s+2,N=L+1;h.push(O,z,N),h.push(z,V,N)}}this.setIndex(h),this.setAttribute("position",new ci(g,3)),this.setAttribute("normal",new ci(x,3)),this.setAttribute("uv",new ci(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bp(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class yc extends bi{constructor(e=1,a=32,s=16,u=0,f=Math.PI*2,d=0,h=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:a,heightSegments:s,phiStart:u,phiLength:f,thetaStart:d,thetaLength:h},a=Math.max(3,Math.floor(a)),s=Math.max(2,Math.floor(s));const g=Math.min(d+h,Math.PI);let x=0;const _=[],p=new lt,S=new lt,M=[],A=[],C=[],y=[];for(let v=0;v<=s;v++){const L=[],O=v/s;let z=0;v===0&&d===0?z=.5/a:v===s&&g===Math.PI&&(z=-.5/a);for(let V=0;V<=a;V++){const N=V/a;p.x=-e*Math.cos(u+N*f)*Math.sin(d+O*h),p.y=e*Math.cos(d+O*h),p.z=e*Math.sin(u+N*f)*Math.sin(d+O*h),A.push(p.x,p.y,p.z),S.copy(p).normalize(),C.push(S.x,S.y,S.z),y.push(N+z,1-O),L.push(x++)}_.push(L)}for(let v=0;v<s;v++)for(let L=0;L<a;L++){const O=_[v][L+1],z=_[v][L],V=_[v+1][L],N=_[v+1][L+1];(v!==0||d>0)&&M.push(O,z,N),(v!==s-1||g<Math.PI)&&M.push(z,V,N)}this.setIndex(M),this.setAttribute("position",new ci(A,3)),this.setAttribute("normal",new ci(C,3)),this.setAttribute("uv",new ci(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yc(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class qE extends ao{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hv,this.normalScale=new ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ta,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class YE extends ao{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class WE extends ao{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Cv extends Nn{constructor(e,a=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=a}dispose(){}copy(e,a){return super.copy(e,a),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const a=super.toJSON(e);return a.object.color=this.color.getHex(),a.object.intensity=this.intensity,this.groundColor!==void 0&&(a.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(a.object.distance=this.distance),this.angle!==void 0&&(a.object.angle=this.angle),this.decay!==void 0&&(a.object.decay=this.decay),this.penumbra!==void 0&&(a.object.penumbra=this.penumbra),this.shadow!==void 0&&(a.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(a.object.target=this.target.uuid),a}}const wh=new on,T_=new lt,A_=new lt;class jE{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ze(512,512),this.mapType=$i,this.map=null,this.mapPass=null,this.matrix=new on,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ip,this._frameExtents=new ze(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const a=this.camera,s=this.matrix;T_.setFromMatrixPosition(e.matrixWorld),a.position.copy(T_),A_.setFromMatrixPosition(e.target.matrixWorld),a.lookAt(A_),a.updateMatrixWorld(),wh.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wh,a.coordinateSystem,a.reversedDepth),a.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(wh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class wv extends Ev{constructor(e=-1,a=1,s=1,u=-1,f=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=a,this.top=s,this.bottom=u,this.near=f,this.far=d,this.updateProjectionMatrix()}copy(e,a){return super.copy(e,a),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,a,s,u,f,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=a,this.view.offsetX=s,this.view.offsetY=u,this.view.width=f,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),a=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,u=(this.top+this.bottom)/2;let f=s-e,d=s+e,h=u+a,g=u-a;if(this.view!==null&&this.view.enabled){const x=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;f+=x*this.view.offsetX,d=f+x*this.view.width,h-=_*this.view.offsetY,g=h-_*this.view.height}this.projectionMatrix.makeOrthographic(f,d,h,g,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const a=super.toJSON(e);return a.object.zoom=this.zoom,a.object.left=this.left,a.object.right=this.right,a.object.top=this.top,a.object.bottom=this.bottom,a.object.near=this.near,a.object.far=this.far,this.view!==null&&(a.object.view=Object.assign({},this.view)),a}}class ZE extends jE{constructor(){super(new wv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class KE extends Cv{constructor(e,a){super(e,a),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nn.DEFAULT_UP),this.updateMatrix(),this.target=new Nn,this.shadow=new ZE}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class QE extends Cv{constructor(e,a){super(e,a),this.isAmbientLight=!0,this.type="AmbientLight"}}class JE extends Mi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function R_(o,e,a,s){const u=$E(s);switch(a){case cv:return o*e;case dv:return o*e/u.components*u.byteLength;case Np:return o*e/u.components*u.byteLength;case Lp:return o*e*2/u.components*u.byteLength;case Op:return o*e*2/u.components*u.byteLength;case fv:return o*e*3/u.components*u.byteLength;case Pi:return o*e*4/u.components*u.byteLength;case Pp:return o*e*4/u.components*u.byteLength;case dc:case hc:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case pc:case mc:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case Qh:case $h:return Math.max(o,16)*Math.max(e,8)/4;case Kh:case Jh:return Math.max(o,8)*Math.max(e,8)/2;case tp:case ep:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case np:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case ip:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case ap:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case rp:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case sp:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case op:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case lp:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case up:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case cp:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case fp:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case dp:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case hp:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case pp:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case mp:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case xp:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case gp:case _p:case vp:return Math.ceil(o/4)*Math.ceil(e/4)*16;case Sp:case yp:return Math.ceil(o/4)*Math.ceil(e/4)*8;case Mp:case Ep:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${a} format.`)}function $E(o){switch(o){case $i:case sv:return{byteLength:1,components:1};case ll:case ov:case no:return{byteLength:2,components:1};case Dp:case Up:return{byteLength:2,components:4};case jr:case wp:case Ta:return{byteLength:4,components:1};case lv:case uv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cp}}));typeof window<"u"&&(window.__THREE__?me("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cp);function Dv(){let o=null,e=!1,a=null,s=null;function u(f,d){a(f,d),s=o.requestAnimationFrame(u)}return{start:function(){e!==!0&&a!==null&&(s=o.requestAnimationFrame(u),e=!0)},stop:function(){o.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(f){a=f},setContext:function(f){o=f}}}function tb(o){const e=new WeakMap;function a(h,g){const x=h.array,_=h.usage,p=x.byteLength,S=o.createBuffer();o.bindBuffer(g,S),o.bufferData(g,x,_),h.onUploadCallback();let M;if(x instanceof Float32Array)M=o.FLOAT;else if(typeof Float16Array<"u"&&x instanceof Float16Array)M=o.HALF_FLOAT;else if(x instanceof Uint16Array)h.isFloat16BufferAttribute?M=o.HALF_FLOAT:M=o.UNSIGNED_SHORT;else if(x instanceof Int16Array)M=o.SHORT;else if(x instanceof Uint32Array)M=o.UNSIGNED_INT;else if(x instanceof Int32Array)M=o.INT;else if(x instanceof Int8Array)M=o.BYTE;else if(x instanceof Uint8Array)M=o.UNSIGNED_BYTE;else if(x instanceof Uint8ClampedArray)M=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+x);return{buffer:S,type:M,bytesPerElement:x.BYTES_PER_ELEMENT,version:h.version,size:p}}function s(h,g,x){const _=g.array,p=g.updateRanges;if(o.bindBuffer(x,h),p.length===0)o.bufferSubData(x,0,_);else{p.sort((M,A)=>M.start-A.start);let S=0;for(let M=1;M<p.length;M++){const A=p[S],C=p[M];C.start<=A.start+A.count+1?A.count=Math.max(A.count,C.start+C.count-A.start):(++S,p[S]=C)}p.length=S+1;for(let M=0,A=p.length;M<A;M++){const C=p[M];o.bufferSubData(x,C.start*_.BYTES_PER_ELEMENT,_,C.start,C.count)}g.clearUpdateRanges()}g.onUploadCallback()}function u(h){return h.isInterleavedBufferAttribute&&(h=h.data),e.get(h)}function f(h){h.isInterleavedBufferAttribute&&(h=h.data);const g=e.get(h);g&&(o.deleteBuffer(g.buffer),e.delete(h))}function d(h,g){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const _=e.get(h);(!_||_.version<h.version)&&e.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const x=e.get(h);if(x===void 0)e.set(h,a(h,g));else if(x.version<h.version){if(x.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(x.buffer,h,g),x.version=h.version}}return{get:u,remove:f,update:d}}var eb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nb=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ib=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ab=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ob=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ub=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,cb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,db=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hb=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pb=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mb=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,xb=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,gb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_b=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,yb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Eb=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,bb=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tb=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ab=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Rb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Db=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ub="gl_FragColor = linearToOutputTexel( gl_FragColor );",Nb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ob=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Pb=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ib=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Bb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vb=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Xb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kb=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qb=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yb=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Wb=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zb=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qb=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jb=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$b=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,t3=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,e3=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,n3=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,i3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,a3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,r3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,o3=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,l3=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,u3=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,c3=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,f3=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d3=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,h3=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,p3=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,m3=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x3=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,g3=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_3=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,v3=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,S3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M3=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,E3=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,b3=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T3=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,A3=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,R3=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,C3=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,w3=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,D3=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,U3=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,N3=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,L3=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,O3=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,P3=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,z3=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,I3=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,B3=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,F3=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,H3=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,G3=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,V3=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,X3=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,k3=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,q3=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Y3=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W3=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,j3=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Z3=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,K3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Q3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,J3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$3=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const t1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,e1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,o1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,l1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,u1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,c1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,f1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,h1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,m1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,v1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,y1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,M1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,E1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,T1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,C1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,w1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,D1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,U1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,N1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,L1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_e={alphahash_fragment:eb,alphahash_pars_fragment:nb,alphamap_fragment:ib,alphamap_pars_fragment:ab,alphatest_fragment:rb,alphatest_pars_fragment:sb,aomap_fragment:ob,aomap_pars_fragment:lb,batching_pars_vertex:ub,batching_vertex:cb,begin_vertex:fb,beginnormal_vertex:db,bsdfs:hb,iridescence_fragment:pb,bumpmap_pars_fragment:mb,clipping_planes_fragment:xb,clipping_planes_pars_fragment:gb,clipping_planes_pars_vertex:_b,clipping_planes_vertex:vb,color_fragment:Sb,color_pars_fragment:yb,color_pars_vertex:Mb,color_vertex:Eb,common:bb,cube_uv_reflection_fragment:Tb,defaultnormal_vertex:Ab,displacementmap_pars_vertex:Rb,displacementmap_vertex:Cb,emissivemap_fragment:wb,emissivemap_pars_fragment:Db,colorspace_fragment:Ub,colorspace_pars_fragment:Nb,envmap_fragment:Lb,envmap_common_pars_fragment:Ob,envmap_pars_fragment:Pb,envmap_pars_vertex:zb,envmap_physical_pars_fragment:Wb,envmap_vertex:Ib,fog_vertex:Bb,fog_pars_vertex:Fb,fog_fragment:Hb,fog_pars_fragment:Gb,gradientmap_pars_fragment:Vb,lightmap_pars_fragment:Xb,lights_lambert_fragment:kb,lights_lambert_pars_fragment:qb,lights_pars_begin:Yb,lights_toon_fragment:jb,lights_toon_pars_fragment:Zb,lights_phong_fragment:Kb,lights_phong_pars_fragment:Qb,lights_physical_fragment:Jb,lights_physical_pars_fragment:$b,lights_fragment_begin:t3,lights_fragment_maps:e3,lights_fragment_end:n3,logdepthbuf_fragment:i3,logdepthbuf_pars_fragment:a3,logdepthbuf_pars_vertex:r3,logdepthbuf_vertex:s3,map_fragment:o3,map_pars_fragment:l3,map_particle_fragment:u3,map_particle_pars_fragment:c3,metalnessmap_fragment:f3,metalnessmap_pars_fragment:d3,morphinstance_vertex:h3,morphcolor_vertex:p3,morphnormal_vertex:m3,morphtarget_pars_vertex:x3,morphtarget_vertex:g3,normal_fragment_begin:_3,normal_fragment_maps:v3,normal_pars_fragment:S3,normal_pars_vertex:y3,normal_vertex:M3,normalmap_pars_fragment:E3,clearcoat_normal_fragment_begin:b3,clearcoat_normal_fragment_maps:T3,clearcoat_pars_fragment:A3,iridescence_pars_fragment:R3,opaque_fragment:C3,packing:w3,premultiplied_alpha_fragment:D3,project_vertex:U3,dithering_fragment:N3,dithering_pars_fragment:L3,roughnessmap_fragment:O3,roughnessmap_pars_fragment:P3,shadowmap_pars_fragment:z3,shadowmap_pars_vertex:I3,shadowmap_vertex:B3,shadowmask_pars_fragment:F3,skinbase_vertex:H3,skinning_pars_vertex:G3,skinning_vertex:V3,skinnormal_vertex:X3,specularmap_fragment:k3,specularmap_pars_fragment:q3,tonemapping_fragment:Y3,tonemapping_pars_fragment:W3,transmission_fragment:j3,transmission_pars_fragment:Z3,uv_pars_fragment:K3,uv_pars_vertex:Q3,uv_vertex:J3,worldpos_vertex:$3,background_vert:t1,background_frag:e1,backgroundCube_vert:n1,backgroundCube_frag:i1,cube_vert:a1,cube_frag:r1,depth_vert:s1,depth_frag:o1,distanceRGBA_vert:l1,distanceRGBA_frag:u1,equirect_vert:c1,equirect_frag:f1,linedashed_vert:d1,linedashed_frag:h1,meshbasic_vert:p1,meshbasic_frag:m1,meshlambert_vert:x1,meshlambert_frag:g1,meshmatcap_vert:_1,meshmatcap_frag:v1,meshnormal_vert:S1,meshnormal_frag:y1,meshphong_vert:M1,meshphong_frag:E1,meshphysical_vert:b1,meshphysical_frag:T1,meshtoon_vert:A1,meshtoon_frag:R1,points_vert:C1,points_frag:w1,shadow_vert:D1,shadow_frag:U1,sprite_vert:N1,sprite_frag:L1},It={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new xe}},envmap:{envMap:{value:null},envMapRotation:{value:new xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new xe},normalScale:{value:new ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0},uvTransform:{value:new xe}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}}},Ki={basic:{uniforms:Vn([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.fog]),vertexShader:_e.meshbasic_vert,fragmentShader:_e.meshbasic_frag},lambert:{uniforms:Vn([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new Pe(0)}}]),vertexShader:_e.meshlambert_vert,fragmentShader:_e.meshlambert_frag},phong:{uniforms:Vn([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:_e.meshphong_vert,fragmentShader:_e.meshphong_frag},standard:{uniforms:Vn([It.common,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.roughnessmap,It.metalnessmap,It.fog,It.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag},toon:{uniforms:Vn([It.common,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.gradientmap,It.fog,It.lights,{emissive:{value:new Pe(0)}}]),vertexShader:_e.meshtoon_vert,fragmentShader:_e.meshtoon_frag},matcap:{uniforms:Vn([It.common,It.bumpmap,It.normalmap,It.displacementmap,It.fog,{matcap:{value:null}}]),vertexShader:_e.meshmatcap_vert,fragmentShader:_e.meshmatcap_frag},points:{uniforms:Vn([It.points,It.fog]),vertexShader:_e.points_vert,fragmentShader:_e.points_frag},dashed:{uniforms:Vn([It.common,It.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_e.linedashed_vert,fragmentShader:_e.linedashed_frag},depth:{uniforms:Vn([It.common,It.displacementmap]),vertexShader:_e.depth_vert,fragmentShader:_e.depth_frag},normal:{uniforms:Vn([It.common,It.bumpmap,It.normalmap,It.displacementmap,{opacity:{value:1}}]),vertexShader:_e.meshnormal_vert,fragmentShader:_e.meshnormal_frag},sprite:{uniforms:Vn([It.sprite,It.fog]),vertexShader:_e.sprite_vert,fragmentShader:_e.sprite_frag},background:{uniforms:{uvTransform:{value:new xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_e.background_vert,fragmentShader:_e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new xe}},vertexShader:_e.backgroundCube_vert,fragmentShader:_e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_e.cube_vert,fragmentShader:_e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_e.equirect_vert,fragmentShader:_e.equirect_frag},distanceRGBA:{uniforms:Vn([It.common,It.displacementmap,{referencePosition:{value:new lt},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_e.distanceRGBA_vert,fragmentShader:_e.distanceRGBA_frag},shadow:{uniforms:Vn([It.lights,It.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:_e.shadow_vert,fragmentShader:_e.shadow_frag}};Ki.physical={uniforms:Vn([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new xe},clearcoatNormalScale:{value:new ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new xe},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new xe},transmissionSamplerSize:{value:new ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new xe},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new xe},anisotropyVector:{value:new ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new xe}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag};const uc={r:0,b:0,g:0},Gr=new ta,O1=new on;function P1(o,e,a,s,u,f,d){const h=new Pe(0);let g=f===!0?0:1,x,_,p=null,S=0,M=null;function A(O){let z=O.isScene===!0?O.background:null;return z&&z.isTexture&&(z=(O.backgroundBlurriness>0?a:e).get(z)),z}function C(O){let z=!1;const V=A(O);V===null?v(h,g):V&&V.isColor&&(v(V,1),z=!0);const N=o.xr.getEnvironmentBlendMode();N==="additive"?s.buffers.color.setClear(0,0,0,1,d):N==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,d),(o.autoClear||z)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function y(O,z){const V=A(z);V&&(V.isCubeTexture||V.mapping===Mc)?(_===void 0&&(_=new Ii(new xl(1,1,1),new Ca({name:"BackgroundCubeMaterial",uniforms:eo(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(N,I,Y){this.matrixWorld.copyPosition(Y.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),u.update(_)),Gr.copy(z.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),_.material.uniforms.envMap.value=V,_.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=z.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,_.material.uniforms.backgroundRotation.value.setFromMatrix4(O1.makeRotationFromEuler(Gr)),_.material.toneMapped=Oe.getTransfer(V.colorSpace)!==We,(p!==V||S!==V.version||M!==o.toneMapping)&&(_.material.needsUpdate=!0,p=V,S=V.version,M=o.toneMapping),_.layers.enableAll(),O.unshift(_,_.geometry,_.material,0,0,null)):V&&V.isTexture&&(x===void 0&&(x=new Ii(new bc(2,2),new Ca({name:"BackgroundMaterial",uniforms:eo(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:dr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),Object.defineProperty(x.material,"map",{get:function(){return this.uniforms.t2D.value}}),u.update(x)),x.material.uniforms.t2D.value=V,x.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,x.material.toneMapped=Oe.getTransfer(V.colorSpace)!==We,V.matrixAutoUpdate===!0&&V.updateMatrix(),x.material.uniforms.uvTransform.value.copy(V.matrix),(p!==V||S!==V.version||M!==o.toneMapping)&&(x.material.needsUpdate=!0,p=V,S=V.version,M=o.toneMapping),x.layers.enableAll(),O.unshift(x,x.geometry,x.material,0,0,null))}function v(O,z){O.getRGB(uc,Mv(o)),s.buffers.color.setClear(uc.r,uc.g,uc.b,z,d)}function L(){_!==void 0&&(_.geometry.dispose(),_.material.dispose(),_=void 0),x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0)}return{getClearColor:function(){return h},setClearColor:function(O,z=1){h.set(O),g=z,v(h,g)},getClearAlpha:function(){return g},setClearAlpha:function(O){g=O,v(h,g)},render:C,addToRenderList:y,dispose:L}}function z1(o,e){const a=o.getParameter(o.MAX_VERTEX_ATTRIBS),s={},u=S(null);let f=u,d=!1;function h(w,q,at,ut,gt){let ct=!1;const K=p(ut,at,q);f!==K&&(f=K,x(f.object)),ct=M(w,ut,at,gt),ct&&A(w,ut,at,gt),gt!==null&&e.update(gt,o.ELEMENT_ARRAY_BUFFER),(ct||d)&&(d=!1,z(w,q,at,ut),gt!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(gt).buffer))}function g(){return o.createVertexArray()}function x(w){return o.bindVertexArray(w)}function _(w){return o.deleteVertexArray(w)}function p(w,q,at){const ut=at.wireframe===!0;let gt=s[w.id];gt===void 0&&(gt={},s[w.id]=gt);let ct=gt[q.id];ct===void 0&&(ct={},gt[q.id]=ct);let K=ct[ut];return K===void 0&&(K=S(g()),ct[ut]=K),K}function S(w){const q=[],at=[],ut=[];for(let gt=0;gt<a;gt++)q[gt]=0,at[gt]=0,ut[gt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:q,enabledAttributes:at,attributeDivisors:ut,object:w,attributes:{},index:null}}function M(w,q,at,ut){const gt=f.attributes,ct=q.attributes;let K=0;const rt=at.getAttributes();for(const J in rt)if(rt[J].location>=0){const _t=gt[J];let Vt=ct[J];if(Vt===void 0&&(J==="instanceMatrix"&&w.instanceMatrix&&(Vt=w.instanceMatrix),J==="instanceColor"&&w.instanceColor&&(Vt=w.instanceColor)),_t===void 0||_t.attribute!==Vt||Vt&&_t.data!==Vt.data)return!0;K++}return f.attributesNum!==K||f.index!==ut}function A(w,q,at,ut){const gt={},ct=q.attributes;let K=0;const rt=at.getAttributes();for(const J in rt)if(rt[J].location>=0){let _t=ct[J];_t===void 0&&(J==="instanceMatrix"&&w.instanceMatrix&&(_t=w.instanceMatrix),J==="instanceColor"&&w.instanceColor&&(_t=w.instanceColor));const Vt={};Vt.attribute=_t,_t&&_t.data&&(Vt.data=_t.data),gt[J]=Vt,K++}f.attributes=gt,f.attributesNum=K,f.index=ut}function C(){const w=f.newAttributes;for(let q=0,at=w.length;q<at;q++)w[q]=0}function y(w){v(w,0)}function v(w,q){const at=f.newAttributes,ut=f.enabledAttributes,gt=f.attributeDivisors;at[w]=1,ut[w]===0&&(o.enableVertexAttribArray(w),ut[w]=1),gt[w]!==q&&(o.vertexAttribDivisor(w,q),gt[w]=q)}function L(){const w=f.newAttributes,q=f.enabledAttributes;for(let at=0,ut=q.length;at<ut;at++)q[at]!==w[at]&&(o.disableVertexAttribArray(at),q[at]=0)}function O(w,q,at,ut,gt,ct,K){K===!0?o.vertexAttribIPointer(w,q,at,gt,ct):o.vertexAttribPointer(w,q,at,ut,gt,ct)}function z(w,q,at,ut){C();const gt=ut.attributes,ct=at.getAttributes(),K=q.defaultAttributeValues;for(const rt in ct){const J=ct[rt];if(J.location>=0){let St=gt[rt];if(St===void 0&&(rt==="instanceMatrix"&&w.instanceMatrix&&(St=w.instanceMatrix),rt==="instanceColor"&&w.instanceColor&&(St=w.instanceColor)),St!==void 0){const _t=St.normalized,Vt=St.itemSize,le=e.get(St);if(le===void 0)continue;const Ee=le.buffer,E=le.type,G=le.bytesPerElement,B=E===o.INT||E===o.UNSIGNED_INT||St.gpuType===wp;if(St.isInterleavedBufferAttribute){const k=St.data,dt=k.stride,bt=St.offset;if(k.isInstancedInterleavedBuffer){for(let vt=0;vt<J.locationSize;vt++)v(J.location+vt,k.meshPerAttribute);w.isInstancedMesh!==!0&&ut._maxInstanceCount===void 0&&(ut._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let vt=0;vt<J.locationSize;vt++)y(J.location+vt);o.bindBuffer(o.ARRAY_BUFFER,Ee);for(let vt=0;vt<J.locationSize;vt++)O(J.location+vt,Vt/J.locationSize,E,_t,dt*G,(bt+Vt/J.locationSize*vt)*G,B)}else{if(St.isInstancedBufferAttribute){for(let k=0;k<J.locationSize;k++)v(J.location+k,St.meshPerAttribute);w.isInstancedMesh!==!0&&ut._maxInstanceCount===void 0&&(ut._maxInstanceCount=St.meshPerAttribute*St.count)}else for(let k=0;k<J.locationSize;k++)y(J.location+k);o.bindBuffer(o.ARRAY_BUFFER,Ee);for(let k=0;k<J.locationSize;k++)O(J.location+k,Vt/J.locationSize,E,_t,Vt*G,Vt/J.locationSize*k*G,B)}}else if(K!==void 0){const _t=K[rt];if(_t!==void 0)switch(_t.length){case 2:o.vertexAttrib2fv(J.location,_t);break;case 3:o.vertexAttrib3fv(J.location,_t);break;case 4:o.vertexAttrib4fv(J.location,_t);break;default:o.vertexAttrib1fv(J.location,_t)}}}}L()}function V(){Y();for(const w in s){const q=s[w];for(const at in q){const ut=q[at];for(const gt in ut)_(ut[gt].object),delete ut[gt];delete q[at]}delete s[w]}}function N(w){if(s[w.id]===void 0)return;const q=s[w.id];for(const at in q){const ut=q[at];for(const gt in ut)_(ut[gt].object),delete ut[gt];delete q[at]}delete s[w.id]}function I(w){for(const q in s){const at=s[q];if(at[w.id]===void 0)continue;const ut=at[w.id];for(const gt in ut)_(ut[gt].object),delete ut[gt];delete at[w.id]}}function Y(){D(),d=!0,f!==u&&(f=u,x(f.object))}function D(){u.geometry=null,u.program=null,u.wireframe=!1}return{setup:h,reset:Y,resetDefaultState:D,dispose:V,releaseStatesOfGeometry:N,releaseStatesOfProgram:I,initAttributes:C,enableAttribute:y,disableUnusedAttributes:L}}function I1(o,e,a){let s;function u(x){s=x}function f(x,_){o.drawArrays(s,x,_),a.update(_,s,1)}function d(x,_,p){p!==0&&(o.drawArraysInstanced(s,x,_,p),a.update(_,s,p))}function h(x,_,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,x,0,_,0,p);let M=0;for(let A=0;A<p;A++)M+=_[A];a.update(M,s,1)}function g(x,_,p,S){if(p===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let A=0;A<x.length;A++)d(x[A],_[A],S[A]);else{M.multiDrawArraysInstancedWEBGL(s,x,0,_,0,S,0,p);let A=0;for(let C=0;C<p;C++)A+=_[C]*S[C];a.update(A,s,1)}}this.setMode=u,this.render=f,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=g}function B1(o,e,a,s){let u;function f(){if(u!==void 0)return u;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");u=o.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else u=0;return u}function d(I){return!(I!==Pi&&s.convert(I)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(I){const Y=I===no&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==$i&&s.convert(I)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==Ta&&!Y)}function g(I){if(I==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let x=a.precision!==void 0?a.precision:"highp";const _=g(x);_!==x&&(me("WebGLRenderer:",x,"not supported, using",_,"instead."),x=_);const p=a.logarithmicDepthBuffer===!0,S=a.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),M=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),A=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=o.getParameter(o.MAX_TEXTURE_SIZE),y=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),v=o.getParameter(o.MAX_VERTEX_ATTRIBS),L=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),O=o.getParameter(o.MAX_VARYING_VECTORS),z=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),V=A>0,N=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:f,getMaxPrecision:g,textureFormatReadable:d,textureTypeReadable:h,precision:x,logarithmicDepthBuffer:p,reversedDepthBuffer:S,maxTextures:M,maxVertexTextures:A,maxTextureSize:C,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:L,maxVaryings:O,maxFragmentUniforms:z,vertexTextures:V,maxSamples:N}}function F1(o){const e=this;let a=null,s=0,u=!1,f=!1;const d=new Xr,h=new xe,g={value:null,needsUpdate:!1};this.uniform=g,this.numPlanes=0,this.numIntersection=0,this.init=function(p,S){const M=p.length!==0||S||s!==0||u;return u=S,s=p.length,M},this.beginShadows=function(){f=!0,_(null)},this.endShadows=function(){f=!1},this.setGlobalState=function(p,S){a=_(p,S,0)},this.setState=function(p,S,M){const A=p.clippingPlanes,C=p.clipIntersection,y=p.clipShadows,v=o.get(p);if(!u||A===null||A.length===0||f&&!y)f?_(null):x();else{const L=f?0:s,O=L*4;let z=v.clippingState||null;g.value=z,z=_(A,S,O,M);for(let V=0;V!==O;++V)z[V]=a[V];v.clippingState=z,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=L}};function x(){g.value!==a&&(g.value=a,g.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function _(p,S,M,A){const C=p!==null?p.length:0;let y=null;if(C!==0){if(y=g.value,A!==!0||y===null){const v=M+C*4,L=S.matrixWorldInverse;h.getNormalMatrix(L),(y===null||y.length<v)&&(y=new Float32Array(v));for(let O=0,z=M;O!==C;++O,z+=4)d.copy(p[O]).applyMatrix4(L,h),d.normal.toArray(y,z),y[z+3]=d.constant}g.value=y,g.needsUpdate=!0}return e.numPlanes=C,e.numIntersection=0,y}}function H1(o){let e=new WeakMap;function a(d,h){return h===Yh?d.mapping=Js:h===Wh&&(d.mapping=$s),d}function s(d){if(d&&d.isTexture){const h=d.mapping;if(h===Yh||h===Wh)if(e.has(d)){const g=e.get(d).texture;return a(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const x=new IE(g.height);return x.fromEquirectangularTexture(o,d),e.set(d,x),d.addEventListener("dispose",u),a(x.texture,d.mapping)}else return null}}return d}function u(d){const h=d.target;h.removeEventListener("dispose",u);const g=e.get(h);g!==void 0&&(e.delete(h),g.dispose())}function f(){e=new WeakMap}return{get:s,dispose:f}}const cr=4,C_=[.125,.215,.35,.446,.526,.582],qr=20,G1=256,al=new wv,w_=new Pe;let Dh=null,Uh=0,Nh=0,Lh=!1;const V1=new lt;class D_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,a=0,s=.1,u=100,f={}){const{size:d=256,position:h=V1}=f;Dh=this._renderer.getRenderTarget(),Uh=this._renderer.getActiveCubeFace(),Nh=this._renderer.getActiveMipmapLevel(),Lh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const g=this._allocateTargets();return g.depthBuffer=!0,this._sceneToCubeUV(e,s,u,g,h),a>0&&this._blur(g,0,0,a),this._applyPMREM(g),this._cleanup(g),g}fromEquirectangular(e,a=null){return this._fromTexture(e,a)}fromCubemap(e,a=null){return this._fromTexture(e,a)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=L_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=N_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dh,Uh,Nh),this._renderer.xr.enabled=Lh,e.scissorTest=!1,js(e,0,0,e.width,e.height)}_fromTexture(e,a){e.mapping===Js||e.mapping===$s?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dh=this._renderer.getRenderTarget(),Uh=this._renderer.getActiveCubeFace(),Nh=this._renderer.getActiveMipmapLevel(),Lh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=a||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),a=4*this._cubeSize,s={magFilter:Ei,minFilter:Ei,generateMipmaps:!1,type:no,format:Pi,colorSpace:to,depthBuffer:!1},u=U_(e,a,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==a){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=U_(e,a,s);const{_lodMax:f}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=X1(f)),this._blurMaterial=q1(f,e,a),this._ggxMaterial=k1(f,e,a)}return u}_compileMaterial(e){const a=new Ii(new bi,e);this._renderer.compile(a,al)}_sceneToCubeUV(e,a,s,u,f){const g=new Mi(90,1,a,s),x=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],p=this._renderer,S=p.autoClear,M=p.toneMapping;p.getClearColor(w_),p.toneMapping=fr,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(u),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ii(new xl,new Sc({name:"PMREM.Background",side:Qn,depthWrite:!1,depthTest:!1})));const C=this._backgroundBox,y=C.material;let v=!1;const L=e.background;L?L.isColor&&(y.color.copy(L),e.background=null,v=!0):(y.color.copy(w_),v=!0);for(let O=0;O<6;O++){const z=O%3;z===0?(g.up.set(0,x[O],0),g.position.set(f.x,f.y,f.z),g.lookAt(f.x+_[O],f.y,f.z)):z===1?(g.up.set(0,0,x[O]),g.position.set(f.x,f.y,f.z),g.lookAt(f.x,f.y+_[O],f.z)):(g.up.set(0,x[O],0),g.position.set(f.x,f.y,f.z),g.lookAt(f.x,f.y,f.z+_[O]));const V=this._cubeSize;js(u,z*V,O>2?V:0,V,V),p.setRenderTarget(u),v&&p.render(C,g),p.render(e,g)}p.toneMapping=M,p.autoClear=S,e.background=L}_textureToCubeUV(e,a){const s=this._renderer,u=e.mapping===Js||e.mapping===$s;u?(this._cubemapMaterial===null&&(this._cubemapMaterial=L_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=N_());const f=u?this._cubemapMaterial:this._equirectMaterial,d=this._lodMeshes[0];d.material=f;const h=f.uniforms;h.envMap.value=e;const g=this._cubeSize;js(a,0,0,3*g,2*g),s.setRenderTarget(a),s.render(d,al)}_applyPMREM(e){const a=this._renderer,s=a.autoClear;a.autoClear=!1;const u=this._lodMeshes.length;for(let f=1;f<u;f++)this._applyGGXFilter(e,f-1,f);a.autoClear=s}_applyGGXFilter(e,a,s){const u=this._renderer,f=this._pingPongRenderTarget,d=this._ggxMaterial,h=this._lodMeshes[s];h.material=d;const g=d.uniforms,x=s/(this._lodMeshes.length-1),_=a/(this._lodMeshes.length-1),p=Math.sqrt(x*x-_*_),S=.05+x*.95,M=p*S,{_lodMax:A}=this,C=this._sizeLods[s],y=3*C*(s>A-cr?s-A+cr:0),v=4*(this._cubeSize-C);g.envMap.value=e.texture,g.roughness.value=M,g.mipInt.value=A-a,js(f,y,v,3*C,2*C),u.setRenderTarget(f),u.render(h,al),g.envMap.value=f.texture,g.roughness.value=0,g.mipInt.value=A-s,js(e,y,v,3*C,2*C),u.setRenderTarget(e),u.render(h,al)}_blur(e,a,s,u,f){const d=this._pingPongRenderTarget;this._halfBlur(e,d,a,s,u,"latitudinal",f),this._halfBlur(d,e,s,s,u,"longitudinal",f)}_halfBlur(e,a,s,u,f,d,h){const g=this._renderer,x=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&cn("blur direction must be either latitudinal or longitudinal!");const _=3,p=this._lodMeshes[u];p.material=x;const S=x.uniforms,M=this._sizeLods[s]-1,A=isFinite(f)?Math.PI/(2*M):2*Math.PI/(2*qr-1),C=f/A,y=isFinite(f)?1+Math.floor(_*C):qr;y>qr&&me(`sigmaRadians, ${f}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${qr}`);const v=[];let L=0;for(let I=0;I<qr;++I){const Y=I/C,D=Math.exp(-Y*Y/2);v.push(D),I===0?L+=D:I<y&&(L+=2*D)}for(let I=0;I<v.length;I++)v[I]=v[I]/L;S.envMap.value=e.texture,S.samples.value=y,S.weights.value=v,S.latitudinal.value=d==="latitudinal",h&&(S.poleAxis.value=h);const{_lodMax:O}=this;S.dTheta.value=A,S.mipInt.value=O-s;const z=this._sizeLods[u],V=3*z*(u>O-cr?u-O+cr:0),N=4*(this._cubeSize-z);js(a,V,N,3*z,2*z),g.setRenderTarget(a),g.render(p,al)}}function X1(o){const e=[],a=[],s=[];let u=o;const f=o-cr+1+C_.length;for(let d=0;d<f;d++){const h=Math.pow(2,u);e.push(h);let g=1/h;d>o-cr?g=C_[d-o+cr-1]:d===0&&(g=0),a.push(g);const x=1/(h-2),_=-x,p=1+x,S=[_,_,p,_,p,p,_,_,p,p,_,p],M=6,A=6,C=3,y=2,v=1,L=new Float32Array(C*A*M),O=new Float32Array(y*A*M),z=new Float32Array(v*A*M);for(let N=0;N<M;N++){const I=N%3*2/3-1,Y=N>2?0:-1,D=[I,Y,0,I+2/3,Y,0,I+2/3,Y+1,0,I,Y,0,I+2/3,Y+1,0,I,Y+1,0];L.set(D,C*A*N),O.set(S,y*A*N);const w=[N,N,N,N,N,N];z.set(w,v*A*N)}const V=new bi;V.setAttribute("position",new zi(L,C)),V.setAttribute("uv",new zi(O,y)),V.setAttribute("faceIndex",new zi(z,v)),s.push(new Ii(V,null)),u>cr&&u--}return{lodMeshes:s,sizeLods:e,sigmas:a}}function U_(o,e,a){const s=new Zr(o,e,a);return s.texture.mapping=Mc,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function js(o,e,a,s,u){o.viewport.set(e,a,s,u),o.scissor.set(e,a,s,u)}function k1(o,e,a){return new Ca({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:G1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/a,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Tc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Aa,depthTest:!1,depthWrite:!1})}function q1(o,e,a){const s=new Float32Array(qr),u=new lt(0,1,0);return new Ca({name:"SphericalGaussianBlur",defines:{n:qr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/a,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:u}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Aa,depthTest:!1,depthWrite:!1})}function N_(){return new Ca({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Aa,depthTest:!1,depthWrite:!1})}function L_(){return new Ca({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Aa,depthTest:!1,depthWrite:!1})}function Tc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Y1(o){let e=new WeakMap,a=null;function s(h){if(h&&h.isTexture){const g=h.mapping,x=g===Yh||g===Wh,_=g===Js||g===$s;if(x||_){let p=e.get(h);const S=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==S)return a===null&&(a=new D_(o)),p=x?a.fromEquirectangular(h,p):a.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{const M=h.image;return x&&M&&M.height>0||_&&M&&u(M)?(a===null&&(a=new D_(o)),p=x?a.fromEquirectangular(h):a.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",f),p.texture):null}}}return h}function u(h){let g=0;const x=6;for(let _=0;_<x;_++)h[_]!==void 0&&g++;return g===x}function f(h){const g=h.target;g.removeEventListener("dispose",f);const x=e.get(g);x!==void 0&&(e.delete(g),x.dispose())}function d(){e=new WeakMap,a!==null&&(a.dispose(),a=null)}return{get:s,dispose:d}}function W1(o){const e={};function a(s){if(e[s]!==void 0)return e[s];const u=o.getExtension(s);return e[s]=u,u}return{has:function(s){return a(s)!==null},init:function(){a("EXT_color_buffer_float"),a("WEBGL_clip_cull_distance"),a("OES_texture_float_linear"),a("EXT_color_buffer_half_float"),a("WEBGL_multisampled_render_to_texture"),a("WEBGL_render_shared_exponent")},get:function(s){const u=a(s);return u===null&&dl("WebGLRenderer: "+s+" extension not supported."),u}}}function j1(o,e,a,s){const u={},f=new WeakMap;function d(p){const S=p.target;S.index!==null&&e.remove(S.index);for(const A in S.attributes)e.remove(S.attributes[A]);S.removeEventListener("dispose",d),delete u[S.id];const M=f.get(S);M&&(e.remove(M),f.delete(S)),s.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,a.memory.geometries--}function h(p,S){return u[S.id]===!0||(S.addEventListener("dispose",d),u[S.id]=!0,a.memory.geometries++),S}function g(p){const S=p.attributes;for(const M in S)e.update(S[M],o.ARRAY_BUFFER)}function x(p){const S=[],M=p.index,A=p.attributes.position;let C=0;if(M!==null){const L=M.array;C=M.version;for(let O=0,z=L.length;O<z;O+=3){const V=L[O+0],N=L[O+1],I=L[O+2];S.push(V,N,N,I,I,V)}}else if(A!==void 0){const L=A.array;C=A.version;for(let O=0,z=L.length/3-1;O<z;O+=3){const V=O+0,N=O+1,I=O+2;S.push(V,N,N,I,I,V)}}else return;const y=new(mv(S)?yv:Sv)(S,1);y.version=C;const v=f.get(p);v&&e.remove(v),f.set(p,y)}function _(p){const S=f.get(p);if(S){const M=p.index;M!==null&&S.version<M.version&&x(p)}else x(p);return f.get(p)}return{get:h,update:g,getWireframeAttribute:_}}function Z1(o,e,a){let s;function u(S){s=S}let f,d;function h(S){f=S.type,d=S.bytesPerElement}function g(S,M){o.drawElements(s,M,f,S*d),a.update(M,s,1)}function x(S,M,A){A!==0&&(o.drawElementsInstanced(s,M,f,S*d,A),a.update(M,s,A))}function _(S,M,A){if(A===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,M,0,f,S,0,A);let y=0;for(let v=0;v<A;v++)y+=M[v];a.update(y,s,1)}function p(S,M,A,C){if(A===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let v=0;v<S.length;v++)x(S[v]/d,M[v],C[v]);else{y.multiDrawElementsInstancedWEBGL(s,M,0,f,S,0,C,0,A);let v=0;for(let L=0;L<A;L++)v+=M[L]*C[L];a.update(v,s,1)}}this.setMode=u,this.setIndex=h,this.render=g,this.renderInstances=x,this.renderMultiDraw=_,this.renderMultiDrawInstances=p}function K1(o){const e={geometries:0,textures:0},a={frame:0,calls:0,triangles:0,points:0,lines:0};function s(f,d,h){switch(a.calls++,d){case o.TRIANGLES:a.triangles+=h*(f/3);break;case o.LINES:a.lines+=h*(f/2);break;case o.LINE_STRIP:a.lines+=h*(f-1);break;case o.LINE_LOOP:a.lines+=h*f;break;case o.POINTS:a.points+=h*f;break;default:cn("WebGLInfo: Unknown draw mode:",d);break}}function u(){a.calls=0,a.triangles=0,a.points=0,a.lines=0}return{memory:e,render:a,programs:null,autoReset:!0,reset:u,update:s}}function Q1(o,e,a){const s=new WeakMap,u=new sn;function f(d,h,g){const x=d.morphTargetInfluences,_=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,p=_!==void 0?_.length:0;let S=s.get(h);if(S===void 0||S.count!==p){let w=function(){Y.dispose(),s.delete(h),h.removeEventListener("dispose",w)};var M=w;S!==void 0&&S.texture.dispose();const A=h.morphAttributes.position!==void 0,C=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,v=h.morphAttributes.position||[],L=h.morphAttributes.normal||[],O=h.morphAttributes.color||[];let z=0;A===!0&&(z=1),C===!0&&(z=2),y===!0&&(z=3);let V=h.attributes.position.count*z,N=1;V>e.maxTextureSize&&(N=Math.ceil(V/e.maxTextureSize),V=e.maxTextureSize);const I=new Float32Array(V*N*4*p),Y=new xv(I,V,N,p);Y.type=Ta,Y.needsUpdate=!0;const D=z*4;for(let q=0;q<p;q++){const at=v[q],ut=L[q],gt=O[q],ct=V*N*4*q;for(let K=0;K<at.count;K++){const rt=K*D;A===!0&&(u.fromBufferAttribute(at,K),I[ct+rt+0]=u.x,I[ct+rt+1]=u.y,I[ct+rt+2]=u.z,I[ct+rt+3]=0),C===!0&&(u.fromBufferAttribute(ut,K),I[ct+rt+4]=u.x,I[ct+rt+5]=u.y,I[ct+rt+6]=u.z,I[ct+rt+7]=0),y===!0&&(u.fromBufferAttribute(gt,K),I[ct+rt+8]=u.x,I[ct+rt+9]=u.y,I[ct+rt+10]=u.z,I[ct+rt+11]=gt.itemSize===4?u.w:1)}}S={count:p,texture:Y,size:new ze(V,N)},s.set(h,S),h.addEventListener("dispose",w)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)g.getUniforms().setValue(o,"morphTexture",d.morphTexture,a);else{let A=0;for(let y=0;y<x.length;y++)A+=x[y];const C=h.morphTargetsRelative?1:1-A;g.getUniforms().setValue(o,"morphTargetBaseInfluence",C),g.getUniforms().setValue(o,"morphTargetInfluences",x)}g.getUniforms().setValue(o,"morphTargetsTexture",S.texture,a),g.getUniforms().setValue(o,"morphTargetsTextureSize",S.size)}return{update:f}}function J1(o,e,a,s){let u=new WeakMap;function f(g){const x=s.render.frame,_=g.geometry,p=e.get(g,_);if(u.get(p)!==x&&(e.update(p),u.set(p,x)),g.isInstancedMesh&&(g.hasEventListener("dispose",h)===!1&&g.addEventListener("dispose",h),u.get(g)!==x&&(a.update(g.instanceMatrix,o.ARRAY_BUFFER),g.instanceColor!==null&&a.update(g.instanceColor,o.ARRAY_BUFFER),u.set(g,x))),g.isSkinnedMesh){const S=g.skeleton;u.get(S)!==x&&(S.update(),u.set(S,x))}return p}function d(){u=new WeakMap}function h(g){const x=g.target;x.removeEventListener("dispose",h),a.remove(x.instanceMatrix),x.instanceColor!==null&&a.remove(x.instanceColor)}return{update:f,dispose:d}}const Uv=new Xn,O_=new Av(1,1),Nv=new xv,Lv=new SE,Ov=new bv,P_=[],z_=[],I_=new Float32Array(16),B_=new Float32Array(9),F_=new Float32Array(4);function ro(o,e,a){const s=o[0];if(s<=0||s>0)return o;const u=e*a;let f=P_[u];if(f===void 0&&(f=new Float32Array(u),P_[u]=f),e!==0){s.toArray(f,0);for(let d=1,h=0;d!==e;++d)h+=a,o[d].toArray(f,h)}return f}function _n(o,e){if(o.length!==e.length)return!1;for(let a=0,s=o.length;a<s;a++)if(o[a]!==e[a])return!1;return!0}function vn(o,e){for(let a=0,s=e.length;a<s;a++)o[a]=e[a]}function Ac(o,e){let a=z_[e];a===void 0&&(a=new Int32Array(e),z_[e]=a);for(let s=0;s!==e;++s)a[s]=o.allocateTextureUnit();return a}function $1(o,e){const a=this.cache;a[0]!==e&&(o.uniform1f(this.addr,e),a[0]=e)}function tT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(_n(a,e))return;o.uniform2fv(this.addr,e),vn(a,e)}}function eT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else if(e.r!==void 0)(a[0]!==e.r||a[1]!==e.g||a[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),a[0]=e.r,a[1]=e.g,a[2]=e.b);else{if(_n(a,e))return;o.uniform3fv(this.addr,e),vn(a,e)}}function nT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(_n(a,e))return;o.uniform4fv(this.addr,e),vn(a,e)}}function iT(o,e){const a=this.cache,s=e.elements;if(s===void 0){if(_n(a,e))return;o.uniformMatrix2fv(this.addr,!1,e),vn(a,e)}else{if(_n(a,s))return;F_.set(s),o.uniformMatrix2fv(this.addr,!1,F_),vn(a,s)}}function aT(o,e){const a=this.cache,s=e.elements;if(s===void 0){if(_n(a,e))return;o.uniformMatrix3fv(this.addr,!1,e),vn(a,e)}else{if(_n(a,s))return;B_.set(s),o.uniformMatrix3fv(this.addr,!1,B_),vn(a,s)}}function rT(o,e){const a=this.cache,s=e.elements;if(s===void 0){if(_n(a,e))return;o.uniformMatrix4fv(this.addr,!1,e),vn(a,e)}else{if(_n(a,s))return;I_.set(s),o.uniformMatrix4fv(this.addr,!1,I_),vn(a,s)}}function sT(o,e){const a=this.cache;a[0]!==e&&(o.uniform1i(this.addr,e),a[0]=e)}function oT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(_n(a,e))return;o.uniform2iv(this.addr,e),vn(a,e)}}function lT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else{if(_n(a,e))return;o.uniform3iv(this.addr,e),vn(a,e)}}function uT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(_n(a,e))return;o.uniform4iv(this.addr,e),vn(a,e)}}function cT(o,e){const a=this.cache;a[0]!==e&&(o.uniform1ui(this.addr,e),a[0]=e)}function fT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),a[0]=e.x,a[1]=e.y);else{if(_n(a,e))return;o.uniform2uiv(this.addr,e),vn(a,e)}}function dT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),a[0]=e.x,a[1]=e.y,a[2]=e.z);else{if(_n(a,e))return;o.uniform3uiv(this.addr,e),vn(a,e)}}function hT(o,e){const a=this.cache;if(e.x!==void 0)(a[0]!==e.x||a[1]!==e.y||a[2]!==e.z||a[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=e.w);else{if(_n(a,e))return;o.uniform4uiv(this.addr,e),vn(a,e)}}function pT(o,e,a){const s=this.cache,u=a.allocateTextureUnit();s[0]!==u&&(o.uniform1i(this.addr,u),s[0]=u);let f;this.type===o.SAMPLER_2D_SHADOW?(O_.compareFunction=pv,f=O_):f=Uv,a.setTexture2D(e||f,u)}function mT(o,e,a){const s=this.cache,u=a.allocateTextureUnit();s[0]!==u&&(o.uniform1i(this.addr,u),s[0]=u),a.setTexture3D(e||Lv,u)}function xT(o,e,a){const s=this.cache,u=a.allocateTextureUnit();s[0]!==u&&(o.uniform1i(this.addr,u),s[0]=u),a.setTextureCube(e||Ov,u)}function gT(o,e,a){const s=this.cache,u=a.allocateTextureUnit();s[0]!==u&&(o.uniform1i(this.addr,u),s[0]=u),a.setTexture2DArray(e||Nv,u)}function _T(o){switch(o){case 5126:return $1;case 35664:return tT;case 35665:return eT;case 35666:return nT;case 35674:return iT;case 35675:return aT;case 35676:return rT;case 5124:case 35670:return sT;case 35667:case 35671:return oT;case 35668:case 35672:return lT;case 35669:case 35673:return uT;case 5125:return cT;case 36294:return fT;case 36295:return dT;case 36296:return hT;case 35678:case 36198:case 36298:case 36306:case 35682:return pT;case 35679:case 36299:case 36307:return mT;case 35680:case 36300:case 36308:case 36293:return xT;case 36289:case 36303:case 36311:case 36292:return gT}}function vT(o,e){o.uniform1fv(this.addr,e)}function ST(o,e){const a=ro(e,this.size,2);o.uniform2fv(this.addr,a)}function yT(o,e){const a=ro(e,this.size,3);o.uniform3fv(this.addr,a)}function MT(o,e){const a=ro(e,this.size,4);o.uniform4fv(this.addr,a)}function ET(o,e){const a=ro(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,a)}function bT(o,e){const a=ro(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,a)}function TT(o,e){const a=ro(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,a)}function AT(o,e){o.uniform1iv(this.addr,e)}function RT(o,e){o.uniform2iv(this.addr,e)}function CT(o,e){o.uniform3iv(this.addr,e)}function wT(o,e){o.uniform4iv(this.addr,e)}function DT(o,e){o.uniform1uiv(this.addr,e)}function UT(o,e){o.uniform2uiv(this.addr,e)}function NT(o,e){o.uniform3uiv(this.addr,e)}function LT(o,e){o.uniform4uiv(this.addr,e)}function OT(o,e,a){const s=this.cache,u=e.length,f=Ac(a,u);_n(s,f)||(o.uniform1iv(this.addr,f),vn(s,f));for(let d=0;d!==u;++d)a.setTexture2D(e[d]||Uv,f[d])}function PT(o,e,a){const s=this.cache,u=e.length,f=Ac(a,u);_n(s,f)||(o.uniform1iv(this.addr,f),vn(s,f));for(let d=0;d!==u;++d)a.setTexture3D(e[d]||Lv,f[d])}function zT(o,e,a){const s=this.cache,u=e.length,f=Ac(a,u);_n(s,f)||(o.uniform1iv(this.addr,f),vn(s,f));for(let d=0;d!==u;++d)a.setTextureCube(e[d]||Ov,f[d])}function IT(o,e,a){const s=this.cache,u=e.length,f=Ac(a,u);_n(s,f)||(o.uniform1iv(this.addr,f),vn(s,f));for(let d=0;d!==u;++d)a.setTexture2DArray(e[d]||Nv,f[d])}function BT(o){switch(o){case 5126:return vT;case 35664:return ST;case 35665:return yT;case 35666:return MT;case 35674:return ET;case 35675:return bT;case 35676:return TT;case 5124:case 35670:return AT;case 35667:case 35671:return RT;case 35668:case 35672:return CT;case 35669:case 35673:return wT;case 5125:return DT;case 36294:return UT;case 36295:return NT;case 36296:return LT;case 35678:case 36198:case 36298:case 36306:case 35682:return OT;case 35679:case 36299:case 36307:return PT;case 35680:case 36300:case 36308:case 36293:return zT;case 36289:case 36303:case 36311:case 36292:return IT}}class FT{constructor(e,a,s){this.id=e,this.addr=s,this.cache=[],this.type=a.type,this.setValue=_T(a.type)}}class HT{constructor(e,a,s){this.id=e,this.addr=s,this.cache=[],this.type=a.type,this.size=a.size,this.setValue=BT(a.type)}}class GT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,a,s){const u=this.seq;for(let f=0,d=u.length;f!==d;++f){const h=u[f];h.setValue(e,a[h.id],s)}}}const Oh=/(\w+)(\])?(\[|\.)?/g;function H_(o,e){o.seq.push(e),o.map[e.id]=e}function VT(o,e,a){const s=o.name,u=s.length;for(Oh.lastIndex=0;;){const f=Oh.exec(s),d=Oh.lastIndex;let h=f[1];const g=f[2]==="]",x=f[3];if(g&&(h=h|0),x===void 0||x==="["&&d+2===u){H_(a,x===void 0?new FT(h,o,e):new HT(h,o,e));break}else{let p=a.map[h];p===void 0&&(p=new GT(h),H_(a,p)),a=p}}}class xc{constructor(e,a){this.seq=[],this.map={};const s=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let u=0;u<s;++u){const f=e.getActiveUniform(a,u),d=e.getUniformLocation(a,f.name);VT(f,d,this)}}setValue(e,a,s,u){const f=this.map[a];f!==void 0&&f.setValue(e,s,u)}setOptional(e,a,s){const u=a[s];u!==void 0&&this.setValue(e,s,u)}static upload(e,a,s,u){for(let f=0,d=a.length;f!==d;++f){const h=a[f],g=s[h.id];g.needsUpdate!==!1&&h.setValue(e,g.value,u)}}static seqWithValue(e,a){const s=[];for(let u=0,f=e.length;u!==f;++u){const d=e[u];d.id in a&&s.push(d)}return s}}function G_(o,e,a){const s=o.createShader(e);return o.shaderSource(s,a),o.compileShader(s),s}const XT=37297;let kT=0;function qT(o,e){const a=o.split(`
`),s=[],u=Math.max(e-6,0),f=Math.min(e+6,a.length);for(let d=u;d<f;d++){const h=d+1;s.push(`${h===e?">":" "} ${h}: ${a[d]}`)}return s.join(`
`)}const V_=new xe;function YT(o){Oe._getMatrix(V_,Oe.workingColorSpace,o);const e=`mat3( ${V_.elements.map(a=>a.toFixed(4))} )`;switch(Oe.getTransfer(o)){case gc:return[e,"LinearTransferOETF"];case We:return[e,"sRGBTransferOETF"];default:return me("WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function X_(o,e,a){const s=o.getShaderParameter(e,o.COMPILE_STATUS),f=(o.getShaderInfoLog(e)||"").trim();if(s&&f==="")return"";const d=/ERROR: 0:(\d+)/.exec(f);if(d){const h=parseInt(d[1]);return a.toUpperCase()+`

`+f+`

`+qT(o.getShaderSource(e),h)}else return f}function WT(o,e){const a=YT(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${a[1]}( vec4( value.rgb * ${a[0]}, value.a ) );`,"}"].join(`
`)}function jT(o,e){let a;switch(e){case jM:a="Linear";break;case ZM:a="Reinhard";break;case KM:a="Cineon";break;case QM:a="ACESFilmic";break;case $M:a="AgX";break;case tE:a="Neutral";break;case JM:a="Custom";break;default:me("WebGLProgram: Unsupported toneMapping:",e),a="Linear"}return"vec3 "+o+"( vec3 color ) { return "+a+"ToneMapping( color ); }"}const cc=new lt;function ZT(){Oe.getLuminanceCoefficients(cc);const o=cc.x.toFixed(4),e=cc.y.toFixed(4),a=cc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${a} );`,"	return dot( weights, rgb );","}"].join(`
`)}function KT(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ol).join(`
`)}function QT(o){const e=[];for(const a in o){const s=o[a];s!==!1&&e.push("#define "+a+" "+s)}return e.join(`
`)}function JT(o,e){const a={},s=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let u=0;u<s;u++){const f=o.getActiveAttrib(e,u),d=f.name;let h=1;f.type===o.FLOAT_MAT2&&(h=2),f.type===o.FLOAT_MAT3&&(h=3),f.type===o.FLOAT_MAT4&&(h=4),a[d]={type:f.type,location:o.getAttribLocation(e,d),locationSize:h}}return a}function ol(o){return o!==""}function k_(o,e){const a=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,a).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function q_(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $T=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ap(o){return o.replace($T,eA)}const tA=new Map;function eA(o,e){let a=_e[e];if(a===void 0){const s=tA.get(e);if(s!==void 0)a=_e[s],me('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Ap(a)}const nA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Y_(o){return o.replace(nA,iA)}function iA(o,e,a,s){let u="";for(let f=parseInt(e);f<parseInt(a);f++)u+=s.replace(/\[\s*i\s*\]/g,"[ "+f+" ]").replace(/UNROLLED_LOOP_INDEX/g,f);return u}function W_(o){let e=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function aA(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===iv?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===RM?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ea&&(e="SHADOWMAP_TYPE_VSM"),e}function rA(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Js:case $s:e="ENVMAP_TYPE_CUBE";break;case Mc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sA(o){let e="ENVMAP_MODE_REFLECTION";return o.envMap&&o.envMapMode===$s&&(e="ENVMAP_MODE_REFRACTION"),e}function oA(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case av:e="ENVMAP_BLENDING_MULTIPLY";break;case YM:e="ENVMAP_BLENDING_MIX";break;case WM:e="ENVMAP_BLENDING_ADD";break}return e}function lA(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const a=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,a),112)),texelHeight:s,maxMip:a}}function uA(o,e,a,s){const u=o.getContext(),f=a.defines;let d=a.vertexShader,h=a.fragmentShader;const g=aA(a),x=rA(a),_=sA(a),p=oA(a),S=lA(a),M=KT(a),A=QT(f),C=u.createProgram();let y,v,L=a.glslVersion?"#version "+a.glslVersion+`
`:"";a.isRawShaderMaterial?(y=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,A].filter(ol).join(`
`),y.length>0&&(y+=`
`),v=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,A].filter(ol).join(`
`),v.length>0&&(v+=`
`)):(y=[W_(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,A,a.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",a.batching?"#define USE_BATCHING":"",a.batchingColor?"#define USE_BATCHING_COLOR":"",a.instancing?"#define USE_INSTANCING":"",a.instancingColor?"#define USE_INSTANCING_COLOR":"",a.instancingMorph?"#define USE_INSTANCING_MORPH":"",a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.map?"#define USE_MAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+_:"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.displacementMap?"#define USE_DISPLACEMENTMAP":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.mapUv?"#define MAP_UV "+a.mapUv:"",a.alphaMapUv?"#define ALPHAMAP_UV "+a.alphaMapUv:"",a.lightMapUv?"#define LIGHTMAP_UV "+a.lightMapUv:"",a.aoMapUv?"#define AOMAP_UV "+a.aoMapUv:"",a.emissiveMapUv?"#define EMISSIVEMAP_UV "+a.emissiveMapUv:"",a.bumpMapUv?"#define BUMPMAP_UV "+a.bumpMapUv:"",a.normalMapUv?"#define NORMALMAP_UV "+a.normalMapUv:"",a.displacementMapUv?"#define DISPLACEMENTMAP_UV "+a.displacementMapUv:"",a.metalnessMapUv?"#define METALNESSMAP_UV "+a.metalnessMapUv:"",a.roughnessMapUv?"#define ROUGHNESSMAP_UV "+a.roughnessMapUv:"",a.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+a.anisotropyMapUv:"",a.clearcoatMapUv?"#define CLEARCOATMAP_UV "+a.clearcoatMapUv:"",a.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+a.clearcoatNormalMapUv:"",a.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+a.clearcoatRoughnessMapUv:"",a.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+a.iridescenceMapUv:"",a.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+a.iridescenceThicknessMapUv:"",a.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+a.sheenColorMapUv:"",a.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+a.sheenRoughnessMapUv:"",a.specularMapUv?"#define SPECULARMAP_UV "+a.specularMapUv:"",a.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+a.specularColorMapUv:"",a.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+a.specularIntensityMapUv:"",a.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+a.transmissionMapUv:"",a.thicknessMapUv?"#define THICKNESSMAP_UV "+a.thicknessMapUv:"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.flatShading?"#define FLAT_SHADED":"",a.skinning?"#define USE_SKINNING":"",a.morphTargets?"#define USE_MORPHTARGETS":"",a.morphNormals&&a.flatShading===!1?"#define USE_MORPHNORMALS":"",a.morphColors?"#define USE_MORPHCOLORS":"",a.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+a.morphTextureStride:"",a.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+a.morphTargetsCount:"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+g:"",a.sizeAttenuation?"#define USE_SIZEATTENUATION":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ol).join(`
`),v=[W_(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,A,a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",a.map?"#define USE_MAP":"",a.matcap?"#define USE_MATCAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+x:"",a.envMap?"#define "+_:"",a.envMap?"#define "+p:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoat?"#define USE_CLEARCOAT":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.dispersion?"#define USE_DISPERSION":"",a.iridescence?"#define USE_IRIDESCENCE":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaTest?"#define USE_ALPHATEST":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.sheen?"#define USE_SHEEN":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors||a.instancingColor||a.batchingColor?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.gradientMap?"#define USE_GRADIENTMAP":"",a.flatShading?"#define FLAT_SHADED":"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+g:"",a.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",a.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",a.toneMapping!==fr?"#define TONE_MAPPING":"",a.toneMapping!==fr?_e.tonemapping_pars_fragment:"",a.toneMapping!==fr?jT("toneMapping",a.toneMapping):"",a.dithering?"#define DITHERING":"",a.opaque?"#define OPAQUE":"",_e.colorspace_pars_fragment,WT("linearToOutputTexel",a.outputColorSpace),ZT(),a.useDepthPacking?"#define DEPTH_PACKING "+a.depthPacking:"",`
`].filter(ol).join(`
`)),d=Ap(d),d=k_(d,a),d=q_(d,a),h=Ap(h),h=k_(h,a),h=q_(h,a),d=Y_(d),h=Y_(h),a.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,y=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,v=["#define varying in",a.glslVersion===a_?"":"layout(location = 0) out highp vec4 pc_fragColor;",a.glslVersion===a_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const O=L+y+d,z=L+v+h,V=G_(u,u.VERTEX_SHADER,O),N=G_(u,u.FRAGMENT_SHADER,z);u.attachShader(C,V),u.attachShader(C,N),a.index0AttributeName!==void 0?u.bindAttribLocation(C,0,a.index0AttributeName):a.morphTargets===!0&&u.bindAttribLocation(C,0,"position"),u.linkProgram(C);function I(q){if(o.debug.checkShaderErrors){const at=u.getProgramInfoLog(C)||"",ut=u.getShaderInfoLog(V)||"",gt=u.getShaderInfoLog(N)||"",ct=at.trim(),K=ut.trim(),rt=gt.trim();let J=!0,St=!0;if(u.getProgramParameter(C,u.LINK_STATUS)===!1)if(J=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(u,C,V,N);else{const _t=X_(u,V,"vertex"),Vt=X_(u,N,"fragment");cn("THREE.WebGLProgram: Shader Error "+u.getError()+" - VALIDATE_STATUS "+u.getProgramParameter(C,u.VALIDATE_STATUS)+`

Material Name: `+q.name+`
Material Type: `+q.type+`

Program Info Log: `+ct+`
`+_t+`
`+Vt)}else ct!==""?me("WebGLProgram: Program Info Log:",ct):(K===""||rt==="")&&(St=!1);St&&(q.diagnostics={runnable:J,programLog:ct,vertexShader:{log:K,prefix:y},fragmentShader:{log:rt,prefix:v}})}u.deleteShader(V),u.deleteShader(N),Y=new xc(u,C),D=JT(u,C)}let Y;this.getUniforms=function(){return Y===void 0&&I(this),Y};let D;this.getAttributes=function(){return D===void 0&&I(this),D};let w=a.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=u.getProgramParameter(C,XT)),w},this.destroy=function(){s.releaseStatesOfProgram(this),u.deleteProgram(C),this.program=void 0},this.type=a.shaderType,this.name=a.shaderName,this.id=kT++,this.cacheKey=e,this.usedTimes=1,this.program=C,this.vertexShader=V,this.fragmentShader=N,this}let cA=0;class fA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const a=e.vertexShader,s=e.fragmentShader,u=this._getShaderStage(a),f=this._getShaderStage(s),d=this._getShaderCacheForMaterial(e);return d.has(u)===!1&&(d.add(u),u.usedTimes++),d.has(f)===!1&&(d.add(f),f.usedTimes++),this}remove(e){const a=this.materialCache.get(e);for(const s of a)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const a=this.materialCache;let s=a.get(e);return s===void 0&&(s=new Set,a.set(e,s)),s}_getShaderStage(e){const a=this.shaderCache;let s=a.get(e);return s===void 0&&(s=new dA(e),a.set(e,s)),s}}class dA{constructor(e){this.id=cA++,this.code=e,this.usedTimes=0}}function hA(o,e,a,s,u,f,d){const h=new _v,g=new fA,x=new Set,_=[],p=u.logarithmicDepthBuffer,S=u.vertexTextures;let M=u.precision;const A={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(D){return x.add(D),D===0?"uv":`uv${D}`}function y(D,w,q,at,ut){const gt=at.fog,ct=ut.geometry,K=D.isMeshStandardMaterial?at.environment:null,rt=(D.isMeshStandardMaterial?a:e).get(D.envMap||K),J=rt&&rt.mapping===Mc?rt.image.height:null,St=A[D.type];D.precision!==null&&(M=u.getMaxPrecision(D.precision),M!==D.precision&&me("WebGLProgram.getParameters:",D.precision,"not supported, using",M,"instead."));const _t=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,Vt=_t!==void 0?_t.length:0;let le=0;ct.morphAttributes.position!==void 0&&(le=1),ct.morphAttributes.normal!==void 0&&(le=2),ct.morphAttributes.color!==void 0&&(le=3);let Ee,E,G,B;if(St){const De=Ki[St];Ee=De.vertexShader,E=De.fragmentShader}else Ee=D.vertexShader,E=D.fragmentShader,g.update(D),G=g.getVertexShaderID(D),B=g.getFragmentShaderID(D);const k=o.getRenderTarget(),dt=o.state.buffers.depth.getReversed(),bt=ut.isInstancedMesh===!0,vt=ut.isBatchedMesh===!0,Mt=!!D.map,Lt=!!D.matcap,ae=!!rt,qe=!!D.aoMap,H=!!D.lightMap,ue=!!D.bumpMap,Jt=!!D.normalMap,te=!!D.displacementMap,Ft=!!D.emissiveMap,He=!!D.metalnessMap,Yt=!!D.roughnessMap,se=D.anisotropy>0,U=D.clearcoat>0,T=D.dispersion>0,nt=D.iridescence>0,xt=D.sheen>0,Et=D.transmission>0,ft=se&&!!D.anisotropyMap,Xt=U&&!!D.clearcoatMap,Ot=U&&!!D.clearcoatNormalMap,Kt=U&&!!D.clearcoatRoughnessMap,Wt=nt&&!!D.iridescenceMap,Tt=nt&&!!D.iridescenceThicknessMap,wt=xt&&!!D.sheenColorMap,ee=xt&&!!D.sheenRoughnessMap,$t=!!D.specularMap,Ht=!!D.specularColorMap,oe=!!D.specularIntensityMap,F=Et&&!!D.transmissionMap,Pt=Et&&!!D.thicknessMap,Dt=!!D.gradientMap,Ut=!!D.alphaMap,At=D.alphaTest>0,yt=!!D.alphaHash,kt=!!D.extensions;let ce=fr;D.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(ce=o.toneMapping);const je={shaderID:St,shaderType:D.type,shaderName:D.name,vertexShader:Ee,fragmentShader:E,defines:D.defines,customVertexShaderID:G,customFragmentShaderID:B,isRawShaderMaterial:D.isRawShaderMaterial===!0,glslVersion:D.glslVersion,precision:M,batching:vt,batchingColor:vt&&ut._colorsTexture!==null,instancing:bt,instancingColor:bt&&ut.instanceColor!==null,instancingMorph:bt&&ut.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:k===null?o.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:to,alphaToCoverage:!!D.alphaToCoverage,map:Mt,matcap:Lt,envMap:ae,envMapMode:ae&&rt.mapping,envMapCubeUVHeight:J,aoMap:qe,lightMap:H,bumpMap:ue,normalMap:Jt,displacementMap:S&&te,emissiveMap:Ft,normalMapObjectSpace:Jt&&D.normalMapType===aE,normalMapTangentSpace:Jt&&D.normalMapType===hv,metalnessMap:He,roughnessMap:Yt,anisotropy:se,anisotropyMap:ft,clearcoat:U,clearcoatMap:Xt,clearcoatNormalMap:Ot,clearcoatRoughnessMap:Kt,dispersion:T,iridescence:nt,iridescenceMap:Wt,iridescenceThicknessMap:Tt,sheen:xt,sheenColorMap:wt,sheenRoughnessMap:ee,specularMap:$t,specularColorMap:Ht,specularIntensityMap:oe,transmission:Et,transmissionMap:F,thicknessMap:Pt,gradientMap:Dt,opaque:D.transparent===!1&&D.blending===Zs&&D.alphaToCoverage===!1,alphaMap:Ut,alphaTest:At,alphaHash:yt,combine:D.combine,mapUv:Mt&&C(D.map.channel),aoMapUv:qe&&C(D.aoMap.channel),lightMapUv:H&&C(D.lightMap.channel),bumpMapUv:ue&&C(D.bumpMap.channel),normalMapUv:Jt&&C(D.normalMap.channel),displacementMapUv:te&&C(D.displacementMap.channel),emissiveMapUv:Ft&&C(D.emissiveMap.channel),metalnessMapUv:He&&C(D.metalnessMap.channel),roughnessMapUv:Yt&&C(D.roughnessMap.channel),anisotropyMapUv:ft&&C(D.anisotropyMap.channel),clearcoatMapUv:Xt&&C(D.clearcoatMap.channel),clearcoatNormalMapUv:Ot&&C(D.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Kt&&C(D.clearcoatRoughnessMap.channel),iridescenceMapUv:Wt&&C(D.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&C(D.iridescenceThicknessMap.channel),sheenColorMapUv:wt&&C(D.sheenColorMap.channel),sheenRoughnessMapUv:ee&&C(D.sheenRoughnessMap.channel),specularMapUv:$t&&C(D.specularMap.channel),specularColorMapUv:Ht&&C(D.specularColorMap.channel),specularIntensityMapUv:oe&&C(D.specularIntensityMap.channel),transmissionMapUv:F&&C(D.transmissionMap.channel),thicknessMapUv:Pt&&C(D.thicknessMap.channel),alphaMapUv:Ut&&C(D.alphaMap.channel),vertexTangents:!!ct.attributes.tangent&&(Jt||se),vertexColors:D.vertexColors,vertexAlphas:D.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,pointsUvs:ut.isPoints===!0&&!!ct.attributes.uv&&(Mt||Ut),fog:!!gt,useFog:D.fog===!0,fogExp2:!!gt&&gt.isFogExp2,flatShading:D.flatShading===!0&&D.wireframe===!1,sizeAttenuation:D.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:dt,skinning:ut.isSkinnedMesh===!0,morphTargets:ct.morphAttributes.position!==void 0,morphNormals:ct.morphAttributes.normal!==void 0,morphColors:ct.morphAttributes.color!==void 0,morphTargetsCount:Vt,morphTextureStride:le,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:D.dithering,shadowMapEnabled:o.shadowMap.enabled&&q.length>0,shadowMapType:o.shadowMap.type,toneMapping:ce,decodeVideoTexture:Mt&&D.map.isVideoTexture===!0&&Oe.getTransfer(D.map.colorSpace)===We,decodeVideoTextureEmissive:Ft&&D.emissiveMap.isVideoTexture===!0&&Oe.getTransfer(D.emissiveMap.colorSpace)===We,premultipliedAlpha:D.premultipliedAlpha,doubleSided:D.side===Qi,flipSided:D.side===Qn,useDepthPacking:D.depthPacking>=0,depthPacking:D.depthPacking||0,index0AttributeName:D.index0AttributeName,extensionClipCullDistance:kt&&D.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(kt&&D.extensions.multiDraw===!0||vt)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:D.customProgramCacheKey()};return je.vertexUv1s=x.has(1),je.vertexUv2s=x.has(2),je.vertexUv3s=x.has(3),x.clear(),je}function v(D){const w=[];if(D.shaderID?w.push(D.shaderID):(w.push(D.customVertexShaderID),w.push(D.customFragmentShaderID)),D.defines!==void 0)for(const q in D.defines)w.push(q),w.push(D.defines[q]);return D.isRawShaderMaterial===!1&&(L(w,D),O(w,D),w.push(o.outputColorSpace)),w.push(D.customProgramCacheKey),w.join()}function L(D,w){D.push(w.precision),D.push(w.outputColorSpace),D.push(w.envMapMode),D.push(w.envMapCubeUVHeight),D.push(w.mapUv),D.push(w.alphaMapUv),D.push(w.lightMapUv),D.push(w.aoMapUv),D.push(w.bumpMapUv),D.push(w.normalMapUv),D.push(w.displacementMapUv),D.push(w.emissiveMapUv),D.push(w.metalnessMapUv),D.push(w.roughnessMapUv),D.push(w.anisotropyMapUv),D.push(w.clearcoatMapUv),D.push(w.clearcoatNormalMapUv),D.push(w.clearcoatRoughnessMapUv),D.push(w.iridescenceMapUv),D.push(w.iridescenceThicknessMapUv),D.push(w.sheenColorMapUv),D.push(w.sheenRoughnessMapUv),D.push(w.specularMapUv),D.push(w.specularColorMapUv),D.push(w.specularIntensityMapUv),D.push(w.transmissionMapUv),D.push(w.thicknessMapUv),D.push(w.combine),D.push(w.fogExp2),D.push(w.sizeAttenuation),D.push(w.morphTargetsCount),D.push(w.morphAttributeCount),D.push(w.numDirLights),D.push(w.numPointLights),D.push(w.numSpotLights),D.push(w.numSpotLightMaps),D.push(w.numHemiLights),D.push(w.numRectAreaLights),D.push(w.numDirLightShadows),D.push(w.numPointLightShadows),D.push(w.numSpotLightShadows),D.push(w.numSpotLightShadowsWithMaps),D.push(w.numLightProbes),D.push(w.shadowMapType),D.push(w.toneMapping),D.push(w.numClippingPlanes),D.push(w.numClipIntersection),D.push(w.depthPacking)}function O(D,w){h.disableAll(),w.supportsVertexTextures&&h.enable(0),w.instancing&&h.enable(1),w.instancingColor&&h.enable(2),w.instancingMorph&&h.enable(3),w.matcap&&h.enable(4),w.envMap&&h.enable(5),w.normalMapObjectSpace&&h.enable(6),w.normalMapTangentSpace&&h.enable(7),w.clearcoat&&h.enable(8),w.iridescence&&h.enable(9),w.alphaTest&&h.enable(10),w.vertexColors&&h.enable(11),w.vertexAlphas&&h.enable(12),w.vertexUv1s&&h.enable(13),w.vertexUv2s&&h.enable(14),w.vertexUv3s&&h.enable(15),w.vertexTangents&&h.enable(16),w.anisotropy&&h.enable(17),w.alphaHash&&h.enable(18),w.batching&&h.enable(19),w.dispersion&&h.enable(20),w.batchingColor&&h.enable(21),w.gradientMap&&h.enable(22),D.push(h.mask),h.disableAll(),w.fog&&h.enable(0),w.useFog&&h.enable(1),w.flatShading&&h.enable(2),w.logarithmicDepthBuffer&&h.enable(3),w.reversedDepthBuffer&&h.enable(4),w.skinning&&h.enable(5),w.morphTargets&&h.enable(6),w.morphNormals&&h.enable(7),w.morphColors&&h.enable(8),w.premultipliedAlpha&&h.enable(9),w.shadowMapEnabled&&h.enable(10),w.doubleSided&&h.enable(11),w.flipSided&&h.enable(12),w.useDepthPacking&&h.enable(13),w.dithering&&h.enable(14),w.transmission&&h.enable(15),w.sheen&&h.enable(16),w.opaque&&h.enable(17),w.pointsUvs&&h.enable(18),w.decodeVideoTexture&&h.enable(19),w.decodeVideoTextureEmissive&&h.enable(20),w.alphaToCoverage&&h.enable(21),D.push(h.mask)}function z(D){const w=A[D.type];let q;if(w){const at=Ki[w];q=LE.clone(at.uniforms)}else q=D.uniforms;return q}function V(D,w){let q;for(let at=0,ut=_.length;at<ut;at++){const gt=_[at];if(gt.cacheKey===w){q=gt,++q.usedTimes;break}}return q===void 0&&(q=new uA(o,w,D,f),_.push(q)),q}function N(D){if(--D.usedTimes===0){const w=_.indexOf(D);_[w]=_[_.length-1],_.pop(),D.destroy()}}function I(D){g.remove(D)}function Y(){g.dispose()}return{getParameters:y,getProgramCacheKey:v,getUniforms:z,acquireProgram:V,releaseProgram:N,releaseShaderCache:I,programs:_,dispose:Y}}function pA(){let o=new WeakMap;function e(d){return o.has(d)}function a(d){let h=o.get(d);return h===void 0&&(h={},o.set(d,h)),h}function s(d){o.delete(d)}function u(d,h,g){o.get(d)[h]=g}function f(){o=new WeakMap}return{has:e,get:a,remove:s,update:u,dispose:f}}function mA(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function j_(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function Z_(){const o=[];let e=0;const a=[],s=[],u=[];function f(){e=0,a.length=0,s.length=0,u.length=0}function d(p,S,M,A,C,y){let v=o[e];return v===void 0?(v={id:p.id,object:p,geometry:S,material:M,groupOrder:A,renderOrder:p.renderOrder,z:C,group:y},o[e]=v):(v.id=p.id,v.object=p,v.geometry=S,v.material=M,v.groupOrder=A,v.renderOrder=p.renderOrder,v.z=C,v.group=y),e++,v}function h(p,S,M,A,C,y){const v=d(p,S,M,A,C,y);M.transmission>0?s.push(v):M.transparent===!0?u.push(v):a.push(v)}function g(p,S,M,A,C,y){const v=d(p,S,M,A,C,y);M.transmission>0?s.unshift(v):M.transparent===!0?u.unshift(v):a.unshift(v)}function x(p,S){a.length>1&&a.sort(p||mA),s.length>1&&s.sort(S||j_),u.length>1&&u.sort(S||j_)}function _(){for(let p=e,S=o.length;p<S;p++){const M=o[p];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:a,transmissive:s,transparent:u,init:f,push:h,unshift:g,finish:_,sort:x}}function xA(){let o=new WeakMap;function e(s,u){const f=o.get(s);let d;return f===void 0?(d=new Z_,o.set(s,[d])):u>=f.length?(d=new Z_,f.push(d)):d=f[u],d}function a(){o=new WeakMap}return{get:e,dispose:a}}function gA(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let a;switch(e.type){case"DirectionalLight":a={direction:new lt,color:new Pe};break;case"SpotLight":a={position:new lt,direction:new lt,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":a={position:new lt,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":a={direction:new lt,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":a={color:new Pe,position:new lt,halfWidth:new lt,halfHeight:new lt};break}return o[e.id]=a,a}}}function _A(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let a;switch(e.type){case"DirectionalLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze};break;case"SpotLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze};break;case"PointLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=a,a}}}let vA=0;function SA(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function yA(o){const e=new gA,a=_A(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let x=0;x<9;x++)s.probe.push(new lt);const u=new lt,f=new on,d=new on;function h(x){let _=0,p=0,S=0;for(let D=0;D<9;D++)s.probe[D].set(0,0,0);let M=0,A=0,C=0,y=0,v=0,L=0,O=0,z=0,V=0,N=0,I=0;x.sort(SA);for(let D=0,w=x.length;D<w;D++){const q=x[D],at=q.color,ut=q.intensity,gt=q.distance,ct=q.shadow&&q.shadow.map?q.shadow.map.texture:null;if(q.isAmbientLight)_+=at.r*ut,p+=at.g*ut,S+=at.b*ut;else if(q.isLightProbe){for(let K=0;K<9;K++)s.probe[K].addScaledVector(q.sh.coefficients[K],ut);I++}else if(q.isDirectionalLight){const K=e.get(q);if(K.color.copy(q.color).multiplyScalar(q.intensity),q.castShadow){const rt=q.shadow,J=a.get(q);J.shadowIntensity=rt.intensity,J.shadowBias=rt.bias,J.shadowNormalBias=rt.normalBias,J.shadowRadius=rt.radius,J.shadowMapSize=rt.mapSize,s.directionalShadow[M]=J,s.directionalShadowMap[M]=ct,s.directionalShadowMatrix[M]=q.shadow.matrix,L++}s.directional[M]=K,M++}else if(q.isSpotLight){const K=e.get(q);K.position.setFromMatrixPosition(q.matrixWorld),K.color.copy(at).multiplyScalar(ut),K.distance=gt,K.coneCos=Math.cos(q.angle),K.penumbraCos=Math.cos(q.angle*(1-q.penumbra)),K.decay=q.decay,s.spot[C]=K;const rt=q.shadow;if(q.map&&(s.spotLightMap[V]=q.map,V++,rt.updateMatrices(q),q.castShadow&&N++),s.spotLightMatrix[C]=rt.matrix,q.castShadow){const J=a.get(q);J.shadowIntensity=rt.intensity,J.shadowBias=rt.bias,J.shadowNormalBias=rt.normalBias,J.shadowRadius=rt.radius,J.shadowMapSize=rt.mapSize,s.spotShadow[C]=J,s.spotShadowMap[C]=ct,z++}C++}else if(q.isRectAreaLight){const K=e.get(q);K.color.copy(at).multiplyScalar(ut),K.halfWidth.set(q.width*.5,0,0),K.halfHeight.set(0,q.height*.5,0),s.rectArea[y]=K,y++}else if(q.isPointLight){const K=e.get(q);if(K.color.copy(q.color).multiplyScalar(q.intensity),K.distance=q.distance,K.decay=q.decay,q.castShadow){const rt=q.shadow,J=a.get(q);J.shadowIntensity=rt.intensity,J.shadowBias=rt.bias,J.shadowNormalBias=rt.normalBias,J.shadowRadius=rt.radius,J.shadowMapSize=rt.mapSize,J.shadowCameraNear=rt.camera.near,J.shadowCameraFar=rt.camera.far,s.pointShadow[A]=J,s.pointShadowMap[A]=ct,s.pointShadowMatrix[A]=q.shadow.matrix,O++}s.point[A]=K,A++}else if(q.isHemisphereLight){const K=e.get(q);K.skyColor.copy(q.color).multiplyScalar(ut),K.groundColor.copy(q.groundColor).multiplyScalar(ut),s.hemi[v]=K,v++}}y>0&&(o.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=It.LTC_FLOAT_1,s.rectAreaLTC2=It.LTC_FLOAT_2):(s.rectAreaLTC1=It.LTC_HALF_1,s.rectAreaLTC2=It.LTC_HALF_2)),s.ambient[0]=_,s.ambient[1]=p,s.ambient[2]=S;const Y=s.hash;(Y.directionalLength!==M||Y.pointLength!==A||Y.spotLength!==C||Y.rectAreaLength!==y||Y.hemiLength!==v||Y.numDirectionalShadows!==L||Y.numPointShadows!==O||Y.numSpotShadows!==z||Y.numSpotMaps!==V||Y.numLightProbes!==I)&&(s.directional.length=M,s.spot.length=C,s.rectArea.length=y,s.point.length=A,s.hemi.length=v,s.directionalShadow.length=L,s.directionalShadowMap.length=L,s.pointShadow.length=O,s.pointShadowMap.length=O,s.spotShadow.length=z,s.spotShadowMap.length=z,s.directionalShadowMatrix.length=L,s.pointShadowMatrix.length=O,s.spotLightMatrix.length=z+V-N,s.spotLightMap.length=V,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=I,Y.directionalLength=M,Y.pointLength=A,Y.spotLength=C,Y.rectAreaLength=y,Y.hemiLength=v,Y.numDirectionalShadows=L,Y.numPointShadows=O,Y.numSpotShadows=z,Y.numSpotMaps=V,Y.numLightProbes=I,s.version=vA++)}function g(x,_){let p=0,S=0,M=0,A=0,C=0;const y=_.matrixWorldInverse;for(let v=0,L=x.length;v<L;v++){const O=x[v];if(O.isDirectionalLight){const z=s.directional[p];z.direction.setFromMatrixPosition(O.matrixWorld),u.setFromMatrixPosition(O.target.matrixWorld),z.direction.sub(u),z.direction.transformDirection(y),p++}else if(O.isSpotLight){const z=s.spot[M];z.position.setFromMatrixPosition(O.matrixWorld),z.position.applyMatrix4(y),z.direction.setFromMatrixPosition(O.matrixWorld),u.setFromMatrixPosition(O.target.matrixWorld),z.direction.sub(u),z.direction.transformDirection(y),M++}else if(O.isRectAreaLight){const z=s.rectArea[A];z.position.setFromMatrixPosition(O.matrixWorld),z.position.applyMatrix4(y),d.identity(),f.copy(O.matrixWorld),f.premultiply(y),d.extractRotation(f),z.halfWidth.set(O.width*.5,0,0),z.halfHeight.set(0,O.height*.5,0),z.halfWidth.applyMatrix4(d),z.halfHeight.applyMatrix4(d),A++}else if(O.isPointLight){const z=s.point[S];z.position.setFromMatrixPosition(O.matrixWorld),z.position.applyMatrix4(y),S++}else if(O.isHemisphereLight){const z=s.hemi[C];z.direction.setFromMatrixPosition(O.matrixWorld),z.direction.transformDirection(y),C++}}}return{setup:h,setupView:g,state:s}}function K_(o){const e=new yA(o),a=[],s=[];function u(_){x.camera=_,a.length=0,s.length=0}function f(_){a.push(_)}function d(_){s.push(_)}function h(){e.setup(a)}function g(_){e.setupView(a,_)}const x={lightsArray:a,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:u,state:x,setupLights:h,setupLightsView:g,pushLight:f,pushShadow:d}}function MA(o){let e=new WeakMap;function a(u,f=0){const d=e.get(u);let h;return d===void 0?(h=new K_(o),e.set(u,[h])):f>=d.length?(h=new K_(o),d.push(h)):h=d[f],h}function s(){e=new WeakMap}return{get:a,dispose:s}}const EA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function TA(o,e,a){let s=new Ip;const u=new ze,f=new ze,d=new sn,h=new YE({depthPacking:iE}),g=new WE,x={},_=a.maxTextureSize,p={[dr]:Qn,[Qn]:dr,[Qi]:Qi},S=new Ca({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ze},radius:{value:4}},vertexShader:EA,fragmentShader:bA}),M=S.clone();M.defines.HORIZONTAL_PASS=1;const A=new bi;A.setAttribute("position",new zi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Ii(A,S),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iv;let v=this.type;this.render=function(N,I,Y){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||N.length===0)return;const D=o.getRenderTarget(),w=o.getActiveCubeFace(),q=o.getActiveMipmapLevel(),at=o.state;at.setBlending(Aa),at.buffers.depth.getReversed()===!0?at.buffers.color.setClear(0,0,0,0):at.buffers.color.setClear(1,1,1,1),at.buffers.depth.setTest(!0),at.setScissorTest(!1);const ut=v!==Ea&&this.type===Ea,gt=v===Ea&&this.type!==Ea;for(let ct=0,K=N.length;ct<K;ct++){const rt=N[ct],J=rt.shadow;if(J===void 0){me("WebGLShadowMap:",rt,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;u.copy(J.mapSize);const St=J.getFrameExtents();if(u.multiply(St),f.copy(J.mapSize),(u.x>_||u.y>_)&&(u.x>_&&(f.x=Math.floor(_/St.x),u.x=f.x*St.x,J.mapSize.x=f.x),u.y>_&&(f.y=Math.floor(_/St.y),u.y=f.y*St.y,J.mapSize.y=f.y)),J.map===null||ut===!0||gt===!0){const Vt=this.type!==Ea?{minFilter:ui,magFilter:ui}:{};J.map!==null&&J.map.dispose(),J.map=new Zr(u.x,u.y,Vt),J.map.texture.name=rt.name+".shadowMap",J.camera.updateProjectionMatrix()}o.setRenderTarget(J.map),o.clear();const _t=J.getViewportCount();for(let Vt=0;Vt<_t;Vt++){const le=J.getViewport(Vt);d.set(f.x*le.x,f.y*le.y,f.x*le.z,f.y*le.w),at.viewport(d),J.updateMatrices(rt,Vt),s=J.getFrustum(),z(I,Y,J.camera,rt,this.type)}J.isPointLightShadow!==!0&&this.type===Ea&&L(J,Y),J.needsUpdate=!1}v=this.type,y.needsUpdate=!1,o.setRenderTarget(D,w,q)};function L(N,I){const Y=e.update(C);S.defines.VSM_SAMPLES!==N.blurSamples&&(S.defines.VSM_SAMPLES=N.blurSamples,M.defines.VSM_SAMPLES=N.blurSamples,S.needsUpdate=!0,M.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new Zr(u.x,u.y)),S.uniforms.shadow_pass.value=N.map.texture,S.uniforms.resolution.value=N.mapSize,S.uniforms.radius.value=N.radius,o.setRenderTarget(N.mapPass),o.clear(),o.renderBufferDirect(I,null,Y,S,C,null),M.uniforms.shadow_pass.value=N.mapPass.texture,M.uniforms.resolution.value=N.mapSize,M.uniforms.radius.value=N.radius,o.setRenderTarget(N.map),o.clear(),o.renderBufferDirect(I,null,Y,M,C,null)}function O(N,I,Y,D){let w=null;const q=Y.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(q!==void 0)w=q;else if(w=Y.isPointLight===!0?g:h,o.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const at=w.uuid,ut=I.uuid;let gt=x[at];gt===void 0&&(gt={},x[at]=gt);let ct=gt[ut];ct===void 0&&(ct=w.clone(),gt[ut]=ct,I.addEventListener("dispose",V)),w=ct}if(w.visible=I.visible,w.wireframe=I.wireframe,D===Ea?w.side=I.shadowSide!==null?I.shadowSide:I.side:w.side=I.shadowSide!==null?I.shadowSide:p[I.side],w.alphaMap=I.alphaMap,w.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,w.map=I.map,w.clipShadows=I.clipShadows,w.clippingPlanes=I.clippingPlanes,w.clipIntersection=I.clipIntersection,w.displacementMap=I.displacementMap,w.displacementScale=I.displacementScale,w.displacementBias=I.displacementBias,w.wireframeLinewidth=I.wireframeLinewidth,w.linewidth=I.linewidth,Y.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const at=o.properties.get(w);at.light=Y}return w}function z(N,I,Y,D,w){if(N.visible===!1)return;if(N.layers.test(I.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&w===Ea)&&(!N.frustumCulled||s.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,N.matrixWorld);const ut=e.update(N),gt=N.material;if(Array.isArray(gt)){const ct=ut.groups;for(let K=0,rt=ct.length;K<rt;K++){const J=ct[K],St=gt[J.materialIndex];if(St&&St.visible){const _t=O(N,St,D,w);N.onBeforeShadow(o,N,I,Y,ut,_t,J),o.renderBufferDirect(Y,null,ut,_t,N,J),N.onAfterShadow(o,N,I,Y,ut,_t,J)}}}else if(gt.visible){const ct=O(N,gt,D,w);N.onBeforeShadow(o,N,I,Y,ut,ct,null),o.renderBufferDirect(Y,null,ut,ct,N,null),N.onAfterShadow(o,N,I,Y,ut,ct,null)}}const at=N.children;for(let ut=0,gt=at.length;ut<gt;ut++)z(at[ut],I,Y,D,w)}function V(N){N.target.removeEventListener("dispose",V);for(const Y in x){const D=x[Y],w=N.target.uuid;w in D&&(D[w].dispose(),delete D[w])}}}const AA={[Fh]:Hh,[Gh]:kh,[Vh]:qh,[Qs]:Xh,[Hh]:Fh,[kh]:Gh,[qh]:Vh,[Xh]:Qs};function RA(o,e){function a(){let F=!1;const Pt=new sn;let Dt=null;const Ut=new sn(0,0,0,0);return{setMask:function(At){Dt!==At&&!F&&(o.colorMask(At,At,At,At),Dt=At)},setLocked:function(At){F=At},setClear:function(At,yt,kt,ce,je){je===!0&&(At*=ce,yt*=ce,kt*=ce),Pt.set(At,yt,kt,ce),Ut.equals(Pt)===!1&&(o.clearColor(At,yt,kt,ce),Ut.copy(Pt))},reset:function(){F=!1,Dt=null,Ut.set(-1,0,0,0)}}}function s(){let F=!1,Pt=!1,Dt=null,Ut=null,At=null;return{setReversed:function(yt){if(Pt!==yt){const kt=e.get("EXT_clip_control");yt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT),Pt=yt;const ce=At;At=null,this.setClear(ce)}},getReversed:function(){return Pt},setTest:function(yt){yt?k(o.DEPTH_TEST):dt(o.DEPTH_TEST)},setMask:function(yt){Dt!==yt&&!F&&(o.depthMask(yt),Dt=yt)},setFunc:function(yt){if(Pt&&(yt=AA[yt]),Ut!==yt){switch(yt){case Fh:o.depthFunc(o.NEVER);break;case Hh:o.depthFunc(o.ALWAYS);break;case Gh:o.depthFunc(o.LESS);break;case Qs:o.depthFunc(o.LEQUAL);break;case Vh:o.depthFunc(o.EQUAL);break;case Xh:o.depthFunc(o.GEQUAL);break;case kh:o.depthFunc(o.GREATER);break;case qh:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Ut=yt}},setLocked:function(yt){F=yt},setClear:function(yt){At!==yt&&(Pt&&(yt=1-yt),o.clearDepth(yt),At=yt)},reset:function(){F=!1,Dt=null,Ut=null,At=null,Pt=!1}}}function u(){let F=!1,Pt=null,Dt=null,Ut=null,At=null,yt=null,kt=null,ce=null,je=null;return{setTest:function(De){F||(De?k(o.STENCIL_TEST):dt(o.STENCIL_TEST))},setMask:function(De){Pt!==De&&!F&&(o.stencilMask(De),Pt=De)},setFunc:function(De,tn,fn){(Dt!==De||Ut!==tn||At!==fn)&&(o.stencilFunc(De,tn,fn),Dt=De,Ut=tn,At=fn)},setOp:function(De,tn,fn){(yt!==De||kt!==tn||ce!==fn)&&(o.stencilOp(De,tn,fn),yt=De,kt=tn,ce=fn)},setLocked:function(De){F=De},setClear:function(De){je!==De&&(o.clearStencil(De),je=De)},reset:function(){F=!1,Pt=null,Dt=null,Ut=null,At=null,yt=null,kt=null,ce=null,je=null}}}const f=new a,d=new s,h=new u,g=new WeakMap,x=new WeakMap;let _={},p={},S=new WeakMap,M=[],A=null,C=!1,y=null,v=null,L=null,O=null,z=null,V=null,N=null,I=new Pe(0,0,0),Y=0,D=!1,w=null,q=null,at=null,ut=null,gt=null;const ct=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,rt=0;const J=o.getParameter(o.VERSION);J.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(J)[1]),K=rt>=1):J.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),K=rt>=2);let St=null,_t={};const Vt=o.getParameter(o.SCISSOR_BOX),le=o.getParameter(o.VIEWPORT),Ee=new sn().fromArray(Vt),E=new sn().fromArray(le);function G(F,Pt,Dt,Ut){const At=new Uint8Array(4),yt=o.createTexture();o.bindTexture(F,yt),o.texParameteri(F,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(F,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let kt=0;kt<Dt;kt++)F===o.TEXTURE_3D||F===o.TEXTURE_2D_ARRAY?o.texImage3D(Pt,0,o.RGBA,1,1,Ut,0,o.RGBA,o.UNSIGNED_BYTE,At):o.texImage2D(Pt+kt,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,At);return yt}const B={};B[o.TEXTURE_2D]=G(o.TEXTURE_2D,o.TEXTURE_2D,1),B[o.TEXTURE_CUBE_MAP]=G(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[o.TEXTURE_2D_ARRAY]=G(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),B[o.TEXTURE_3D]=G(o.TEXTURE_3D,o.TEXTURE_3D,1,1),f.setClear(0,0,0,1),d.setClear(1),h.setClear(0),k(o.DEPTH_TEST),d.setFunc(Qs),ue(!1),Jt(Jg),k(o.CULL_FACE),qe(Aa);function k(F){_[F]!==!0&&(o.enable(F),_[F]=!0)}function dt(F){_[F]!==!1&&(o.disable(F),_[F]=!1)}function bt(F,Pt){return p[F]!==Pt?(o.bindFramebuffer(F,Pt),p[F]=Pt,F===o.DRAW_FRAMEBUFFER&&(p[o.FRAMEBUFFER]=Pt),F===o.FRAMEBUFFER&&(p[o.DRAW_FRAMEBUFFER]=Pt),!0):!1}function vt(F,Pt){let Dt=M,Ut=!1;if(F){Dt=S.get(Pt),Dt===void 0&&(Dt=[],S.set(Pt,Dt));const At=F.textures;if(Dt.length!==At.length||Dt[0]!==o.COLOR_ATTACHMENT0){for(let yt=0,kt=At.length;yt<kt;yt++)Dt[yt]=o.COLOR_ATTACHMENT0+yt;Dt.length=At.length,Ut=!0}}else Dt[0]!==o.BACK&&(Dt[0]=o.BACK,Ut=!0);Ut&&o.drawBuffers(Dt)}function Mt(F){return A!==F?(o.useProgram(F),A=F,!0):!1}const Lt={[kr]:o.FUNC_ADD,[wM]:o.FUNC_SUBTRACT,[DM]:o.FUNC_REVERSE_SUBTRACT};Lt[UM]=o.MIN,Lt[NM]=o.MAX;const ae={[LM]:o.ZERO,[OM]:o.ONE,[PM]:o.SRC_COLOR,[Ih]:o.SRC_ALPHA,[GM]:o.SRC_ALPHA_SATURATE,[FM]:o.DST_COLOR,[IM]:o.DST_ALPHA,[zM]:o.ONE_MINUS_SRC_COLOR,[Bh]:o.ONE_MINUS_SRC_ALPHA,[HM]:o.ONE_MINUS_DST_COLOR,[BM]:o.ONE_MINUS_DST_ALPHA,[VM]:o.CONSTANT_COLOR,[XM]:o.ONE_MINUS_CONSTANT_COLOR,[kM]:o.CONSTANT_ALPHA,[qM]:o.ONE_MINUS_CONSTANT_ALPHA};function qe(F,Pt,Dt,Ut,At,yt,kt,ce,je,De){if(F===Aa){C===!0&&(dt(o.BLEND),C=!1);return}if(C===!1&&(k(o.BLEND),C=!0),F!==CM){if(F!==y||De!==D){if((v!==kr||z!==kr)&&(o.blendEquation(o.FUNC_ADD),v=kr,z=kr),De)switch(F){case Zs:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case $g:o.blendFunc(o.ONE,o.ONE);break;case t_:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case e_:o.blendFuncSeparate(o.DST_COLOR,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE);break;default:cn("WebGLState: Invalid blending: ",F);break}else switch(F){case Zs:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case $g:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE,o.ONE,o.ONE);break;case t_:cn("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case e_:cn("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:cn("WebGLState: Invalid blending: ",F);break}L=null,O=null,V=null,N=null,I.set(0,0,0),Y=0,y=F,D=De}return}At=At||Pt,yt=yt||Dt,kt=kt||Ut,(Pt!==v||At!==z)&&(o.blendEquationSeparate(Lt[Pt],Lt[At]),v=Pt,z=At),(Dt!==L||Ut!==O||yt!==V||kt!==N)&&(o.blendFuncSeparate(ae[Dt],ae[Ut],ae[yt],ae[kt]),L=Dt,O=Ut,V=yt,N=kt),(ce.equals(I)===!1||je!==Y)&&(o.blendColor(ce.r,ce.g,ce.b,je),I.copy(ce),Y=je),y=F,D=!1}function H(F,Pt){F.side===Qi?dt(o.CULL_FACE):k(o.CULL_FACE);let Dt=F.side===Qn;Pt&&(Dt=!Dt),ue(Dt),F.blending===Zs&&F.transparent===!1?qe(Aa):qe(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),d.setFunc(F.depthFunc),d.setTest(F.depthTest),d.setMask(F.depthWrite),f.setMask(F.colorWrite);const Ut=F.stencilWrite;h.setTest(Ut),Ut&&(h.setMask(F.stencilWriteMask),h.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),h.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ft(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?k(o.SAMPLE_ALPHA_TO_COVERAGE):dt(o.SAMPLE_ALPHA_TO_COVERAGE)}function ue(F){w!==F&&(F?o.frontFace(o.CW):o.frontFace(o.CCW),w=F)}function Jt(F){F!==TM?(k(o.CULL_FACE),F!==q&&(F===Jg?o.cullFace(o.BACK):F===AM?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):dt(o.CULL_FACE),q=F}function te(F){F!==at&&(K&&o.lineWidth(F),at=F)}function Ft(F,Pt,Dt){F?(k(o.POLYGON_OFFSET_FILL),(ut!==Pt||gt!==Dt)&&(o.polygonOffset(Pt,Dt),ut=Pt,gt=Dt)):dt(o.POLYGON_OFFSET_FILL)}function He(F){F?k(o.SCISSOR_TEST):dt(o.SCISSOR_TEST)}function Yt(F){F===void 0&&(F=o.TEXTURE0+ct-1),St!==F&&(o.activeTexture(F),St=F)}function se(F,Pt,Dt){Dt===void 0&&(St===null?Dt=o.TEXTURE0+ct-1:Dt=St);let Ut=_t[Dt];Ut===void 0&&(Ut={type:void 0,texture:void 0},_t[Dt]=Ut),(Ut.type!==F||Ut.texture!==Pt)&&(St!==Dt&&(o.activeTexture(Dt),St=Dt),o.bindTexture(F,Pt||B[F]),Ut.type=F,Ut.texture=Pt)}function U(){const F=_t[St];F!==void 0&&F.type!==void 0&&(o.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function T(){try{o.compressedTexImage2D(...arguments)}catch(F){F("WebGLState:",F)}}function nt(){try{o.compressedTexImage3D(...arguments)}catch(F){F("WebGLState:",F)}}function xt(){try{o.texSubImage2D(...arguments)}catch(F){F("WebGLState:",F)}}function Et(){try{o.texSubImage3D(...arguments)}catch(F){F("WebGLState:",F)}}function ft(){try{o.compressedTexSubImage2D(...arguments)}catch(F){F("WebGLState:",F)}}function Xt(){try{o.compressedTexSubImage3D(...arguments)}catch(F){F("WebGLState:",F)}}function Ot(){try{o.texStorage2D(...arguments)}catch(F){F("WebGLState:",F)}}function Kt(){try{o.texStorage3D(...arguments)}catch(F){F("WebGLState:",F)}}function Wt(){try{o.texImage2D(...arguments)}catch(F){F("WebGLState:",F)}}function Tt(){try{o.texImage3D(...arguments)}catch(F){F("WebGLState:",F)}}function wt(F){Ee.equals(F)===!1&&(o.scissor(F.x,F.y,F.z,F.w),Ee.copy(F))}function ee(F){E.equals(F)===!1&&(o.viewport(F.x,F.y,F.z,F.w),E.copy(F))}function $t(F,Pt){let Dt=x.get(Pt);Dt===void 0&&(Dt=new WeakMap,x.set(Pt,Dt));let Ut=Dt.get(F);Ut===void 0&&(Ut=o.getUniformBlockIndex(Pt,F.name),Dt.set(F,Ut))}function Ht(F,Pt){const Ut=x.get(Pt).get(F);g.get(Pt)!==Ut&&(o.uniformBlockBinding(Pt,Ut,F.__bindingPointIndex),g.set(Pt,Ut))}function oe(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),d.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),_={},St=null,_t={},p={},S=new WeakMap,M=[],A=null,C=!1,y=null,v=null,L=null,O=null,z=null,V=null,N=null,I=new Pe(0,0,0),Y=0,D=!1,w=null,q=null,at=null,ut=null,gt=null,Ee.set(0,0,o.canvas.width,o.canvas.height),E.set(0,0,o.canvas.width,o.canvas.height),f.reset(),d.reset(),h.reset()}return{buffers:{color:f,depth:d,stencil:h},enable:k,disable:dt,bindFramebuffer:bt,drawBuffers:vt,useProgram:Mt,setBlending:qe,setMaterial:H,setFlipSided:ue,setCullFace:Jt,setLineWidth:te,setPolygonOffset:Ft,setScissorTest:He,activeTexture:Yt,bindTexture:se,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:nt,texImage2D:Wt,texImage3D:Tt,updateUBOMapping:$t,uniformBlockBinding:Ht,texStorage2D:Ot,texStorage3D:Kt,texSubImage2D:xt,texSubImage3D:Et,compressedTexSubImage2D:ft,compressedTexSubImage3D:Xt,scissor:wt,viewport:ee,reset:oe}}function CA(o,e,a,s,u,f,d){const h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,g=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new ze,_=new WeakMap;let p;const S=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function A(U,T){return M?new OffscreenCanvas(U,T):vc("canvas")}function C(U,T,nt){let xt=1;const Et=se(U);if((Et.width>nt||Et.height>nt)&&(xt=nt/Math.max(Et.width,Et.height)),xt<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ft=Math.floor(xt*Et.width),Xt=Math.floor(xt*Et.height);p===void 0&&(p=A(ft,Xt));const Ot=T?A(ft,Xt):p;return Ot.width=ft,Ot.height=Xt,Ot.getContext("2d").drawImage(U,0,0,ft,Xt),me("WebGLRenderer: Texture has been resized from ("+Et.width+"x"+Et.height+") to ("+ft+"x"+Xt+")."),Ot}else return"data"in U&&me("WebGLRenderer: Image in DataTexture is too big ("+Et.width+"x"+Et.height+")."),U;return U}function y(U){return U.generateMipmaps}function v(U){o.generateMipmap(U)}function L(U){return U.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?o.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function O(U,T,nt,xt,Et=!1){if(U!==null){if(o[U]!==void 0)return o[U];me("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ft=T;if(T===o.RED&&(nt===o.FLOAT&&(ft=o.R32F),nt===o.HALF_FLOAT&&(ft=o.R16F),nt===o.UNSIGNED_BYTE&&(ft=o.R8)),T===o.RED_INTEGER&&(nt===o.UNSIGNED_BYTE&&(ft=o.R8UI),nt===o.UNSIGNED_SHORT&&(ft=o.R16UI),nt===o.UNSIGNED_INT&&(ft=o.R32UI),nt===o.BYTE&&(ft=o.R8I),nt===o.SHORT&&(ft=o.R16I),nt===o.INT&&(ft=o.R32I)),T===o.RG&&(nt===o.FLOAT&&(ft=o.RG32F),nt===o.HALF_FLOAT&&(ft=o.RG16F),nt===o.UNSIGNED_BYTE&&(ft=o.RG8)),T===o.RG_INTEGER&&(nt===o.UNSIGNED_BYTE&&(ft=o.RG8UI),nt===o.UNSIGNED_SHORT&&(ft=o.RG16UI),nt===o.UNSIGNED_INT&&(ft=o.RG32UI),nt===o.BYTE&&(ft=o.RG8I),nt===o.SHORT&&(ft=o.RG16I),nt===o.INT&&(ft=o.RG32I)),T===o.RGB_INTEGER&&(nt===o.UNSIGNED_BYTE&&(ft=o.RGB8UI),nt===o.UNSIGNED_SHORT&&(ft=o.RGB16UI),nt===o.UNSIGNED_INT&&(ft=o.RGB32UI),nt===o.BYTE&&(ft=o.RGB8I),nt===o.SHORT&&(ft=o.RGB16I),nt===o.INT&&(ft=o.RGB32I)),T===o.RGBA_INTEGER&&(nt===o.UNSIGNED_BYTE&&(ft=o.RGBA8UI),nt===o.UNSIGNED_SHORT&&(ft=o.RGBA16UI),nt===o.UNSIGNED_INT&&(ft=o.RGBA32UI),nt===o.BYTE&&(ft=o.RGBA8I),nt===o.SHORT&&(ft=o.RGBA16I),nt===o.INT&&(ft=o.RGBA32I)),T===o.RGB&&(nt===o.UNSIGNED_INT_5_9_9_9_REV&&(ft=o.RGB9_E5),nt===o.UNSIGNED_INT_10F_11F_11F_REV&&(ft=o.R11F_G11F_B10F)),T===o.RGBA){const Xt=Et?gc:Oe.getTransfer(xt);nt===o.FLOAT&&(ft=o.RGBA32F),nt===o.HALF_FLOAT&&(ft=o.RGBA16F),nt===o.UNSIGNED_BYTE&&(ft=Xt===We?o.SRGB8_ALPHA8:o.RGBA8),nt===o.UNSIGNED_SHORT_4_4_4_4&&(ft=o.RGBA4),nt===o.UNSIGNED_SHORT_5_5_5_1&&(ft=o.RGB5_A1)}return(ft===o.R16F||ft===o.R32F||ft===o.RG16F||ft===o.RG32F||ft===o.RGBA16F||ft===o.RGBA32F)&&e.get("EXT_color_buffer_float"),ft}function z(U,T){let nt;return U?T===null||T===jr||T===ul?nt=o.DEPTH24_STENCIL8:T===Ta?nt=o.DEPTH32F_STENCIL8:T===ll&&(nt=o.DEPTH24_STENCIL8,me("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===jr||T===ul?nt=o.DEPTH_COMPONENT24:T===Ta?nt=o.DEPTH_COMPONENT32F:T===ll&&(nt=o.DEPTH_COMPONENT16),nt}function V(U,T){return y(U)===!0||U.isFramebufferTexture&&U.minFilter!==ui&&U.minFilter!==Ei?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function N(U){const T=U.target;T.removeEventListener("dispose",N),Y(T),T.isVideoTexture&&_.delete(T)}function I(U){const T=U.target;T.removeEventListener("dispose",I),w(T)}function Y(U){const T=s.get(U);if(T.__webglInit===void 0)return;const nt=U.source,xt=S.get(nt);if(xt){const Et=xt[T.__cacheKey];Et.usedTimes--,Et.usedTimes===0&&D(U),Object.keys(xt).length===0&&S.delete(nt)}s.remove(U)}function D(U){const T=s.get(U);o.deleteTexture(T.__webglTexture);const nt=U.source,xt=S.get(nt);delete xt[T.__cacheKey],d.memory.textures--}function w(U){const T=s.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),s.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let xt=0;xt<6;xt++){if(Array.isArray(T.__webglFramebuffer[xt]))for(let Et=0;Et<T.__webglFramebuffer[xt].length;Et++)o.deleteFramebuffer(T.__webglFramebuffer[xt][Et]);else o.deleteFramebuffer(T.__webglFramebuffer[xt]);T.__webglDepthbuffer&&o.deleteRenderbuffer(T.__webglDepthbuffer[xt])}else{if(Array.isArray(T.__webglFramebuffer))for(let xt=0;xt<T.__webglFramebuffer.length;xt++)o.deleteFramebuffer(T.__webglFramebuffer[xt]);else o.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&o.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&o.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let xt=0;xt<T.__webglColorRenderbuffer.length;xt++)T.__webglColorRenderbuffer[xt]&&o.deleteRenderbuffer(T.__webglColorRenderbuffer[xt]);T.__webglDepthRenderbuffer&&o.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const nt=U.textures;for(let xt=0,Et=nt.length;xt<Et;xt++){const ft=s.get(nt[xt]);ft.__webglTexture&&(o.deleteTexture(ft.__webglTexture),d.memory.textures--),s.remove(nt[xt])}s.remove(U)}let q=0;function at(){q=0}function ut(){const U=q;return U>=u.maxTextures&&me("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+u.maxTextures),q+=1,U}function gt(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function ct(U,T){const nt=s.get(U);if(U.isVideoTexture&&He(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&nt.__version!==U.version){const xt=U.image;if(xt===null)me("WebGLRenderer: Texture marked for update but no image data found.");else if(xt.complete===!1)me("WebGLRenderer: Texture marked for update but image is incomplete");else{B(nt,U,T);return}}else U.isExternalTexture&&(nt.__webglTexture=U.sourceTexture?U.sourceTexture:null);a.bindTexture(o.TEXTURE_2D,nt.__webglTexture,o.TEXTURE0+T)}function K(U,T){const nt=s.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&nt.__version!==U.version){B(nt,U,T);return}else U.isExternalTexture&&(nt.__webglTexture=U.sourceTexture?U.sourceTexture:null);a.bindTexture(o.TEXTURE_2D_ARRAY,nt.__webglTexture,o.TEXTURE0+T)}function rt(U,T){const nt=s.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&nt.__version!==U.version){B(nt,U,T);return}a.bindTexture(o.TEXTURE_3D,nt.__webglTexture,o.TEXTURE0+T)}function J(U,T){const nt=s.get(U);if(U.version>0&&nt.__version!==U.version){k(nt,U,T);return}a.bindTexture(o.TEXTURE_CUBE_MAP,nt.__webglTexture,o.TEXTURE0+T)}const St={[jh]:o.REPEAT,[ba]:o.CLAMP_TO_EDGE,[Zh]:o.MIRRORED_REPEAT},_t={[ui]:o.NEAREST,[eE]:o.NEAREST_MIPMAP_NEAREST,[Xu]:o.NEAREST_MIPMAP_LINEAR,[Ei]:o.LINEAR,[ah]:o.LINEAR_MIPMAP_NEAREST,[Yr]:o.LINEAR_MIPMAP_LINEAR},Vt={[rE]:o.NEVER,[fE]:o.ALWAYS,[sE]:o.LESS,[pv]:o.LEQUAL,[oE]:o.EQUAL,[cE]:o.GEQUAL,[lE]:o.GREATER,[uE]:o.NOTEQUAL};function le(U,T){if(T.type===Ta&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Ei||T.magFilter===ah||T.magFilter===Xu||T.magFilter===Yr||T.minFilter===Ei||T.minFilter===ah||T.minFilter===Xu||T.minFilter===Yr)&&me("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(U,o.TEXTURE_WRAP_S,St[T.wrapS]),o.texParameteri(U,o.TEXTURE_WRAP_T,St[T.wrapT]),(U===o.TEXTURE_3D||U===o.TEXTURE_2D_ARRAY)&&o.texParameteri(U,o.TEXTURE_WRAP_R,St[T.wrapR]),o.texParameteri(U,o.TEXTURE_MAG_FILTER,_t[T.magFilter]),o.texParameteri(U,o.TEXTURE_MIN_FILTER,_t[T.minFilter]),T.compareFunction&&(o.texParameteri(U,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(U,o.TEXTURE_COMPARE_FUNC,Vt[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===ui||T.minFilter!==Xu&&T.minFilter!==Yr||T.type===Ta&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||s.get(T).__currentAnisotropy){const nt=e.get("EXT_texture_filter_anisotropic");o.texParameterf(U,nt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,u.getMaxAnisotropy())),s.get(T).__currentAnisotropy=T.anisotropy}}}function Ee(U,T){let nt=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",N));const xt=T.source;let Et=S.get(xt);Et===void 0&&(Et={},S.set(xt,Et));const ft=gt(T);if(ft!==U.__cacheKey){Et[ft]===void 0&&(Et[ft]={texture:o.createTexture(),usedTimes:0},d.memory.textures++,nt=!0),Et[ft].usedTimes++;const Xt=Et[U.__cacheKey];Xt!==void 0&&(Et[U.__cacheKey].usedTimes--,Xt.usedTimes===0&&D(T)),U.__cacheKey=ft,U.__webglTexture=Et[ft].texture}return nt}function E(U,T,nt){return Math.floor(Math.floor(U/nt)/T)}function G(U,T,nt,xt){const ft=U.updateRanges;if(ft.length===0)a.texSubImage2D(o.TEXTURE_2D,0,0,0,T.width,T.height,nt,xt,T.data);else{ft.sort((Tt,wt)=>Tt.start-wt.start);let Xt=0;for(let Tt=1;Tt<ft.length;Tt++){const wt=ft[Xt],ee=ft[Tt],$t=wt.start+wt.count,Ht=E(ee.start,T.width,4),oe=E(wt.start,T.width,4);ee.start<=$t+1&&Ht===oe&&E(ee.start+ee.count-1,T.width,4)===Ht?wt.count=Math.max(wt.count,ee.start+ee.count-wt.start):(++Xt,ft[Xt]=ee)}ft.length=Xt+1;const Ot=o.getParameter(o.UNPACK_ROW_LENGTH),Kt=o.getParameter(o.UNPACK_SKIP_PIXELS),Wt=o.getParameter(o.UNPACK_SKIP_ROWS);o.pixelStorei(o.UNPACK_ROW_LENGTH,T.width);for(let Tt=0,wt=ft.length;Tt<wt;Tt++){const ee=ft[Tt],$t=Math.floor(ee.start/4),Ht=Math.ceil(ee.count/4),oe=$t%T.width,F=Math.floor($t/T.width),Pt=Ht,Dt=1;o.pixelStorei(o.UNPACK_SKIP_PIXELS,oe),o.pixelStorei(o.UNPACK_SKIP_ROWS,F),a.texSubImage2D(o.TEXTURE_2D,0,oe,F,Pt,Dt,nt,xt,T.data)}U.clearUpdateRanges(),o.pixelStorei(o.UNPACK_ROW_LENGTH,Ot),o.pixelStorei(o.UNPACK_SKIP_PIXELS,Kt),o.pixelStorei(o.UNPACK_SKIP_ROWS,Wt)}}function B(U,T,nt){let xt=o.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(xt=o.TEXTURE_2D_ARRAY),T.isData3DTexture&&(xt=o.TEXTURE_3D);const Et=Ee(U,T),ft=T.source;a.bindTexture(xt,U.__webglTexture,o.TEXTURE0+nt);const Xt=s.get(ft);if(ft.version!==Xt.__version||Et===!0){a.activeTexture(o.TEXTURE0+nt);const Ot=Oe.getPrimaries(Oe.workingColorSpace),Kt=T.colorSpace===ur?null:Oe.getPrimaries(T.colorSpace),Wt=T.colorSpace===ur||Ot===Kt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let Tt=C(T.image,!1,u.maxTextureSize);Tt=Yt(T,Tt);const wt=f.convert(T.format,T.colorSpace),ee=f.convert(T.type);let $t=O(T.internalFormat,wt,ee,T.colorSpace,T.isVideoTexture);le(xt,T);let Ht;const oe=T.mipmaps,F=T.isVideoTexture!==!0,Pt=Xt.__version===void 0||Et===!0,Dt=ft.dataReady,Ut=V(T,Tt);if(T.isDepthTexture)$t=z(T.format===fl,T.type),Pt&&(F?a.texStorage2D(o.TEXTURE_2D,1,$t,Tt.width,Tt.height):a.texImage2D(o.TEXTURE_2D,0,$t,Tt.width,Tt.height,0,wt,ee,null));else if(T.isDataTexture)if(oe.length>0){F&&Pt&&a.texStorage2D(o.TEXTURE_2D,Ut,$t,oe[0].width,oe[0].height);for(let At=0,yt=oe.length;At<yt;At++)Ht=oe[At],F?Dt&&a.texSubImage2D(o.TEXTURE_2D,At,0,0,Ht.width,Ht.height,wt,ee,Ht.data):a.texImage2D(o.TEXTURE_2D,At,$t,Ht.width,Ht.height,0,wt,ee,Ht.data);T.generateMipmaps=!1}else F?(Pt&&a.texStorage2D(o.TEXTURE_2D,Ut,$t,Tt.width,Tt.height),Dt&&G(T,Tt,wt,ee)):a.texImage2D(o.TEXTURE_2D,0,$t,Tt.width,Tt.height,0,wt,ee,Tt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){F&&Pt&&a.texStorage3D(o.TEXTURE_2D_ARRAY,Ut,$t,oe[0].width,oe[0].height,Tt.depth);for(let At=0,yt=oe.length;At<yt;At++)if(Ht=oe[At],T.format!==Pi)if(wt!==null)if(F){if(Dt)if(T.layerUpdates.size>0){const kt=R_(Ht.width,Ht.height,T.format,T.type);for(const ce of T.layerUpdates){const je=Ht.data.subarray(ce*kt/Ht.data.BYTES_PER_ELEMENT,(ce+1)*kt/Ht.data.BYTES_PER_ELEMENT);a.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,At,0,0,ce,Ht.width,Ht.height,1,wt,je)}T.clearLayerUpdates()}else a.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,At,0,0,0,Ht.width,Ht.height,Tt.depth,wt,Ht.data)}else a.compressedTexImage3D(o.TEXTURE_2D_ARRAY,At,$t,Ht.width,Ht.height,Tt.depth,0,Ht.data,0,0);else me("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?Dt&&a.texSubImage3D(o.TEXTURE_2D_ARRAY,At,0,0,0,Ht.width,Ht.height,Tt.depth,wt,ee,Ht.data):a.texImage3D(o.TEXTURE_2D_ARRAY,At,$t,Ht.width,Ht.height,Tt.depth,0,wt,ee,Ht.data)}else{F&&Pt&&a.texStorage2D(o.TEXTURE_2D,Ut,$t,oe[0].width,oe[0].height);for(let At=0,yt=oe.length;At<yt;At++)Ht=oe[At],T.format!==Pi?wt!==null?F?Dt&&a.compressedTexSubImage2D(o.TEXTURE_2D,At,0,0,Ht.width,Ht.height,wt,Ht.data):a.compressedTexImage2D(o.TEXTURE_2D,At,$t,Ht.width,Ht.height,0,Ht.data):me("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?Dt&&a.texSubImage2D(o.TEXTURE_2D,At,0,0,Ht.width,Ht.height,wt,ee,Ht.data):a.texImage2D(o.TEXTURE_2D,At,$t,Ht.width,Ht.height,0,wt,ee,Ht.data)}else if(T.isDataArrayTexture)if(F){if(Pt&&a.texStorage3D(o.TEXTURE_2D_ARRAY,Ut,$t,Tt.width,Tt.height,Tt.depth),Dt)if(T.layerUpdates.size>0){const At=R_(Tt.width,Tt.height,T.format,T.type);for(const yt of T.layerUpdates){const kt=Tt.data.subarray(yt*At/Tt.data.BYTES_PER_ELEMENT,(yt+1)*At/Tt.data.BYTES_PER_ELEMENT);a.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,yt,Tt.width,Tt.height,1,wt,ee,kt)}T.clearLayerUpdates()}else a.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Tt.width,Tt.height,Tt.depth,wt,ee,Tt.data)}else a.texImage3D(o.TEXTURE_2D_ARRAY,0,$t,Tt.width,Tt.height,Tt.depth,0,wt,ee,Tt.data);else if(T.isData3DTexture)F?(Pt&&a.texStorage3D(o.TEXTURE_3D,Ut,$t,Tt.width,Tt.height,Tt.depth),Dt&&a.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Tt.width,Tt.height,Tt.depth,wt,ee,Tt.data)):a.texImage3D(o.TEXTURE_3D,0,$t,Tt.width,Tt.height,Tt.depth,0,wt,ee,Tt.data);else if(T.isFramebufferTexture){if(Pt)if(F)a.texStorage2D(o.TEXTURE_2D,Ut,$t,Tt.width,Tt.height);else{let At=Tt.width,yt=Tt.height;for(let kt=0;kt<Ut;kt++)a.texImage2D(o.TEXTURE_2D,kt,$t,At,yt,0,wt,ee,null),At>>=1,yt>>=1}}else if(oe.length>0){if(F&&Pt){const At=se(oe[0]);a.texStorage2D(o.TEXTURE_2D,Ut,$t,At.width,At.height)}for(let At=0,yt=oe.length;At<yt;At++)Ht=oe[At],F?Dt&&a.texSubImage2D(o.TEXTURE_2D,At,0,0,wt,ee,Ht):a.texImage2D(o.TEXTURE_2D,At,$t,wt,ee,Ht);T.generateMipmaps=!1}else if(F){if(Pt){const At=se(Tt);a.texStorage2D(o.TEXTURE_2D,Ut,$t,At.width,At.height)}Dt&&a.texSubImage2D(o.TEXTURE_2D,0,0,0,wt,ee,Tt)}else a.texImage2D(o.TEXTURE_2D,0,$t,wt,ee,Tt);y(T)&&v(xt),Xt.__version=ft.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function k(U,T,nt){if(T.image.length!==6)return;const xt=Ee(U,T),Et=T.source;a.bindTexture(o.TEXTURE_CUBE_MAP,U.__webglTexture,o.TEXTURE0+nt);const ft=s.get(Et);if(Et.version!==ft.__version||xt===!0){a.activeTexture(o.TEXTURE0+nt);const Xt=Oe.getPrimaries(Oe.workingColorSpace),Ot=T.colorSpace===ur?null:Oe.getPrimaries(T.colorSpace),Kt=T.colorSpace===ur||Xt===Ot?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Kt);const Wt=T.isCompressedTexture||T.image[0].isCompressedTexture,Tt=T.image[0]&&T.image[0].isDataTexture,wt=[];for(let yt=0;yt<6;yt++)!Wt&&!Tt?wt[yt]=C(T.image[yt],!0,u.maxCubemapSize):wt[yt]=Tt?T.image[yt].image:T.image[yt],wt[yt]=Yt(T,wt[yt]);const ee=wt[0],$t=f.convert(T.format,T.colorSpace),Ht=f.convert(T.type),oe=O(T.internalFormat,$t,Ht,T.colorSpace),F=T.isVideoTexture!==!0,Pt=ft.__version===void 0||xt===!0,Dt=Et.dataReady;let Ut=V(T,ee);le(o.TEXTURE_CUBE_MAP,T);let At;if(Wt){F&&Pt&&a.texStorage2D(o.TEXTURE_CUBE_MAP,Ut,oe,ee.width,ee.height);for(let yt=0;yt<6;yt++){At=wt[yt].mipmaps;for(let kt=0;kt<At.length;kt++){const ce=At[kt];T.format!==Pi?$t!==null?F?Dt&&a.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt,0,0,ce.width,ce.height,$t,ce.data):a.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt,oe,ce.width,ce.height,0,ce.data):me("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Dt&&a.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt,0,0,ce.width,ce.height,$t,Ht,ce.data):a.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt,oe,ce.width,ce.height,0,$t,Ht,ce.data)}}}else{if(At=T.mipmaps,F&&Pt){At.length>0&&Ut++;const yt=se(wt[0]);a.texStorage2D(o.TEXTURE_CUBE_MAP,Ut,oe,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(Tt){F?Dt&&a.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,wt[yt].width,wt[yt].height,$t,Ht,wt[yt].data):a.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,oe,wt[yt].width,wt[yt].height,0,$t,Ht,wt[yt].data);for(let kt=0;kt<At.length;kt++){const je=At[kt].image[yt].image;F?Dt&&a.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt+1,0,0,je.width,je.height,$t,Ht,je.data):a.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt+1,oe,je.width,je.height,0,$t,Ht,je.data)}}else{F?Dt&&a.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,$t,Ht,wt[yt]):a.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,oe,$t,Ht,wt[yt]);for(let kt=0;kt<At.length;kt++){const ce=At[kt];F?Dt&&a.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt+1,0,0,$t,Ht,ce.image[yt]):a.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+yt,kt+1,oe,$t,Ht,ce.image[yt])}}}y(T)&&v(o.TEXTURE_CUBE_MAP),ft.__version=Et.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function dt(U,T,nt,xt,Et,ft){const Xt=f.convert(nt.format,nt.colorSpace),Ot=f.convert(nt.type),Kt=O(nt.internalFormat,Xt,Ot,nt.colorSpace),Wt=s.get(T),Tt=s.get(nt);if(Tt.__renderTarget=T,!Wt.__hasExternalTextures){const wt=Math.max(1,T.width>>ft),ee=Math.max(1,T.height>>ft);Et===o.TEXTURE_3D||Et===o.TEXTURE_2D_ARRAY?a.texImage3D(Et,ft,Kt,wt,ee,T.depth,0,Xt,Ot,null):a.texImage2D(Et,ft,Kt,wt,ee,0,Xt,Ot,null)}a.bindFramebuffer(o.FRAMEBUFFER,U),Ft(T)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,xt,Et,Tt.__webglTexture,0,te(T)):(Et===o.TEXTURE_2D||Et>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Et<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,xt,Et,Tt.__webglTexture,ft),a.bindFramebuffer(o.FRAMEBUFFER,null)}function bt(U,T,nt){if(o.bindRenderbuffer(o.RENDERBUFFER,U),T.depthBuffer){const xt=T.depthTexture,Et=xt&&xt.isDepthTexture?xt.type:null,ft=z(T.stencilBuffer,Et),Xt=T.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Ot=te(T);Ft(T)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Ot,ft,T.width,T.height):nt?o.renderbufferStorageMultisample(o.RENDERBUFFER,Ot,ft,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,ft,T.width,T.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Xt,o.RENDERBUFFER,U)}else{const xt=T.textures;for(let Et=0;Et<xt.length;Et++){const ft=xt[Et],Xt=f.convert(ft.format,ft.colorSpace),Ot=f.convert(ft.type),Kt=O(ft.internalFormat,Xt,Ot,ft.colorSpace),Wt=te(T);nt&&Ft(T)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,Wt,Kt,T.width,T.height):Ft(T)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Wt,Kt,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,Kt,T.width,T.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function vt(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(a.bindFramebuffer(o.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const xt=s.get(T.depthTexture);xt.__renderTarget=T,(!xt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),ct(T.depthTexture,0);const Et=xt.__webglTexture,ft=te(T);if(T.depthTexture.format===cl)Ft(T)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Et,0,ft):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Et,0);else if(T.depthTexture.format===fl)Ft(T)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Et,0,ft):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Et,0);else throw new Error("Unknown depthTexture format")}function Mt(U){const T=s.get(U),nt=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const xt=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),xt){const Et=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,xt.removeEventListener("dispose",Et)};xt.addEventListener("dispose",Et),T.__depthDisposeCallback=Et}T.__boundDepthTexture=xt}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(nt)throw new Error("target.depthTexture not supported in Cube render targets");const xt=U.texture.mipmaps;xt&&xt.length>0?vt(T.__webglFramebuffer[0],U):vt(T.__webglFramebuffer,U)}else if(nt){T.__webglDepthbuffer=[];for(let xt=0;xt<6;xt++)if(a.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer[xt]),T.__webglDepthbuffer[xt]===void 0)T.__webglDepthbuffer[xt]=o.createRenderbuffer(),bt(T.__webglDepthbuffer[xt],U,!1);else{const Et=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ft=T.__webglDepthbuffer[xt];o.bindRenderbuffer(o.RENDERBUFFER,ft),o.framebufferRenderbuffer(o.FRAMEBUFFER,Et,o.RENDERBUFFER,ft)}}else{const xt=U.texture.mipmaps;if(xt&&xt.length>0?a.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer[0]):a.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=o.createRenderbuffer(),bt(T.__webglDepthbuffer,U,!1);else{const Et=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ft=T.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,ft),o.framebufferRenderbuffer(o.FRAMEBUFFER,Et,o.RENDERBUFFER,ft)}}a.bindFramebuffer(o.FRAMEBUFFER,null)}function Lt(U,T,nt){const xt=s.get(U);T!==void 0&&dt(xt.__webglFramebuffer,U,U.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),nt!==void 0&&Mt(U)}function ae(U){const T=U.texture,nt=s.get(U),xt=s.get(T);U.addEventListener("dispose",I);const Et=U.textures,ft=U.isWebGLCubeRenderTarget===!0,Xt=Et.length>1;if(Xt||(xt.__webglTexture===void 0&&(xt.__webglTexture=o.createTexture()),xt.__version=T.version,d.memory.textures++),ft){nt.__webglFramebuffer=[];for(let Ot=0;Ot<6;Ot++)if(T.mipmaps&&T.mipmaps.length>0){nt.__webglFramebuffer[Ot]=[];for(let Kt=0;Kt<T.mipmaps.length;Kt++)nt.__webglFramebuffer[Ot][Kt]=o.createFramebuffer()}else nt.__webglFramebuffer[Ot]=o.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){nt.__webglFramebuffer=[];for(let Ot=0;Ot<T.mipmaps.length;Ot++)nt.__webglFramebuffer[Ot]=o.createFramebuffer()}else nt.__webglFramebuffer=o.createFramebuffer();if(Xt)for(let Ot=0,Kt=Et.length;Ot<Kt;Ot++){const Wt=s.get(Et[Ot]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=o.createTexture(),d.memory.textures++)}if(U.samples>0&&Ft(U)===!1){nt.__webglMultisampledFramebuffer=o.createFramebuffer(),nt.__webglColorRenderbuffer=[],a.bindFramebuffer(o.FRAMEBUFFER,nt.__webglMultisampledFramebuffer);for(let Ot=0;Ot<Et.length;Ot++){const Kt=Et[Ot];nt.__webglColorRenderbuffer[Ot]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,nt.__webglColorRenderbuffer[Ot]);const Wt=f.convert(Kt.format,Kt.colorSpace),Tt=f.convert(Kt.type),wt=O(Kt.internalFormat,Wt,Tt,Kt.colorSpace,U.isXRRenderTarget===!0),ee=te(U);o.renderbufferStorageMultisample(o.RENDERBUFFER,ee,wt,U.width,U.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ot,o.RENDERBUFFER,nt.__webglColorRenderbuffer[Ot])}o.bindRenderbuffer(o.RENDERBUFFER,null),U.depthBuffer&&(nt.__webglDepthRenderbuffer=o.createRenderbuffer(),bt(nt.__webglDepthRenderbuffer,U,!0)),a.bindFramebuffer(o.FRAMEBUFFER,null)}}if(ft){a.bindTexture(o.TEXTURE_CUBE_MAP,xt.__webglTexture),le(o.TEXTURE_CUBE_MAP,T);for(let Ot=0;Ot<6;Ot++)if(T.mipmaps&&T.mipmaps.length>0)for(let Kt=0;Kt<T.mipmaps.length;Kt++)dt(nt.__webglFramebuffer[Ot][Kt],U,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ot,Kt);else dt(nt.__webglFramebuffer[Ot],U,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Ot,0);y(T)&&v(o.TEXTURE_CUBE_MAP),a.unbindTexture()}else if(Xt){for(let Ot=0,Kt=Et.length;Ot<Kt;Ot++){const Wt=Et[Ot],Tt=s.get(Wt);let wt=o.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(wt=U.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),a.bindTexture(wt,Tt.__webglTexture),le(wt,Wt),dt(nt.__webglFramebuffer,U,Wt,o.COLOR_ATTACHMENT0+Ot,wt,0),y(Wt)&&v(wt)}a.unbindTexture()}else{let Ot=o.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ot=U.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),a.bindTexture(Ot,xt.__webglTexture),le(Ot,T),T.mipmaps&&T.mipmaps.length>0)for(let Kt=0;Kt<T.mipmaps.length;Kt++)dt(nt.__webglFramebuffer[Kt],U,T,o.COLOR_ATTACHMENT0,Ot,Kt);else dt(nt.__webglFramebuffer,U,T,o.COLOR_ATTACHMENT0,Ot,0);y(T)&&v(Ot),a.unbindTexture()}U.depthBuffer&&Mt(U)}function qe(U){const T=U.textures;for(let nt=0,xt=T.length;nt<xt;nt++){const Et=T[nt];if(y(Et)){const ft=L(U),Xt=s.get(Et).__webglTexture;a.bindTexture(ft,Xt),v(ft),a.unbindTexture()}}}const H=[],ue=[];function Jt(U){if(U.samples>0){if(Ft(U)===!1){const T=U.textures,nt=U.width,xt=U.height;let Et=o.COLOR_BUFFER_BIT;const ft=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Xt=s.get(U),Ot=T.length>1;if(Ot)for(let Wt=0;Wt<T.length;Wt++)a.bindFramebuffer(o.FRAMEBUFFER,Xt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Wt,o.RENDERBUFFER,null),a.bindFramebuffer(o.FRAMEBUFFER,Xt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Wt,o.TEXTURE_2D,null,0);a.bindFramebuffer(o.READ_FRAMEBUFFER,Xt.__webglMultisampledFramebuffer);const Kt=U.texture.mipmaps;Kt&&Kt.length>0?a.bindFramebuffer(o.DRAW_FRAMEBUFFER,Xt.__webglFramebuffer[0]):a.bindFramebuffer(o.DRAW_FRAMEBUFFER,Xt.__webglFramebuffer);for(let Wt=0;Wt<T.length;Wt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(Et|=o.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(Et|=o.STENCIL_BUFFER_BIT)),Ot){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Xt.__webglColorRenderbuffer[Wt]);const Tt=s.get(T[Wt]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,Tt,0)}o.blitFramebuffer(0,0,nt,xt,0,0,nt,xt,Et,o.NEAREST),g===!0&&(H.length=0,ue.length=0,H.push(o.COLOR_ATTACHMENT0+Wt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(H.push(ft),ue.push(ft),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,ue)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,H))}if(a.bindFramebuffer(o.READ_FRAMEBUFFER,null),a.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Ot)for(let Wt=0;Wt<T.length;Wt++){a.bindFramebuffer(o.FRAMEBUFFER,Xt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Wt,o.RENDERBUFFER,Xt.__webglColorRenderbuffer[Wt]);const Tt=s.get(T[Wt]).__webglTexture;a.bindFramebuffer(o.FRAMEBUFFER,Xt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Wt,o.TEXTURE_2D,Tt,0)}a.bindFramebuffer(o.DRAW_FRAMEBUFFER,Xt.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&g){const T=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[T])}}}function te(U){return Math.min(u.maxSamples,U.samples)}function Ft(U){const T=s.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function He(U){const T=d.render.frame;_.get(U)!==T&&(_.set(U,T),U.update())}function Yt(U,T){const nt=U.colorSpace,xt=U.format,Et=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||nt!==to&&nt!==ur&&(Oe.getTransfer(nt)===We?(xt!==Pi||Et!==$i)&&me("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):cn("WebGLTextures: Unsupported texture color space:",nt)),T}function se(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(x.width=U.naturalWidth||U.width,x.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(x.width=U.displayWidth,x.height=U.displayHeight):(x.width=U.width,x.height=U.height),x}this.allocateTextureUnit=ut,this.resetTextureUnits=at,this.setTexture2D=ct,this.setTexture2DArray=K,this.setTexture3D=rt,this.setTextureCube=J,this.rebindTextures=Lt,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=Ft}function wA(o,e){function a(s,u=ur){let f;const d=Oe.getTransfer(u);if(s===$i)return o.UNSIGNED_BYTE;if(s===Dp)return o.UNSIGNED_SHORT_4_4_4_4;if(s===Up)return o.UNSIGNED_SHORT_5_5_5_1;if(s===lv)return o.UNSIGNED_INT_5_9_9_9_REV;if(s===uv)return o.UNSIGNED_INT_10F_11F_11F_REV;if(s===sv)return o.BYTE;if(s===ov)return o.SHORT;if(s===ll)return o.UNSIGNED_SHORT;if(s===wp)return o.INT;if(s===jr)return o.UNSIGNED_INT;if(s===Ta)return o.FLOAT;if(s===no)return o.HALF_FLOAT;if(s===cv)return o.ALPHA;if(s===fv)return o.RGB;if(s===Pi)return o.RGBA;if(s===cl)return o.DEPTH_COMPONENT;if(s===fl)return o.DEPTH_STENCIL;if(s===dv)return o.RED;if(s===Np)return o.RED_INTEGER;if(s===Lp)return o.RG;if(s===Op)return o.RG_INTEGER;if(s===Pp)return o.RGBA_INTEGER;if(s===dc||s===hc||s===pc||s===mc)if(d===We)if(f=e.get("WEBGL_compressed_texture_s3tc_srgb"),f!==null){if(s===dc)return f.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===hc)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===pc)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===mc)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(f=e.get("WEBGL_compressed_texture_s3tc"),f!==null){if(s===dc)return f.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===hc)return f.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===pc)return f.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===mc)return f.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Kh||s===Qh||s===Jh||s===$h)if(f=e.get("WEBGL_compressed_texture_pvrtc"),f!==null){if(s===Kh)return f.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Qh)return f.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Jh)return f.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===$h)return f.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===tp||s===ep||s===np)if(f=e.get("WEBGL_compressed_texture_etc"),f!==null){if(s===tp||s===ep)return d===We?f.COMPRESSED_SRGB8_ETC2:f.COMPRESSED_RGB8_ETC2;if(s===np)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:f.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===ip||s===ap||s===rp||s===sp||s===op||s===lp||s===up||s===cp||s===fp||s===dp||s===hp||s===pp||s===mp||s===xp)if(f=e.get("WEBGL_compressed_texture_astc"),f!==null){if(s===ip)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:f.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===ap)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:f.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===rp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:f.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===sp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:f.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===op)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:f.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===lp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:f.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===up)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:f.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===cp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:f.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===fp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:f.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===dp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:f.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===hp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:f.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===pp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:f.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===mp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:f.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===xp)return d===We?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:f.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===gp||s===_p||s===vp)if(f=e.get("EXT_texture_compression_bptc"),f!==null){if(s===gp)return d===We?f.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:f.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===_p)return f.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===vp)return f.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Sp||s===yp||s===Mp||s===Ep)if(f=e.get("EXT_texture_compression_rgtc"),f!==null){if(s===Sp)return f.COMPRESSED_RED_RGTC1_EXT;if(s===yp)return f.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Mp)return f.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Ep)return f.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===ul?o.UNSIGNED_INT_24_8:o[s]!==void 0?o[s]:null}return{convert:a}}const DA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,UA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class NA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,a){if(this.texture===null){const s=new Rv(e.texture);(e.depthNear!==a.depthNear||e.depthFar!==a.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const a=e.cameras[0].viewport,s=new Ca({vertexShader:DA,fragmentShader:UA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:a.z},depthHeight:{value:a.w}}});this.mesh=new Ii(new bc(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class LA extends io{constructor(e,a){super();const s=this;let u=null,f=1,d=null,h="local-floor",g=1,x=null,_=null,p=null,S=null,M=null,A=null;const C=typeof XRWebGLBinding<"u",y=new NA,v={},L=a.getContextAttributes();let O=null,z=null;const V=[],N=[],I=new ze;let Y=null;const D=new Mi;D.viewport=new sn;const w=new Mi;w.viewport=new sn;const q=[D,w],at=new JE;let ut=null,gt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let k=V[B];return k===void 0&&(k=new Rh,V[B]=k),k.getTargetRaySpace()},this.getControllerGrip=function(B){let k=V[B];return k===void 0&&(k=new Rh,V[B]=k),k.getGripSpace()},this.getHand=function(B){let k=V[B];return k===void 0&&(k=new Rh,V[B]=k),k.getHandSpace()};function ct(B){const k=N.indexOf(B.inputSource);if(k===-1)return;const dt=V[k];dt!==void 0&&(dt.update(B.inputSource,B.frame,x||d),dt.dispatchEvent({type:B.type,data:B.inputSource}))}function K(){u.removeEventListener("select",ct),u.removeEventListener("selectstart",ct),u.removeEventListener("selectend",ct),u.removeEventListener("squeeze",ct),u.removeEventListener("squeezestart",ct),u.removeEventListener("squeezeend",ct),u.removeEventListener("end",K),u.removeEventListener("inputsourceschange",rt);for(let B=0;B<V.length;B++){const k=N[B];k!==null&&(N[B]=null,V[B].disconnect(k))}ut=null,gt=null,y.reset();for(const B in v)delete v[B];e.setRenderTarget(O),M=null,S=null,p=null,u=null,z=null,G.stop(),s.isPresenting=!1,e.setPixelRatio(Y),e.setSize(I.width,I.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){f=B,s.isPresenting===!0&&me("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){h=B,s.isPresenting===!0&&me("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return x||d},this.setReferenceSpace=function(B){x=B},this.getBaseLayer=function(){return S!==null?S:M},this.getBinding=function(){return p===null&&C&&(p=new XRWebGLBinding(u,a)),p},this.getFrame=function(){return A},this.getSession=function(){return u},this.setSession=async function(B){if(u=B,u!==null){if(O=e.getRenderTarget(),u.addEventListener("select",ct),u.addEventListener("selectstart",ct),u.addEventListener("selectend",ct),u.addEventListener("squeeze",ct),u.addEventListener("squeezestart",ct),u.addEventListener("squeezeend",ct),u.addEventListener("end",K),u.addEventListener("inputsourceschange",rt),L.xrCompatible!==!0&&await a.makeXRCompatible(),Y=e.getPixelRatio(),e.getSize(I),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,bt=null,vt=null;L.depth&&(vt=L.stencil?a.DEPTH24_STENCIL8:a.DEPTH_COMPONENT24,dt=L.stencil?fl:cl,bt=L.stencil?ul:jr);const Mt={colorFormat:a.RGBA8,depthFormat:vt,scaleFactor:f};p=this.getBinding(),S=p.createProjectionLayer(Mt),u.updateRenderState({layers:[S]}),e.setPixelRatio(1),e.setSize(S.textureWidth,S.textureHeight,!1),z=new Zr(S.textureWidth,S.textureHeight,{format:Pi,type:$i,depthTexture:new Av(S.textureWidth,S.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:L.stencil,colorSpace:e.outputColorSpace,samples:L.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}else{const dt={antialias:L.antialias,alpha:!0,depth:L.depth,stencil:L.stencil,framebufferScaleFactor:f};M=new XRWebGLLayer(u,a,dt),u.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),z=new Zr(M.framebufferWidth,M.framebufferHeight,{format:Pi,type:$i,colorSpace:e.outputColorSpace,stencilBuffer:L.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}z.isXRRenderTarget=!0,this.setFoveation(g),x=null,d=await u.requestReferenceSpace(h),G.setContext(u),G.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(u!==null)return u.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function rt(B){for(let k=0;k<B.removed.length;k++){const dt=B.removed[k],bt=N.indexOf(dt);bt>=0&&(N[bt]=null,V[bt].disconnect(dt))}for(let k=0;k<B.added.length;k++){const dt=B.added[k];let bt=N.indexOf(dt);if(bt===-1){for(let Mt=0;Mt<V.length;Mt++)if(Mt>=N.length){N.push(dt),bt=Mt;break}else if(N[Mt]===null){N[Mt]=dt,bt=Mt;break}if(bt===-1)break}const vt=V[bt];vt&&vt.connect(dt)}}const J=new lt,St=new lt;function _t(B,k,dt){J.setFromMatrixPosition(k.matrixWorld),St.setFromMatrixPosition(dt.matrixWorld);const bt=J.distanceTo(St),vt=k.projectionMatrix.elements,Mt=dt.projectionMatrix.elements,Lt=vt[14]/(vt[10]-1),ae=vt[14]/(vt[10]+1),qe=(vt[9]+1)/vt[5],H=(vt[9]-1)/vt[5],ue=(vt[8]-1)/vt[0],Jt=(Mt[8]+1)/Mt[0],te=Lt*ue,Ft=Lt*Jt,He=bt/(-ue+Jt),Yt=He*-ue;if(k.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Yt),B.translateZ(He),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),vt[10]===-1)B.projectionMatrix.copy(k.projectionMatrix),B.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{const se=Lt+He,U=ae+He,T=te-Yt,nt=Ft+(bt-Yt),xt=qe*ae/U*se,Et=H*ae/U*se;B.projectionMatrix.makePerspective(T,nt,xt,Et,se,U),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function Vt(B,k){k===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(k.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(u===null)return;let k=B.near,dt=B.far;y.texture!==null&&(y.depthNear>0&&(k=y.depthNear),y.depthFar>0&&(dt=y.depthFar)),at.near=w.near=D.near=k,at.far=w.far=D.far=dt,(ut!==at.near||gt!==at.far)&&(u.updateRenderState({depthNear:at.near,depthFar:at.far}),ut=at.near,gt=at.far),at.layers.mask=B.layers.mask|6,D.layers.mask=at.layers.mask&3,w.layers.mask=at.layers.mask&5;const bt=B.parent,vt=at.cameras;Vt(at,bt);for(let Mt=0;Mt<vt.length;Mt++)Vt(vt[Mt],bt);vt.length===2?_t(at,D,w):at.projectionMatrix.copy(D.projectionMatrix),le(B,at,bt)};function le(B,k,dt){dt===null?B.matrix.copy(k.matrixWorld):(B.matrix.copy(dt.matrixWorld),B.matrix.invert(),B.matrix.multiply(k.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(k.projectionMatrix),B.projectionMatrixInverse.copy(k.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=bp*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return at},this.getFoveation=function(){if(!(S===null&&M===null))return g},this.setFoveation=function(B){g=B,S!==null&&(S.fixedFoveation=B),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=B)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(at)},this.getCameraTexture=function(B){return v[B]};let Ee=null;function E(B,k){if(_=k.getViewerPose(x||d),A=k,_!==null){const dt=_.views;M!==null&&(e.setRenderTargetFramebuffer(z,M.framebuffer),e.setRenderTarget(z));let bt=!1;dt.length!==at.cameras.length&&(at.cameras.length=0,bt=!0);for(let ae=0;ae<dt.length;ae++){const qe=dt[ae];let H=null;if(M!==null)H=M.getViewport(qe);else{const Jt=p.getViewSubImage(S,qe);H=Jt.viewport,ae===0&&(e.setRenderTargetTextures(z,Jt.colorTexture,Jt.depthStencilTexture),e.setRenderTarget(z))}let ue=q[ae];ue===void 0&&(ue=new Mi,ue.layers.enable(ae),ue.viewport=new sn,q[ae]=ue),ue.matrix.fromArray(qe.transform.matrix),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.projectionMatrix.fromArray(qe.projectionMatrix),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert(),ue.viewport.set(H.x,H.y,H.width,H.height),ae===0&&(at.matrix.copy(ue.matrix),at.matrix.decompose(at.position,at.quaternion,at.scale)),bt===!0&&at.cameras.push(ue)}const vt=u.enabledFeatures;if(vt&&vt.includes("depth-sensing")&&u.depthUsage=="gpu-optimized"&&C){p=s.getBinding();const ae=p.getDepthInformation(dt[0]);ae&&ae.isValid&&ae.texture&&y.init(ae,u.renderState)}if(vt&&vt.includes("camera-access")&&C){e.state.unbindTexture(),p=s.getBinding();for(let ae=0;ae<dt.length;ae++){const qe=dt[ae].camera;if(qe){let H=v[qe];H||(H=new Rv,v[qe]=H);const ue=p.getCameraImage(qe);H.sourceTexture=ue}}}}for(let dt=0;dt<V.length;dt++){const bt=N[dt],vt=V[dt];bt!==null&&vt!==void 0&&vt.update(bt,k,x||d)}Ee&&Ee(B,k),k.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:k}),A=null}const G=new Dv;G.setAnimationLoop(E),this.setAnimationLoop=function(B){Ee=B},this.dispose=function(){}}}const Vr=new ta,OA=new on;function PA(o,e){function a(y,v){y.matrixAutoUpdate===!0&&y.updateMatrix(),v.value.copy(y.matrix)}function s(y,v){v.color.getRGB(y.fogColor.value,Mv(o)),v.isFog?(y.fogNear.value=v.near,y.fogFar.value=v.far):v.isFogExp2&&(y.fogDensity.value=v.density)}function u(y,v,L,O,z){v.isMeshBasicMaterial||v.isMeshLambertMaterial?f(y,v):v.isMeshToonMaterial?(f(y,v),p(y,v)):v.isMeshPhongMaterial?(f(y,v),_(y,v)):v.isMeshStandardMaterial?(f(y,v),S(y,v),v.isMeshPhysicalMaterial&&M(y,v,z)):v.isMeshMatcapMaterial?(f(y,v),A(y,v)):v.isMeshDepthMaterial?f(y,v):v.isMeshDistanceMaterial?(f(y,v),C(y,v)):v.isMeshNormalMaterial?f(y,v):v.isLineBasicMaterial?(d(y,v),v.isLineDashedMaterial&&h(y,v)):v.isPointsMaterial?g(y,v,L,O):v.isSpriteMaterial?x(y,v):v.isShadowMaterial?(y.color.value.copy(v.color),y.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function f(y,v){y.opacity.value=v.opacity,v.color&&y.diffuse.value.copy(v.color),v.emissive&&y.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(y.map.value=v.map,a(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,a(v.alphaMap,y.alphaMapTransform)),v.bumpMap&&(y.bumpMap.value=v.bumpMap,a(v.bumpMap,y.bumpMapTransform),y.bumpScale.value=v.bumpScale,v.side===Qn&&(y.bumpScale.value*=-1)),v.normalMap&&(y.normalMap.value=v.normalMap,a(v.normalMap,y.normalMapTransform),y.normalScale.value.copy(v.normalScale),v.side===Qn&&y.normalScale.value.negate()),v.displacementMap&&(y.displacementMap.value=v.displacementMap,a(v.displacementMap,y.displacementMapTransform),y.displacementScale.value=v.displacementScale,y.displacementBias.value=v.displacementBias),v.emissiveMap&&(y.emissiveMap.value=v.emissiveMap,a(v.emissiveMap,y.emissiveMapTransform)),v.specularMap&&(y.specularMap.value=v.specularMap,a(v.specularMap,y.specularMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest);const L=e.get(v),O=L.envMap,z=L.envMapRotation;O&&(y.envMap.value=O,Vr.copy(z),Vr.x*=-1,Vr.y*=-1,Vr.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(Vr.y*=-1,Vr.z*=-1),y.envMapRotation.value.setFromMatrix4(OA.makeRotationFromEuler(Vr)),y.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=v.reflectivity,y.ior.value=v.ior,y.refractionRatio.value=v.refractionRatio),v.lightMap&&(y.lightMap.value=v.lightMap,y.lightMapIntensity.value=v.lightMapIntensity,a(v.lightMap,y.lightMapTransform)),v.aoMap&&(y.aoMap.value=v.aoMap,y.aoMapIntensity.value=v.aoMapIntensity,a(v.aoMap,y.aoMapTransform))}function d(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,v.map&&(y.map.value=v.map,a(v.map,y.mapTransform))}function h(y,v){y.dashSize.value=v.dashSize,y.totalSize.value=v.dashSize+v.gapSize,y.scale.value=v.scale}function g(y,v,L,O){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.size.value=v.size*L,y.scale.value=O*.5,v.map&&(y.map.value=v.map,a(v.map,y.uvTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,a(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function x(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.rotation.value=v.rotation,v.map&&(y.map.value=v.map,a(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,a(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function _(y,v){y.specular.value.copy(v.specular),y.shininess.value=Math.max(v.shininess,1e-4)}function p(y,v){v.gradientMap&&(y.gradientMap.value=v.gradientMap)}function S(y,v){y.metalness.value=v.metalness,v.metalnessMap&&(y.metalnessMap.value=v.metalnessMap,a(v.metalnessMap,y.metalnessMapTransform)),y.roughness.value=v.roughness,v.roughnessMap&&(y.roughnessMap.value=v.roughnessMap,a(v.roughnessMap,y.roughnessMapTransform)),v.envMap&&(y.envMapIntensity.value=v.envMapIntensity)}function M(y,v,L){y.ior.value=v.ior,v.sheen>0&&(y.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),y.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(y.sheenColorMap.value=v.sheenColorMap,a(v.sheenColorMap,y.sheenColorMapTransform)),v.sheenRoughnessMap&&(y.sheenRoughnessMap.value=v.sheenRoughnessMap,a(v.sheenRoughnessMap,y.sheenRoughnessMapTransform))),v.clearcoat>0&&(y.clearcoat.value=v.clearcoat,y.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(y.clearcoatMap.value=v.clearcoatMap,a(v.clearcoatMap,y.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,a(v.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(y.clearcoatNormalMap.value=v.clearcoatNormalMap,a(v.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Qn&&y.clearcoatNormalScale.value.negate())),v.dispersion>0&&(y.dispersion.value=v.dispersion),v.iridescence>0&&(y.iridescence.value=v.iridescence,y.iridescenceIOR.value=v.iridescenceIOR,y.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(y.iridescenceMap.value=v.iridescenceMap,a(v.iridescenceMap,y.iridescenceMapTransform)),v.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=v.iridescenceThicknessMap,a(v.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),v.transmission>0&&(y.transmission.value=v.transmission,y.transmissionSamplerMap.value=L.texture,y.transmissionSamplerSize.value.set(L.width,L.height),v.transmissionMap&&(y.transmissionMap.value=v.transmissionMap,a(v.transmissionMap,y.transmissionMapTransform)),y.thickness.value=v.thickness,v.thicknessMap&&(y.thicknessMap.value=v.thicknessMap,a(v.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=v.attenuationDistance,y.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(y.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(y.anisotropyMap.value=v.anisotropyMap,a(v.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=v.specularIntensity,y.specularColor.value.copy(v.specularColor),v.specularColorMap&&(y.specularColorMap.value=v.specularColorMap,a(v.specularColorMap,y.specularColorMapTransform)),v.specularIntensityMap&&(y.specularIntensityMap.value=v.specularIntensityMap,a(v.specularIntensityMap,y.specularIntensityMapTransform))}function A(y,v){v.matcap&&(y.matcap.value=v.matcap)}function C(y,v){const L=e.get(v).light;y.referencePosition.value.setFromMatrixPosition(L.matrixWorld),y.nearDistance.value=L.shadow.camera.near,y.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:u}}function zA(o,e,a,s){let u={},f={},d=[];const h=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function g(L,O){const z=O.program;s.uniformBlockBinding(L,z)}function x(L,O){let z=u[L.id];z===void 0&&(A(L),z=_(L),u[L.id]=z,L.addEventListener("dispose",y));const V=O.program;s.updateUBOMapping(L,V);const N=e.render.frame;f[L.id]!==N&&(S(L),f[L.id]=N)}function _(L){const O=p();L.__bindingPointIndex=O;const z=o.createBuffer(),V=L.__size,N=L.usage;return o.bindBuffer(o.UNIFORM_BUFFER,z),o.bufferData(o.UNIFORM_BUFFER,V,N),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,O,z),z}function p(){for(let L=0;L<h;L++)if(d.indexOf(L)===-1)return d.push(L),L;return cn("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(L){const O=u[L.id],z=L.uniforms,V=L.__cache;o.bindBuffer(o.UNIFORM_BUFFER,O);for(let N=0,I=z.length;N<I;N++){const Y=Array.isArray(z[N])?z[N]:[z[N]];for(let D=0,w=Y.length;D<w;D++){const q=Y[D];if(M(q,N,D,V)===!0){const at=q.__offset,ut=Array.isArray(q.value)?q.value:[q.value];let gt=0;for(let ct=0;ct<ut.length;ct++){const K=ut[ct],rt=C(K);typeof K=="number"||typeof K=="boolean"?(q.__data[0]=K,o.bufferSubData(o.UNIFORM_BUFFER,at+gt,q.__data)):K.isMatrix3?(q.__data[0]=K.elements[0],q.__data[1]=K.elements[1],q.__data[2]=K.elements[2],q.__data[3]=0,q.__data[4]=K.elements[3],q.__data[5]=K.elements[4],q.__data[6]=K.elements[5],q.__data[7]=0,q.__data[8]=K.elements[6],q.__data[9]=K.elements[7],q.__data[10]=K.elements[8],q.__data[11]=0):(K.toArray(q.__data,gt),gt+=rt.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,at,q.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(L,O,z,V){const N=L.value,I=O+"_"+z;if(V[I]===void 0)return typeof N=="number"||typeof N=="boolean"?V[I]=N:V[I]=N.clone(),!0;{const Y=V[I];if(typeof N=="number"||typeof N=="boolean"){if(Y!==N)return V[I]=N,!0}else if(Y.equals(N)===!1)return Y.copy(N),!0}return!1}function A(L){const O=L.uniforms;let z=0;const V=16;for(let I=0,Y=O.length;I<Y;I++){const D=Array.isArray(O[I])?O[I]:[O[I]];for(let w=0,q=D.length;w<q;w++){const at=D[w],ut=Array.isArray(at.value)?at.value:[at.value];for(let gt=0,ct=ut.length;gt<ct;gt++){const K=ut[gt],rt=C(K),J=z%V,St=J%rt.boundary,_t=J+St;z+=St,_t!==0&&V-_t<rt.storage&&(z+=V-_t),at.__data=new Float32Array(rt.storage/Float32Array.BYTES_PER_ELEMENT),at.__offset=z,z+=rt.storage}}}const N=z%V;return N>0&&(z+=V-N),L.__size=z,L.__cache={},this}function C(L){const O={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(O.boundary=4,O.storage=4):L.isVector2?(O.boundary=8,O.storage=8):L.isVector3||L.isColor?(O.boundary=16,O.storage=12):L.isVector4?(O.boundary=16,O.storage=16):L.isMatrix3?(O.boundary=48,O.storage=48):L.isMatrix4?(O.boundary=64,O.storage=64):L.isTexture?me("WebGLRenderer: Texture samplers can not be part of an uniforms group."):me("WebGLRenderer: Unsupported uniform value type.",L),O}function y(L){const O=L.target;O.removeEventListener("dispose",y);const z=d.indexOf(O.__bindingPointIndex);d.splice(z,1),o.deleteBuffer(u[O.id]),delete u[O.id],delete f[O.id]}function v(){for(const L in u)o.deleteBuffer(u[L]);d=[],u={},f={}}return{bind:g,update:x,dispose:v}}const IA=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Ma=null;function BA(){return Ma===null&&(Ma=new HE(IA,32,32,Lp,no),Ma.minFilter=Ei,Ma.magFilter=Ei,Ma.wrapS=ba,Ma.wrapT=ba,Ma.generateMipmaps=!1,Ma.needsUpdate=!0),Ma}class FA{constructor(e={}){const{canvas:a=dE(),context:s=null,depth:u=!0,stencil:f=!1,alpha:d=!1,antialias:h=!1,premultipliedAlpha:g=!0,preserveDrawingBuffer:x=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:S=!1}=e;this.isWebGLRenderer=!0;let M;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=s.getContextAttributes().alpha}else M=d;const A=new Set([Pp,Op,Np]),C=new Set([$i,jr,ll,ul,Dp,Up]),y=new Uint32Array(4),v=new Int32Array(4);let L=null,O=null;const z=[],V=[];this.domElement=a,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let I=!1;this._outputColorSpace=li;let Y=0,D=0,w=null,q=-1,at=null;const ut=new sn,gt=new sn;let ct=null;const K=new Pe(0);let rt=0,J=a.width,St=a.height,_t=1,Vt=null,le=null;const Ee=new sn(0,0,J,St),E=new sn(0,0,J,St);let G=!1;const B=new Ip;let k=!1,dt=!1;const bt=new on,vt=new lt,Mt=new sn,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ae=!1;function qe(){return w===null?_t:1}let H=s;function ue(R,Q){return a.getContext(R,Q)}try{const R={alpha:!0,depth:u,stencil:f,antialias:h,premultipliedAlpha:g,preserveDrawingBuffer:x,powerPreference:_,failIfMajorPerformanceCaveat:p};if("setAttribute"in a&&a.setAttribute("data-engine",`three.js r${Cp}`),a.addEventListener("webglcontextlost",At,!1),a.addEventListener("webglcontextrestored",yt,!1),a.addEventListener("webglcontextcreationerror",kt,!1),H===null){const Q="webgl2";if(H=ue(Q,R),H===null)throw ue(Q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw R("WebGLRenderer: "+R.message),R}let Jt,te,Ft,He,Yt,se,U,T,nt,xt,Et,ft,Xt,Ot,Kt,Wt,Tt,wt,ee,$t,Ht,oe,F,Pt;function Dt(){Jt=new W1(H),Jt.init(),oe=new wA(H,Jt),te=new B1(H,Jt,e,oe),Ft=new RA(H,Jt),te.reversedDepthBuffer&&S&&Ft.buffers.depth.setReversed(!0),He=new K1(H),Yt=new pA,se=new CA(H,Jt,Ft,Yt,te,oe,He),U=new H1(N),T=new Y1(N),nt=new tb(H),F=new z1(H,nt),xt=new j1(H,nt,He,F),Et=new J1(H,xt,nt,He),ee=new Q1(H,te,se),Wt=new F1(Yt),ft=new hA(N,U,T,Jt,te,F,Wt),Xt=new PA(N,Yt),Ot=new xA,Kt=new MA(Jt),wt=new P1(N,U,T,Ft,Et,M,g),Tt=new TA(N,Et,te),Pt=new zA(H,He,te,Ft),$t=new I1(H,Jt,He),Ht=new Z1(H,Jt,He),He.programs=ft.programs,N.capabilities=te,N.extensions=Jt,N.properties=Yt,N.renderLists=Ot,N.shadowMap=Tt,N.state=Ft,N.info=He}Dt();const Ut=new LA(N,H);this.xr=Ut,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const R=Jt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Jt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return _t},this.setPixelRatio=function(R){R!==void 0&&(_t=R,this.setSize(J,St,!1))},this.getSize=function(R){return R.set(J,St)},this.setSize=function(R,Q,st=!0){if(Ut.isPresenting){me("WebGLRenderer: Can't change size while VR device is presenting.");return}J=R,St=Q,a.width=Math.floor(R*_t),a.height=Math.floor(Q*_t),st===!0&&(a.style.width=R+"px",a.style.height=Q+"px"),this.setViewport(0,0,R,Q)},this.getDrawingBufferSize=function(R){return R.set(J*_t,St*_t).floor()},this.setDrawingBufferSize=function(R,Q,st){J=R,St=Q,_t=st,a.width=Math.floor(R*st),a.height=Math.floor(Q*st),this.setViewport(0,0,R,Q)},this.getCurrentViewport=function(R){return R.copy(ut)},this.getViewport=function(R){return R.copy(Ee)},this.setViewport=function(R,Q,st,ot){R.isVector4?Ee.set(R.x,R.y,R.z,R.w):Ee.set(R,Q,st,ot),Ft.viewport(ut.copy(Ee).multiplyScalar(_t).round())},this.getScissor=function(R){return R.copy(E)},this.setScissor=function(R,Q,st,ot){R.isVector4?E.set(R.x,R.y,R.z,R.w):E.set(R,Q,st,ot),Ft.scissor(gt.copy(E).multiplyScalar(_t).round())},this.getScissorTest=function(){return G},this.setScissorTest=function(R){Ft.setScissorTest(G=R)},this.setOpaqueSort=function(R){Vt=R},this.setTransparentSort=function(R){le=R},this.getClearColor=function(R){return R.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor(...arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha(...arguments)},this.clear=function(R=!0,Q=!0,st=!0){let ot=0;if(R){let $=!1;if(w!==null){const Rt=w.texture.format;$=A.has(Rt)}if($){const Rt=w.texture.type,Ct=C.has(Rt),zt=wt.getClearColor(),Bt=wt.getClearAlpha(),ne=zt.r,re=zt.g,Qt=zt.b;Ct?(y[0]=ne,y[1]=re,y[2]=Qt,y[3]=Bt,H.clearBufferuiv(H.COLOR,0,y)):(v[0]=ne,v[1]=re,v[2]=Qt,v[3]=Bt,H.clearBufferiv(H.COLOR,0,v))}else ot|=H.COLOR_BUFFER_BIT}Q&&(ot|=H.DEPTH_BUFFER_BIT),st&&(ot|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){a.removeEventListener("webglcontextlost",At,!1),a.removeEventListener("webglcontextrestored",yt,!1),a.removeEventListener("webglcontextcreationerror",kt,!1),wt.dispose(),Ot.dispose(),Kt.dispose(),Yt.dispose(),U.dispose(),T.dispose(),Et.dispose(),F.dispose(),Pt.dispose(),ft.dispose(),Ut.dispose(),Ut.removeEventListener("sessionstart",gl),Ut.removeEventListener("sessionend",_l),ea.stop()};function At(R){R.preventDefault(),s_("WebGLRenderer: Context Lost."),I=!0}function yt(){s_("WebGLRenderer: Context Restored."),I=!1;const R=He.autoReset,Q=Tt.enabled,st=Tt.autoUpdate,ot=Tt.needsUpdate,$=Tt.type;Dt(),He.autoReset=R,Tt.enabled=Q,Tt.autoUpdate=st,Tt.needsUpdate=ot,Tt.type=$}function kt(R){cn("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ce(R){const Q=R.target;Q.removeEventListener("dispose",ce),je(Q)}function je(R){De(R),Yt.remove(R)}function De(R){const Q=Yt.get(R).programs;Q!==void 0&&(Q.forEach(function(st){ft.releaseProgram(st)}),R.isShaderMaterial&&ft.releaseShaderCache(R))}this.renderBufferDirect=function(R,Q,st,ot,$,Rt){Q===null&&(Q=Lt);const Ct=$.isMesh&&$.matrixWorld.determinant()<0,zt=Sl(R,Q,st,ot,$);Ft.setMaterial(ot,Ct);let Bt=st.index,ne=1;if(ot.wireframe===!0){if(Bt=xt.getWireframeAttribute(st),Bt===void 0)return;ne=2}const re=st.drawRange,Qt=st.attributes.position;let Se=re.start*ne,Ue=(re.start+re.count)*ne;Rt!==null&&(Se=Math.max(Se,Rt.start*ne),Ue=Math.min(Ue,(Rt.start+Rt.count)*ne)),Bt!==null?(Se=Math.max(Se,0),Ue=Math.min(Ue,Bt.count)):Qt!=null&&(Se=Math.max(Se,0),Ue=Math.min(Ue,Qt.count));const Ze=Ue-Se;if(Ze<0||Ze===1/0)return;F.setup($,ot,zt,st,Bt);let Ke,Ce=$t;if(Bt!==null&&(Ke=nt.get(Bt),Ce=Ht,Ce.setIndex(Ke)),$.isMesh)ot.wireframe===!0?(Ft.setLineWidth(ot.wireframeLinewidth*qe()),Ce.setMode(H.LINES)):Ce.setMode(H.TRIANGLES);else if($.isLine){let jt=ot.linewidth;jt===void 0&&(jt=1),Ft.setLineWidth(jt*qe()),$.isLineSegments?Ce.setMode(H.LINES):$.isLineLoop?Ce.setMode(H.LINE_LOOP):Ce.setMode(H.LINE_STRIP)}else $.isPoints?Ce.setMode(H.POINTS):$.isSprite&&Ce.setMode(H.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)dl("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ce.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(Jt.get("WEBGL_multi_draw"))Ce.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const jt=$._multiDrawStarts,Ge=$._multiDrawCounts,ye=$._multiDrawCount,Le=Bt?nt.get(Bt).bytesPerElement:1,na=Yt.get(ot).currentProgram.getUniforms();for(let Ln=0;Ln<ye;Ln++)na.setValue(H,"_gl_DrawID",Ln),Ce.render(jt[Ln]/Le,Ge[Ln])}else if($.isInstancedMesh)Ce.renderInstances(Se,Ze,$.count);else if(st.isInstancedBufferGeometry){const jt=st._maxInstanceCount!==void 0?st._maxInstanceCount:1/0,Ge=Math.min(st.instanceCount,jt);Ce.renderInstances(Se,Ze,Ge)}else Ce.render(Se,Ze)};function tn(R,Q,st){R.transparent===!0&&R.side===Qi&&R.forceSinglePass===!1?(R.side=Qn,R.needsUpdate=!0,Bi(R,Q,st),R.side=dr,R.needsUpdate=!0,Bi(R,Q,st),R.side=Qi):Bi(R,Q,st)}this.compile=function(R,Q,st=null){st===null&&(st=R),O=Kt.get(st),O.init(Q),V.push(O),st.traverseVisible(function($){$.isLight&&$.layers.test(Q.layers)&&(O.pushLight($),$.castShadow&&O.pushShadow($))}),R!==st&&R.traverseVisible(function($){$.isLight&&$.layers.test(Q.layers)&&(O.pushLight($),$.castShadow&&O.pushShadow($))}),O.setupLights();const ot=new Set;return R.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Rt=$.material;if(Rt)if(Array.isArray(Rt))for(let Ct=0;Ct<Rt.length;Ct++){const zt=Rt[Ct];tn(zt,st,$),ot.add(zt)}else tn(Rt,st,$),ot.add(Rt)}),O=V.pop(),ot},this.compileAsync=function(R,Q,st=null){const ot=this.compile(R,Q,st);return new Promise($=>{function Rt(){if(ot.forEach(function(Ct){Yt.get(Ct).currentProgram.isReady()&&ot.delete(Ct)}),ot.size===0){$(R);return}setTimeout(Rt,10)}Jt.get("KHR_parallel_shader_compile")!==null?Rt():setTimeout(Rt,10)})};let fn=null;function In(R){fn&&fn(R)}function gl(){ea.stop()}function _l(){ea.start()}const ea=new Dv;ea.setAnimationLoop(In),typeof self<"u"&&ea.setContext(self),this.setAnimationLoop=function(R){fn=R,Ut.setAnimationLoop(R),R===null?ea.stop():ea.start()},Ut.addEventListener("sessionstart",gl),Ut.addEventListener("sessionend",_l),this.render=function(R,Q){if(Q!==void 0&&Q.isCamera!==!0){cn("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),Ut.enabled===!0&&Ut.isPresenting===!0&&(Ut.cameraAutoUpdate===!0&&Ut.updateCamera(Q),Q=Ut.getCamera()),R.isScene===!0&&R.onBeforeRender(N,R,Q,w),O=Kt.get(R,V.length),O.init(Q),V.push(O),bt.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),B.setFromProjectionMatrix(bt,Ji,Q.reversedDepth),dt=this.localClippingEnabled,k=Wt.init(this.clippingPlanes,dt),L=Ot.get(R,z.length),L.init(),z.push(L),Ut.enabled===!0&&Ut.isPresenting===!0){const Rt=N.xr.getDepthSensingMesh();Rt!==null&&wa(Rt,Q,-1/0,N.sortObjects)}wa(R,Q,0,N.sortObjects),L.finish(),N.sortObjects===!0&&L.sort(Vt,le),ae=Ut.enabled===!1||Ut.isPresenting===!1||Ut.hasDepthSensing()===!1,ae&&wt.addToRenderList(L,R),this.info.render.frame++,k===!0&&Wt.beginShadows();const st=O.state.shadowsArray;Tt.render(st,R,Q),k===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ot=L.opaque,$=L.transmissive;if(O.setupLights(),Q.isArrayCamera){const Rt=Q.cameras;if($.length>0)for(let Ct=0,zt=Rt.length;Ct<zt;Ct++){const Bt=Rt[Ct];pr(ot,$,R,Bt)}ae&&wt.render(R);for(let Ct=0,zt=Rt.length;Ct<zt;Ct++){const Bt=Rt[Ct];hr(L,R,Bt,Bt.viewport)}}else $.length>0&&pr(ot,$,R,Q),ae&&wt.render(R),hr(L,R,Q);w!==null&&D===0&&(se.updateMultisampleRenderTarget(w),se.updateRenderTargetMipmap(w)),R.isScene===!0&&R.onAfterRender(N,R,Q),F.resetDefaultState(),q=-1,at=null,V.pop(),V.length>0?(O=V[V.length-1],k===!0&&Wt.setGlobalState(N.clippingPlanes,O.state.camera)):O=null,z.pop(),z.length>0?L=z[z.length-1]:L=null};function wa(R,Q,st,ot){if(R.visible===!1)return;if(R.layers.test(Q.layers)){if(R.isGroup)st=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(Q);else if(R.isLight)O.pushLight(R),R.castShadow&&O.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||B.intersectsSprite(R)){ot&&Mt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(bt);const Ct=Et.update(R),zt=R.material;zt.visible&&L.push(R,Ct,zt,st,Mt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||B.intersectsObject(R))){const Ct=Et.update(R),zt=R.material;if(ot&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Mt.copy(R.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Mt.copy(Ct.boundingSphere.center)),Mt.applyMatrix4(R.matrixWorld).applyMatrix4(bt)),Array.isArray(zt)){const Bt=Ct.groups;for(let ne=0,re=Bt.length;ne<re;ne++){const Qt=Bt[ne],Se=zt[Qt.materialIndex];Se&&Se.visible&&L.push(R,Ct,Se,st,Mt.z,Qt)}}else zt.visible&&L.push(R,Ct,zt,st,Mt.z,null)}}const Rt=R.children;for(let Ct=0,zt=Rt.length;Ct<zt;Ct++)wa(Rt[Ct],Q,st,ot)}function hr(R,Q,st,ot){const{opaque:$,transmissive:Rt,transparent:Ct}=R;O.setupLightsView(st),k===!0&&Wt.setGlobalState(N.clippingPlanes,st),ot&&Ft.viewport(ut.copy(ot)),$.length>0&&fi($,Q,st),Rt.length>0&&fi(Rt,Q,st),Ct.length>0&&fi(Ct,Q,st),Ft.buffers.depth.setTest(!0),Ft.buffers.depth.setMask(!0),Ft.buffers.color.setMask(!0),Ft.setPolygonOffset(!1)}function pr(R,Q,st,ot){if((st.isScene===!0?st.overrideMaterial:null)!==null)return;O.state.transmissionRenderTarget[ot.id]===void 0&&(O.state.transmissionRenderTarget[ot.id]=new Zr(1,1,{generateMipmaps:!0,type:Jt.has("EXT_color_buffer_half_float")||Jt.has("EXT_color_buffer_float")?no:$i,minFilter:Yr,samples:4,stencilBuffer:f,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Oe.workingColorSpace}));const Rt=O.state.transmissionRenderTarget[ot.id],Ct=ot.viewport||ut;Rt.setSize(Ct.z*N.transmissionResolutionScale,Ct.w*N.transmissionResolutionScale);const zt=N.getRenderTarget(),Bt=N.getActiveCubeFace(),ne=N.getActiveMipmapLevel();N.setRenderTarget(Rt),N.getClearColor(K),rt=N.getClearAlpha(),rt<1&&N.setClearColor(16777215,.5),N.clear(),ae&&wt.render(st);const re=N.toneMapping;N.toneMapping=fr;const Qt=ot.viewport;if(ot.viewport!==void 0&&(ot.viewport=void 0),O.setupLightsView(ot),k===!0&&Wt.setGlobalState(N.clippingPlanes,ot),fi(R,st,ot),se.updateMultisampleRenderTarget(Rt),se.updateRenderTargetMipmap(Rt),Jt.has("WEBGL_multisampled_render_to_texture")===!1){let Se=!1;for(let Ue=0,Ze=Q.length;Ue<Ze;Ue++){const Ke=Q[Ue],{object:Ce,geometry:jt,material:Ge,group:ye}=Ke;if(Ge.side===Qi&&Ce.layers.test(ot.layers)){const Le=Ge.side;Ge.side=Qn,Ge.needsUpdate=!0,mr(Ce,st,ot,jt,Ge,ye),Ge.side=Le,Ge.needsUpdate=!0,Se=!0}}Se===!0&&(se.updateMultisampleRenderTarget(Rt),se.updateRenderTargetMipmap(Rt))}N.setRenderTarget(zt,Bt,ne),N.setClearColor(K,rt),Qt!==void 0&&(ot.viewport=Qt),N.toneMapping=re}function fi(R,Q,st){const ot=Q.isScene===!0?Q.overrideMaterial:null;for(let $=0,Rt=R.length;$<Rt;$++){const Ct=R[$],{object:zt,geometry:Bt,group:ne}=Ct;let re=Ct.material;re.allowOverride===!0&&ot!==null&&(re=ot),zt.layers.test(st.layers)&&mr(zt,Q,st,Bt,re,ne)}}function mr(R,Q,st,ot,$,Rt){R.onBeforeRender(N,Q,st,ot,$,Rt),R.modelViewMatrix.multiplyMatrices(st.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),$.onBeforeRender(N,Q,st,ot,R,Rt),$.transparent===!0&&$.side===Qi&&$.forceSinglePass===!1?($.side=Qn,$.needsUpdate=!0,N.renderBufferDirect(st,Q,ot,$,R,Rt),$.side=dr,$.needsUpdate=!0,N.renderBufferDirect(st,Q,ot,$,R,Rt),$.side=Qi):N.renderBufferDirect(st,Q,ot,$,R,Rt),R.onAfterRender(N,Q,st,ot,$,Rt)}function Bi(R,Q,st){Q.isScene!==!0&&(Q=Lt);const ot=Yt.get(R),$=O.state.lights,Rt=O.state.shadowsArray,Ct=$.state.version,zt=ft.getParameters(R,$.state,Rt,Q,st),Bt=ft.getProgramCacheKey(zt);let ne=ot.programs;ot.environment=R.isMeshStandardMaterial?Q.environment:null,ot.fog=Q.fog,ot.envMap=(R.isMeshStandardMaterial?T:U).get(R.envMap||ot.environment),ot.envMapRotation=ot.environment!==null&&R.envMap===null?Q.environmentRotation:R.envMapRotation,ne===void 0&&(R.addEventListener("dispose",ce),ne=new Map,ot.programs=ne);let re=ne.get(Bt);if(re!==void 0){if(ot.currentProgram===re&&ot.lightsStateVersion===Ct)return vl(R,zt),re}else zt.uniforms=ft.getUniforms(R),R.onBeforeCompile(zt,N),re=ft.acquireProgram(zt,Bt),ne.set(Bt,re),ot.uniforms=zt.uniforms;const Qt=ot.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Qt.clippingPlanes=Wt.uniform),vl(R,zt),ot.needsLights=xr(R),ot.lightsStateVersion=Ct,ot.needsLights&&(Qt.ambientLightColor.value=$.state.ambient,Qt.lightProbe.value=$.state.probe,Qt.directionalLights.value=$.state.directional,Qt.directionalLightShadows.value=$.state.directionalShadow,Qt.spotLights.value=$.state.spot,Qt.spotLightShadows.value=$.state.spotShadow,Qt.rectAreaLights.value=$.state.rectArea,Qt.ltc_1.value=$.state.rectAreaLTC1,Qt.ltc_2.value=$.state.rectAreaLTC2,Qt.pointLights.value=$.state.point,Qt.pointLightShadows.value=$.state.pointShadow,Qt.hemisphereLights.value=$.state.hemi,Qt.directionalShadowMap.value=$.state.directionalShadowMap,Qt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Qt.spotShadowMap.value=$.state.spotShadowMap,Qt.spotLightMatrix.value=$.state.spotLightMatrix,Qt.spotLightMap.value=$.state.spotLightMap,Qt.pointShadowMap.value=$.state.pointShadowMap,Qt.pointShadowMatrix.value=$.state.pointShadowMatrix),ot.currentProgram=re,ot.uniformsList=null,re}function so(R){if(R.uniformsList===null){const Q=R.currentProgram.getUniforms();R.uniformsList=xc.seqWithValue(Q.seq,R.uniforms)}return R.uniformsList}function vl(R,Q){const st=Yt.get(R);st.outputColorSpace=Q.outputColorSpace,st.batching=Q.batching,st.batchingColor=Q.batchingColor,st.instancing=Q.instancing,st.instancingColor=Q.instancingColor,st.instancingMorph=Q.instancingMorph,st.skinning=Q.skinning,st.morphTargets=Q.morphTargets,st.morphNormals=Q.morphNormals,st.morphColors=Q.morphColors,st.morphTargetsCount=Q.morphTargetsCount,st.numClippingPlanes=Q.numClippingPlanes,st.numIntersection=Q.numClipIntersection,st.vertexAlphas=Q.vertexAlphas,st.vertexTangents=Q.vertexTangents,st.toneMapping=Q.toneMapping}function Sl(R,Q,st,ot,$){Q.isScene!==!0&&(Q=Lt),se.resetTextureUnits();const Rt=Q.fog,Ct=ot.isMeshStandardMaterial?Q.environment:null,zt=w===null?N.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:to,Bt=(ot.isMeshStandardMaterial?T:U).get(ot.envMap||Ct),ne=ot.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,re=!!st.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),Qt=!!st.morphAttributes.position,Se=!!st.morphAttributes.normal,Ue=!!st.morphAttributes.color;let Ze=fr;ot.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ze=N.toneMapping);const Ke=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,Ce=Ke!==void 0?Ke.length:0,jt=Yt.get(ot),Ge=O.state.lights;if(k===!0&&(dt===!0||R!==at)){const Sn=R===at&&ot.id===q;Wt.setState(ot,R,Sn)}let ye=!1;ot.version===jt.__version?(jt.needsLights&&jt.lightsStateVersion!==Ge.state.version||jt.outputColorSpace!==zt||$.isBatchedMesh&&jt.batching===!1||!$.isBatchedMesh&&jt.batching===!0||$.isBatchedMesh&&jt.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&jt.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&jt.instancing===!1||!$.isInstancedMesh&&jt.instancing===!0||$.isSkinnedMesh&&jt.skinning===!1||!$.isSkinnedMesh&&jt.skinning===!0||$.isInstancedMesh&&jt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&jt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&jt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&jt.instancingMorph===!1&&$.morphTexture!==null||jt.envMap!==Bt||ot.fog===!0&&jt.fog!==Rt||jt.numClippingPlanes!==void 0&&(jt.numClippingPlanes!==Wt.numPlanes||jt.numIntersection!==Wt.numIntersection)||jt.vertexAlphas!==ne||jt.vertexTangents!==re||jt.morphTargets!==Qt||jt.morphNormals!==Se||jt.morphColors!==Ue||jt.toneMapping!==Ze||jt.morphTargetsCount!==Ce)&&(ye=!0):(ye=!0,jt.__version=ot.version);let Le=jt.currentProgram;ye===!0&&(Le=Bi(ot,Q,$));let na=!1,Ln=!1,Da=!1;const Ie=Le.getUniforms(),ln=jt.uniforms;if(Ft.useProgram(Le.program)&&(na=!0,Ln=!0,Da=!0),ot.id!==q&&(q=ot.id,Ln=!0),na||at!==R){Ft.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ie.setValue(H,"projectionMatrix",R.projectionMatrix),Ie.setValue(H,"viewMatrix",R.matrixWorldInverse);const Tn=Ie.map.cameraPosition;Tn!==void 0&&Tn.setValue(H,vt.setFromMatrixPosition(R.matrixWorld)),te.logarithmicDepthBuffer&&Ie.setValue(H,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&Ie.setValue(H,"isOrthographic",R.isOrthographicCamera===!0),at!==R&&(at=R,Ln=!0,Da=!0)}if($.isSkinnedMesh){Ie.setOptional(H,$,"bindMatrix"),Ie.setOptional(H,$,"bindMatrixInverse");const Sn=$.skeleton;Sn&&(Sn.boneTexture===null&&Sn.computeBoneTexture(),Ie.setValue(H,"boneTexture",Sn.boneTexture,se))}$.isBatchedMesh&&(Ie.setOptional(H,$,"batchingTexture"),Ie.setValue(H,"batchingTexture",$._matricesTexture,se),Ie.setOptional(H,$,"batchingIdTexture"),Ie.setValue(H,"batchingIdTexture",$._indirectTexture,se),Ie.setOptional(H,$,"batchingColorTexture"),$._colorsTexture!==null&&Ie.setValue(H,"batchingColorTexture",$._colorsTexture,se));const kn=st.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&ee.update($,st,Le),(Ln||jt.receiveShadow!==$.receiveShadow)&&(jt.receiveShadow=$.receiveShadow,Ie.setValue(H,"receiveShadow",$.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(ln.envMap.value=Bt,ln.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),ot.isMeshStandardMaterial&&ot.envMap===null&&Q.environment!==null&&(ln.envMapIntensity.value=Q.environmentIntensity),ln.dfgLUT!==void 0&&(ln.dfgLUT.value=BA()),Ln&&(Ie.setValue(H,"toneMappingExposure",N.toneMappingExposure),jt.needsLights&&oo(ln,Da),Rt&&ot.fog===!0&&Xt.refreshFogUniforms(ln,Rt),Xt.refreshMaterialUniforms(ln,ot,_t,St,O.state.transmissionRenderTarget[R.id]),xc.upload(H,so(jt),ln,se)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(xc.upload(H,so(jt),ln,se),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&Ie.setValue(H,"center",$.center),Ie.setValue(H,"modelViewMatrix",$.modelViewMatrix),Ie.setValue(H,"normalMatrix",$.normalMatrix),Ie.setValue(H,"modelMatrix",$.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const Sn=ot.uniformsGroups;for(let Tn=0,lo=Sn.length;Tn<lo;Tn++){const ge=Sn[Tn];Pt.update(ge,Le),Pt.bind(ge,Le)}}return Le}function oo(R,Q){R.ambientLightColor.needsUpdate=Q,R.lightProbe.needsUpdate=Q,R.directionalLights.needsUpdate=Q,R.directionalLightShadows.needsUpdate=Q,R.pointLights.needsUpdate=Q,R.pointLightShadows.needsUpdate=Q,R.spotLights.needsUpdate=Q,R.spotLightShadows.needsUpdate=Q,R.rectAreaLights.needsUpdate=Q,R.hemisphereLights.needsUpdate=Q}function xr(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(R,Q,st){const ot=Yt.get(R);ot.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ot.__autoAllocateDepthBuffer===!1&&(ot.__useRenderToTexture=!1),Yt.get(R.texture).__webglTexture=Q,Yt.get(R.depthTexture).__webglTexture=ot.__autoAllocateDepthBuffer?void 0:st,ot.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,Q){const st=Yt.get(R);st.__webglFramebuffer=Q,st.__useDefaultFramebuffer=Q===void 0};const Rc=H.createFramebuffer();this.setRenderTarget=function(R,Q=0,st=0){w=R,Y=Q,D=st;let ot=!0,$=null,Rt=!1,Ct=!1;if(R){const Bt=Yt.get(R);if(Bt.__useDefaultFramebuffer!==void 0)Ft.bindFramebuffer(H.FRAMEBUFFER,null),ot=!1;else if(Bt.__webglFramebuffer===void 0)se.setupRenderTarget(R);else if(Bt.__hasExternalTextures)se.rebindTextures(R,Yt.get(R.texture).__webglTexture,Yt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Qt=R.depthTexture;if(Bt.__boundDepthTexture!==Qt){if(Qt!==null&&Yt.has(Qt)&&(R.width!==Qt.image.width||R.height!==Qt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");se.setupDepthRenderbuffer(R)}}const ne=R.texture;(ne.isData3DTexture||ne.isDataArrayTexture||ne.isCompressedArrayTexture)&&(Ct=!0);const re=Yt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(re[Q])?$=re[Q][st]:$=re[Q],Rt=!0):R.samples>0&&se.useMultisampledRTT(R)===!1?$=Yt.get(R).__webglMultisampledFramebuffer:Array.isArray(re)?$=re[st]:$=re,ut.copy(R.viewport),gt.copy(R.scissor),ct=R.scissorTest}else ut.copy(Ee).multiplyScalar(_t).floor(),gt.copy(E).multiplyScalar(_t).floor(),ct=G;if(st!==0&&($=Rc),Ft.bindFramebuffer(H.FRAMEBUFFER,$)&&ot&&Ft.drawBuffers(R,$),Ft.viewport(ut),Ft.scissor(gt),Ft.setScissorTest(ct),Rt){const Bt=Yt.get(R.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Bt.__webglTexture,st)}else if(Ct){const Bt=Q;for(let ne=0;ne<R.textures.length;ne++){const re=Yt.get(R.textures[ne]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+ne,re.__webglTexture,st,Bt)}}else if(R!==null&&st!==0){const Bt=Yt.get(R.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Bt.__webglTexture,st)}q=-1},this.readRenderTargetPixels=function(R,Q,st,ot,$,Rt,Ct,zt=0){if(!(R&&R.isWebGLRenderTarget)){cn("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Bt=Yt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Bt=Bt[Ct]),Bt){Ft.bindFramebuffer(H.FRAMEBUFFER,Bt);try{const ne=R.textures[zt],re=ne.format,Qt=ne.type;if(!te.textureFormatReadable(re)){cn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!te.textureTypeReadable(Qt)){cn("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=R.width-ot&&st>=0&&st<=R.height-$&&(R.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+zt),H.readPixels(Q,st,ot,$,oe.convert(re),oe.convert(Qt),Rt))}finally{const ne=w!==null?Yt.get(w).__webglFramebuffer:null;Ft.bindFramebuffer(H.FRAMEBUFFER,ne)}}},this.readRenderTargetPixelsAsync=async function(R,Q,st,ot,$,Rt,Ct,zt=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Bt=Yt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Bt=Bt[Ct]),Bt)if(Q>=0&&Q<=R.width-ot&&st>=0&&st<=R.height-$){Ft.bindFramebuffer(H.FRAMEBUFFER,Bt);const ne=R.textures[zt],re=ne.format,Qt=ne.type;if(!te.textureFormatReadable(re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!te.textureTypeReadable(Qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Se=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,Se),H.bufferData(H.PIXEL_PACK_BUFFER,Rt.byteLength,H.STREAM_READ),R.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+zt),H.readPixels(Q,st,ot,$,oe.convert(re),oe.convert(Qt),0);const Ue=w!==null?Yt.get(w).__webglFramebuffer:null;Ft.bindFramebuffer(H.FRAMEBUFFER,Ue);const Ze=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await hE(H,Ze,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,Se),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,Rt),H.deleteBuffer(Se),H.deleteSync(Ze),Rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,Q=null,st=0){const ot=Math.pow(2,-st),$=Math.floor(R.image.width*ot),Rt=Math.floor(R.image.height*ot),Ct=Q!==null?Q.x:0,zt=Q!==null?Q.y:0;se.setTexture2D(R,0),H.copyTexSubImage2D(H.TEXTURE_2D,st,0,0,Ct,zt,$,Rt),Ft.unbindTexture()};const yl=H.createFramebuffer(),Ml=H.createFramebuffer();this.copyTextureToTexture=function(R,Q,st=null,ot=null,$=0,Rt=null){Rt===null&&($!==0?(dl("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Rt=$,$=0):Rt=0);let Ct,zt,Bt,ne,re,Qt,Se,Ue,Ze;const Ke=R.isCompressedTexture?R.mipmaps[Rt]:R.image;if(st!==null)Ct=st.max.x-st.min.x,zt=st.max.y-st.min.y,Bt=st.isBox3?st.max.z-st.min.z:1,ne=st.min.x,re=st.min.y,Qt=st.isBox3?st.min.z:0;else{const kn=Math.pow(2,-$);Ct=Math.floor(Ke.width*kn),zt=Math.floor(Ke.height*kn),R.isDataArrayTexture?Bt=Ke.depth:R.isData3DTexture?Bt=Math.floor(Ke.depth*kn):Bt=1,ne=0,re=0,Qt=0}ot!==null?(Se=ot.x,Ue=ot.y,Ze=ot.z):(Se=0,Ue=0,Ze=0);const Ce=oe.convert(Q.format),jt=oe.convert(Q.type);let Ge;Q.isData3DTexture?(se.setTexture3D(Q,0),Ge=H.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(se.setTexture2DArray(Q,0),Ge=H.TEXTURE_2D_ARRAY):(se.setTexture2D(Q,0),Ge=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Q.unpackAlignment);const ye=H.getParameter(H.UNPACK_ROW_LENGTH),Le=H.getParameter(H.UNPACK_IMAGE_HEIGHT),na=H.getParameter(H.UNPACK_SKIP_PIXELS),Ln=H.getParameter(H.UNPACK_SKIP_ROWS),Da=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,Ke.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Ke.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,ne),H.pixelStorei(H.UNPACK_SKIP_ROWS,re),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Qt);const Ie=R.isDataArrayTexture||R.isData3DTexture,ln=Q.isDataArrayTexture||Q.isData3DTexture;if(R.isDepthTexture){const kn=Yt.get(R),Sn=Yt.get(Q),Tn=Yt.get(kn.__renderTarget),lo=Yt.get(Sn.__renderTarget);Ft.bindFramebuffer(H.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Ft.bindFramebuffer(H.DRAW_FRAMEBUFFER,lo.__webglFramebuffer);for(let ge=0;ge<Bt;ge++)Ie&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Yt.get(R).__webglTexture,$,Qt+ge),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Yt.get(Q).__webglTexture,Rt,Ze+ge)),H.blitFramebuffer(ne,re,Ct,zt,Se,Ue,Ct,zt,H.DEPTH_BUFFER_BIT,H.NEAREST);Ft.bindFramebuffer(H.READ_FRAMEBUFFER,null),Ft.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if($!==0||R.isRenderTargetTexture||Yt.has(R)){const kn=Yt.get(R),Sn=Yt.get(Q);Ft.bindFramebuffer(H.READ_FRAMEBUFFER,yl),Ft.bindFramebuffer(H.DRAW_FRAMEBUFFER,Ml);for(let Tn=0;Tn<Bt;Tn++)Ie?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,kn.__webglTexture,$,Qt+Tn):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,kn.__webglTexture,$),ln?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Sn.__webglTexture,Rt,Ze+Tn):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Sn.__webglTexture,Rt),$!==0?H.blitFramebuffer(ne,re,Ct,zt,Se,Ue,Ct,zt,H.COLOR_BUFFER_BIT,H.NEAREST):ln?H.copyTexSubImage3D(Ge,Rt,Se,Ue,Ze+Tn,ne,re,Ct,zt):H.copyTexSubImage2D(Ge,Rt,Se,Ue,ne,re,Ct,zt);Ft.bindFramebuffer(H.READ_FRAMEBUFFER,null),Ft.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else ln?R.isDataTexture||R.isData3DTexture?H.texSubImage3D(Ge,Rt,Se,Ue,Ze,Ct,zt,Bt,Ce,jt,Ke.data):Q.isCompressedArrayTexture?H.compressedTexSubImage3D(Ge,Rt,Se,Ue,Ze,Ct,zt,Bt,Ce,Ke.data):H.texSubImage3D(Ge,Rt,Se,Ue,Ze,Ct,zt,Bt,Ce,jt,Ke):R.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,Rt,Se,Ue,Ct,zt,Ce,jt,Ke.data):R.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,Rt,Se,Ue,Ke.width,Ke.height,Ce,Ke.data):H.texSubImage2D(H.TEXTURE_2D,Rt,Se,Ue,Ct,zt,Ce,jt,Ke);H.pixelStorei(H.UNPACK_ROW_LENGTH,ye),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Le),H.pixelStorei(H.UNPACK_SKIP_PIXELS,na),H.pixelStorei(H.UNPACK_SKIP_ROWS,Ln),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Da),Rt===0&&Q.generateMipmaps&&H.generateMipmap(Ge),Ft.unbindTexture()},this.initRenderTarget=function(R){Yt.get(R).__webglFramebuffer===void 0&&se.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?se.setTextureCube(R,0):R.isData3DTexture?se.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?se.setTexture2DArray(R,0):se.setTexture2D(R,0),Ft.unbindTexture()},this.resetState=function(){Y=0,D=0,w=null,Ft.reset(),F.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const a=this.getContext();a.drawingBufferColorSpace=Oe._getDrawingBufferColorSpace(e),a.unpackColorSpace=Oe._getUnpackColorSpace()}}const Pv=4200;function HA(o,e=Pv){if(!Number.isFinite(o)||!Number.isFinite(e)||e<=0)throw new RangeError("Flight times must be finite and duration must be positive");const a=Math.min(1,Math.max(0,o/e));return a*a*(3-2*a)}function GA(o){return 7.8-4.7*o}const VA=[{initials:"01",role:"Terrain intelligence",label:"Data & mapping"},{initials:"02",role:"Route engineering",label:"Navigation"},{initials:"03",role:"Mission experience",label:"Design & story"}];function XA({reducedMotion:o}){const e=Wr.useRef(null),[a,s]=Wr.useState(o);return Wr.useEffect(()=>{const u=e.current,f=new FE,d=new Mi(35,1,.1,100),h=new FA({antialias:!0,alpha:!0,powerPreference:"low-power"});h.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),h.outputColorSpace=li,u.appendChild(h.domElement);const g=new Ii(new yc(1.55,48,32),new qE({color:12173765,roughness:1,metalness:0,flatShading:!0}));g.rotation.z=-.18,f.add(g),f.add(new QE(6322057,1.8));const x=new KE(15332338,3.2);x.position.set(-3,2,5),f.add(x);const _=new sl;_.position.set(0,-1.56,0);const p=new Ii(new Bp(.19,.205,48),new Sc({color:10414033,side:Qi,transparent:!0,opacity:.9}));p.rotation.x=-Math.PI/2,_.add(p),_.add(new Ii(new yc(.045,12,8),new Sc({color:12976112}))),f.add(_);const S=new Float32Array([-6,3,-3,-4,-2,-2,5,3,-3,4,-1,-1,-2,5,-5,3,5,-4,6,0,-4,-5,0,-2,1,4,-5,-3,-4,-4,2,-4,-5,5,-3,-5,-6,-1,-5,0,6,-5,-5,4,-5]),M=new bi;M.setAttribute("position",new zi(S,3));const A=new kE(M,new Tv({color:11189702,size:.035}));f.add(A);const C=()=>{const{width:z,height:V}=u.getBoundingClientRect();h.setSize(z,V,!1),d.aspect=z/V,d.updateProjectionMatrix()};C();const y=new ResizeObserver(C);y.observe(u);let v,L;const O=z=>{L===void 0&&(L=z);const V=o?1:HA(z-L,Pv);d.position.set(0,-2.2*V,GA(V)),d.lookAt(0,-1.3*V,0),g.rotation.y=.2*V,p.scale.setScalar(1+.25*V),h.render(f,d),V<1&&!document.hidden?v=requestAnimationFrame(O):s(!0)};return v=requestAnimationFrame(O),()=>{cancelAnimationFrame(v),y.disconnect(),u.removeChild(h.domElement),g.geometry.dispose(),g.material.dispose(),p.geometry.dispose(),p.material.dispose(),_.children[1].geometry.dispose(),_.children[1].material.dispose(),M.dispose(),A.material.dispose(),h.dispose()}},[o]),ht.createElement("div",{className:`moon-scene ${a?"arrived":""}`,ref:e,"aria-hidden":"true"})}function kA(){const[o,e]=Wr.useState(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);return Wr.useEffect(()=>{const a=window.matchMedia("(prefers-reduced-motion: reduce)"),s=()=>e(a.matches);return a.addEventListener("change",s),()=>a.removeEventListener("change",s)},[]),ht.createElement(ht.Fragment,null,ht.createElement("a",{className:"skip",href:"#what"},"Skip to content"),ht.createElement("header",{className:"site-header"},ht.createElement("a",{className:"brand",href:"#top","aria-label":"South Pole Navigator home"},ht.createElement("span",{className:"brand-mark"},"✳"),ht.createElement("span",null,"SOUTH POLE",ht.createElement("br",null),ht.createElement("strong",null,"NAVIGATOR"))),ht.createElement("nav",{"aria-label":"Main navigation"},ht.createElement("a",{href:"#what"},"The mission"),ht.createElement("a",{href:"#how"},"How it works"),ht.createElement("a",{href:"#team"},"Team"),ht.createElement("a",{href:"#resources"},"Resources")),ht.createElement("a",{className:"header-cta",href:"/app"},"Launch navigator ",ht.createElement("span",{"aria-hidden":"true"},"↗"))),ht.createElement("main",{id:"top"},ht.createElement("section",{className:"hero","aria-labelledby":"hero-title"},ht.createElement("div",{className:"hero-glow"}),ht.createElement(XA,{reducedMotion:o}),ht.createElement("div",{className:"hero-copy"},ht.createElement("p",{className:"eyebrow"},ht.createElement("span",{className:"signal"})," EXPLORATION SYSTEM / 001"),ht.createElement("h1",{id:"hero-title"},"The next step",ht.createElement("br",null),"starts ",ht.createElement("em",null,"here.")),ht.createElement("p",{className:"hero-description"},"A new way to explore the lunar south pole. See the terrain, understand the risk, and find a path forward."),ht.createElement("div",{className:"hero-actions"},ht.createElement("a",{className:"button primary",href:"/app"},"Launch the navigator ",ht.createElement("span",{"aria-hidden":"true"},"↗")),ht.createElement("a",{className:"text-link",href:"#what"},"Discover the mission ",ht.createElement("span",{"aria-hidden":"true"},"↓")))),ht.createElement("div",{className:"hero-meta"},ht.createElement("span",null,"84°–90° S",ht.createElement("br",null),"LUNAR SOUTH POLE"),ht.createElement("span",null,"SCROLL TO EXPLORE ",ht.createElement("span",{"aria-hidden":"true"},"↓")))),ht.createElement("section",{className:"section intro",id:"what"},ht.createElement("div",{className:"section-index"},"01 / WHAT"),ht.createElement("div",null,ht.createElement("p",{className:"kicker"},"THE MISSION"),ht.createElement("h2",null,"Find a way through",ht.createElement("br",null),ht.createElement("em",null,"the unknown.")),ht.createElement("p",{className:"large-copy"},"The Moon's south pole holds extraordinary promise. It also holds complex terrain. South Pole Navigator turns elevation and slope data into an explorable view of the ground ahead."))),ht.createElement("section",{className:"section why",id:"why"},ht.createElement("div",{className:"section-index"},"02 / WHY"),ht.createElement("div",{className:"why-grid"},ht.createElement("div",null,ht.createElement("p",{className:"kicker"},"WHY IT MATTERS"),ht.createElement("h2",null,"Every meter",ht.createElement("br",null),ht.createElement("em",null,"matters."))),ht.createElement("div",{className:"stat-card"},ht.createElement("span",{className:"stat-icon"},"◌"),ht.createElement("p",null,"Steep slopes, deep shadows, and long distances make every route a decision. Better terrain context helps explorers see the tradeoffs before taking the first step."),ht.createElement("span",{className:"card-foot"},"DESIGNED FOR EXPLORATION / BUILT ON DATA")))),ht.createElement("section",{className:"section how",id:"how"},ht.createElement("div",{className:"section-index"},"03 / HOW"),ht.createElement("div",null,ht.createElement("p",{className:"kicker"},"FROM DATA TO DIRECTION"),ht.createElement("h2",null,"Navigate with",ht.createElement("br",null),ht.createElement("em",null,"confidence.")),ht.createElement("div",{className:"steps"},ht.createElement("article",null,ht.createElement("span",null,"01"),ht.createElement("h3",null,"Explore terrain"),ht.createElement("p",null,"Move through a focused view of the lunar south pole and inspect the landscape.")),ht.createElement("article",null,ht.createElement("span",null,"02"),ht.createElement("h3",null,"Understand slope"),ht.createElement("p",null,"Read elevation and steepness together to see where the ground gets difficult.")),ht.createElement("article",null,ht.createElement("span",null,"03"),ht.createElement("h3",null,"Trace a path"),ht.createElement("p",null,"Compare routes between a landing area and a destination on the surface."))))),ht.createElement("section",{className:"section team",id:"team"},ht.createElement("div",{className:"section-index"},"04 / TEAM"),ht.createElement("div",null,ht.createElement("p",{className:"kicker"},"THE PEOPLE BEHIND THE PATH"),ht.createElement("h2",null,"Built for the",ht.createElement("br",null),ht.createElement("em",null,"curious.")),ht.createElement("p",{className:"large-copy"},"A cross discipline NASA Space Apps effort connecting planetary data, route planning, and accessible exploration."),ht.createElement("div",{className:"team-grid"},VA.map(a=>ht.createElement("article",{key:a.initials},ht.createElement("span",null,a.initials),ht.createElement("h3",null,a.role),ht.createElement("p",null,a.label)))))),ht.createElement("section",{className:"section resources",id:"resources"},ht.createElement("div",{className:"section-index"},"05 / RESOURCES"),ht.createElement("div",null,ht.createElement("p",{className:"kicker"},"GO FURTHER"),ht.createElement("h2",null,"The data behind",ht.createElement("br",null),ht.createElement("em",null,"the journey.")),ht.createElement("p",{className:"large-copy"},"Explore the source material behind this project and start navigating the surface yourself."),ht.createElement("div",{className:"resource-links"},ht.createElement("a",{href:"https://science.nasa.gov/moon/",target:"_blank",rel:"noreferrer"},"NASA Moon science ",ht.createElement("span",{"aria-hidden":"true"},"↗")),ht.createElement("a",{href:"https://trek.nasa.gov/moon/",target:"_blank",rel:"noreferrer"},"NASA Moon Trek ",ht.createElement("span",{"aria-hidden":"true"},"↗")),ht.createElement("a",{href:"/app"},"Launch the navigator ",ht.createElement("span",{"aria-hidden":"true"},"↗")))))),ht.createElement("footer",null,ht.createElement("div",{className:"brand"},ht.createElement("span",{className:"brand-mark"},"✳"),ht.createElement("span",null,"SOUTH POLE",ht.createElement("br",null),ht.createElement("strong",null,"NAVIGATOR"))),ht.createElement("p",null,"Made for the next giant leap."),ht.createElement("a",{href:"#top"},"Back to top ↑")))}var Ph={exports:{}},rl={};var Q_;function qA(){if(Q_)return rl;Q_=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function a(s,u,f){var d=null;if(f!==void 0&&(d=""+f),u.key!==void 0&&(d=""+u.key),"key"in u){f={};for(var h in u)h!=="key"&&(f[h]=u[h])}else f=u;return u=f.ref,{$$typeof:o,type:s,key:d,ref:u!==void 0?u:null,props:f}}return rl.Fragment=e,rl.jsx=a,rl.jsxs=a,rl}var J_;function YA(){return J_||(J_=1,Ph.exports=qA()),Ph.exports}var ve=YA(),zh={exports:{}},de={};var $_;function WA(){if($_)return de;$_=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),u=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),p=Symbol.for("react.activity"),S=Symbol.for("react.view_transition"),M=Symbol.iterator;function A(E){return E===null||typeof E!="object"?null:(E=M&&E[M]||E["@@iterator"],typeof E=="function"?E:null)}var C={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y=Object.assign,v={};function L(E,G,B){this.props=E,this.context=G,this.refs=v,this.updater=B||C}L.prototype.isReactComponent={},L.prototype.setState=function(E,G){if(typeof E!="object"&&typeof E!="function"&&E!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,E,G,"setState")},L.prototype.forceUpdate=function(E){this.updater.enqueueForceUpdate(this,E,"forceUpdate")};function O(){}O.prototype=L.prototype;function z(E,G,B){this.props=E,this.context=G,this.refs=v,this.updater=B||C}var V=z.prototype=new O;V.constructor=z,y(V,L.prototype),V.isPureReactComponent=!0;var N=Array.isArray;function I(){}var Y={H:null,A:null,T:null,S:null},D=Object.prototype.hasOwnProperty;function w(E,G,B){var k=B.ref;return{$$typeof:o,type:E,key:G,ref:k!==void 0?k:null,props:B}}function q(E,G){return w(E.type,G,E.props)}function at(E){return typeof E=="object"&&E!==null&&E.$$typeof===o}function ut(E){var G={"=":"=0",":":"=2"};return"$"+E.replace(/[=:]/g,function(B){return G[B]})}var gt=/\/+/g;function ct(E,G){return typeof E=="object"&&E!==null&&E.key!=null?ut(""+E.key):G.toString(36)}function K(E){switch(E.status){case"fulfilled":return E.value;case"rejected":throw E.reason;default:switch(typeof E.status=="string"?E.then(I,I):(E.status="pending",E.then(function(G){E.status==="pending"&&(E.status="fulfilled",E.value=G)},function(G){E.status==="pending"&&(E.status="rejected",E.reason=G)})),E.status){case"fulfilled":return E.value;case"rejected":throw E.reason}}throw E}function rt(E,G,B,k,dt){var bt=typeof E;(bt==="undefined"||bt==="boolean")&&(E=null);var vt=!1;if(E===null)vt=!0;else switch(bt){case"bigint":case"string":case"number":vt=!0;break;case"object":switch(E.$$typeof){case o:case e:vt=!0;break;case _:return vt=E._init,rt(vt(E._payload),G,B,k,dt)}}if(vt)return dt=dt(E),vt=k===""?"."+ct(E,0):k,N(dt)?(B="",vt!=null&&(B=vt.replace(gt,"$&/")+"/"),rt(dt,G,B,"",function(ae){return ae})):dt!=null&&(at(dt)&&(dt=q(dt,B+(dt.key==null||E&&E.key===dt.key?"":(""+dt.key).replace(gt,"$&/")+"/")+vt)),G.push(dt)),1;vt=0;var Mt=k===""?".":k+":";if(N(E))for(var Lt=0;Lt<E.length;Lt++)k=E[Lt],bt=Mt+ct(k,Lt),vt+=rt(k,G,B,bt,dt);else if(Lt=A(E),typeof Lt=="function")for(E=Lt.call(E),Lt=0;!(k=E.next()).done;)k=k.value,bt=Mt+ct(k,Lt++),vt+=rt(k,G,B,bt,dt);else if(bt==="object"){if(typeof E.then=="function")return rt(K(E),G,B,k,dt);throw G=String(E),Error("Objects are not valid as a React child (found: "+(G==="[object Object]"?"object with keys {"+Object.keys(E).join(", ")+"}":G)+"). If you meant to render a collection of children, use an array instead.")}return vt}function J(E,G,B){if(E==null)return E;var k=[],dt=0;return rt(E,k,"","",function(bt){return G.call(B,bt,dt++)}),k}function St(E){if(E._status===-1){var G=E._result,B=G();B.then(function(k){(E._status===0||E._status===-1)&&(E._status=1,E._result=k,B.status===void 0&&(B.status="fulfilled",B.value=k))},function(k){(E._status===0||E._status===-1)&&(E._status=2,E._result=k,B.status===void 0&&(B.status="rejected",B.reason=k))}),E._status===-1&&(E._status=0,E._result=B)}if(E._status===1)return E._result.default;throw E._result}var _t=typeof reportError=="function"?reportError:function(E){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var G=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof E=="object"&&E!==null&&typeof E.message=="string"?String(E.message):String(E),error:E});if(!window.dispatchEvent(G))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",E);return}console.error(E)};function Vt(E){var G=Y.T,B={};B.types=G!==null?G.types:null,Y.T=B;try{var k=E(),dt=Y.S;dt!==null&&dt(B,k),typeof k=="object"&&k!==null&&typeof k.then=="function"&&k.then(I,_t)}catch(bt){_t(bt)}finally{G!==null&&B.types!==null&&(G.types=B.types),Y.T=G}}function le(E){var G=Y.T;if(G!==null){var B=G.types;B===null?G.types=[E]:B.indexOf(E)===-1&&B.push(E)}else Vt(le.bind(null,E))}var Ee={map:J,forEach:function(E,G,B){J(E,function(){G.apply(this,arguments)},B)},count:function(E){var G=0;return J(E,function(){G++}),G},toArray:function(E){return J(E,function(G){return G})||[]},only:function(E){if(!at(E))throw Error("React.Children.only expected to receive a single React element child.");return E}};return de.Activity=p,de.Children=Ee,de.Component=L,de.Fragment=a,de.Profiler=u,de.PureComponent=z,de.StrictMode=s,de.Suspense=g,de.ViewTransition=S,de.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Y,de.__COMPILER_RUNTIME={__proto__:null,c:function(E){return Y.H.useMemoCache(E)}},de.addTransitionType=le,de.cache=function(E){return function(){return E.apply(null,arguments)}},de.cacheSignal=function(){return null},de.cloneElement=function(E,G,B){if(E==null)throw Error("The argument must be a React element, but you passed "+E+".");var k=y({},E.props),dt=E.key;if(G!=null)for(bt in G.key!==void 0&&(dt=""+G.key),G)!D.call(G,bt)||bt==="key"||bt==="__self"||bt==="__source"||bt==="ref"&&G.ref===void 0||(k[bt]=G[bt]);var bt=arguments.length-2;if(bt===1)k.children=B;else if(1<bt){for(var vt=Array(bt),Mt=0;Mt<bt;Mt++)vt[Mt]=arguments[Mt+2];k.children=vt}return w(E.type,dt,k)},de.createContext=function(E){return E={$$typeof:d,_currentValue:E,_currentValue2:E,_threadCount:0,Provider:null,Consumer:null},E.Provider=E,E.Consumer={$$typeof:f,_context:E},E},de.createElement=function(E,G,B){var k,dt={},bt=null;if(G!=null)for(k in G.key!==void 0&&(bt=""+G.key),G)D.call(G,k)&&k!=="key"&&k!=="__self"&&k!=="__source"&&(dt[k]=G[k]);var vt=arguments.length-2;if(vt===1)dt.children=B;else if(1<vt){for(var Mt=Array(vt),Lt=0;Lt<vt;Lt++)Mt[Lt]=arguments[Lt+2];dt.children=Mt}if(E&&E.defaultProps)for(k in vt=E.defaultProps,vt)dt[k]===void 0&&(dt[k]=vt[k]);return w(E,bt,dt)},de.createRef=function(){return{current:null}},de.forwardRef=function(E){return{$$typeof:h,render:E}},de.isValidElement=at,de.lazy=function(E){return{$$typeof:_,_payload:{_status:-1,_result:E},_init:St}},de.memo=function(E,G){return{$$typeof:x,type:E,compare:G===void 0?null:G}},de.startTransition=Vt,de.unstable_useCacheRefresh=function(){return Y.H.useCacheRefresh()},de.use=function(E){return Y.H.use(E)},de.useActionState=function(E,G,B){return Y.H.useActionState(E,G,B)},de.useCallback=function(E,G){return Y.H.useCallback(E,G)},de.useContext=function(E){return Y.H.useContext(E)},de.useDebugValue=function(){},de.useDeferredValue=function(E,G){return Y.H.useDeferredValue(E,G)},de.useEffect=function(E,G){return Y.H.useEffect(E,G)},de.useEffectEvent=function(E){return Y.H.useEffectEvent(E)},de.useId=function(){return Y.H.useId()},de.useImperativeHandle=function(E,G,B){return Y.H.useImperativeHandle(E,G,B)},de.useInsertionEffect=function(E,G){return Y.H.useInsertionEffect(E,G)},de.useLayoutEffect=function(E,G){return Y.H.useLayoutEffect(E,G)},de.useMemo=function(E,G){return Y.H.useMemo(E,G)},de.useOptimistic=function(E,G){return Y.H.useOptimistic(E,G)},de.useReducer=function(E,G,B){return Y.H.useReducer(E,G,B)},de.useRef=function(E){return Y.H.useRef(E)},de.useState=function(E){return Y.H.useState(E)},de.useSyncExternalStore=function(E,G,B){return Y.H.useSyncExternalStore(E,G,B)},de.useTransition=function(){return Y.H.useTransition()},de.version="19.3.1",de}var tv;function jA(){return tv||(tv=1,zh.exports=WA()),zh.exports}var ZA=jA();const ev={litPercent:"max",longestDarknessHours:"min",earthContactPercent:"max",longestBlackoutHours:"min"};function KA(o){const e={};for(const a of Object.keys(ev)){const s=o.map(u=>u[a]).filter(u=>u!==null&&Number.isFinite(u));s.length&&(e[a]=ev[a]==="max"?Math.max(...s):Math.min(...s))}return e}function nv(o,e){if(!o)return"No event in window";const a=Date.parse(o)-Date.parse(e);if(!Number.isFinite(a))return"Time unavailable";if(a<=0)return"Event passed";const s=Math.ceil(a/6e4),u=Math.floor(s/1440),f=Math.floor(s%1440/60),d=s%60;return`${u?`${u}d `:""}${f}h ${String(d).padStart(2,"0")}m`}function QA(o,e){const a=[{value:o.litPercent,limit:e.minLitPercent,bad:(f,d)=>f<d,reason:`Sunlit time below ${e.minLitPercent}%`},{value:o.earthContactPercent,limit:e.minEarthContactPercent,bad:(f,d)=>f<d,reason:`Earth contact below ${e.minEarthContactPercent}%`},{value:o.longestDarknessHours,limit:e.maxDarknessHours,bad:(f,d)=>f>d,reason:`Darkness exceeds ${e.maxDarknessHours} h`},{value:o.longestBlackoutHours,limit:e.maxBlackoutHours,bad:(f,d)=>f>d,reason:`Blackout exceeds ${e.maxBlackoutHours} h`}],s=a.filter(f=>f.value===null||!Number.isFinite(f.value)),u=a.filter(f=>f.value!==null&&Number.isFinite(f.value)&&f.bad(f.value,f.limit));return u.length>1?{status:"red",reason:u.map(f=>f.reason).join("; ")}:u.length===1?{status:"yellow",reason:u[0].reason}:s.length?{status:"yellow",reason:"Some metrics are unavailable"}:{status:"green",reason:"All four mission thresholds met"}}const JA=[{key:"litPercent",label:"Sunlit",unit:"%",digits:0},{key:"longestDarknessHours",label:"Longest darkness",unit:"h",digits:1},{key:"earthContactPercent",label:"Earth contact",unit:"%",digits:0},{key:"longestBlackoutHours",label:"Longest blackout",unit:"h",digits:1}];function fc(o,e=1){return o===null||!Number.isFinite(o)?"No data":o.toFixed(e)}function $A({site:o,timelineIso:e,thresholds:a,best:s}){const u=QA(o,a);return ve.jsxs("article",{className:"compare-card","aria-label":`${o.name} metrics`,children:[ve.jsxs("header",{className:"compare-card-head",children:[ve.jsx("h3",{children:o.name}),ve.jsx("span",{className:`compare-badge compare-badge-${u.status}`,title:u.reason,"aria-label":`${u.status} status: ${u.reason}`,tabIndex:0,children:u.status==="green"?"Within limits":u.status==="yellow"?"Review":"Outside limits"})]}),ve.jsxs("div",{className:"compare-solar",children:[ve.jsx("span",{children:"Solar elevation"}),ve.jsxs("strong",{children:[fc(o.solarElevationDeg),ve.jsx("small",{children:o.solarElevationDeg===null?"":"°"})]})]}),ve.jsxs("dl",{className:"compare-metrics",children:[JA.map(f=>{const d=o[f.key],h=d!==null&&Number.isFinite(d)&&d===s[f.key];return ve.jsxs("div",{className:`compare-metric ${h?"compare-best":""}`,children:[ve.jsx("dt",{children:f.label}),ve.jsxs("dd",{children:[fc(d,f.digits),d!==null&&Number.isFinite(d)&&ve.jsxs("span",{children:[" ",f.unit]}),h&&ve.jsx("small",{"aria-label":"Best among selected sites",children:"Best"})]})]},f.key)}),ve.jsxs("div",{className:"compare-metric compare-temperature",children:[ve.jsx("dt",{children:"Temperature range"}),ve.jsx("dd",{children:o.temperatureMinK!==null&&o.temperatureMaxK!==null&&Number.isFinite(o.temperatureMinK)&&Number.isFinite(o.temperatureMaxK)?ve.jsxs(ve.Fragment,{children:[fc(o.temperatureMinK,0),"–",fc(o.temperatureMaxK,0),ve.jsx("span",{children:" K"})]}):"No data"})]})]}),ve.jsxs("div",{className:"compare-events",children:[ve.jsxs("div",{children:[ve.jsx("span",{children:"Next sunset"}),ve.jsx("strong",{children:nv(o.nextSunsetIso,e)})]}),ve.jsxs("div",{children:[ve.jsx("span",{children:"Next Earthset"}),ve.jsx("strong",{children:nv(o.nextEarthsetIso,e)})]})]}),ve.jsx("p",{className:"compare-reason",children:u.reason})]})}function t2({sites:o,timelineIso:e,thresholds:a,loading:s=!1,error:u=null}){const f=ZA.useMemo(()=>KA(o),[o]);return s?ve.jsx("section",{className:"compare-state",role:"status",children:"Calculating site conditions…"}):u?ve.jsxs("section",{className:"compare-state compare-error",role:"alert",children:["Comparison unavailable: ",u]}):o.length?ve.jsxs("section",{className:"compare","aria-label":"Site comparison",children:[ve.jsxs("div",{className:"compare-heading",children:[ve.jsxs("div",{children:[ve.jsx("p",{children:"Site comparison"}),ve.jsx("h2",{children:"Which site works?"})]}),ve.jsxs("span",{children:[o.length," ",o.length===1?"site":"sites"," selected"]})]}),ve.jsx("div",{className:"compare-grid",children:o.map(d=>ve.jsx($A,{site:d,timelineIso:e,thresholds:a,best:f},d.id))}),ve.jsx("p",{className:"compare-note",children:"Temperature is a simplified equilibrium estimate with no thermal inertia. Earth contact assumes a DSN station can see the Moon and no relay is available. Best marks compare only selected sites."})]}):ve.jsx("section",{className:"compare-state",children:"Choose two or more sites to compare their conditions."})}const e2=[{id:"haworth",name:"Haworth",solarElevationDeg:2.8,litPercent:67,longestDarknessHours:39.5,earthContactPercent:91,longestBlackoutHours:4.2,temperatureMinK:88,temperatureMaxK:233,nextSunsetIso:"2026-11-16T04:00:00Z",nextEarthsetIso:"2026-11-15T18:00:00Z"},{id:"connecting-ridge",name:"Connecting Ridge",solarElevationDeg:5.6,litPercent:86,longestDarknessHours:13.2,earthContactPercent:79,longestBlackoutHours:11.7,temperatureMinK:104,temperatureMaxK:251,nextSunsetIso:"2026-11-17T10:00:00Z",nextEarthsetIso:"2026-11-15T21:00:00Z"},{id:"nobile-rim-1",name:"Nobile Rim 1",solarElevationDeg:4.1,litPercent:78,longestDarknessHours:18.4,earthContactPercent:86,longestBlackoutHours:7.1,temperatureMinK:96,temperatureMaxK:247,nextSunsetIso:"2026-11-16T17:00:00Z",nextEarthsetIso:"2026-11-16T01:00:00Z"}];function n2(){const[o,e]=Wr.useState("2026-11-14T12:00:00Z");return ht.createElement("main",{style:{minHeight:"100vh",background:"#111820",color:"#e8eeec",fontFamily:"Arial,sans-serif"}},ht.createElement("header",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem clamp(1rem,3vw,2.5rem)",borderBottom:"1px solid #52616b"}},ht.createElement("a",{href:"/",style:{color:"#e8eeec",textDecoration:"none",fontWeight:700}},"South Pole Navigator"),ht.createElement("a",{href:"/",style:{color:"#8bc4e8"}},"Landing page")),ht.createElement("div",{style:{padding:"1.5rem clamp(1rem,3vw,2.5rem) 0"}},ht.createElement("p",{style:{margin:"0 0 1rem",color:"#f0bd61"}},"Demo metrics · Not mission data"),ht.createElement("label",{htmlFor:"timeline",style:{display:"block",marginBottom:".5rem"}},"Timeline time (UTC)"),ht.createElement("input",{id:"timeline",type:"datetime-local",value:o.slice(0,16),onChange:a=>e(`${a.target.value}:00Z`),style:{padding:".65rem",color:"#e8eeec",background:"#202b33",border:"1px solid #80919b",colorScheme:"dark"}})),ht.createElement(t2,{sites:e2,timelineIso:o,thresholds:{minLitPercent:75,minEarthContactPercent:80,maxDarknessHours:20,maxBlackoutHours:8}}))}const i2=window.location.pathname==="/app"||window.location.pathname.startsWith("/app/")?ht.createElement(n2,null):ht.createElement(kA,null);bM.createRoot(document.getElementById("root")).render(i2);
