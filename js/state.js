// ==================== GAME STATE ====================
let screen='title',selChar=null,G=null,keys=new Set();
let fpsCnt=0,fpsT=0,fpsVal=60;

function createEnemy(type,x,y,dm){
const d=ENEMY_DEFS[type];
const wm=G?WAVE_MULT[Math.min(G.waveNumber||1,WAVE_MULT.length-1)]:1;
const hp=d.hp*dm*wm,maxHp=hp,dmg=d.dmg*(0.7+0.3*dm)*wm,spd=d.speed*(0.85+0.15*dm)*(1+(wm-1)*0.3);
return{type,x,y,hp,maxHp,speed:spd,damage:dmg,
size:d.size,color:d.color,gold:d.gold,xp:d.xp,special:d.special,facing:0,
specialTimer:type==='spitter'?1:0,flashTimer:0,isBoss:false,bossPhase:0,isElite:false,
healPulseTimer:0,contactCD:0,dead:false,isEnemy:true,fadeIn:0.3,
burnTimer:0,frozenTimer:0,
chargeTimer:type==='charger'?2:0,isCharging:false,chargeDir:0,chargeDur:0,
teleportCD:type==='teleporter'?2:0,shootCD:type==='teleporter'?1.5:0,
shieldHP:type==='shielder'?15*dm*wm:0,previewTimer:0}
}

function startRun(stage){
if(!selChar){switchScreen('charSelect');return}
const ch=CHARS[selChar],tl=saveData.talents||{},sd=STAGE_DEFS[stage-1];
const hs=tl.headStart||0;
G={
charId:selChar,stage:stage,charDef:ch,sd:sd,
hp:ch.baseHP,maxHP:ch.baseHP,
atk:ch.baseATK,spd:ch.baseSPD,
atkSpd:ch.baseATKSPD,
crit:ch.baseCRIT,critDmg:ch.baseCRITDMG,
armor:0,hpRegen:0,dodgeChance:0,thorns:0,lifeSteal:0,
pickupRange:PICKUP_R,goldMult:1,xpMult:1,ultCDMult:1,
hasShield:false,shieldCD:18,shieldReady:false,shieldTimer:0,
projCount:1,piercing:0,cleaveArc:ch.cleaveArc||Math.PI*2/3,
afterimageMult:ch.afterimageMult||0.4,attackCounter:0,
chainChance:0,chainDmg:0.4,burnDmg:0,burnDur:0,
magnetField:0,fortune:0,
orbitalShield:0,lightningAuraDmg:0,lightningAuraCD:2.5,lightningAuraTimer:0,
frozenTrail:false,frozenTrailSlow:0.3,frozenTrailTimer:0,
whirlwind:false,whirlwindRange:50,whirlwindCD:6,whirlwindTimer:0,
ultShockwaveRange:ch.ultShockwaveRange||0,ultDuration:ch.ultDuration||0,
ultBullets:ch.ultBullets||0,ultClones:ch.ultClones||0,
px:0,py:0,facing:0,
level:hs,xp:0,xpToNext:15*(hs+1)+5*hs,
gold:0,totalGoldEarned:0,goldCapReached:false,kills:0,
autoRange:ch.autoRange,autoCDTimer:0,
ultCDTimer:0,ultActive:false,ultTimer:0,ultSpecialTimer:0,
clones:[],
gameTime:0,paused:false,
spawnTimer:0,specialSpawnTimer:20,bossEntranceTimer:0,
bossSpawned:false,bossDefeated:false,boss:null,
waveKillCount:0,waveKillTarget:Math.round(sd.enemiesPerWave*sd.diffMult),waveNumber:1,waveBreakTimer:2,totalWaves:sd.totalWaves,
stageComplete:false,stageFailed:false,stageTime:sd.timer,
enemies:[],projectiles:[],xpOrbs:[],particles:[],floatingTexts:[],
afterimages:[],explosions:[],frozenTrailSegs:[],orbitalOrbs:[],
hazards:[],hazardTimer:0,
fieldPowerUp:null,powerUpSpawnTimer:rand(25,40),
activePowerUp:null,
spatial:new SpatialHash(CELL),
screenShake:0,shakeIntensity:0,screenFlash:0,flashColor:'#fff',
bossHPPercent:1,runOver:false,iFrames:0,isAttacking:false,attackTimer:0,attackAngle:0,
weakenMult:1,weakenTimer:0,stunTimer:0,
comboCount:0,comboTimer:0,comboStep:0,
atkMult:1,spdMult:1,defMult:1,atkSpdMult:1,healPS:0,
upgradeStacks:{},pendingLevelUps:0,
waveAnnounceTimer:0,lastWave:1,
waveEvent:null,waveEventTriggered:false,
hazardSlow:0,fortifyDR:0,
unbreakableActive:false,unbreakableTimer:0,
lastStandUsed:false,executeThreshold:0.15,
};
if(G.level>0){for(let i=0;i<G.level;i++)applySilentUpgrade();G.xpToNext=xpForLevel(G.level)}
applyTalentEffects(saveData.talents||{},G);
G.hp=Math.min(G.hp,G.maxHP);
if(G.orbitalShield>0)initOrbitalOrbs();
switchScreen('inGame')
}
function xpForLevel(lv){return 15*(lv+1)+5*lv}

function applySilentUpgrade(){
const avail=UPGRADES.filter(u=>!u.charReq||u.charReq===G.charId);
const pick=avail[randInt(0,avail.length-1)];
const stacks=G.upgradeStacks[pick.id]||0;
const n=Math.pow(0.75,stacks);
pick.apply(G,n);
G.upgradeStacks[pick.id]=(G.upgradeStacks[pick.id]||0)+1
}
function initOrbitalOrbs(){G.orbitalOrbs=[];const c=G.orbitalShield;for(let i=0;i<c;i++)G.orbitalOrbs.push({angle:Math.PI*2/c*i,cd:{}})}