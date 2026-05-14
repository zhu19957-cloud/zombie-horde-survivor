// ==================== SCREENS ====================
function switchScreen(s){
document.querySelectorAll('.overlay').forEach(e=>e.classList.remove('active'));
screen=s;
const map={title:'titleScreen',charSelect:'charSelect',shop:'shopScreen',stageSelect:'stageSelect',
levelUp:'levelUpOverlay',results:'resultsScreen',pause:'pauseOverlay'};
if(map[s])document.getElementById(map[s]).classList.add('active');
if(s==='shop')renderShop();if(s==='stageSelect')renderStageSelect();if(s==='charSelect')renderCharSelect();
if(s==='results'){document.getElementById('resultsBtn').textContent=s==='results'?t('shop'):'';
document.getElementById('resultsBtn').onclick=()=>switchScreen('shop')}
refreshUI()
}
function selectChar(id){selChar=id;switchScreen('stageSelect')}
function resumeGame(){G.paused=false;switchScreen('inGame')}
function restartRun(){startRun(G.stage)}
function quitRun(){saveData.gold+=Math.floor(G.totalGoldEarned);saveData.totalRuns++;saveSave();G=null;switchScreen('shop')}

// ==================== CHAR SELECT ====================
function renderCharSelect(){
const c=document.getElementById('charCards');c.innerHTML='';
const chars=[
{id:'guardian',css:'guardian',style:'background:#4488cc;border-radius:4px',
nameKey:'charGuardian',roleKey:'roleTank',atkKey:'cleave',passKey:'fortify',ultKey:'fortress',
atkDK:'cleaveDesc',passDK:'fortifyDesc',ultDK:'fortressDesc',
stats:'HP: 120 | ATK: 12<br>SPD: 2.0 | ATKSPD: 1.25<br>CRIT: 5% | CRITDMG: 150%'},
{id:'gunslinger',css:'gunslinger',style:'background:#cc8844;transform:rotate(45deg);border-radius:2px',
nameKey:'charGunslinger',roleKey:'roleRanged',atkKey:'shoot',passKey:'sharpshooter',ultKey:'bulletHell',
atkDK:'shootDesc',passDK:'sharpshooterDesc',ultDK:'bulletHellDesc',
stats:'HP: 70 | ATK: 10<br>SPD: 2.5 | ATKSPD: 2.0<br>CRIT: 10% | CRITDMG: 200%'},
{id:'shadow',css:'shadow',style:'background:#8844cc;clip-path:polygon(50% 0%,0% 100%,100% 100%)',
nameKey:'charShadow',roleKey:'roleAssassin',atkKey:'dashStrike',passKey:'afterimage',ultKey:'timeWarp',
atkDK:'dashStrikeDesc',passDK:'afterimageDesc',ultDK:'timeWarpDesc',
stats:'HP: 80 | ATK: 9<br>SPD: 3.5 | ATKSPD: 1.67<br>CRIT: 20% | CRITDMG: 180%'}
];
chars.forEach(ch=>{
const d=document.createElement('div');d.className='char-card '+ch.css;
d.innerHTML=`<div class="char-icon" style="${ch.style}"></div>
<h3 style="color:${CHARS[ch.id].color}">${t(ch.nameKey)}</h3>
<div class="role">${t(ch.roleKey)}</div>
<div class="stats">${ch.stats}</div>
<div class="ability"><b>${t(ch.atkKey)}</b>: ${t(ch.atkDK)}<br><b>${t(ch.passKey)}</b>: ${t(ch.passDK)}<br><b>${t(ch.ultKey)}</b>: ${t(ch.ultDK)}</div>`;
d.addEventListener('click',()=>selectChar(ch.id));c.appendChild(d)})
}

// ==================== SHOP ====================
let talentNodes=[];
function renderShop(){
document.getElementById('shopGold').textContent=t('gold')+': '+saveData.gold;
const tc=document.getElementById('talentCanvas');
const cw=Math.min(660,window.innerWidth-20),ch2=Math.min(500,window.innerHeight-120);
tc.width=cw;tc.height=ch2;
const c2=tc.getContext('2d');
c2.fillStyle='#0a0a0a';c2.fillRect(0,0,cw,ch2);
talentNodes=[];
const branches=Object.keys(TALENT_TREE);
const bw=cw/3;
for(let bi=0;bi<branches.length;bi++){
const bk=branches[bi],branch=TALENT_TREE[bk];
const bx=bw*bi+bw/2;
// Branch title
c2.fillStyle=branch.color;c2.font='bold 16px sans-serif';c2.textAlign='center';
c2.fillText(branch.name,bx,25);
// Draw connection lines
for(const t of branch.talents){
const ty=55+t.tier*100;
for(const pid of t.prereqs){
const pt=TALENT_LIST.find(x=>x.id===pid);
if(pt){
const py=55+pt.tier*100;
const px=bw*branches.indexOf(pt.branch)+bw/2;
c2.strokeStyle=branch.color+'44';c2.lineWidth=2;c2.beginPath();c2.moveTo(px,py+20);c2.lineTo(bx,ty-20);c2.stroke()
}}}
// Draw nodes
for(const t of branch.talents){
const ny=55+t.tier*100;const lvl=getTalentLvl(t.id);const maxed=lvl>=t.maxLvl;
const canBuy=canUnlockTalent(t);
const r=isMobile?30:20;
talentNodes.push({id:t.id,x:bx,y:ny,r});
// Node circle
if(maxed){c2.fillStyle=branch.color;c2.strokeStyle=branch.color}
else if(canBuy){c2.fillStyle='#1a1a1a';c2.strokeStyle='#ffcc00'}
else if(lvl>0){c2.fillStyle='#1a1a1a';c2.strokeStyle=branch.color}
else{c2.fillStyle='#111';c2.strokeStyle='#444'}
c2.lineWidth=maxed?3:canBuy?2.5:1.5;
c2.beginPath();c2.arc(bx,ny,r,0,Math.PI*2);c2.fill();c2.stroke();
// Level text
c2.fillStyle=maxed?'#111':'#ccc';c2.font='bold 11px sans-serif';c2.textAlign='center';
c2.fillText(lvl+'/'+t.maxLvl,bx,ny+4);
// Name below
c2.fillStyle=maxed?branch.color:'#888';c2.font='10px sans-serif';
c2.fillText(t.name,bx,ny+r+14);
// Cost
if(!maxed){c2.fillStyle=canBuy?'#ffcc00':'#666';c2.font='9px sans-serif';
c2.fillText(t.cost(lvl+1)+'g',bx,ny+r+26)}
}}
// Click handler for talent canvas (bind once)
const tc2=document.getElementById('talentCanvas');
if(!tc2._clickBound){tc2._clickBound=true;
const handleTalentTap=function(ev){
let mx,my;
if(ev.touches&&ev.touches.length>0){const touch=ev.touches[0];const rect=tc2.getBoundingClientRect();mx=touch.clientX-rect.left;my=touch.clientY-rect.top}
else{const rect=tc2.getBoundingClientRect();mx=ev.clientX-rect.left;my=ev.clientY-rect.top}
for(const n of talentNodes){
if(Math.hypot(mx-n.x,my-n.y)>n.r)continue;
const t=TALENT_LIST.find(x=>x.id===n.id);
if(!t||!canUnlockTalent(t))break;
const cost=t.cost(getTalentLvl(t.id));
saveData.gold-=cost;saveData.talents[t.id]=(saveData.talents[t.id]||0)+1;saveSave();renderShop();
break
}};
tc2.addEventListener('click',handleTalentTap);
tc2.addEventListener('touchstart',function(ev){ev.preventDefault();handleTalentTap(ev)},{passive:false})
}}

// ==================== STAGE SELECT ====================
function renderStageSelect(){
const c=document.getElementById('stageCards');c.innerHTML='';
const diffs=['×1.0','×1.5','×2.0','×2.5','×3.0','×4.0'];
for(let i=1;i<=6;i++){
const u=saveData.unlockedStages.includes(i);
const d=document.createElement('div');d.className='stage-card'+(u?'':' locked');
if(u)d.addEventListener('click',()=>startRun(i));
d.innerHTML=`<h4>${t('stage')} ${i}</h4><div style="font-size:12px;pointer-events:none">${t('stageNames')[i-1]}</div>
<div class="boss-name">${t('boss')}: ${t('bossNames')[i-1]}</div>
<div class="diff">${t('difficulty')}: ${diffs[i-1]}</div>
${u?`<div style="color:#cc3333;font-size:11px;margin-top:4px;pointer-events:none">${t('clickToStart')}</div>`
:`<div class="lock-text">${t('locked')}</div>`}`;
c.appendChild(d)}
}

// ==================== LEVEL UP ====================
function showLevelUp(){
G.paused=true;
const avail=UPGRADES.filter(u=>!u.charReq||u.charReq===G.charId);
const picks=[],pool=[...avail],pickedIds=new Set();
const isRareLvl=(G.level===5||G.level===10||G.level===15);
for(let i=0;i<3&&pool.length>0;i++){
const roll=Math.random();let cat;
if(roll<0.30)cat='off';else if(roll<0.55)cat='def';else if(roll<0.75)cat='util';else if(roll<0.90)cat='spec';else cat='char';
const catPool=pool.filter(u=>u.cat===cat&&!pickedIds.has(u.id));
const usePool=catPool.length>0?catPool:pool.filter(u=>!pickedIds.has(u.id));
const finalPool=usePool.length>0?usePool:pool;
const tw=finalPool.reduce((s,u)=>s+u.weight,0);
let r=Math.random()*tw,pick=finalPool[0];
for(const u of finalPool){r-=u.weight;if(r<=0){pick=u;break}}
const isRare=isRareLvl&&i===0;
picks.push({...pick,rare:isRare});pickedIds.add(pick.id);
const idx=pool.indexOf(pick);if(idx>=0)pool.splice(idx,1)
}
const cont=document.getElementById('upgradeCards');cont.innerHTML='';
document.getElementById('luTitle').textContent=t('levelUp');
picks.forEach(pick=>{
const card=document.createElement('div');card.className='upgrade-card'+(pick.rare?' rare':'');
let desc=t(pick.id+'Desc');
if(pick.rare)desc=desc.replace(/(\+?)(\d+\.?\d*)(%?)/g,(m,p,ns,pc)=>{const n=parseFloat(ns);return isNaN(n)?m:(p||'')+(n*1.8)+(pc||'')});
card.innerHTML=`<h4>${t(pick.id)}</h4><div class="desc">${desc}</div>${pick.rare?`<div class="rarity-label">${t('rare18x')}</div>`:''}`;
card.onclick=()=>{
const stacks=G.upgradeStacks[pick.id]||0;
const n=pick.rare?1.8*Math.pow(0.75,stacks):Math.pow(0.75,stacks);
pick.apply(G,n);
G.upgradeStacks[pick.id]=(G.upgradeStacks[pick.id]||0)+1;
if(G.orbitalShield>0&&G.orbitalOrbs.length===0)initOrbitalOrbs();
if(G.pendingLevelUps>0){G.pendingLevelUps--;showLevelUp()}
else{G.paused=false;switchScreen('inGame')}
};cont.appendChild(card)});
switchScreen('levelUp')
}