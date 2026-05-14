// ==================== UPDATE: PLAYER ====================
function updatePlayer(dt){
if(G.stunTimer>0){G.stunTimer-=dt;return}
let dx=0,dy=0;
if(keys.has('KeyW')||keys.has('ArrowUp'))dy=-1;
if(keys.has('KeyS')||keys.has('ArrowDown'))dy=1;
if(keys.has('KeyA')||keys.has('ArrowLeft'))dx=-1;
if(keys.has('KeyD')||keys.has('ArrowRight'))dx+=1;
if(dx!==0||dy!==0){const len=Math.hypot(dx,dy);dx/=len;dy/=len;
G.px+=dx*G.spd*G.spdMult*(1-G.hazardSlow)*60*dt;G.py+=dy*G.spd*G.spdMult*(1-G.hazardSlow)*60*dt;G.facing=Math.atan2(dy,dx)}
// Arena bounds
const d2=Math.hypot(G.px,G.py);if(d2>ARENA_R-G.charDef.size/2){const a=Math.atan2(G.py,G.px);G.px=Math.cos(a)*(ARENA_R-G.charDef.size/2);G.py=Math.sin(a)*(ARENA_R-G.charDef.size/2)}
// Regen
if(G.hpRegen>0)G.hp=Math.min(G.maxHP,G.hp+G.hpRegen*dt);
// Power-up heal
if(G.healPS>0)G.hp=Math.min(G.maxHP,G.hp+G.healPS*dt);
// Burn timer on enemies handled in enemy update
// Frozen trail (throttled)
G.frozenTrailTimer-=dt;if(G.frozenTrail&&(dx!==0||dy!==0)&&G.frozenTrailTimer<=0){G.frozenTrailTimer=0.05;G.frozenTrailSegs.push({x:G.px,y:G.py,lifetime:1.5,slow:G.frozenTrailSlow})};
// HP regen from shop
// iFrames
if(G.iFrames>0)G.iFrames-=dt;
// Shield recharge
if(G.hasShield&&!G.shieldReady){G.shieldTimer-=dt;if(G.shieldTimer<=0)G.shieldReady=true}
// Ult CD
if(G.ultCDTimer>0)G.ultCDTimer-=dt;
// Weaken
if(G.weakenTimer>0){G.weakenTimer-=dt;if(G.weakenTimer<=0)G.weakenMult=1}
// Lightning aura
if(G.lightningAuraDmg>0){G.lightningAuraTimer-=dt;if(G.lightningAuraTimer<=0){G.lightningAuraTimer=G.lightningAuraCD;const near=findNearest(G.px,G.py,100);if(near){damageEnemy(near,G.lightningAuraDmg,false);G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.15,maxLifetime:0.15,size:2,color:'#ffffff',alpha:1,isArc:true,tx:near.x,ty:near.y})}}}
// Whirlwind
if(G.whirlwind){G.whirlwindTimer-=dt;if(G.whirlwindTimer<=0){G.whirlwindTimer=G.whirlwindCD;const near=G.spatial.query(G.px,G.py,G.whirlwindRange);for(const e of near){if(e.isEnemy&&!e.dead&&dist(e.x,e.y,G.px,G.py)<G.whirlwindRange){const a=angle(e.x,e.y,G.px,G.py);e.x+=Math.cos(a)*12;e.y+=Math.sin(a)*12}}}}
// Fortify (Guardian passive)
if(G.charId==='guardian'){const near=G.spatial.query(G.px,G.py,100);let cnt=0;for(const e of near)if(e.isEnemy&&!e.dead&&dist(e.x,e.y,G.px,G.py)<100)cnt++;G.fortifyDR=Math.min(0.30,cnt*0.03)}else G.fortifyDR=0;
// Active power-up timer
if(G.activePowerUp){G.activePowerUp.remaining-=dt;if(G.activePowerUp.remaining<=0)removePowerUp()}
}

// ==================== AUTO-ATTACK ====================
function updateAutoAttack(dt){
G.autoCDTimer-=dt;
if(G.autoCDTimer>0)return;
const ch=G.charDef;
const atkSpd=G.atkSpd*G.atkSpdMult;
const cd=ch.autoCD/atkSpd;
// Find nearest enemy in range
let nearest=null,nearDist=G.autoRange;
for(const e of G.enemies){if(e.dead||e.fadeIn>0)continue;const d=dist(e.x,e.y,G.px,G.py);if(d<nearDist){nearDist=d;nearest=e}}
if(!nearest)return;
G.autoCDTimer=cd;G.attackCounter++;
const a=angle(G.px,G.py,nearest.x,nearest.y);G.facing=a;
let isCrit=Math.random()<G.crit;
if(G.charId==='gunslinger'&&G.attackCounter%5===0)isCrit=true;
const baseDmg=G.atk*G.atkMult;
if(G.charId==='guardian'){
// Cleave arc
const near=G.spatial.query(G.px,G.py,G.autoRange);
for(const e of near){if(!e.isEnemy||e.dead)continue;const ea=angle(G.px,G.py,e.x,e.y);if(Math.abs(angleDiff(a,ea))<G.cleaveArc/2){damageEnemy(e,baseDmg,isCrit)}}
G.isAttacking=true;G.attackTimer=0.15;G.attackAngle=a;
if(fpsVal>=25)for(let j=-2;j<=2;j++){const sa=a+j*(G.cleaveArc/5);G.particles.push({x:G.px+Math.cos(sa)*G.autoRange*0.6,y:G.py+Math.sin(sa)*G.autoRange*0.6,dx:Math.cos(sa)*40,dy:Math.sin(sa)*40,lifetime:0.15,maxLifetime:0.15,size:4,color:'#88bbff',alpha:0.7})}
}else if(G.charId==='gunslinger'){
const count=Math.max(3,G.projCount);const spread=0.15;
for(let i=0;i<count;i++){const sa=a+(i-Math.floor(count/2))*spread;
G.projectiles.push({x:G.px,y:G.py,dx:Math.cos(sa),dy:Math.sin(sa),speed:ch.projSpeed,damage:baseDmg*0.7,piercing:G.piercing,owner:'player',lifetime:2,knockback:isCrit?2:1,isCrit})}
if(fpsVal>=25)G.particles.push({x:G.px+Math.cos(a)*15,y:G.py+Math.sin(a)*15,dx:0,dy:0,lifetime:0.08,maxLifetime:0.08,size:8,color:'#ffcc44',alpha:0.9})
}else if(G.charId==='shadow'){
// Combo system
G.comboStep=(G.comboStep||0)+1;if(G.comboStep>5)G.comboStep=1;
const comboMult=[1.0,1.0,1.0,1.2,1.5][G.comboStep-1];
const dmg=baseDmg*(ch.shadowBladeDmg||1.2)*comboMult;
if(G.comboStep===5){G.autoCDTimer=cd*1.2;G.comboStep=0}
damageEnemy(nearest,dmg,isCrit);
if(fpsVal>=25)for(let j=-2;j<=2;j++){const sa=a+j*0.15;G.particles.push({x:G.px+Math.cos(a)*20,y:G.py+Math.sin(a)*20,dx:Math.cos(sa)*80,dy:Math.sin(sa)*80,lifetime:0.15,maxLifetime:0.15,size:3,color:'#aa66ff',alpha:0.9})}
G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.4,maxLifetime:0.4,size:ch.size,color:'#8844cc',alpha:0.6,isAfterimage:true,facing:G.facing});
G.afterimages.push({target:nearest,timer:0.3,mult:G.afterimageMult})
}
// Sharpshooter knockback
if(G.charId==='gunslinger'&&isCrit){const ka=angle(G.px,G.py,nearest.x,nearest.y);nearest.x+=Math.cos(ka)*10*2;nearest.y+=Math.sin(ka)*10*2}
}

// ==================== AFTERIMAGE ====================
function updateAfterimages(dt){
for(let i=G.afterimages.length-1;i>=0;i--){
const a=G.afterimages[i];a.timer-=dt;
if(a.timer<=0){if(a.target&&!a.target.dead&&G.enemies.includes(a.target))damageEnemy(a.target,G.atk*G.atkMult*a.mult,false);
G.afterimages.splice(i,1)}
}
// Shadow clones from Time Warp
for(let i=G.clones.length-1;i>=0;i--){
const c=G.clones[i];c.timer-=dt;c.cdTimer-=dt;
if(c.timer<=0){G.clones.splice(i,1);continue}
if(c.cdTimer<=0){const near=findNearest(c.x,c.y,G.autoRange);if(near){damageEnemy(near,G.atk*G.atkMult*0.4,false);c.cdTimer=G.charDef.autoCD/G.atkSpd}}
c.x=lerp(c.x,G.px,0.02);c.y=lerp(c.y,G.py,0.02)
}
}

// ==================== ULTIMATE ====================
function activateUlt(){
if(!G||G.ultCDTimer>0||G.ultActive)return;
const ch=G.charDef;G.ultActive=true;G.ultTimer=G.ultDuration||ch.ultDuration;
G.ultCDTimer=ch.ultCD*(G.ultCDMult||1);G.ultSpecialTimer=0;
G.screenShake=0.2;G.shakeIntensity=5;G.screenFlash=0.15;G.flashColor=ch.color;
if(fpsVal>=25)for(let i=0;i<20;i++){const a2=Math.PI*2/20*i;G.particles.push({x:G.px,y:G.py,dx:Math.cos(a2)*150,dy:Math.sin(a2)*150,lifetime:0.5,maxLifetime:0.5,size:4,color:ch.color,alpha:0.8})}
if(G.charId==='shadow'){G.clones=[];const nc=G.ultClones||ch.ultClones;for(let i=0;i<nc;i++)G.clones.push({x:G.px+rand(-30,30),y:G.py+rand(-30,30),timer:G.ultDuration,cdTimer:0});
G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.6,maxLifetime:0.6,size:20,color:'#8844cc',alpha:0.8,isRing:true,expandRate:150})}
}

function updateUlt(dt){
if(!G.ultActive)return;
G.ultTimer-=dt;
G.ultSpecialTimer-=dt;
if(G.ultTimer<=0){G.ultActive=false;G.clones=[];return}
if(G.charId==='guardian'){
if(G.ultSpecialTimer<=0){G.ultSpecialTimer=1.5;
const range=G.ultShockwaveRange||120;const dmg=G.charDef.ultShockwaveDmg||25;
const near=G.spatial.query(G.px,G.py,range);
for(const e of near){if(e.isEnemy&&!e.dead&&dist(e.x,e.y,G.px,G.py)<range)damageEnemy(e,dmg,false)}
G.screenShake=0.15;G.shakeIntensity=4;
if(fpsVal>=25)G.particles.push({x:G.px,y:G.py,dx:0,dy:0,lifetime:0.4,maxLifetime:0.4,size:range,color:'#4488cc',alpha:0.4,isRing:true,expandRate:60})
}}else if(G.charId==='gunslinger'){
if(G.ultSpecialTimer<=0){G.ultSpecialTimer=0.35;
const count=G.ultBullets||3;const a=angle(G.px,G.py,G.px+Math.cos(G.facing),G.py+Math.sin(G.facing));
const spread=0.15;const baseDmg=G.atk*G.atkMult;
for(let i=0;i<count;i++){const sa=a+(i-Math.floor(count/2))*spread;
G.projectiles.push({x:G.px,y:G.py,dx:Math.cos(sa),dy:Math.sin(sa),speed:8,damage:baseDmg,piercing:G.ultPierce||2,owner:'player',lifetime:2,knockback:1,isCrit:false})}
}}}