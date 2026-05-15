// ==================== DAMAGE ====================
function damageEnemy(enemy,dmg,isCrit){
if(enemy.dead)return;
if(enemy.flashTimer<=0)enemy.flashTimer=0.1;
const isBack=false;// simplified: no backstab for now
if(enemy.type==='shielder'&&!enemy.isBoss){const shieldDmg=Math.min(enemy.shieldHP,dmg);enemy.shieldHP-=shieldDmg;dmg-=shieldDmg;if(dmg<=0)return}
if(enemy.isBoss&&enemy.shieldHP>0){const shieldDmg=Math.min(enemy.shieldHP,dmg);enemy.shieldHP-=shieldDmg;dmg-=shieldDmg}
let finalDmg=Math.max(1,Math.round(dmg*G.weakenMult));
if(isCrit)finalDmg=Math.round(finalDmg*G.critDmg);
enemy.hp-=finalDmg;
// Execute check
if(G.executeThreshold>0&&enemy.hp>0&&enemy.hp/enemy.maxHp<G.executeThreshold&&!enemy.dead&&!enemy.isBoss){finalDmg+=Math.round(enemy.hp);enemy.hp=0}
addFloat(enemy.x,enemy.y-enemy.size,(isCrit?'CRIT ':'')+finalDmg,isCrit?'#ffcc00':'#fff',clamp(10+finalDmg*0.3,10,30));
if(isCrit){G.screenShake=0.08;G.shakeIntensity=2}
if(G.lifeSteal>0)G.hp=Math.min(G.maxHP,G.hp+finalDmg*G.lifeSteal);
if(G.chainChance>0&&Math.random()<G.chainChance){
const near=G.spatial.query(enemy.x,enemy.y,80);
for(const ne of near){if(ne.isEnemy&&!ne.dead&&ne!==enemy&&dist(ne.x,ne.y,enemy.x,enemy.y)<80){
const cd=Math.round(finalDmg*G.chainDmg);damageEnemy(ne,cd,false);
addFloat(ne.x,ne.y-ne.size,cd,'#88ccff',10);
G.particles.push({x:enemy.x,y:enemy.y,dx:0,dy:0,lifetime:0.15,maxLifetime:0.15,size:2,color:'#ffff44',alpha:1,isArc:true,tx:ne.x,ty:ne.y});break}}
}
if(G.burnDmg>0)enemy.burnTimer=G.burnDur;
if(enemy.hp<=0&&!enemy.dead)killEnemy(enemy)
}

function killEnemy(enemy){
if(enemy.dead)return;enemy.dead=true;
const stageGoldMult=1+0.2*(G.stage-1);
let effMult=Math.min(3,stageGoldMult*G.goldMult);
if(G.fortune>0&&Math.random()<G.fortune)effMult*=2;
let goldAmt=Math.round(enemy.gold*effMult);
if(G.totalGoldEarned+goldAmt>GOLD_CAP){goldAmt=Math.max(0,GOLD_CAP-Math.floor(G.totalGoldEarned));G.goldCapReached=true}
G.gold+=goldAmt;G.totalGoldEarned+=goldAmt;
if(goldAmt>0)addFloat(enemy.x,enemy.y-enemy.size-8,'+'+goldAmt+'g','#ffcc00',11);
const stageXPMult=1+0.3*(G.stage-1);
G.xpOrbs.push({x:enemy.x,y:enemy.y,xp:Math.round(enemy.xp*stageXPMult),lifetime:30});
if(G.frozenTrail)G.frozenTrailSegs.push({x:enemy.x,y:enemy.y,lifetime:1.5,slow:G.frozenTrailSlow});
if(enemy.type==='necrotic')G.hazards.push({type:'toxic',x:enemy.x,y:enemy.y,radius:50,damage:G.stage>=5?6:5,damageType:'slow',slowAmt:0.2,warningTimer:0.5,activeTimer:6,stageOrigin:G.stage});
if(enemy.type==='bomber'&&!enemy.isBoss)G.explosions.push({x:enemy.x,y:enemy.y,timer:0.5,radius:60,damage:enemy.damage});
if(fpsVal>=25)for(let i=0;i<randInt(3,5);i++)G.particles.push({x:enemy.x,y:enemy.y,dx:rand(-60,60),dy:rand(-60,60),lifetime:0.5,maxLifetime:0.5,size:rand(2,4),color:enemy.color,alpha:1});
if(fpsVal>=25&&(enemy.special||enemy.isBoss))G.particles.push({x:enemy.x,y:enemy.y,dx:0,dy:0,lifetime:0.3,maxLifetime:0.3,size:enemy.size/2,color:enemy.color,alpha:0.8,isRing:true,expandRate:80});
G.kills++;G.waveKillCount++;G.comboCount++;G.comboTimer=3;
if(G.comboCount===10||G.comboCount===20||G.comboCount===30){G.xpOrbs.push({x:G.px,y:G.py,xp:G.comboCount*2,lifetime:30});addFloat(G.px,G.py-50,G.comboCount+'x COMBO!','#ff8800',22)}
if(enemy.isBoss){G.bossDefeated=true;G.boss=null;addFloat(G.px,G.py-60,t('bossDefeated'),'#ffcc00',28);G.screenShake=0.5;G.shakeIntensity=8;for(let i=0;i<5;i++)G.xpOrbs.push({x:enemy.x+rand(-20,20),y:enemy.y+rand(-20,20),xp:10,lifetime:30})}
}

function damagePlayer(dmg,src){
if(G.iFrames>0||G.ultActive&&G.charId==='guardian')return;
if((G.dodgeChance||0)>0&&Math.random()<G.dodgeChance){addFloat(G.px,G.py-20,t('dodge'),'#88ccff',14);return}
if(G.hasShield&&G.shieldReady){G.shieldReady=false;G.shieldTimer=G.shieldCD;addFloat(G.px,G.py-20,t('blocked'),'#88ccff',14);return}
let finalDmg=Math.max(1,dmg-G.armor);
finalDmg=Math.round(finalDmg*G.defMult*(1-(G.fortifyDR||0)));
G.hp-=finalDmg;G.iFrames=0.2;G.screenShake=0.15;G.shakeIntensity=3;
addFloat(G.px,G.py-15,'-'+finalDmg,'#ff4444',14);
// Unbreakable: below 20% HP gain 50% DR for 3s
if(!G.unbreakableActive&&G.hp>0&&G.hp/G.maxHP<0.2&&saveData.talents&&saveData.talents.unbreakable){G.unbreakableActive=true;G.unbreakableTimer=3;addFloat(G.px,G.py-30,'UNBREAKABLE!','#4488ff',18)}
if(G.thorns>0&&src&&src.isEnemy&&!src.dead){const th=Math.round(finalDmg*G.thorns);src.hp-=th;if(src.hp<=0&&!src.dead)killEnemy(src)}
if(G.hp<=0){
// Last Stand: revive once at 30% HP
if(!G.lastStandUsed&&saveData.talents&&saveData.talents.lastStand){G.lastStandUsed=true;G.hp=Math.round(G.maxHP*0.3);G.iFrames=1.5;addFloat(G.px,G.py-30,'LAST STAND!','#44ff44',22)}
else{G.runOver=true;G.stageFailed=true;endRun(false)}
}
}