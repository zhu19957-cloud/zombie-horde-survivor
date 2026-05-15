// ==================== INPUT ====================
window.addEventListener('keydown',e=>{
keys.add(e.code);
if(e.code==='Space'){e.preventDefault();if(G&&screen==='inGame')activateUlt()}
if(e.code==='Escape'){e.preventDefault();if(G&&screen==='inGame'){G.paused=true;switchScreen('pause')}}
});
window.addEventListener('keyup',e=>keys.delete(e.code));

// ==================== MOBILE TOUCH ====================
const isMobile=('ontouchstart' in window)||navigator.maxTouchPoints>0;

// Virtual joystick state
let joyTouchId=null,joyOrigin=null,joyDir={x:0,y:0},joyActive=false;
const JOY_RADIUS=50,JOY_DEAD=8;

// Button touch state
let btnTouchId=null;

function handleTouchStart(e){
e.preventDefault();
for(let i=0;i<e.changedTouches.length;i++){
const t=e.changedTouches[i];
const x=t.clientX,y=t.clientY;
const isRight=x>window.innerWidth*0.6;
if(!isRight&&joyTouchId===null){
// Left side: joystick
joyTouchId=t.identifier;joyOrigin={x,y};joyActive=true;joyDir={x:0,y:0}
}else if(isRight&&btnTouchId===null){
// Right side: buttons
btnTouchId=t.identifier;
checkMobileButtons(x,y)
}
}
}

function handleTouchMove(e){
e.preventDefault();
for(let i=0;i<e.changedTouches.length;i++){
const t=e.changedTouches[i];
if(t.identifier===joyTouchId&&joyOrigin){
const dx=t.clientX-joyOrigin.x,dy=t.clientY-joyOrigin.y;
const len=Math.hypot(dx,dy);
if(len>JOY_DEAD){
const clampedLen=Math.min(len,JOY_RADIUS);
joyDir={x:dx/Math.max(1,len),y:dy/Math.max(1,len)};
const ratio=clampedLen/JOY_RADIUS;
keys.clear();
if(joyDir.x<-0.25)keys.add('KeyA');if(joyDir.x>0.25)keys.add('KeyD');
if(joyDir.y<-0.25)keys.add('KeyW');if(joyDir.y>0.25)keys.add('KeyS');
}else{joyDir={x:0,y:0};keys.clear()}
}
}
}

function handleTouchEnd(e){
e.preventDefault();
for(let i=0;i<e.changedTouches.length;i++){
const t=e.changedTouches[i];
if(t.identifier===joyTouchId){
joyTouchId=null;joyOrigin=null;joyActive=false;joyDir={x:0,y:0};keys.clear()
}
if(t.identifier===btnTouchId)btnTouchId=null
}
}

function checkMobileButtons(x,y){
if(!G||screen!=='inGame')return;
const w=window.innerWidth,h=window.innerHeight;
// Ult button: bottom-right area
const ultX=w-60,ultY=h-70,ultR=30;
if(Math.hypot(x-ultX,y-ultY)<ultR*1.5){activateUlt();return}
// Pause button: top-right corner
if(x>w-50&&y<50){G.paused=true;switchScreen('pause')}
}

// Bind touch events
if(isMobile){
canvas.addEventListener('touchstart',handleTouchStart,{passive:false});
canvas.addEventListener('touchmove',handleTouchMove,{passive:false});
canvas.addEventListener('touchend',handleTouchEnd,{passive:false});
canvas.addEventListener('touchcancel',handleTouchEnd,{passive:false})
}

// ==================== UI REFRESH ====================
function refreshUI(){
const b=document.getElementById('startBtn');if(b)b.textContent=t('startGame');
const sb=document.getElementById('shopBtn');if(sb)sb.textContent=t('shop');
const sub=document.getElementById('titleSub');if(sub)sub.textContent='SURVIVOR';
const cst=document.getElementById('charTitle');if(cst)cst.textContent=t('chooseSurvivor');
const st=document.getElementById('shopTitle');if(st)st.textContent=t('permanentUpgrades');
const sst=document.getElementById('stageTitle');if(sst)sst.textContent=t('selectStage');
const lut=document.getElementById('luTitle');if(lut)lut.textContent=t('levelUp');
const pt=document.getElementById('pauseTitle');if(pt)pt.textContent=t('paused');
const rb=document.getElementById('resumeBtn');if(rb)rb.textContent=t('resume');
const rsb=document.getElementById('restartBtn');if(rsb)rsb.textContent=t('restart');
const qb=document.getElementById('quitBtn');if(qb)qb.textContent=t('quitToTalents');
document.querySelectorAll('.lang-btn').forEach(b=>b.textContent='EN/中文');
if(screen==='shop')renderShop();if(screen==='stageSelect')renderStageSelect();if(screen==='charSelect')renderCharSelect()
}

// ==================== INIT ====================
loadSave();refreshUI();requestAnimationFrame(gameLoop);