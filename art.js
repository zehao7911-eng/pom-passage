(function(){'use strict';const palettes=[{sky:'#a9d7bd',far:'#85baa4',sand:'#edbc79',stone:'#e6a74c',light:'#ffdc8a',shade:'#ba6b48',deep:'#893f45',accent:'#a54451',green:'#346b5c',water:'#4d9f95',cream:'#fff1cf'},{sky:'#c8d8c4',far:'#a5bdb0',sand:'#d7b9a6',stone:'#e3bdb3',light:'#fff0d3',shade:'#b7838e',deep:'#675167',accent:'#9a5770',green:'#4c7268',water:'#70a6a0',cream:'#fff2d9'},{sky:'#647d99',far:'#4c6482',sand:'#68828f',stone:'#9a899e',light:'#ddbf9f',shade:'#675f83',deep:'#343d66',accent:'#d89370',green:'#465876',water:'#68a8af',cream:'#ffe0ab'}];
const lerp=(a,b,t)=>a+(b-a)*t,clamp=Pom.clamp,smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)},ease=t=>1-Math.pow(1-clamp(t,0,1),3);
class PomArt{constructor(canvas){this.c=canvas;this.ctx=canvas.getContext('2d');this.time=0;this.q=.5;this.vel=0;this.fx=[];this.w=1;this.h=1;this.gentle=false;this.layout={};}
 resize(w,h){this.w=w;this.h=h;let d=Math.min(1.5,devicePixelRatio||1);this.c.width=Math.round(w*d);this.c.height=Math.round(h*d);this.d=d;this.ctx.setTransform(d,0,0,d,0,0);this.wide=w/h>1.6;this.lw=this.wide?960:600;this.lh=this.wide?460:800;this.scale=Math.min(w/this.lw,h/this.lh);this.ox=(w-this.lw*this.scale)/2;this.oy=(h-this.lh*this.scale)/2;this.layout=this.wide?{gx:635,gy:214,bx:300,by:300}:{gx:300,gy:275,bx:300,by:607};}
 point(x,y){return{x:(x-this.ox)/this.scale,y:(y-this.oy)/this.scale}}
 events(events){for(let e of events){if(e.type==='pass'){let p=this.layout;for(let i=0;i<30;i++)this.fx.push({x:p.gx,y:p.gy,vx:Math.cos(i*2.4)*70+(i%3-1)*15,vy:-80-Math.sin(i*1.7)*55,t:0,max:.8+(i%7)*.1,r:3+i%4,k:i%4})}if(e.type==='bonk'){let p=this.layout;for(let i=0;i<12;i++)this.fx.push({x:p.gx,y:p.gy,vx:(i-5.5)*20,vy:-50-i%3*20,t:0,max:.65,r:3+i%3,k:3})}}if(this.fx.length>80)this.fx.splice(0,this.fx.length-80)}
 poly(points,color){let c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill()}
 rect(x,y,w,h,col){let c=this.ctx;c.fillStyle=col;c.fillRect(x,y,w,h)}
 line(points,color,width=1){let c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.stroke()}
 ellipse(x,y,rx,ry,col){let c=this.ctx;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,Math.PI*2);c.fillStyle=col;c.fill()}
 arch(x,y,w,h,col){let c=this.ctx;c.beginPath();c.moveTo(x-w/2,y+h/2);c.lineTo(x-w/2,y);c.ellipse(x,y,w/2,h/2,0,Math.PI,Math.PI*2);c.lineTo(x+w/2,y+h/2);c.closePath();c.fillStyle=col;c.fill()}
 opening(a,x,y,k=1){let c=this.ctx,w=a.w*1.5*k,h=a.h*1.5*k;c.moveTo(x+w/2,y);if(a.kind==='diamond'){c.moveTo(x,y-h/2);c.lineTo(x+w/2,y);c.lineTo(x,y+h/2);c.lineTo(x-w/2,y);c.closePath()}else if(a.kind==='oval')c.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);else{c.moveTo(x-w/2,y+h/2);c.lineTo(x-w/2,y);c.ellipse(x,y,w/2,h/2,0,Math.PI,Math.PI*2);c.lineTo(x+w/2,y+h/2);c.closePath()}}
 cloud(x,y,s,p){let c=this.ctx;c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-65,9);c.bezierCurveTo(-55,-6,-39,-7,-29,-5);c.bezierCurveTo(-29,-31,2,-40,17,-19);c.bezierCurveTo(36,-28,53,-13,53,-3);c.bezierCurveTo(65,-7,77,1,82,9);c.closePath();c.fillStyle=p.cream;c.fill();c.restore()}
 palm(x,y,s,p,phase){let c=this.ctx;c.save();c.translate(x,y);c.scale(s,s);let sway=Math.sin(this.time*.55+phase)*.05;c.rotate(sway);this.poly([[-3,0],[3,0],[12,-107],[6,-110]],p.deep);for(let side of [-1,1])for(let i=0;i<4;i++){let yy=-108+i*7,xx=side*(45-i*6);this.poly([[8,yy],[xx*.4,yy-15],[xx,yy+5+i*7],[xx*.4,yy-1],[8,yy+6]],i%2?p.green:p.water)}c.restore()}
 window(x,y,w,h,p){this.arch(x,y,w,h,p.deep);this.rect(x-w*.5,y,w,h*.5,p.deep);this.rect(x-1,y-h*.35,2,h*.85,p.shade);this.line([[x-w*.5,y+h*.15],[x+w*.5,y+h*.15]],p.shade,2)}
 background(p,s){let c=this.ctx,W=this.lw,H=this.lh,t=this.time;this.rect(-200,-200,W+400,H+400,p.sky);
 this.ellipse(this.wide?810:460,100,37,37,p.cream);this.cloud(100+(t*2%900),90,.6,p);this.cloud(this.wide?760:465,170,.7,p);this.cloud(-20+(t*1.2%1100),45,.36,p);
 for(let i=0;i<7;i++){let x=i*(W/5)-90,y=this.wide?165:275;this.poly([[x-90,y+100],[x,y-15-(i%3)*25],[x+120,y+100]],p.far)}
 this.rect(-200,this.wide?260:420,W+400,H,p.sand);
 // Far city is quieter, with an original dome and a repeated arcade.
 let cityY=this.wide?225:380;for(let i=0;i<11;i++){let x=i*(W/8)-80,hh=45+(i*23%65);this.rect(x,cityY-hh,44,hh,p.far);this.arch(x+22,cityY-hh,44,27,p.far);for(let j=0;j<3;j++)this.rect(x+7+j*11,cityY-hh+12,4,8,p.sky)}
 this.rect(-50,cityY+2,W+100,8,p.light);for(let i=0;i<25;i++){let x=i*43-35;this.arch(x,cityY+25,25,25,p.shade);this.rect(x-12.5,cityY+25,25,18,p.shade)}this.rect(-50,cityY+44,W+100,7,p.shade);
 // Each district has its own skyline silhouettes, not only a recolour.
 if(s.level>=3&&s.level<6){for(let side of [-1,1]){let xx=this.wide?(side<0?145:825):(side<0?90:510),yy=cityY-12;this.rect(xx-48,yy-60,96,80,p.shade);this.poly([[xx-55,yy-60],[xx,yy-115],[xx+55,yy-60]],p.green);this.poly([[xx-48,yy-64],[xx,yy-106],[xx+48,yy-64]],p.sky);for(let k=-2;k<=2;k++)this.line([[xx,yy-106],[xx+k*19,yy-62]],p.green,2);for(let k=-2;k<=2;k++){this.arch(xx+k*18,yy-30,13,26,p.water);this.rect(xx+k*18-6.5,yy-30,13,28,p.water)}this.rect(xx-57,yy-66,114,5,p.light);this.ellipse(xx,yy-117,6,6,p.light);for(let k=0;k<4;k++){let fx=xx-30+k*20,fy=yy+12;this.rect(fx-1,fy-22,2,22,p.green);for(let j=0;j<5;j++)this.ellipse(fx+Math.cos(j*1.256)*5,fy-25+Math.sin(j*1.256)*5,4,4,p.accent);this.ellipse(fx,fy-25,3,3,p.cream)}}}
 if(s.level>=6){for(let side of [-1,1]){let xx=this.wide?(side<0?160:835):(side<0?85:515),yy=cityY-24;this.rect(xx-43,yy-67,86,94,p.deep);this.arch(xx,yy-63,86,74,p.shade);this.line([[xx-48,yy-65],[xx+48,yy-65]],p.light,4);for(let k=-1;k<=1;k++)this.window(xx+k*24,yy-20,13,33,p);this.ellipse(xx,yy-98,8,8,p.light);this.line([[xx,yy-98],[xx+18,yy-120]],p.light,2);this.poly([[xx+18,yy-126],[xx+24,yy-120],[xx+18,yy-114],[xx+12,yy-120]],p.cream)}for(let i=0;i<18;i++){let xx=(i*83+31)%W,yy=28+(i*37%155);this.poly([[xx,yy-2],[xx+1,yy],[xx,yy+3],[xx-1,yy]],p.cream)}this.ellipse(this.wide?823:473,94,31,31,p.sky);}
 // Neighbouring façades form a frame instead of leaving an empty sky.
 for(let side of [-1,1]){c.save();c.translate(side<0?-30:W+30,0);c.scale(side<0?1:-1,1);let base=this.wide?240:470;this.poly([[0,base],[0,20],[100,65],[117,base]],p.stone);this.poly([[88,60],[117,76],[117,base],[96,base]],p.shade);this.poly([[0,10],[92,53],[114,65],[96,74],[0,28]],p.light);for(let r=0;r<4;r++){let y=115+r*85;this.window(50,y,28,51,p);this.rect(13,y+31,83,6,p.light);for(let i=0;i<5;i++)this.rect(18+i*14,y+25,3,13,p.shade)}this.palm(40,base+70,.85,p,side);c.restore()}
 let {gx,gy,bx,by}=this.layout;let horizon=gy+105;
 this.poly([[gx-125,horizon],[gx+125,horizon],[bx+210,by+103],[bx-210,by+103]],p.shade);
 this.poly([[gx-112,horizon],[gx+112,horizon],[bx+190,by+93],[bx-190,by+93]],p.light);
 for(let i=0;i<9;i++){let z=i/9,yy=lerp(horizon,by+93,z*z);let xx=lerp(gx,bx,z*z),hw=lerp(112,190,z*z);this.line([[xx-hw,yy],[xx+hw,yy]],p.stone,1.2)}
 this.line([[gx,gy+115],[bx,by+90]],p.stone,1);
 // Low balustrades; their repetition creates scale while leaving the route legible.
 for(let side of [-1,1]){for(let i=0;i<7;i++){let z=i/6,xx=lerp(gx+side*135,bx+side*212,z),yy=lerp(horizon,by+85,z),hh=lerp(17,34,z);this.rect(xx-3,yy-hh,6,hh,p.shade);this.ellipse(xx,yy-hh-3,5,4,p.deep)}this.line([[gx+side*135,horizon-23],[bx+side*212,by+46]],p.deep,5);}
 this.ellipse(bx,by+93,126,18,p.shade);this.ellipse(bx,by+86,126,15,p.light);this.ellipse(bx,by+84,108,10,p.stone);
 // A small water channel and paper boats, outside the action corridor.
 let wy=this.wide?365:704;this.poly([[-150,wy],[bx-210,wy-15],[bx-220,H+100],[-150,H+100]],p.water);for(let i=0;i<6;i++){let yy=wy+15+i*18,xx=-40+(i*43%160);this.line([[xx,yy],[xx+36,yy]],p.sky,2)}let boatx=30+Math.sin(t*.2)*12;this.poly([[boatx-20,wy+45],[boatx+24,wy+45],[boatx+9,wy+58],[boatx-9,wy+58]],p.cream);this.poly([[boatx,wy+42],[boatx,wy+11],[boatx+19,wy+42]],p.light);
 for(let i=0;i<4;i++){let x=W-55-(i%2)*30,y=(this.wide?340:700)+(i>1?35:0);this.rect(x-10,y,20,19,p.deep);this.ellipse(x,y,12,4,p.shade);for(let j=0;j<3;j++)this.poly([[x,y],[x-25+j*15,y-32-(j%2)*9],[x+2,y-8]],j%2?p.water:p.green)}
 // Flags and birds are slow decorative motion, not moving hitboxes.
 for(let side of [-1,1]){let x=gx+side*210,fy=gy-93;this.line([[x,fy-40],[x,fy+87]],p.deep,3);let wave=Math.sin(t*1.5+side)*6;this.poly([[x,fy-35],[x+side*43,fy-27+wave],[x+side*38,fy+20+wave],[x,fy+11]],p.accent);this.line([[x+side*12,fy-29],[x+side*10,fy+9]],p.light,1)}
 for(let i=0;i<5;i++){let x=(t*9+i*117)%(W+180)-90,y=72+i%2*14+Math.sin(t*.8+i)*5;this.line([[x-4,y],[x,y-2-Math.sin(t*4+i)*2],[x+4,y]],p.green,1.2)}
 }
 gate(g,p,pass,bonk){let c=this.ctx,{gx:x,gy:y}=this.layout;let w=360,h=360,top=y-200,bottom=y+185;
 // Multiple hard planes, narrow seams, rosette, and restrained ceramic inlays.
 this.poly([[x-w/2-12,bottom],[x-w/2-12,top+24],[x+w/2+15,top+3],[x+w/2+15,bottom]],p.shade);
 this.arch(x,y-33,w,330,p.stone);this.rect(x-w/2,y-32,w,bottom-y+32,p.stone);
 this.arch(x,y-33,w-23,307,p.light);this.rect(x-w/2+11.5,y-32,w-23,bottom-y+32,p.light);
 this.arch(x,y-28,w-43,290,p.stone);this.rect(x-w/2+21.5,y-28,w-43,bottom-y+28,p.stone);
 for(let side of [-1,1]){this.rect(x+side*157-10,y-55,20,240,p.shade);this.rect(x+side*157-8,y-55,11,240,p.light);this.rect(x+side*157-15,y-59,30,9,p.deep);this.rect(x+side*157-15,bottom-13,30,9,p.deep);for(let j=0;j<6;j++)this.rect(x+side*157-9,y-23+j*22,18,1,p.shade)}
 for(let i=0;i<9;i++){let a=Math.PI+(i+.5)*Math.PI/9,xx=x+Math.cos(a)*167,yy=y-30+Math.sin(a)*155;c.save();c.translate(xx,yy);c.rotate(a+Math.PI/2);this.rect(-1,-9,2,18,p.shade);c.restore()}
 for(let side of [-1,1]){let rx=x+side*92,ry=y-105;this.ellipse(rx,ry,10,10,p.shade);this.poly([[rx,ry-7],[rx+5,ry],[rx,ry+7],[rx-5,ry]],p.light)}
 let a=g.frames[0],inner={...a,w:Math.max(...g.frames.map(f=>f.w)),h:Math.max(...g.frames.map(f=>f.h))};
 c.save();c.beginPath();this.opening(inner,x,y,1.08);c.fillStyle=p.deep;c.fill();c.clip();this.rect(x-150,y-150,300,300,p.deep);for(let i=0;i<5;i++){this.arch(x,y-22+i*10,100-i*11,120-i*14,i%2?p.green:p.shade)}this.ellipse(x,y+34,29,5,p.light);this.poly([[x-13,y+19],[x+13,y+19],[x+13,y+35],[x-13,y+35]],p.cream);this.line([[x-13,y+19],[x,y+28],[x+13,y+19]],p.shade,1.5);c.restore();
 for(let i=g.frames.length-1;i>=0;i--){let f=g.frames[i];c.beginPath();this.opening(f,x,y,1.04+i*.05);c.strokeStyle=i?p.water:(bonk?'#a43d40':pass?'#327861':p.shade);c.lineWidth=i?5:5;c.stroke();c.beginPath();this.opening(f,x,y,1);c.strokeStyle=pass?'#d9ecc3':p.light;c.lineWidth=2;c.stroke()}
 this.rect(x-w/2-8,bottom,w+16,8,p.shade);this.rect(x-w/2-16,bottom+8,w+32,8,p.light);this.rect(x-w/2-22,bottom+16,w+44,7,p.shade);
 for(let side of [-1,1]){let xx=x+side*95;this.ellipse(xx,y+112,8,8,p.shade);this.poly([[xx,y+105],[xx+5,y+112],[xx,y+119],[xx-5,y+112]],p.light)}
 }
 body(x,y,q,scale,p,skin,face=0,tuck=0,alpha=1){let c=this.ctx,b=Pom.size(q),w=b.w*1.5,h=b.h*1.5,t=this.time;c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(scale,scale);let body=['#fff1be','#d9efd4','#e7d8ed'][skin],fold=['#e0ac73','#98b5a0','#b59cc8'][skin];
 this.ellipse(4,h/2+13,w*.43,6,'#574b4330');
 // Appendages fold inward before contact; the passing silhouette is the ellipse.
 let extend=1-tuck;for(let side of [-1,1]){this.ellipse(side*w*.25,h/2+extend*9,8*extend+.01,5*extend+.01,p.deep);c.save();c.translate(side*w*.42,h*.10);c.rotate(side*(.6+Math.sin(t*4)*.12));this.ellipse(0,6,8*extend+.01,19*extend+.01,fold);c.restore()}
 this.ellipse(0,0,w/2,h/2,fold);this.ellipse(-w*.025,-h*.018,w*.47,h*.47,body);
 c.save();c.beginPath();c.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);c.clip();this.poly([[-w/2,0],[-w*.1,h*.29],[w/2,h*.12],[w*.18,h/2],[-w/2,h/2]],fold);this.poly([[-w*.48,-h*.08],[-w*.30,-h*.32],[-w*.12,-h*.41],[-w*.28,-h*.12]],'#fff9df80');this.line([[-w*.3,h*.12],[0,h*.29],[w*.3,h*.12]],p.shade,1.1);for(let i=0;i<3;i++){let xx=(i-1)*w*.18;this.line([[xx,h*.38],[xx+w*.08,h*.32]],'#fff9df70',1.2)}c.restore();
 let ey=-h*.13,ex=Math.min(17,w*.18),blink=Math.sin(t*1.6)> .992;
 for(let side of [-1,1]){if(blink||face===2)this.line([[side*ex-4,ey],[side*ex+4,ey]],p.deep,2.5);else{this.ellipse(side*ex,ey,3.3,4.8,p.deep);this.ellipse(side*ex-.8,ey-1.7,1.1,1.4,p.cream)}this.ellipse(side*(ex+8),ey+11,6.5,3.4,'#d47d6870')}
 c.beginPath();if(face===1){c.arc(0,ey+14,4,0,Math.PI*2)}else{c.moveTo(-5,ey+13);c.quadraticCurveTo(0,ey+(face===2?11:21),5,ey+13)}c.strokeStyle=p.deep;c.lineWidth=2;c.stroke();
 // Small folded letter rides within the same deformable silhouette.
 let ew=Math.min(34,w*.42),eh=Math.min(22,h*.26),yy=h*.24;this.rect(-ew/2,yy-eh/2,ew,eh,p.cream);this.line([[-ew/2,yy-eh/2],[0,yy+2],[ew/2,yy-eh/2]],p.shade,1.5);this.ellipse(0,yy+2,3,3,p.accent);
 c.restore();}
 draw(s,profile,dt=0){let c=this.ctx;this.gentle=profile.gentle;let dtime=profile.gentle?dt*.45:dt;this.time+=dtime;let target=s.pending?s.pending.q:s.q;if(!dt){this.q=target;this.vel=0}else{this.vel+=(target-this.q)*150*dt;this.vel*=Math.exp(-15*dt);this.q=clamp(this.q+this.vel*dt,0,1)}
 for(let f of this.fx){f.t+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=100*dt}this.fx=this.fx.filter(f=>f.t<f.max);
 c.setTransform(this.d,0,0,this.d,0,0);let p=palettes[Pom.levels[s.level].district];this.rect(0,0,this.w,this.h,p.sky);c.save();c.translate(this.ox,this.oy);c.scale(this.scale,this.scale);this.background(p,s);
 let g=Pom.levels[s.level].gates[Math.min(s.gate,2)],{gx,gy,bx,by}=this.layout,pending=s.pending,t=pending?.t||0,pass=Pom.fit(s.q,g),bonk=pending&&!pending.success&&t>=.68;let flight=s.phase==='flight',arrive=flight?smooth(t/.68):0,ret=bonk?smooth((t-.68)/.54):0;
 let groundedY=by+70-Pom.size(this.q).h*.75;let x=lerp(bx,gx,arrive*(1-ret)),y=lerp(groundedY,gy,arrive*(1-ret)),sc=1;if(flight&&!pending.success)sc=1-.12*Math.sin(Math.min(t/.68,1)*Math.PI);if(flight&&pending.success&&t>.68)sc=1-ease((t-.68)/.8)*.82;
 if(flight&&pending.success&&t>=.68){this.gate(g,p,pass,false);c.save();c.beginPath();this.opening(g.frames[0],gx,gy);c.clip();this.body(x,y-30*ease((t-.68)/.8),this.q,sc,p,profile.skin,2,1,1-smooth((t-1.05)/.38));c.restore();}
 else{this.gate(g,p,pass,bonk);if(s.phase!=='won'){// A restrained fitting projection is a readable affordance, not an automatic solution.
 c.save();c.globalAlpha=.14;this.body(gx,gy,this.q,1,p,profile.skin,0,1);c.restore();
 let tilt=bonk?Math.sin((t-.68)*35)*.035*(1-ret):0;c.save();c.translate(x,y);c.rotate(tilt);this.body(0,0,this.q,sc,p,profile.skin,bonk?1:0,smooth(t/.55),1);c.restore();}}
 // Compact shape-direction cues live next to Pom, not on the doorway.
 if(s.phase==='shape'){let b=Pom.size(this.q),yy=by+111;if(!pass){let direction=Pom.guidance(s.q,g);let sign=direction.startsWith('STRETCH')?-1:1;this.line([[bx-5,yy+sign*6],[bx,yy+sign*12],[bx+5,yy+sign*6]],p.deep,1.5);this.line([[bx,yy],[bx,yy+sign*12]],p.deep,1.5)}else{this.ellipse(bx,by+110,4,4,p.green)}}
 for(let f of this.fx){c.save();c.globalAlpha=Math.max(0,1-f.t/f.max);c.translate(f.x,f.y);c.rotate(f.t*3);if(f.k===0)this.poly([[0,-f.r],[f.r*.6,0],[0,f.r],[-f.r*.6,0]],p.cream);else this.rect(-f.r/2,-f.r,f.r,f.r*2,[p.light,p.water,p.accent,p.shade][f.k]);c.restore()}
 c.restore();}
}
window.PomArt=PomArt;
})();
