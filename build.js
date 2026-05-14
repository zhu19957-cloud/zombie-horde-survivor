const fs=require('fs');

const css=`*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{overflow:hidden;background:#111;font-family:'Segoe UI',Arial,sans-serif;color:#eee;user-select:none;-webkit-user-select:none;height:100%;width:100%}
#gameCanvas{display:block;position:absolute;top:0;left:0;touch-action:none;pointer-events:none}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;display:none;z-index:10;flex-direction:column;align-items:center;justify-content:center}
.overlay.active{display:flex}
#titleScreen{background:linear-gradient(180deg,#0a0a0a,#1a0a0a)}
#titleScreen h1{font-size:48px;color:#cc3333;text-shadow:0 0 20px #cc333366;letter-spacing:4px;margin-bottom:8px}
#titleScreen .sub{font-size:16px;color:#888;margin-bottom:32px}
.lang-btn{position:absolute;top:12px;right:12px;padding:8px 14px;font-size:13px;border:1px solid #666;background:rgba(0,0,0,.6);color:#aaa;cursor:pointer;z-index:25;border-radius:4px;min-height:36px}
.lang-btn:hover,.lang-btn:active{border-color:#ffcc00;color:#ffcc00}
.btn{padding:12px 32px;font-size:16px;border:2px solid #cc3333;background:transparent;color:#cc3333;cursor:pointer;margin:5px;transition:all .2s;letter-spacing:1px;font-family:inherit;border-radius:4px;min-height:44px}
.btn:hover,.btn:active{background:#cc3333;color:#111}
.btn-gold{border-color:#ffcc00;color:#ffcc00}
.btn-gold:hover,.btn-gold:active{background:#ffcc00;color:#111}
.btn-sm{padding:6px 16px;font-size:13px}
#charSelect{background:#0a0a0a;padding:20px}
#charSelect h2{font-size:24px;margin-bottom:16px;color:#ccc}
.char-cards{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.char-card{width:210px;padding:16px;border:2px solid #333;border-radius:8px;background:#1a1a1a;cursor:pointer;transition:all .2s;text-align:center}
.char-card:hover{transform:translateY(-3px);border-color:#666}
.char-card.guardian{border-color:#4488cc44}.char-card.guardian:hover,.char-card.guardian:active{border-color:#4488cc}
.char-card.gunslinger{border-color:#cc884444}.char-card.gunslinger:hover,.char-card.gunslinger:active{border-color:#cc8844}
.char-card.shadow{border-color:#8844cc44}.char-card.shadow:hover,.char-card.shadow:active{border-color:#8844cc}
.char-icon{width:40px;height:40px;margin:0 auto 8px;border-radius:4px}
.char-card h3{font-size:18px;margin-bottom:4px}.char-card .role{font-size:12px;color:#888;margin-bottom:8px}
.char-card .stats{font-size:11px;color:#aaa;text-align:left;line-height:1.5}
.char-card .ability{font-size:10px;color:#ccc;margin-top:6px;padding-top:6px;border-top:1px solid #333;text-align:left;line-height:1.4}
.char-card .ability b{color:#eee}
#shopScreen{background:#0a0a0a;padding:24px;overflow-y:auto;flex-direction:column;align-items:center}
#shopScreen h2{font-size:24px;margin-bottom:4px;color:#ccc}
#shopScreen .gold-display{font-size:20px;color:#ffcc00;margin-bottom:8px}
.shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:660px;width:100%}
.shop-item{background:#1a1a1a;border:1px solid #333;border-radius:6px;padding:12px;text-align:center}
.shop-item h4{color:#ccc;font-size:14px;margin-bottom:3px}.shop-item .desc{font-size:11px;color:#888;margin-bottom:6px}
.shop-item .level{font-size:12px;color:#aaa;margin-bottom:4px}.shop-item .cost{font-size:13px;color:#ffcc00;margin-bottom:6px}
.shop-item.maxed{opacity:.5}
#stageSelect{background:#0a0a0a}
#stageSelect h2{font-size:24px;margin-bottom:16px;color:#ccc}
.stage-cards{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.stage-card{width:140px;padding:14px;border:2px solid #333;border-radius:6px;background:#1a1a1a;cursor:pointer;text-align:center;transition:all .2s}
.stage-card:hover:not(.locked){transform:translateY(-3px);border-color:#cc3333}
.stage-card.locked{opacity:.35;cursor:not-allowed}
.stage-card h4{font-size:14px;margin-bottom:3px;pointer-events:none}
.stage-card .diff{font-size:10px;color:#888;pointer-events:none}
.stage-card .boss-name{font-size:10px;color:#cc6633;margin-top:3px;pointer-events:none}
.stage-card .lock-text{font-size:10px;color:#cc3333;margin-top:4px;pointer-events:none}
#levelUpOverlay{background:rgba(0,0,0,.75);z-index:20}
#levelUpOverlay h2{font-size:22px;color:#ffcc00;margin-bottom:14px;text-shadow:0 0 10px #ffcc0066}
.upgrade-cards{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.upgrade-card{width:180px;padding:14px;border:2px solid #444;border-radius:8px;background:#1a1a1a;cursor:pointer;text-align:center;transition:all .15s}
.upgrade-card:hover,.upgrade-card:active{transform:scale(1.06);border-color:#ffcc00}
.upgrade-card.rare{border-color:#ffcc00;box-shadow:0 0 15px #ffcc0044}
.upgrade-card h4{font-size:13px;color:#eee;margin-bottom:3px}
.upgrade-card .desc{font-size:10px;color:#aaa;line-height:1.3}
.upgrade-card .rarity-label{font-size:9px;color:#ffcc00;margin-top:3px}
#resultsScreen{background:#0a0a0a}
#resultsScreen h2{font-size:24px;margin-bottom:14px}
#resultsScreen .stats{font-size:15px;line-height:2;color:#ccc}
#resultsScreen .stats span{color:#ffcc00}
#pauseOverlay{background:rgba(0,0,0,.7);z-index:20}
#pauseOverlay h2{font-size:24px;margin-bottom:16px}
.back-btn{position:absolute;top:12px;left:12px;z-index:15;padding:8px 14px;font-size:12px;border:1px solid #555;background:rgba(0,0,0,.5);color:#aaa;cursor:pointer;border-radius:4px;min-height:36px}
.back-btn:hover,.back-btn:active{border-color:#cc3333;color:#cc3333}
@media(max-width:768px){
#titleScreen h1{font-size:28px;letter-spacing:2px}
.btn{padding:10px 24px;font-size:15px;min-height:44px}
.char-card{width:140px;padding:10px}.char-card h3{font-size:14px}
.shop-grid{grid-template-columns:repeat(2,1fr);gap:8px}
.stage-card{width:110px;padding:10px}
.upgrade-card{width:130px;padding:10px}
#shopScreen{padding:16px}
}
@media(max-width:480px){
#titleScreen h1{font-size:22px;letter-spacing:1px}
#titleScreen .sub{font-size:13px;margin-bottom:20px}
.btn{padding:10px 20px;font-size:14px}
.char-cards{gap:8px}
.char-card{width:100%;max-width:280px;padding:12px}
.stage-card{width:90px;padding:8px}
.upgrade-card{width:100%;max-width:250px}
#levelUpOverlay h2{font-size:18px;margin-bottom:10px}
.upgrade-cards{gap:8px}
#shopScreen{padding:10px}
#shopScreen h2{font-size:18px}
#shopScreen .gold-display{font-size:16px}
}`;

// HTML body — NO onclick attributes, all buttons get IDs for JS binding
const body=`<canvas id="gameCanvas"></canvas>
<div id="titleScreen" class="overlay active">
<button class="lang-btn" id="titleLangBtn">EN/中文</button>
<h1>ZOMBIE HORDE</h1>
<div class="sub" id="titleSub">SURVIVOR</div>
<button class="btn" id="startBtn">START GAME</button>
<button class="btn btn-gold" id="shopBtn">SHOP</button>
</div>
<div id="charSelect" class="overlay">
<button class="back-btn" id="charBackBtn">Back</button>
<h2 id="charTitle">Choose Your Survivor</h2>
<div class="char-cards" id="charCards"></div>
</div>
<div id="shopScreen" class="overlay">
<button class="back-btn" id="shopBackBtn">Back</button>
<h2 id="shopTitle">Talent Tree</h2>
<div class="gold-display" id="shopGold">Gold: 0</div>
<canvas id="talentCanvas" style="display:block;margin:0 auto;cursor:pointer"></canvas>
</div>
<div id="stageSelect" class="overlay">
<button class="back-btn" id="stageBackBtn">Back</button>
<h2 id="stageTitle">Select Stage</h2>
<div class="stage-cards" id="stageCards"></div>
</div>
<div id="levelUpOverlay" class="overlay">
<h2 id="luTitle">LEVEL UP!</h2>
<div class="upgrade-cards" id="upgradeCards"></div>
</div>
<div id="resultsScreen" class="overlay">
<h2 id="resultsTitle">Stage Complete!</h2>
<div class="stats" id="resultsStats"></div>
<button class="btn" id="resultsBtn">Continue</button>
</div>
<div id="pauseOverlay" class="overlay">
<h2 id="pauseTitle">PAUSED</h2>
<button class="btn" id="resumeBtn">Resume</button>
<button class="btn" id="restartBtn">Restart</button>
<button class="btn" id="quitBtn">Quit to Shop</button>
<button class="lang-btn" id="pauseLangBtn" style="position:static;margin-top:10px">EN/中文</button>
</div>`;

// JS files in correct load order
const order=['translations','constants','utils','chars','enemies','stages','upgrades','shop','spatial','state','screens','combat','player','enemies-ai','collision','particles','render','input'];
let js='';
for(const f of order){
  js+=fs.readFileSync('js/'+f+'.js','utf8')+'\n';
}

// Add event binding code at the end — this runs inside the script scope,
// so it can access switchScreen, selectChar, etc. directly
// NO onclick attributes needed
const binding=`

// ==================== EVENT BINDING ====================
document.getElementById('startBtn').addEventListener('click',()=>switchScreen('charSelect'));
document.getElementById('shopBtn').addEventListener('click',()=>switchScreen('shop'));
document.getElementById('titleLangBtn').addEventListener('click',()=>toggleLang());
document.getElementById('charBackBtn').addEventListener('click',()=>switchScreen('title'));
document.getElementById('shopBackBtn').addEventListener('click',()=>switchScreen('title'));
document.getElementById('stageBackBtn').addEventListener('click',()=>switchScreen('charSelect'));
document.getElementById('resumeBtn').addEventListener('click',()=>resumeGame());
document.getElementById('restartBtn').addEventListener('click',()=>restartRun());
document.getElementById('quitBtn').addEventListener('click',()=>quitRun());
document.getElementById('pauseLangBtn').addEventListener('click',()=>toggleLang());
// resultsBtn is bound dynamically in switchScreen when results screen opens
`;

// Remove the old input.js init line and replace with our binding + init
js=js.replace('loadSave();refreshUI();requestAnimationFrame(gameLoop);','loadSave();refreshUI();'+binding+'requestAnimationFrame(gameLoop);');

const output=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Zombie Horde Survivor</title>
<style>
${css}
</style>
</head>
<body>
${body}
<script>
${js}</script>
</body>
</html>`;

fs.writeFileSync('index.html',output);

// Verification
const scriptStart=output.indexOf('<script>')+8;
const scriptEnd=output.indexOf('</script>');
const code=output.substring(scriptStart,scriptEnd);
try{new Function(code);console.log('JS syntax: OK')}catch(e){console.log('JS syntax ERROR:',e.message)}

console.log('File size:',output.length);
console.log('Script blocks:',(output.match(/<script>/g)||[]).length);
console.log('onclick attributes:',(output.match(/onclick=/g)||[]).length);
console.log('addEventListener bindings:',(code.match(/addEventListener/g)||[]).length);
console.log('Has gameCanvas pointer-events:none:',output.includes('pointer-events:none'));
console.log('No display:flex on shopScreen:',!output.match(/#shopScreen[^}]*display:flex/));
console.log('Has EVENT BINDING section:',code.includes('EVENT BINDING'));
console.log('Has mobile touch support:',code.includes('isMobile'));
console.log('Has virtual joystick:',code.includes('JOY_RADIUS'));
console.log('Has 480px breakpoint:',output.includes('480px'));