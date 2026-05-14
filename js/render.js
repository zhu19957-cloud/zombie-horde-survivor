// ==================== RENDERING ====================
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
window.addEventListener('resize',resize);resize();
function render(){
ctx.clearRect(0,0,canvas.width,canvas.height);
if(!G||(screen!=='inGame'&&screen!=='levelUp'&&screen!=='pause'))return;
const camX=G.px-canvas.width/2,camY=G.py-canvas.height/2;
let sx=0,sy=0;if(G.screenShake>0){sx=rand(-G.shakeIntensity,G.shakeIntensity);sy=rand(-G.shakeIntensity,G.shakeIntensity)}
ctx.save();ctx.translate(-camX+sx,-camY+sy);
renderGround();renderHazards();renderFrozenTrail();
// Poison clouds from boss
if(G.boss&&G.boss.poisonClouds)for(const c of G.boss.poisonClouds){ctx.fillStyle=`rgba(42,61,26,${0.3*(c.lifetime/4)})`;ctx.beginPath();ctx.arc(c.x,c.y,c.radius,0,Math.PI*2);ctx.fill()}
renderXPOrbs();renderFieldPowerUp();renderEnemies();renderProjectiles();renderPlayer();renderOrbitalShield();renderParticles();
ctx.restore();
renderHUD();
if(G.bossSpawned&&G.boss&&!G.bossDefeated)renderBossHP();
if(G.screenFlash>0){ctx.fillStyle=G.flashColor;ctx.globalAlpha=G.screenFlash;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1}
// Vignette when low HP
if(G.hp/G.maxHP<0.3){const int=1-(G.hp/G.maxHP)/0.3;const grad=ctx.createRadialGradient(canvas.width/2,canvas.height/2,canvas.width*0.3,canvas.width/2,canvas.height/2,canvas.width*0.7);grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,`rgba(100,0,0,${int*0.4})`);ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height)}
}

function renderGround(){
const camX=G.px-canvas.width/2,camY=G.py-canvas.height/2;
ctx.fillStyle='#1a1a1a';ctx.fillRect(camX,camY,canvas.width,canvas.height);
// Grid
ctx.strokeStyle='#222';ctx.lineWidth=1;
const gs=64;const sx2=Math.floor(camX/gs)*gs,sy2=Math.floor(camY/gs)*gs;
for(let x=sx2;x<camX+canvas.width;x+=gs){ctx.beginPath();ctx.moveTo(x,camY);ctx.lineTo(x,camY+canvas.height);ctx.stroke()}
for(let y=sy2;y<camY+canvas.height;y+=gs){ctx.beginPath();ctx.moveTo(camX,y);ctx.lineTo(camX+canvas.width,y);ctx.stroke()}
// Arena border
ctx.strokeStyle='#333';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,ARENA_R,0,Math.PI*2);ctx.stroke()
}

function renderHazards(){
for(const h of G.hazards){
if(h.warningTimer>0){
const pulse=0.5+0.5*Math.sin(Date.now()/250);
if(h.type==='ember'){ctx.strokeStyle=`rgba(255,140,0,${0.3+0.3*pulse})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
else if(h.type==='toxic'){ctx.strokeStyle=`rgba(80,200,80,${0.3+0.3*pulse})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
else if(h.type==='spike'){ctx.strokeStyle=`rgba(150,150,150,${0.3+0.3*pulse})`;ctx.lineWidth=2;ctx.strokeRect(h.x-h.radius,h.y-h.radius,h.radius*2,h.radius*2)}
else if(h.type==='lightning'){ctx.strokeStyle=`rgba(255,255,68,${0.3+0.3*pulse})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
else if(h.type==='void'){ctx.strokeStyle=`rgba(80,0,120,${0.3+0.3*pulse})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
}else{
if(h.type==='ember'){ctx.fillStyle='rgba(255,100,0,0.25)';ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,100,0,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
else if(h.type==='toxic'){ctx.fillStyle='rgba(80,200,80,0.2)';ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(80,200,80,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
else if(h.type==='spike'){ctx.fillStyle='rgba(150,150,150,0.4)';ctx.fillRect(h.x-h.radius,h.y-h.radius,h.radius*2,h.radius*2)}
else if(h.type==='lightning'){ctx.fillStyle='rgba(255,255,68,0.4)';ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.fill()}
else if(h.type==='void'){ctx.fillStyle='rgba(80,0,120,0.25)';ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(80,0,120,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(h.x,h.y,h.radius,0,Math.PI*2);ctx.stroke()}
}
}
}

function renderFrozenTrail(){for(const seg of G.frozenTrailSegs){ctx.fillStyle='rgba(136,204,255,0.25)';ctx.beginPath();ctx.arc(seg.x,seg.y,10,0,Math.PI*2);ctx.fill()}}
function renderXPOrbs(){ctx.fillStyle='#44ff44';for(const orb of G.xpOrbs){ctx.globalAlpha=0.8;ctx.beginPath();ctx.arc(orb.x,orb.y,3,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}

function renderFieldPowerUp(){
if(!G.fieldPowerUp)return;const pu=G.fieldPowerUp;
const by=pu.y+Math.sin(pu.bobPhase*4)*3;
const flicker=pu.despawnTimer<5?0.5+0.5*Math.sin(Date.now()/125):1;
ctx.globalAlpha=flicker;ctx.fillStyle=pu.type.color;ctx.beginPath();ctx.arc(pu.x,by,12,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(pu.type.icon,pu.x,by+4);
ctx.globalAlpha=1
}

function renderEnemies(){
const camX=G.px-canvas.width/2,camY=G.py-canvas.height/2;
const vis=G.enemies.filter(e=>!e.dead&&e.x-camX>-50&&e.x-camX<canvas.width+50&&e.y-camY>-50&&e.y-camY<canvas.height+50);
vis.sort((a,b)=>a.y-b.y);
for(const e of vis){
if(e.previewTimer>0){ctx.globalAlpha=0.3;ctx.fillStyle='#222';ctx.beginPath();ctx.arc(e.x,e.y,e.size/2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;continue}
if(e.frozenTimer>0){ctx.fillStyle='#88ccff44';ctx.beginPath();ctx.arc(e.x,e.y,e.size/2+3,0,Math.PI*2);ctx.fill()}
const size=(e.hp/e.maxHp<0.3)?e.size*0.85:e.size;
const fa=e.fadeIn>0?1-(e.fadeIn/0.3):1;ctx.globalAlpha=fa;
ctx.fillStyle=e.flashTimer>0?'#fff':e.color;ctx.beginPath();ctx.arc(e.x,e.y,size/2,0,Math.PI*2);ctx.fill();
ctx.strokeStyle=e.flashTimer>0?'#fff':e.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,size/2+1,0,Math.PI*2);ctx.stroke();
if(e.special&&!e.isBoss){ctx.strokeStyle='#ffffff44';ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,size/2+3,0,Math.PI*2);ctx.stroke()}
// Elite glow
if(e.isElite){ctx.strokeStyle='#ff880088';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,size/2+4,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#ff880044';ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,size/2+6,0,Math.PI*2);ctx.stroke()}
// Shielder arc
if(e.type==='shielder'&&!e.isBoss){ctx.strokeStyle='#88888866';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,size/2+1,e.facing-Math.PI/2,e.facing+Math.PI/2);ctx.stroke()}
// Healer pulse
if(e.type==='healer'&&e.healPulseTimer>1.5){ctx.strokeStyle='#4a7c7c44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,80*(1-(e.healPulseTimer-1.5)/0.5),0,Math.PI*2);ctx.stroke()}
// Burn indicator
if(e.burnTimer>0){ctx.fillStyle=`rgba(255,140,0,${0.2*Math.random()})`;ctx.beginPath();ctx.arc(e.x,e.y,size/2+2,0,Math.PI*2);ctx.fill()}
ctx.globalAlpha=1;
// HP bar for non-boss damaged enemies
if(!e.isBoss&&e.hp<e.maxHp){const bw=e.size+8,bh=3,bx=e.x-bw/2,by2=e.y+e.size/2+4;
ctx.fillStyle='#333';ctx.fillRect(bx,by2,bw,bh);ctx.fillStyle='#cc3333';ctx.fillRect(bx,by2,bw*Math.max(0,e.hp/e.maxHp),bh)}
// Boss HP bar
if(e.isBoss){const bw=e.size+10,bh=4,bx=e.x-bw/2,by2=e.y+e.size/2+6;
ctx.fillStyle='#333';ctx.fillRect(bx,by2,bw,bh);ctx.fillStyle='#cc3333';ctx.fillRect(bx,by2,bw*Math.max(0,e.hp/e.maxHp),bh)}
}
}

function renderProjectiles(){
for(const p of G.projectiles){
if(p.trail&&p.trail.length>1){
ctx.strokeStyle=p.owner==='player'?'rgba(255,204,0,0.3)':'rgba(255,68,68,0.3)';
ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.trail[0].x,p.trail[0].y);
for(let i=1;i<p.trail.length;i++)ctx.lineTo(p.trail[i].x,p.trail[i].y);ctx.stroke()}
ctx.shadowBlur=p.owner==='player'?8:6;
ctx.shadowColor=p.owner==='player'?'#ffcc00':'#ff4444';
ctx.fillStyle=p.owner==='player'?'#ffcc00':'#ff4444';
ctx.beginPath();ctx.arc(p.x,p.y,p.owner==='player'?3:3.5,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0
}
}

function renderPlayer(){
const ch=G.charDef;const flash=G.iFrames>0&&Math.sin(G.iFrames*30)>0;
if(flash)return;
ctx.fillStyle=ch.color;ctx.save();ctx.translate(G.px,G.py);
if(G.charId==='guardian'){ctx.fillRect(-ch.size/2,-ch.size/2,ch.size,ch.size);
if(G.isAttacking){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,G.autoRange,G.attackAngle-G.cleaveArc/2,G.attackAngle+G.cleaveArc/2);ctx.stroke()}}
else if(G.charId==='gunslinger'){ctx.rotate(Math.PI/4);ctx.fillRect(-ch.size/2,-ch.size/2,ch.size,ch.size)}
else{ctx.rotate(G.facing);ctx.beginPath();ctx.moveTo(ch.size/2,0);ctx.lineTo(-ch.size/2,-ch.size/2);ctx.lineTo(-ch.size/2,ch.size/2);ctx.closePath();ctx.fill()}
ctx.restore();
// Ult active indicator
if(G.ultActive){ctx.strokeStyle=ch.color;ctx.lineWidth=2;ctx.globalAlpha=0.5+0.3*Math.sin(Date.now()/100);ctx.beginPath();ctx.arc(G.px,G.py,ch.size,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
}

function renderOrbitalShield(){
if(G.orbitalOrbs.length===0)return;
for(const orb of G.orbitalOrbs){
const ox=G.px+Math.cos(orb.angle)*50,oy=G.py+Math.sin(orb.angle)*50;
ctx.fillStyle='#4488ff';ctx.beginPath();ctx.arc(ox,oy,5,0,Math.PI*2);ctx.fill()
}
}

function renderParticles(){
const rings=[],arcs=[],dots={};
for(const p of G.particles){ctx.globalAlpha=clamp(p.alpha,0,1);
if(p.isRing)rings.push(p);else if(p.isArc)arcs.push(p);else if(p.isAfterimage){ctx.fillStyle=p.color;ctx.globalAlpha=clamp(p.alpha*0.5,0,0.5);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.facing);ctx.beginPath();ctx.moveTo(p.size/2,0);ctx.lineTo(-p.size/2,-p.size/2);ctx.lineTo(-p.size/2,p.size/2);ctx.closePath();ctx.fill();ctx.restore()}
else{const k=p.color;(dots[k]||(dots[k]=[])).push(p)}}
ctx.lineWidth=3;for(const p of rings){const cs=p.expandRate?p.size+p.expandRate*(1-p.lifetime/p.maxLifetime):p.size;ctx.globalAlpha=clamp(p.alpha,0,1);ctx.strokeStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,cs,0,Math.PI*2);ctx.stroke()}
ctx.lineWidth=1.5;for(const p of arcs){ctx.globalAlpha=clamp(p.alpha,0,1);ctx.strokeStyle=p.color;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.tx,p.ty);ctx.stroke()}
for(const color in dots){ctx.fillStyle=color;ctx.beginPath();for(const p of dots[color]){ctx.globalAlpha=clamp(p.alpha,0,1);ctx.moveTo(Math.round(p.x)+p.size/2,Math.round(p.y));ctx.arc(Math.round(p.x),Math.round(p.y),p.size/2,0,Math.PI*2)}ctx.fill()}
ctx.globalAlpha=1;
// Floating texts
for(const ft of G.floatingTexts){ctx.globalAlpha=clamp(ft.lifetime/ft.maxLifetime,0,1);ctx.fillStyle=ft.color;ctx.font=`bold ${ft.size}px sans-serif`;ctx.textAlign='center';ctx.fillText(ft.text,ft.x,ft.y)}
ctx.globalAlpha=1
}

function renderHUD(){
const mob=isMobile;
// Scale factor for small screens
const s=Math.min(canvas.width,canvas.height)<500?0.75:1;
// HP bar
const hpW=180*s,hpH=16*s,hpX=15,hpY=mob?55:15;
ctx.fillStyle='#333';ctx.fillRect(hpX,hpY,hpW,hpH);
const hpPct=clamp(G.hp/G.maxHP,0,1);ctx.fillStyle=hpPct>0.5?'#44cc44':hpPct>0.25?'#cccc44':'#cc4444';
ctx.fillRect(hpX,hpY,hpW*hpPct,hpH);ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.strokeRect(hpX,hpY,hpW,hpH);
ctx.fillStyle='#fff';ctx.font=`${12*s}px sans-serif`;ctx.textAlign='left';ctx.fillText(`${Math.ceil(G.hp)} / ${G.maxHP}`,hpX+4,hpY+12*s);
// Timer + wave
ctx.textAlign='center';ctx.font=`${14*s}px sans-serif`;
const mins=Math.floor(G.gameTime/60),secs=Math.floor(G.gameTime%60);
ctx.fillStyle='#ccc';
const w=G.waveNumber||1;
ctx.fillText(`${t('stage')} ${G.stage} - ${t('wave')} ${w}/${G.totalWaves} - ${mins}:${secs.toString().padStart(2,'0')}`,canvas.width/2,mob?20:25);
ctx.fillStyle='#888';ctx.font=`${11*s}px sans-serif`;
const alive=G.enemies.filter(e=>!e.dead).length;
const killPct=G.waveKillTarget>0?Math.min(100,Math.round(G.waveKillCount/G.waveKillTarget*100)):0;
ctx.fillText(`${t('enemies')}: ${alive} | ${G.waveKillCount}/${G.waveKillTarget} (${killPct}%)`,canvas.width/2,mob?38:42);
// Gold + Level
ctx.textAlign='right';ctx.font=`${14*s}px sans-serif`;
const goldX=canvas.width-15;
ctx.fillStyle='#ffcc00';ctx.fillText(`${t('gold')}: ${G.gold}${G.goldCapReached?' ('+t('goldCap')+')':''}`,goldX,mob?20:20);
ctx.fillStyle='#ccc';ctx.fillText(`${t('level')} ${G.level}`,goldX,mob?38:38);
const xpW=120*s,xpH=6,xpX=goldX-xpW,xpY=mob?44:44;ctx.fillStyle='#333';ctx.fillRect(xpX,xpY,xpW,xpH);
ctx.fillStyle='#4488ff';ctx.fillRect(xpX,xpY,xpW*clamp(G.xp/G.xpToNext,0,1),xpH);
// Active power-up
if(G.activePowerUp){const pu=G.activePowerUp.type;
ctx.fillStyle=pu.color;ctx.font=`${12*s}px sans-serif`;ctx.textAlign='left';ctx.fillText(pu.icon+' '+Math.ceil(G.activePowerUp.remaining)+'s',15,mob?72:45)}
// Ultimate button — position differs for mobile
const ultR=mob?30*s:22;
const ultX=mob?canvas.width-60:canvas.width/2;
const ultY=mob?canvas.height-70:canvas.height-50;
const ultMaxCD=G.charDef.ultCD*(G.ultCDMult||1);
const ultCDPct=G.ultCDTimer>0?clamp(G.ultCDTimer/ultMaxCD,0,1):0;
ctx.fillStyle='#222';ctx.beginPath();ctx.arc(ultX,ultY,ultR,0,Math.PI*2);ctx.fill();
if(ultCDPct>0){ctx.fillStyle='#444';ctx.beginPath();ctx.moveTo(ultX,ultY);ctx.arc(ultX,ultY,ultR,-Math.PI/2,-Math.PI/2+Math.PI*2*ultCDPct);ctx.closePath();ctx.fill()}
ctx.strokeStyle=G.ultCDTimer<=0?'#ffcc00':'#555';ctx.lineWidth=mob?2:1;ctx.beginPath();ctx.arc(ultX,ultY,ultR,0,Math.PI*2);ctx.stroke();
ctx.fillStyle=G.ultActive?CHARS[G.charId].color:(G.ultCDTimer<=0?'#ffcc00':'#888');ctx.font=`bold ${mob?13*s:10}px sans-serif`;ctx.textAlign='center';
ctx.fillText(G.ultActive?t('active'):(G.ultCDTimer<=0?t('ready'):Math.ceil(G.ultCDTimer)+'s'),ultX,ultY+4*s);
// Minimap — hide on very small screens
if(canvas.width>400){
const mw=(mob?70:100)*s,mh=mw,mx=canvas.width-mw-10,my=canvas.height-mh-(mob?140:10);const ms2=mw/(ARENA_R*2);
ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(mx,my,mw,mh);ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(mx,my,mw,mh);
ctx.fillStyle='#fff';ctx.fillRect(mx+mw/2-2,my+mh/2-2,4,4);ctx.fillStyle='#cc3333';
for(const e of G.enemies){if(e.dead)continue;const dx2=(e.x-G.px)*ms2,dy2=(e.y-G.py)*ms2;if(Math.abs(dx2)<mw/2&&Math.abs(dy2)<mh/2){if(e.isBoss){ctx.fillStyle=Math.sin(Date.now()/200)>0?'#ff0000':'#880000';ctx.fillRect(mx+mw/2+dx2-3,my+mh/2+dy2-3,6,6);ctx.fillStyle='#cc3333'}else ctx.fillRect(mx+mw/2+dx2-0.5,my+mh/2+dy2-0.5,1,1)}}
}
// Combo
if(G.comboCount>=3){ctx.fillStyle='#ff8800';ctx.font=`bold ${Math.min(24+G.comboCount,40)*s}px sans-serif`;ctx.textAlign='center';ctx.fillText(G.comboCount+'x COMBO',canvas.width/2,canvas.height-(mob?140:80))}
// Mobile: virtual joystick + pause button
if(mob){
// Joystick base
const jbx=80,jby=canvas.height-100;
ctx.fillStyle='rgba(255,255,255,0.08)';ctx.beginPath();ctx.arc(jbx,jby,JOY_RADIUS,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(jbx,jby,JOY_RADIUS,0,Math.PI*2);ctx.stroke();
// Joystick thumb
if(joyActive&&joyOrigin){
const thumbX=jbx+joyDir.x*JOY_RADIUS*0.7,thumbY=jby+joyDir.y*JOY_RADIUS*0.7;
ctx.fillStyle='rgba(255,255,255,0.25)';ctx.beginPath();ctx.arc(thumbX,thumbY,22,0,Math.PI*2);ctx.fill()
}else{
ctx.fillStyle='rgba(255,255,255,0.12)';ctx.beginPath();ctx.arc(jbx,jby,22,0,Math.PI*2);ctx.fill()
}
// Pause button (top-right)
ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(canvas.width-44,8,36,36);
ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(canvas.width-38,18,8,16);ctx.fillRect(canvas.width-26,18,8,16)
}
}

function renderBossHP(){
const bw=canvas.width-40,bh=10,bx=20,by=55;
ctx.fillStyle='#333';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#cc3333';ctx.fillRect(bx,by,bw*G.bossHPPercent,bh);
ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.strokeRect(bx,by,bw,bh);
ctx.fillStyle='#fff';ctx.font='12px sans-serif';ctx.textAlign='center';
ctx.fillText(t('boss')+': '+t('bossNames')[G.stage-1],canvas.width/2,by-3)
}

// ==================== GAME LOOP ====================
let lastTime=0;
function gameLoop(ts){
requestAnimationFrame(gameLoop);
const dt=Math.min((ts-lastTime)/1000,0.05);lastTime=ts;
fpsCnt++;fpsT+=dt;if(fpsT>=1){fpsVal=fpsCnt;fpsCnt=0;fpsT-=1}
if(G&&screen==='inGame'&&!G.paused&&!G.runOver){
G.hazardSlow=0;updatePlayer(dt);updateSpawn(dt);updateEnemies(dt);updateCollisions();
updateAutoAttack(dt);updateUlt(dt);updateProjectiles(dt);updateXPOrbs(dt);updateAfterimages(dt);
updateParticles(dt);updateHazards(dt);updatePowerUps(dt);updateStage(dt);
G.spatial.clear();for(const e of G.enemies)if(!e.dead)G.spatial.insert(e);
// Orbital shield update
for(const orb of G.orbitalOrbs){orb.angle+=2*dt;
const ox=G.px+Math.cos(orb.angle)*50,oy=G.py+Math.sin(orb.angle)*50;
const near=G.spatial.query(ox,oy,10);for(const e of near){if(e.isEnemy&&!e.dead&&dist(e.x,e.y,ox,oy)<10){
const eid=G.enemies.indexOf(e);if(eid>=0&&(!orb.cd[eid]||orb.cd[eid]<=0)){orb.cd[eid]=1.5;damageEnemy(e,6,false)}}}
for(const k in orb.cd){orb.cd[k]-=dt;if(orb.cd[k]<=0)delete orb.cd[k]}}
// Combo timer
if(G.comboTimer>0){G.comboTimer-=dt;if(G.comboTimer<=0){G.comboCount=0;G.comboStep=0}}
}
render()
}