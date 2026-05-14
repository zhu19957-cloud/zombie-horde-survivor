// ==================== XP ORBS ====================
function updateXPOrbs(dt){
// Cap orbs
while(G.xpOrbs.length>80){const nearest=G.xpOrbs.reduce((a,b)=>dist(a.x,a.y,G.px,G.py)<dist(b.x,b.y,G.px,G.py)?a:b);G.xp+=nearest.xp*(G.xpMult||1);G.xpOrbs.splice(G.xpOrbs.indexOf(nearest),1)}
for(let i=G.xpOrbs.length-1;i>=0;i--){
const orb=G.xpOrbs[i];orb.lifetime-=dt;const d=dist(orb.x,orb.y,G.px,G.py);
if(d<G.pickupRange){const a2=angle(orb.x,orb.y,G.px,G.py);const speed=Math.max(200,400-d);orb.x+=Math.cos(a2)*speed*dt;orb.y+=Math.sin(a2)*speed*dt}
if(d<10){G.xp+=orb.xp*(G.xpMult||1);G.xpOrbs.splice(i,1);
while(G.xp>=G.xpToNext&&G.level<MAX_LVL){G.xp-=G.xpToNext;G.level++;G.xpToNext=xpForLevel(G.level);
addFloat(G.px,G.py-30,t('levelUp'),'#ffcc00',20);
if(fpsVal>=25)G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.6,maxLifetime:0.6,size:10,color:'#ffcc00',alpha:0.8,isRing:true,expandRate:120});
G.pendingLevelUps++}
if(G.pendingLevelUps>0&&!G.paused){G.pendingLevelUps--;showLevelUp()}}
else if(orb.lifetime<=0)G.xpOrbs.splice(i,1)}
}

// ==================== PARTICLES ====================
function updateParticles(dt){
// Cap particles
while(G.particles.length>250)G.particles.shift();
while(G.floatingTexts.length>40)G.floatingTexts.shift();
for(let i=G.particles.length-1;i>=0;i--){
const p=G.particles[i];p.x+=p.dx*dt;p.y+=p.dy*dt;p.dx*=0.95;p.dy*=0.95;p.lifetime-=dt;
if(p.lifetime<=0){G.particles.splice(i,1);continue}
p.alpha=clamp(p.lifetime/p.maxLifetime,0,1);
if(p.isAcid&&dist(p.x,p.y,G.px,G.py)<15){if(!p._acidCD||p._acidCD<=0){p._acidCD=1;damagePlayer(5,null)}}if(p._acidCD>0)p._acidCD-=dt
}
for(let i=G.floatingTexts.length-1;i>=0;i--){G.floatingTexts[i].y-=40*dt;G.floatingTexts[i].lifetime-=dt;if(G.floatingTexts[i].lifetime<=0)G.floatingTexts.splice(i,1)}
// Frozen trail
for(let i=G.frozenTrailSegs.length-1;i>=0;i--){G.frozenTrailSegs[i].lifetime-=dt;if(G.frozenTrailSegs[i].lifetime<=0)G.frozenTrailSegs.splice(i,1)}
// Explosions
for(let i=G.explosions.length-1;i>=0;i--){const ex=G.explosions[i];ex.timer-=dt;if(ex.timer<=0){const near=G.spatial.query(ex.x,ex.y,ex.radius);for(const e of near)if(e.isEnemy&&!e.dead&&dist(e.x,e.y,ex.x,ex.y)<ex.radius)damageEnemy(e,ex.damage,false);if(dist(G.px,G.py,ex.x,ex.y)<ex.radius+G.charDef.size/2)damagePlayer(ex.damage,null);G.explosions.splice(i,1);
if(fpsVal>=25)G.particles.push({x:ex.x,y:ex.y,dx:0,dy:0,lifetime:0.5,maxLifetime:0.5,size:ex.radius,color:'#ff2200',alpha:0.5,isRing:true,expandRate:0})}}
}

function addFloat(x,y,text,color,size){G.floatingTexts.push({x,y,text,color,size:size||12,lifetime:0.8,maxLifetime:0.8})}

// ==================== HAZARDS ====================
function updateHazards(dt){
const hz=G.sd.hazards;if(hz.length===0)return;
G.hazardTimer-=dt;if(G.hazardTimer<=0){
if(hz.includes('ember')){const count=randInt(2,3);for(let i=0;i<count;i++){const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-50);
G.hazards.push({type:'ember',x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,radius:40,damage:3,damageType:'dot',warningTimer:1,activeTimer:8,stageOrigin:G.stage})}}
if(hz.includes('toxic')){const count=randInt(3,4);for(let i=0;i<count;i++){const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-50);
G.hazards.push({type:'toxic',x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,radius:50,damage:G.stage>=5?6:5,damageType:'slow',slowAmt:0.2,warningTimer:1,activeTimer:G.stage>=5?12:10,stageOrigin:G.stage})}}
if(hz.includes('spike')){for(let i=0;i<2;i++){const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-50);
G.hazards.push({type:'spike',x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,radius:30,damage:G.stage>=6?15:12,damageType:'instant',warningTimer:0.8,activeTimer:0.1,stageOrigin:G.stage})}}
if(hz.includes('lightning')){for(let i=0;i<randInt(1,2);i++){const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-50);
G.hazards.push({type:'lightning',x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,radius:50,damage:18,damageType:'instant',warningTimer:1.5,activeTimer:0.1,stageOrigin:G.stage})}}
if(hz.includes('void')){const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-80);
G.hazards.push({type:'void',x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,radius:80,damage:8,damageType:'dot',warningTimer:2,activeTimer:15,stageOrigin:G.stage,expandRate:2})}
G.hazardTimer=hz.includes('void')?20:hz.includes('lightning')?8:12}
// Update existing hazards
for(let i=G.hazards.length-1;i>=0;i--){
const h=G.hazards[i];
if(h.warningTimer>0){h.warningTimer-=dt}else{
h.activeTimer-=dt;
if(dist(h.x,h.y,G.px,G.py)<h.radius+G.charDef.size/2){
if(h.damageType==='dot'){G.hp-=h.damage*dt;if(h.slowAmt)G.hazardSlow=h.slowAmt}
if(h.damageType==='instant'&&h.activeTimer>0){damagePlayer(h.damage,null);h.activeTimer=0}}
if(h.expandRate)h.radius+=h.expandRate*dt;
if(h.activeTimer<=0)G.hazards.splice(i,1)}
}
}

// ==================== POWER-UPS ====================
function updatePowerUps(dt){
// Spawn timer
if(G.gameTime<20)return;
G.powerUpSpawnTimer-=dt;
if(G.powerUpSpawnTimer<=0&&!G.fieldPowerUp){
const type=POWERUP_TYPES[randInt(0,5)];
const a2=rand(0,Math.PI*2),r2=rand(50,ARENA_R-50);
G.fieldPowerUp={type:type,x:Math.cos(a2)*r2,y:Math.sin(a2)*r2,despawnTimer:15,bobPhase:0};
G.powerUpSpawnTimer=rand(25,40)}
// Field power-up
if(G.fieldPowerUp){
G.fieldPowerUp.despawnTimer-=dt;G.fieldPowerUp.bobPhase+=dt;
if(G.fieldPowerUp.despawnTimer<=0){G.fieldPowerUp=null}
else if(dist(G.px,G.py,G.fieldPowerUp.x,G.fieldPowerUp.y)<G.charDef.size/2+15){
// Collect
removePowerUp();
const pu=G.fieldPowerUp.type;
G.activePowerUp={type:pu,remaining:pu.duration};
pu.effect(G);G.fieldPowerUp=null;
if(fpsVal>=25)G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.4,maxLifetime:0.4,size:30,color:pu.color,alpha:0.6,isRing:true,expandRate:60})}
}
}
function removePowerUp(){
if(!G.activePowerUp)return;
G.atkMult=1;G.spdMult=1;G.defMult=1;G.atkSpdMult=1;G.healPS=0;
// Rebuild goldMult from talent greed + upgrade stacks
let gm=1+((saveData.talents&&saveData.talents.greed)||0)*0.1;
const gbStacks=G.upgradeStacks['goldBonus']||0;
if(gbStacks>0){for(let s=0;s<gbStacks;s++){gm*=(1+0.15*Math.pow(0.75,s))}}
G.goldMult=gm;
G.activePowerUp=null
}

// ==================== STAGE ====================
function updateStage(dt){
G.gameTime+=dt;G.stageTime-=dt;
// No timer failure - stage only fails on player death
if(G.screenShake>0)G.screenShake-=dt;
if(G.screenFlash>0)G.screenFlash-=dt;
if(G.isAttacking){G.attackTimer-=dt;if(G.attackTimer<=0)G.isAttacking=false}
}
function endRun(victory){
saveData.gold+=Math.floor(G.totalGoldEarned);saveData.totalRuns++;saveData.totalKills+=G.kills;
if(victory&&G.stage<6&&!saveData.unlockedStages.includes(G.stage+1))saveData.unlockedStages.push(G.stage+1);
saveSave();
const title=document.getElementById('resultsTitle');title.textContent=victory?t('stageComplete'):t('stageFailed');title.style.color=victory?'#ffcc00':'#cc3333';
document.getElementById('resultsStats').innerHTML=`${t('goldEarned')}: <span>${Math.floor(G.totalGoldEarned)}</span><br>${t('kills')}: <span>${G.kills}</span><br>${t('timeSurvived')}: <span>${Math.floor(G.gameTime)}s</span><br>${t('levelReached')}: <span>${G.level}</span>`;
setTimeout(()=>switchScreen('results'),500)
}