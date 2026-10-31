(function(){'use strict';
const P=PomArt.prototype,old={background:P.background,gate:P.gate,body:P.body,draw:P.draw,resize:P.resize};
const files=['sun-city','petal-city','evening-city','sun-wide','petal-wide','evening-wide','pom-parts','portal-facade'];
let images=[],rects=[],state='loading',attempt=0;
function load(){let id=++attempt;state='loading';let pack=files.map(n=>new Promise((resolve,reject)=>{let im=new Image(),timer=setTimeout(()=>{im.src='';reject(Error('Image timeout'))},12000);im.onload=()=>{clearTimeout(timer);resolve(im)};im.onerror=()=>{clearTimeout(timer);reject(Error('Image unavailable'))};im.src='assets/v2/'+n+'-v2.webp'}));
Promise.all([...pack,fetch('assets/v2/atlas.json').then(r=>{if(!r.ok)throw Error('Atlas unavailable');return r.json()})]).then(all=>{if(id!==attempt)return;rects=all.pop();images=all;state='ready'}).catch(()=>{if(id===attempt)state='fallback'});}
load();window.PomImages={retry:load,get state(){return state}};
P.resize=function(w,h){old.resize.call(this,w,h);if(this.illustrated)this.imageLayout()};
P.imageLayout=function(){this.unit=this.wide?1:1.3;this.layout=this.wide?{gx:665,gy:214,bx:280,by:300}:{gx:300,gy:320,bx:300,by:607}};
P.draw=function(s,p,dt){if(state==='ready'&&!this.illustrated&&s.phase!=='flight'){this.illustrated=true;this.imageLayout()}if(!this.illustrated)this.unit=1.5;old.draw.call(this,s,p,dt)};
P.sprite=function(i,x,y,w,h){let r=rects[i];this.ctx.drawImage(images[6],...r,x,y,w,h)};
P.background=function(p,s){if(!this.illustrated)return old.background.call(this,p,s);let c=this.ctx,d=Pom.levels[s.level].district;this.district=d;c.drawImage(images[d+(this.wide?3:0)],0,0,this.lw,this.lh);
// Ambient details stay outside the path; the still illustration does not drift under the puzzle.
let t=this.time;for(let i=0;i<8;i++){let x=(i*149+t*(d===1?8:5))%this.lw,y=(this.wide?45:70)+(i*39)%100+Math.sin(t*.5+i)*7;c.globalAlpha=d===2?.65:.27;this.ellipse(x,y,d===1?2.5:1.2,d===1?1.3:1.2,d===2?'#ffdf9a':'#fff4d3')}c.globalAlpha=1;
for(let side of [-1,1])for(let i=0;i<6;i++){let x=this.wide?55+i*13+(side>0?735:0):15+i*10+(side>0?495:0),y=(this.wide?410:735)+Math.sin(t*1.3+i)*3+i%3*7;c.globalAlpha=.18;this.line([[x,y],[x+9+Math.sin(t+i)*4,y]],'#fff5cf',1)}c.globalAlpha=1;};
P.gate=function(g,p,pass,bonk){if(!this.illustrated)return old.gate.call(this,g,p,pass,bonk);let c=this.ctx,{gx:x,gy:y}=this.layout,k=this.wide?.77:1,w=420*k,h=525*k;
// Cache a facade with a real transparent aperture, using the model's same path.
let key=JSON.stringify(g.frames)+':'+this.unit;
if(this.portalKey!==key){let layer=document.createElement('canvas');layer.width=Math.ceil(w*2);layer.height=Math.ceil(h*2);let lc=layer.getContext('2d');lc.scale(2,2);lc.drawImage(images[7],0,0,w,h);lc.globalCompositeOperation='destination-out';let saved=this.ctx;this.ctx=lc;lc.beginPath();let f={...g.frames[0],w:Math.max(...g.frames.map(a=>a.w)),h:Math.max(...g.frames.map(a=>a.h))};this.opening(f,w/2,h/2,1.08);lc.fill();this.ctx=saved;this.portal=layer;this.portalKey=key;}
c.save();c.beginPath();let f={...g.frames[0],w:Math.max(...g.frames.map(a=>a.w)),h:Math.max(...g.frames.map(a=>a.h))};this.opening(f,x,y,1.08);c.clip();this.rect(x-180,y-180,360,360,p.deep);c.globalAlpha=.38;c.drawImage(images[this.district],120,100,700,850,x-165,y-180,330,360);c.globalAlpha=1;let glow=c.createRadialGradient(x,y+50,1,x,y+50,130);glow.addColorStop(0,'#fbd7a949');glow.addColorStop(1,'#fbd7a900');c.fillStyle=glow;c.fillRect(x-150,y-150,300,300);this.sprite(4,x-19,y+20,38,26);c.restore();
c.save();if(this.district===2)c.filter='brightness(.74) saturate(.7)';else if(this.district===1)c.filter='saturate(.75)';c.drawImage(this.portal,x-w/2,y-h/2,w,h);c.restore();
for(let i=g.frames.length-1;i>=0;i--){c.beginPath();this.opening(g.frames[i],x,y,1.02+i*.035);c.strokeStyle=i?'#77bcb7':bonk?'#b14d4e':pass?'#3e9074':'#8c5a43';c.lineWidth=i?5:4;c.stroke();c.beginPath();this.opening(g.frames[i],x,y);c.lineWidth=1.5;c.strokeStyle=pass?'#e0f5ce':'#ffe5ac';c.stroke();}
};
P.body=function(x,y,q,scale,p,skin,face=0,tuck=0,alpha=1){if(!this.illustrated)return old.body.call(this,x,y,q,scale,p,skin,face,tuck,alpha);let c=this.ctx,b=Pom.size(q),w=b.w*this.unit,h=b.h*this.unit,ext=1-tuck;c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(scale,scale);this.ellipse(2,h/2+13,w*.4,6,'#403d3e30');
if(ext>.01){this.sprite(7,-Math.min(27,w*.32),h/2-3,Math.min(54,w*.64),18*ext);for(let side of [-1,1]){c.save();c.translate(side*w*.43,h*.05);c.rotate(side*(.14+Math.sin(this.time*3)*.05));this.sprite(side<0?5:6,side<0?-14*ext:0,0,14*ext,29*ext);c.restore()}}
c.save();c.beginPath();c.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);c.clip();this.ellipse(0,0,w/2,h/2,'#f5dda5');this.sprite(0,-w/2,-h/2,w,h);if(skin){c.globalAlpha*=.28;c.globalCompositeOperation='source-atop';this.ellipse(0,0,w/2,h/2,skin===1?'#8ed6a9':'#c59cde')}c.restore();
let fw=Math.min(59,w*.67,h*.95),fh=fw*.41,blink=Math.sin(this.time*1.6)>.992;this.sprite(face===1?3:face===2||blink?2:1,-fw/2,-h*.14-fh/2,fw,fh);
let ew=Math.min(34,w*.43),eh=Math.min(23,h*.24);this.sprite(4,-ew/2,h*.25-eh/2,ew,eh);c.restore();};
})();
