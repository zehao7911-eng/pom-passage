(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Pom=factory()})(this,function(){'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),copy=o=>JSON.parse(JSON.stringify(o));
const names=['A Letter for the Sun','The Long Arcade','Apricot Avenue','The Petal Embassy','The Moon Garden','The Glasshouse Post','The Double Colonnade','Two Windows, One Wish','The Last Little Letter'];
const targets=[[.20,.78,.48],[.88,.15,.63],[.35,.82,.10],[.73,.28,.54],[.12,.90,.39],[.62,.18,.82],[.25,.77,.46],[.87,.34,.13],[.55,.21,.80]];
const seals=['sun','leaf','bird','flower','moon','butterfly','shell','star','letter'];
function size(q){let h=78*Math.exp((clamp(q,0,1)-.5)*1.65);return{w:78*78/h,h}}
function aperture(q,kind,pad){let b=size(q);return{w:b.w*pad,h:b.h*pad,kind}}
function inside(q,a){let b=size(q);if(a.kind==='diamond')return Math.hypot(b.w/a.w,b.h/a.h)<=1+1e-9;return b.w<=a.w+1e-9&&b.h<=a.h+1e-9}
const levels=targets.map((qs,i)=>({name:names[i],district:Math.floor(i/3),seal:seals[i],gates:qs.map((q,j)=>{let kind=i<3?'arch':i<6?(j===1?'diamond':'oval'):(j===1?'diamond':'arch'),p=kind==='diamond'?1.64:1.16;let frames=[aperture(q,kind,p)];if(i>=6)frames.push(aperture(clamp(q+(j%2?.035:-.035),.05,.95),kind,p-.02));return{q,frames,mark:j}})}));
function fit(q,g){return g.frames.every(a=>inside(q,a))}
function clearance(q,g){let b=size(q);return Math.min(...g.frames.map(a=>a.kind==='diamond'?1-Math.hypot(b.w/a.w,b.h/a.h):Math.min(1-b.w/a.w,1-b.h/a.h)))}
function guidance(q,g){let valid=[];for(let i=0;i<=1000;i++)if(fit(i/1000,g))valid.push(i/1000);if(!valid.length)return'RETRY';return q<valid[0]?'STRETCH A LITTLE':'SQUASH A LITTLE'}
function make(level=0){level=clamp(Math.floor(level)||0,0,8);return{version:1,level,gate:0,q:.5,time:0,phase:'shape',attempts:0,bonks:0,perfect:0,stamps:[],pending:null,events:[],last:null}}
function shape(s,q){if(s.phase!=='shape'||!Number.isFinite(q))return false;s.q=clamp(q,0,1);s.events=[{type:'shape'}];return true}
function send(s){if(s.phase!=='shape')return false;let g=levels[s.level].gates[s.gate];s.attempts++;s.phase='flight';s.pending={t:0,q:s.q,success:fit(s.q,g),perfect:Math.abs(s.q-g.q)<.085,announced:false};s.events=[{type:'send'}];return true}
function step(s,dt){s.events=[];if(!Number.isFinite(dt)||dt<0)return;dt=Math.min(dt,.1);s.time+=dt;if(s.phase!=='flight')return;let p=s.pending;p.t+=dt;if(!p.announced&&p.t>=.68){p.announced=true;s.events.push({type:p.success?'pass':'bonk',perfect:p.perfect});}
 if(p.t<(p.success?1.48:1.22))return;s.last={success:p.success,perfect:p.perfect,q:p.q};if(p.success){s.stamps.push({gate:s.gate,perfect:p.perfect});if(p.perfect)s.perfect++;s.gate++;s.phase=s.gate===3?'won':'shape';s.events.push({type:s.phase==='won'?'won':'next'});}else{s.bonks++;s.phase='shape';s.events.push({type:'retry',text:guidance(s.q,levels[s.level].gates[s.gate])});}s.pending=null;
}
function stars(s){return s.phase==='won'?1+(s.bonks<=2?1:0)+(s.perfect===3?1:0):0}
function profile(v={}){let best=Array.from({length:9},(_,i)=>clamp(Math.floor(v.best?.[i])||0,0,3)),cleared=0;while(cleared<9&&best[cleared]>0)cleared++;let total=best.reduce((a,b)=>a+b,0);return{best,cleared,skin:clamp(Math.floor(v.skin)||0,0,total>=18?2:total>=6?1:0),sound:v.sound!==false,gentle:v.gentle===true}}
function award(p,s){if(s.phase!=='won'||s.level>p.cleared)return false;let n=stars(s),old=p.best[s.level];p.best[s.level]=Math.max(old,n);while(p.cleared<9&&p.best[p.cleared]>0)p.cleared++;return old===0}
function restore(v,p){try{if(!v||v.version!==1||!Number.isInteger(v.level)||v.level<0||v.level>Math.min(8,p.cleared))return null;let s=make(v.level);if(!Number.isInteger(v.gate)||v.gate<0||v.gate>3||!Number.isFinite(v.q)||v.q<0||v.q>1||!Number.isFinite(v.time)||v.time<0)return null;s.gate=v.gate;s.q=v.q;s.time=Math.min(v.time,1e6);for(let k of ['attempts','bonks','perfect']){if(!Number.isInteger(v[k])||v[k]<0||v[k]>100000)return null;s[k]=v[k]}if(s.perfect>s.gate||s.attempts<s.gate||s.bonks>s.attempts)return null;if(!Array.isArray(v.stamps)||v.stamps.length!==s.gate)return null;s.stamps=v.stamps.map((x,i)=>({gate:i,perfect:x.perfect===true}));s.phase=s.gate===3?'won':'shape';s.last=v.last&&typeof v.last.success==='boolean'?{success:v.last.success,perfect:v.last.perfect===true,q:clamp(+v.last.q||0,0,1)}:null;if(v.pending){let t=v.pending.t;if(s.gate===3||!Number.isFinite(t)||t<0||t>=1.5||!Number.isFinite(v.pending.q)||Math.abs(v.pending.q-s.q)>1e-8)return null;send(s);s.attempts--;s.pending.t=t;s.pending.announced=t>=.68;}s.events=[];return s}catch(_){return null}}
function view(s){let b=size(s.q),p=s.pending;return{...b,t:p?p.t:0,success:p?.success||false,perfect:p?.perfect||false,phase:s.phase}}
return{clamp,copy,size,levels,inside,fit,clearance,guidance,make,shape,send,step,stars,profile,award,restore,view};
});
