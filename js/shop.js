// ==================== TALENT TREE ====================
const TALENT_TREE={
might:{name:'Might',color:'#cc4444',talents:[
{id:'power',name:'+2 ATK',maxLvl:10,cost:l=>Math.round(50*(l+1)),tier:1,prereqs:[]},
{id:'fury',name:'+12% ATK SPD',maxLvl:5,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['power']},
{id:'precision',name:'+2% Crit',maxLvl:5,cost:l=>Math.round(100*(l+1)),tier:3,prereqs:['fury','agility']},
{id:'might',name:'+15% Damage',maxLvl:3,cost:l=>Math.round(200*(l+1)),tier:4,prereqs:['fury','precision']}
]},
resilience:{name:'Resilience',color:'#4488cc',talents:[
{id:'vitality',name:'+5 HP',maxLvl:20,cost:l=>Math.round(50*(l+1)),tier:1,prereqs:[]},
{id:'armor',name:'+2 Armor',maxLvl:8,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['vitality']},
{id:'regen',name:'+0.8 HP/s',maxLvl:5,cost:l=>Math.round(120*(l+1)),tier:3,prereqs:['armor']},
{id:'fortitude',name:'Start with Shield',maxLvl:1,cost:l=>500,tier:4,prereqs:['armor','regen']}
]},
fortune:{name:'Fortune',color:'#ccaa44',talents:[
{id:'greed',name:'+10% Gold',maxLvl:10,cost:l=>Math.round(200*(l+1)),tier:1,prereqs:[]},
{id:'agility',name:'+0.2 SPD',maxLvl:5,cost:l=>Math.round(80*(l+1)),tier:2,prereqs:['greed']},
{id:'xpBoost',name:'+15% XP',maxLvl:5,cost:l=>Math.round(150*(l+1)),tier:3,prereqs:['agility']},
{id:'headStart',name:'Start Lv N',maxLvl:5,cost:l=>Math.round(300*(l+1)),tier:4,prereqs:['agility','xpBoost']}
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
if(u.headStart)d.talents.headStart=Math.min(5,u.headStart);
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