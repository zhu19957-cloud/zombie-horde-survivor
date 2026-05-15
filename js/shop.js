// ==================== TALENT TREE ====================
const TALENT_TREE={
might:{name:'Might',color:'#cc4444',talents:[
{id:'power',maxLvl:10,cost:l=>Math.round(50*(l+1)),tier:1,prereqs:[]},
{id:'fury',maxLvl:5,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['power']},
{id:'precision',maxLvl:5,cost:l=>Math.round(100*(l+1)),tier:3,prereqs:['fury']},
{id:'force',maxLvl:5,cost:l=>Math.round(200*(l+1)),tier:4,prereqs:['fury','precision']},
{id:'critMastery',maxLvl:5,cost:l=>Math.round(120*(l+1)),tier:3,prereqs:['precision']},
{id:'burningTouch',maxLvl:1,cost:l=>300,tier:3,prereqs:['force']},
{id:'chainReaction',maxLvl:1,cost:l=>300,tier:3,prereqs:['force']},
{id:'execute',maxLvl:1,cost:l=>500,tier:4,prereqs:['critMastery','burningTouch']},
{id:'bladeMaster',maxLvl:3,cost:l=>Math.round(250*(l+1)),tier:4,prereqs:['critMastery']},
{id:'shadowFury',maxLvl:3,cost:l=>Math.round(200*(l+1)),tier:4,prereqs:['bladeMaster']},
{id:'warlord',maxLvl:1,cost:l=>800,tier:5,prereqs:['execute','bladeMaster']}
]},
resilience:{name:'Resilience',color:'#4488cc',talents:[
{id:'vitality',maxLvl:20,cost:l=>Math.round(50*(l+1)),tier:1,prereqs:[]},
{id:'armor',maxLvl:8,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['vitality']},
{id:'regen',maxLvl:5,cost:l=>Math.round(120*(l+1)),tier:3,prereqs:['armor']},
{id:'fortitude',maxLvl:1,cost:l=>500,tier:3,prereqs:['armor','regen']},
{id:'swiftReflexes',maxLvl:5,cost:l=>Math.round(150*(l+1)),tier:3,prereqs:['fortitude']},
{id:'vampiric',maxLvl:1,cost:l=>400,tier:3,prereqs:['regen','agility']},
{id:'fortressMastery',maxLvl:3,cost:l=>Math.round(200*(l+1)),tier:4,prereqs:['fortitude']},
{id:'unbreakable',maxLvl:1,cost:l=>600,tier:4,prereqs:['swiftReflexes','fortressMastery']},
{id:'lastStand',maxLvl:1,cost:l=>700,tier:4,prereqs:['vampiric']},
{id:'ironWill',maxLvl:3,cost:l=>Math.round(250*(l+1)),tier:5,prereqs:['unbreakable']},
{id:'phoenix',maxLvl:1,cost:l=>1000,tier:5,prereqs:['lastStand','ironWill']}
]},
fortune:{name:'Fortune',color:'#ccaa44',talents:[
{id:'greed',maxLvl:10,cost:l=>Math.round(200*(l+1)),tier:1,prereqs:[]},
{id:'agility',maxLvl:5,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['greed']},
{id:'xpBoost',maxLvl:5,cost:l=>Math.round(150*(l+1)),tier:3,prereqs:['agility']},
{id:'headStart',maxLvl:3,cost:l=>Math.round(300*(l+1)),tier:3,prereqs:['agility','xpBoost']},
{id:'goldMagnet',maxLvl:5,cost:l=>Math.round(120*(l+1)),tier:3,prereqs:['agility']},
{id:'frostWalk',maxLvl:1,cost:l=>400,tier:3,prereqs:['goldMagnet','armor']},
{id:'xpAccelerator',maxLvl:5,cost:l=>Math.round(180*(l+1)),tier:4,prereqs:['xpBoost']},
{id:'fortune',maxLvl:3,cost:l=>Math.round(250*(l+1)),tier:4,prereqs:['greed','xpBoost']},
{id:'treasureHunter',maxLvl:1,cost:l=>600,tier:4,prereqs:['fortune','goldMagnet']},
{id:'mastery',maxLvl:3,cost:l=>Math.round(300*(l+1)),tier:5,prereqs:['xpAccelerator','precision']}
]}
};
const TALENT_LIST=[];
for(const bk in TALENT_TREE)for(const t of TALENT_TREE[bk].talents)TALENT_LIST.push({...t,branch:bk});
function getTalentLvl(id){return(saveData.talents&&saveData.talents[id])||0}
function canUnlockTalent(t){
if(getTalentLvl(t.id)>=t.maxLvl)return false;
const cost=t.cost(getTalentLvl(t.id));
if(saveData.gold<cost)return false;
for(const pid of t.prereqs){const pt=TALENT_LIST.find(x=>x.id===pid);if(!pt||getTalentLvl(pid)<1)return false}
return true
}

// ==================== TALENT EFFECTS ====================
function applyTalentEffects(tl,G){
G.hp+=(tl.vitality||0)*5;G.maxHP+=(tl.vitality||0)*5;
G.atk+=(tl.power||0)*2+(tl.force||0)*2;
G.spd+=(tl.agility||0)*0.2;
G.atkSpd*=(1+(tl.fury||0)*0.12);
G.crit+=(tl.precision||0)*0.02;
G.critDmg+=(tl.critMastery||0)*0.1;
G.armor+=(tl.armor||0)*2;
G.hpRegen+=(tl.regen||0)*0.8;
G.goldMult=1+(tl.greed||0)*0.1;
G.xpMult=1+(tl.xpBoost||0)*0.15+(tl.xpAccelerator||0)*0.1;
G.pickupRange=PICKUP_R+(tl.goldMagnet||0)*0.15*PICKUP_R;
G.hasShield=!!(tl.fortitude||0);
if(tl.fortitude)G.shieldReady=true;
G.dodgeChance=(tl.swiftReflexes||0)*0.03;
G.lifeSteal+=(tl.vampiric||0)*0.03;
if(tl.fortressMastery>0)G.shieldCD=Math.max(8,18-(tl.fortressMastery)*2);
if(tl.frostWalk)G.frozenTrail=true;
if(tl.frostWalk)G.frozenTrailSlow=0.3;
G.fortune+=(tl.fortune||0)*0.10;
if(tl.burningTouch){G.burnDmg=2;G.burnDur=3}
if(tl.chainReaction){G.chainChance=0.20;G.chainDmg=0.4}
if(tl.bladeMaster>0)G.afterimageMult+=0.15*tl.bladeMaster;
if(tl.treasureHunter)G.goldMult*=1.15;
if(tl.mastery>0){G.atk*=(1+0.05*tl.mastery);G.maxHP*=(1+0.05*tl.mastery);G.spd*=(1+0.05*tl.mastery)}
if(tl.headStart>0){G.level+=tl.headStart;G.xpToNext=xpForLevel(G.level)}
if(tl.shadowFury>0){G.atkSpd*=(1+0.08*tl.shadowFury)}
}

// ==================== SAVE ====================
let saveData={gold:0,talents:{},unlockedStages:[1],totalRuns:0,totalKills:0,language:'en'};
function migrateOldSave(d){
if(!d.talents)d.talents={};
if(d.upgrades){const u=d.upgrades;
if(u.vitality)d.talents.vitality=Math.min(20,u.vitality);
if(u.power)d.talents.power=Math.min(10,u.power);
if(u.agility)d.talents.agility=Math.min(5,u.agility);
if(u.precision)d.talents.precision=Math.min(5,u.precision);
if(u.greed)d.talents.greed=Math.min(10,u.greed);
if(u.headStart)d.talents.headStart=Math.min(3,u.headStart);
if(u.might){d.talents.force=Math.min(5,u.might)}
if(u.armor)d.talents.armor=Math.min(8,u.armor);
if(u.regen)d.talents.regen=Math.min(5,u.regen);
if(u.fortitude)d.talents.fortitude=Math.min(1,u.fortitude);
if(u.xpBoost)d.talents.xpBoost=Math.min(5,u.xpBoost);
delete d.upgrades}
return d
}
function loadSave(){try{const r=localStorage.getItem(SAVE_KEY);if(r){const d=JSON.parse(r);saveData.gold=d.gold||0;saveData.unlockedStages=(d.unlockedStages&&d.unlockedStages.length>0)?d.unlockedStages:[1];saveData.totalRuns=d.totalRuns||0;saveData.totalKills=d.totalKills||0;saveData.language=d.language||'en';
const migrated=migrateOldSave(d);saveData.talents=migrated.talents||{};
// Ensure all talents exist
for(const t of TALENT_LIST)if(saveData.talents[t.id]===undefined)saveData.talents[t.id]=0;
}}catch(e){}lang=saveData.language||'en';
// Ensure all talents exist even without save data
for(const t of TALENT_LIST)if(saveData.talents[t.id]===undefined)saveData.talents[t.id]=0}
function saveSave(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(saveData))}catch(e){}}