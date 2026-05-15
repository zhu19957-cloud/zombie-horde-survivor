let lang='en';
function t(k){return T[lang][k]||T.en[k]||k}
function toggleLang(){lang=lang==='en'?'zh':'en';saveData.language=lang;saveSave();refreshUI()}

function rand(a,b){return Math.random()*(b-a)+a}
function randInt(a,b){return Math.floor(rand(a,b+1))}
function dist(x1,y1,x2,y2){return Math.hypot(x1-x2,y1-y2)}
function distWrap(x1,y1,x2,y2){let dx=Math.abs(x1-x2);dx=Math.min(dx,CORRIDOR_W-dx);return Math.hypot(dx,y1-y2)}
function angle(x1,y1,x2,y2){return Math.atan2(y2-y1,x2-x1)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function angleDiff(a,b){let d=b-a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d}