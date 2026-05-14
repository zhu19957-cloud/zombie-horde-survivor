// ==================== ENEMIES ====================
function findNearest(x,y,r){let best=null,bd=r;for(const e of G.enemies){if(e.dead||e.fadeIn>0)continue;const d=dist(e.x,e.y,x,y);if(d<bd){bd=d;best=e}}return best}

function updateEnemies(dt){
for(let i=G.enemies.length-1;i>=0;i--){
const e=G.enemies[i];
if(e.dead){G.enemies.splice(i,1);continue}
e.fadeIn=Math.max(0,e.fadeIn-dt);e.flashTimer=Math.max(0,e.flashTimer-dt);e.contactCD=Math.max(0,e.contactCD-dt);
if(e.frozenTimer>0){e.frozenTimer-=dt;continue}
if(e.burnTimer>0){e.burnTimer-=dt;e.hp-=G.burnDmg*dt;if(e.hp<=0&&!e.dead)killEnemy(e)}
if(e.isBoss){updateBoss(e,dt);continue}
const a=angle(e.x,e.y,G.px,G.py);e.facing=a;
let spdMult=1;
if(G.magnetField>0&&dist(e.x,e.y,G.px,G.py)<40)spdMult*=(1-G.magnetField);
for(const seg of G.frozenTrailSegs){if(dist(e.x,e.y,seg.x,seg.y)<15){spdMult*=(1-seg.slow);break}}
// Time Warp slow
if(G.ultActive&&G.charId==='shadow')spdMult*=0.5;
if(e.type==='spitter'){
const d=dist(e.x,e.y,G.px,G.py);
if(d>120)e.x+=Math.cos(a)*e.speed*60*dt*spdMult;else if(d<80){e.x-=Math.cos(a)*e.speed*60*dt*spdMult;e.y-=Math.sin(a)*e.speed*60*dt*spdMult}
e.specialTimer-=dt;if(e.specialTimer<=0&&d<=250){e.specialTimer=2;for(let j=-1;j<=1;j++){const sa=a+j*0.2;G.projectiles.push({x:e.x,y:e.y,dx:Math.cos(sa),dy:Math.sin(sa),speed:4,damage:e.damage,piercing:0,owner:'enemy',lifetime:3})}}
}else if(e.type==='healer'){
e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult;
e.healPulseTimer-=dt;if(e.healPulseTimer<=0){e.healPulseTimer=2;const near=G.spatial.query(e.x,e.y,80);for(const ne of near)if(ne.isEnemy&&!ne.dead&&ne!==e&&dist(ne.x,ne.y,e.x,e.y)<80)ne.hp=Math.min(ne.maxHp,ne.hp+3);
if(fpsVal>=25)G.particles.push({x:e.x,y:e.y,dx:0,dy:0,lifetime:0.5,maxLifetime:0.5,size:40,color:'#4a7c7c',alpha:0.3})}
}else if(e.type==='bomber'){
e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult;
if(e.hp/e.maxHp<0.5)spdMult*=1.8;
}else if(e.type==='shielder'){
e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult;
}else if(e.type==='flanker'){
const d=dist(e.x,e.y,G.px,G.py);
if(d>80){const tx=G.px+Math.cos(G.facing+Math.PI)*60,ty=G.py+Math.sin(G.facing+Math.PI)*60;const ma=angle(e.x,e.y,tx,ty);e.x+=Math.cos(ma)*e.speed*60*dt*spdMult;e.y+=Math.sin(ma)*e.speed*60*dt*spdMult}
else{e.x+=Math.cos(a)*e.speed*1.5*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*1.5*60*dt*spdMult}
}else if(e.type==='charger'){
if(!e.isCharging){e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult;e.chargeTimer-=dt;if(e.chargeTimer<=0){e.isCharging=true;e.chargeDir=a;e.chargeDur=0.4}}
else{e.x+=Math.cos(e.chargeDir)*6*60*dt;e.y+=Math.sin(e.chargeDir)*6*60*dt;e.chargeDur-=dt;if(e.chargeDur<=0){e.isCharging=false;e.chargeTimer=2}}
}else if(e.type==='teleporter'){
const td=dist(e.x,e.y,G.px,G.py);
if(td>180)e.x+=Math.cos(a)*e.speed*60*dt*spdMult,e.y+=Math.sin(a)*e.speed*60*dt*spdMult;
else if(td<100)e.x-=Math.cos(a)*e.speed*0.5*60*dt*spdMult,e.y-=Math.sin(a)*e.speed*0.5*60*dt*spdMult;
e.teleportCD-=dt;if(e.teleportCD<=0){e.teleportCD=2;
if(fpsVal>=25)for(let j=0;j<5;j++)G.particles.push({x:e.x+rand(-5,5),y:e.y+rand(-5,5),dx:rand(-30,30),dy:rand(-30,30),lifetime:0.3,maxLifetime:0.3,size:3,color:'#7c4a9c',alpha:0.8});
const ta=rand(0,Math.PI*2);e.x=G.px+Math.cos(ta)*rand(80,150);e.y=G.py+Math.sin(ta)*rand(80,150)}
e.shootCD-=dt;if(e.shootCD<=0&&td<=250){e.shootCD=1.5;
const pa=angle(e.x,e.y,G.px,G.py);G.projectiles.push({x:e.x,y:e.y,dx:Math.cos(pa),dy:Math.sin(pa),speed:2.5,damage:e.damage,piercing:0,owner:'enemy',lifetime:4,homing:0.02})}
}else if(e.type==='necrotic'){
e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult;
}else{
e.x+=Math.cos(a)*e.speed*60*dt*spdMult;e.y+=Math.sin(a)*e.speed*60*dt*spdMult}
// Arena bounds clamp
const eDist=Math.hypot(e.x,e.y);const maxR=ARENA_R-e.size/2;if(eDist>maxR){const ea=Math.atan2(e.y,e.x);e.x=Math.cos(ea)*maxR;e.y=Math.sin(ea)*maxR}
// Contact damage
const cd=dist(e.x,e.y,G.px,G.py);const cdist=e.size/2+G.charDef.size/2;
if(cd<cdist&&e.contactCD<=0){damagePlayer(e.damage,e);e.contactCD=CONTACT_CD}
// Remove far away enemies
if(!e.isBoss&&Math.hypot(e.x,e.y)>ARENA_R+200){G.enemies.splice(i,1);continue}
}
}

// ==================== BOSS AI ====================
function updateBoss(boss,dt){
const a=angle(boss.x,boss.y,G.px,G.py);boss.facing=a;
const slowMult=(G.ultActive&&G.charId==='shadow')?0.5:1;
if(!boss.isCharging){boss.x+=Math.cos(a)*boss.speed*60*dt*slowMult;boss.y+=Math.sin(a)*boss.speed*60*dt*slowMult}
if(boss.type==='colossus'){
boss.slamTimer-=dt;if(boss.slamTimer<=0){boss.slamTimer=5;if(dist(boss.x,boss.y,G.px,G.py)<100+G.charDef.size/2){damagePlayer(20,boss);const ka=angle(boss.x,boss.y,G.px,G.py);G.px+=Math.cos(ka)*60;G.py+=Math.sin(ka)*60}
G.screenShake=0.3;G.shakeIntensity=8}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonTimer=10;for(let i=0;i<5;i++)G.enemies.push(createEnemy('walker',boss.x+rand(-20,20),boss.y+rand(-20,20),G.sd.diffMult))}
}else if(boss.type==='necromancer'){
boss.orbTimer-=dt;if(boss.orbTimer<=0){boss.orbTimer=3;for(let i=-1;i<=1;i++){const sa=a+i*0.3;G.projectiles.push({x:boss.x,y:boss.y,dx:Math.cos(sa),dy:Math.sin(sa),speed:3,damage:12,piercing:0,owner:'enemy',lifetime:4})}}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonAlt=!boss.summonAlt;boss.summonTimer=boss.summonAlt?8:12;G.enemies.push(createEnemy(boss.summonAlt?'spitter':'shielder',boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult))}
}else if(boss.type==='hiveQueen'){
if(boss.hp/boss.maxHp<=0.5&&boss.bossPhase===0){boss.bossPhase=1;addFloat(boss.x,boss.y-30,t('phase2'),'#ffcc00',20)}
const cf=boss.bossPhase===1?3:6;
if(!boss.isCharging){boss.chargeTimer-=dt;if(boss.chargeTimer<=0){boss.isCharging=true;boss.chargeDir=a;boss.chargeDur=0.5}}
if(boss.isCharging){boss.x+=Math.cos(boss.chargeDir)*8*60*dt;boss.y+=Math.sin(boss.chargeDir)*8*60*dt;boss.chargeDur-=dt;
if(fpsVal>=25)G.particles.push({x:boss.x+rand(-5,5),y:boss.y+rand(-5,5),dx:0,dy:0,lifetime:3,maxLifetime:3,size:10,color:'#3d3d1f',alpha:0.6,isAcid:true});
if(dist(boss.x,boss.y,G.px,G.py)<boss.size/2+G.charDef.size/2&&boss.contactCD<=0){damagePlayer(25,boss);boss.contactCD=0.5}
if(boss.chargeDur<=0){boss.isCharging=false;boss.chargeTimer=cf}}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonTimer=boss.bossPhase===1?4:5;for(let i=0;i<8;i++)G.enemies.push(createEnemy('swarmer',boss.x+rand(-20,20),boss.y+rand(-20,20),G.sd.diffMult))}
}else if(boss.type==='warlord'){
if(boss.hp/boss.maxHp<=0.4&&boss.bossPhase===0){boss.bossPhase=1;addFloat(boss.x,boss.y-30,t('phase2'),'#ffcc00',20)}
const ccd=boss.bossPhase===1?2.5:4;
if(!boss.isCharging){boss.chargeTimer-=dt;if(boss.chargeTimer<=0){boss.isCharging=true;boss.chargeDir=a;boss.chargeDur=0.4}}
if(boss.isCharging){boss.x+=Math.cos(boss.chargeDir)*10*60*dt;boss.y+=Math.sin(boss.chargeDir)*10*60*dt;boss.chargeDur-=dt;
if(dist(boss.x,boss.y,G.px,G.py)<boss.size/2+G.charDef.size/2&&boss.contactCD<=0){damagePlayer(25,boss);G.stunTimer=0.5;boss.contactCD=0.5}
if(boss.chargeDur<=0){boss.isCharging=false;boss.chargeTimer=ccd}}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonAlt=!boss.summonAlt;boss.summonTimer=boss.summonAlt?15:6;G.enemies.push(createEnemy(boss.summonAlt?'shielder':'runner',boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult));if(!boss.summonAlt)G.enemies.push(createEnemy('runner',boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult))}
}else if(boss.type==='plagueDoctor'){
if(boss.hp/boss.maxHp<=0.5&&boss.bossPhase===0){boss.bossPhase=1;addFloat(boss.x,boss.y-30,t('phase2'),'#ffcc00',20)}
boss.flaskTimer-=dt;if(boss.flaskTimer<=0){boss.flaskTimer=3;const nf=boss.bossPhase===1?3:1;for(let i=0;i<nf;i++){const tx=G.px+rand(-50,50),ty=G.py+rand(-50,50);boss.poisonClouds.push({x:tx,y:ty,lifetime:4,radius:60})}}
boss.curseTimer-=dt;if(boss.curseTimer<=0){boss.curseTimer=8;G.weakenMult=boss.bossPhase===1?0.65:0.8;G.weakenTimer=5;addFloat(G.px,G.py-20,'WEAKENED!','#8844aa',14)}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonAlt=!boss.summonAlt;boss.summonTimer=boss.summonAlt?10:8;G.enemies.push(createEnemy(boss.summonAlt?'bomber':'healer',boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult))}
// Poison cloud damage
if(boss.poisonClouds)for(let i=boss.poisonClouds.length-1;i>=0;i--){const c=boss.poisonClouds[i];c.lifetime-=dt;if(dist(c.x,c.y,G.px,G.py)<c.radius){if(!c._dmgCD||c._dmgCD<=0){c._dmgCD=1;damagePlayer(4,null)}}if(c._dmgCD>0)c._dmgCD-=dt;if(c.lifetime<=0)boss.poisonClouds.splice(i,1)}
}else if(boss.type==='abyssKing'){
if(boss.hp/boss.maxHp<=0.6&&boss.bossPhase===0){boss.bossPhase=1;boss.shieldHP=500;boss.shieldRegenTimer=30;addFloat(boss.x,boss.y-30,t('phase2'),'#ffcc00',20)}
if(boss.hp/boss.maxHp<=0.25&&boss.bossPhase===1){boss.bossPhase=2;addFloat(boss.x,boss.y-30,t('phase3'),'#ffcc00',20)}
// Dark beam
boss.beamTimer-=dt;if(boss.beamTimer<=0){boss.beamTimer=6;boss.beamActive=true;boss.beamAngle=a;boss.beamDur=2}
if(boss.beamActive){boss.beamDur-=dt;const sweepSpd=boss.bossPhase>=1?1.5:0.75;boss.beamAngle+=sweepSpd*dt;
const bx2=boss.x+Math.cos(boss.beamAngle)*300,by2=boss.y+Math.sin(boss.beamAngle)*300;
const dx2=bx2-boss.x,dy2=by2-boss.y,len2=Math.hypot(dx2,dy2);
const t2=((G.px-boss.x)*dx2+(G.py-boss.y)*dy2)/(len2*len2);const cx=boss.x+clamp(t2,0,1)*dx2,cy=boss.y+clamp(t2,0,1)*dy2;
if(dist(G.px,G.py,cx,cy)<20)damagePlayer(20,boss);
if(fpsVal>=25)G.particles.push({x:boss.x,y:boss.y,dx:0,dy:0,lifetime:0.1,maxLifetime:0.1,size:3,color:'#4400aa',alpha:0.8,isArc:true,tx:bx2,ty:by2});
if(boss.beamDur<=0)boss.beamActive=false}
boss.summonTimer-=dt;if(boss.summonTimer<=0){boss.summonTimer=4;for(let i=0;i<3;i++)G.enemies.push(createEnemy('swarmer',boss.x+rand(-20,20),boss.y+rand(-20,20),G.sd.diffMult))}
boss.riftTimer-=dt;if(boss.riftTimer<=0){boss.riftTimer=12;boss.riftDur=9}
if(boss.riftDur>0){boss.riftDur-=dt;boss.riftSpawnTimer-=dt;if(boss.riftSpawnTimer<=0){boss.riftSpawnTimer=3;const types=['spitter','bomber','shielder','healer'];G.enemies.push(createEnemy(types[randInt(0,3)],boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult))}}
if(boss.bossPhase>=1&&boss.shieldHP>0){boss.shieldRegenTimer-=dt;if(boss.shieldRegenTimer<=0){boss.shieldHP=Math.min(500,boss.shieldHP+100);boss.shieldRegenTimer=10}}
if(boss.bossPhase>=2){boss.teleportCD-=dt;if(boss.teleportCD<=0){boss.teleportCD=8;const ta=rand(0,Math.PI*2);boss.x=G.px+Math.cos(ta)*200;boss.y=G.py+Math.sin(ta)*200;for(let i=0;i<2;i++)G.enemies.push(createEnemy('shielder',boss.x+rand(-30,30),boss.y+rand(-30,30),G.sd.diffMult))}}
}
// Contact damage for all bosses
const bd=dist(boss.x,boss.y,G.px,G.py);if(bd<boss.size/2+G.charDef.size/2&&boss.contactCD<=0){damagePlayer(boss.damage,boss);boss.contactCD=0.5}
// Arena bounds clamp
const bDist=Math.hypot(boss.x,boss.y);const bMaxR=ARENA_R-boss.size/2;if(bDist>bMaxR){const ba=Math.atan2(boss.y,boss.x);boss.x=Math.cos(ba)*bMaxR;boss.y=Math.sin(ba)*bMaxR}
// Boss HP bar
G.bossHPPercent=boss.hp/boss.maxHp
}

function spawnBoss(){
if(G.bossSpawned)return;G.bossSpawned=true;G.bossEntranceTimer=5;
const bk=BOSS_KEYS[G.stage-1];const def=BOSS_DEFS[bk];
const pos=getSpawnPos(1)[0]||{x:G.px+200,y:G.py};
const boss={type:bk,x:pos.x,y:pos.y,hp:def.hp*G.sd.diffMult,maxHp:def.hp*G.sd.diffMult,
speed:def.speed,damage:def.dmg*G.sd.diffMult,size:def.size,color:def.color,
gold:def.gold+G.stage*15,xp:30,special:false,facing:0,specialTimer:0,flashTimer:0,
isBoss:true,bossPhase:0,healPulseTimer:0,contactCD:0,dead:false,isEnemy:true,fadeIn:0,
burnTimer:0,frozenTimer:0,shieldHP:0,previewTimer:0,
slamTimer:5,summonTimer:10,summonAlt:false,orbTimer:3,teleportCD:0,
chargeTimer:4,isCharging:false,chargeDir:0,chargeDur:0,
flaskTimer:3,curseTimer:8,poisonClouds:[],
beamTimer:6,beamActive:false,beamAngle:0,beamDur:0,
riftTimer:12,riftDur:0,riftSpawnTimer:3,shieldRegenTimer:30};
G.enemies.push(boss);G.boss=boss;
G.screenShake=0.5;G.shakeIntensity=8;addFloat(G.px,G.py-40,t('bossIncoming'),'#ff3333',24)
}

// ==================== SPAWN ====================
function getWave(){return G.waveNumber||1}
function getSpawnInterval(){
const w=G.waveNumber||1;const idx=Math.min(w,WAVE_SPAWN.length)-1;
return WAVE_SPAWN[Math.max(0,idx)]
}

function getSpawnPos(count){
const positions=[];const numPoints=randInt(2,4);
for(let i=0;i<numPoints;i++){
const a2=rand(0,Math.PI*2);const pos={x:Math.cos(a2)*(ARENA_R+30),y:Math.sin(a2)*(ARENA_R+30)};
let valid=true;for(const p of positions)if(dist(p.x,p.y,pos.x,pos.y)<60){valid=false;break}
if(valid)positions.push(pos)}
return positions
}

function updateSpawn(dt){
// Boss entrance pause
if(G.bossEntranceTimer>0){G.bossEntranceTimer-=dt;return}
// Boss defeated check
if(G.bossDefeated&&!G.runOver){G.runOver=true;G.stageComplete=true;const bonus=50*G.stage;G.gold+=bonus;G.totalGoldEarned+=bonus;endRun(true);return}
// Wave break
if(G.waveBreakTimer>0){G.waveBreakTimer-=dt;return}
// Wave completion check
if(G.waveKillCount>=G.waveKillTarget&&!G.bossSpawned){
addFloat(G.px,G.py-60,'WAVE '+G.waveNumber+' CLEAR!','#ffcc00',22);
if(fpsVal>=25)G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.5,maxLifetime:0.5,size:30,color:'#ffcc00',alpha:0.6,isRing:true,expandRate:200});
if(G.waveNumber>=G.totalWaves){spawnBoss();return}
G.waveNumber++;G.waveKillCount=0;
G.waveKillTarget=Math.round(G.sd.enemiesPerWave*G.sd.diffMult*(1+0.15*(G.waveNumber-1)));
G.waveBreakTimer=2;
// Wave announce
if(G.waveNumber>G.lastWave){G.lastWave=G.waveNumber;G.waveAnnounceTimer=2}
// Elite wave
if(G.sd.eliteWaves&&G.sd.eliteWaves.includes(G.waveNumber)){spawnElite()}
return
}
if(G.waveAnnounceTimer>0)G.waveAnnounceTimer-=dt;
// Normal spawn
const nm=G.sd.normalSpawnMult;
let interval=getSpawnInterval()/nm;
if(G.bossSpawned)interval=0.5;
G.spawnTimer-=dt;
if(G.spawnTimer<=0&&G.enemies.length<SOFT_ENEMY){G.spawnTimer=interval;spawnNormal()}
// Special spawn
const canSpecial=G.waveNumber>=G.sd.specialFromWave;
G.specialSpawnTimer-=dt;
if(G.specialSpawnTimer<=0&&canSpecial&&G.enemies.length<HARD_ENEMY){spawnSpecial();G.specialSpawnTimer=G.waveNumber>=5?12:20}
}

function spawnNormal(){
const r=Math.random();const t2=G.gameTime;
const swRatio=lerp(0.2,0.4,t2/300),rnRatio=lerp(0.3,0.2,t2/300);
let type;if(r<swRatio)type='swarmer';else if(r<swRatio+rnRatio)type='runner';else type='walker';
const dm=G.sd.diffMult;const pos=getSpawnPos(1);if(pos.length===0)return;
const cnt=type==='swarmer'?randInt(20,30):type==='runner'?randInt(8,12):randInt(2,4);
for(let i=0;i<cnt&&G.enemies.length<HARD_ENEMY;i++)G.enemies.push(createEnemy(type,pos[0].x+rand(-20,20),pos[0].y+rand(-20,20),dm))
}
function spawnSpecial(){
const types=['spitter','bomber','shielder','healer','flanker','charger','teleporter','necrotic'];
const type=types[randInt(0,types.length-1)];
const pos=getSpawnPos(1);if(pos.length===0)return;
G.enemies.push(createEnemy(type,pos[0].x,pos[0].y,G.sd.diffMult))
}
function spawnElite(){
const types=['spitter','bomber','shielder','healer','flanker','charger','teleporter','necrotic'];
const type=types[randInt(0,types.length-1)];
const pos=getSpawnPos(1);if(pos.length===0)return;
const e=createEnemy(type,pos[0].x,pos[0].y,G.sd.diffMult*2);
e.hp*=3;e.maxHp*=3;e.damage*=1.5;e.size*=1.3;e.isElite=true;
G.enemies.push(e);
addFloat(e.x,e.y-e.size,'ELITE!','#ff8800',18)
}