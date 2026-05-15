// ==================== COLLISION ====================
function updateCollisions(){
// Player-enemy: push ONLY the enemy, player is immovable
for(const e of G.enemies){if(e.dead)continue;
const d=dist(e.x,e.y,G.px,G.py);const minD=G.charDef.size/2+e.size/2+1;
if(d<minD&&d>0){const overlap=minD-d;const ax=(e.x-G.px)/d,ay=(e.y-G.py)/d;
e.x+=ax*overlap;e.y+=ay*overlap}}
// Enemy-enemy: size-based push, bosses immovable
for(let iter=0;iter<3;iter++){let moved=false;
for(const e of G.enemies){if(e.dead||e.isBoss)continue;const near=G.spatial.query(e.x,e.y,e.size+10);
for(const ne of near){if(ne===e||ne.dead)continue;const d=dist(e.x,e.y,ne.x,ne.y);const minD=e.size/2+ne.size/2+3;
if(d<minD&&d>0){const overlap=minD-d;const ax=(e.x-ne.x)/d,ay=(e.y-ne.y)/d;
if(ne.isBoss){e.x+=ax*overlap;e.y+=ay*overlap;moved=true}
else{const sizeSum=e.size+ne.size;const pushToE=overlap*(ne.size/sizeSum);const pushToNe=overlap*(e.size/sizeSum);
e.x+=ax*pushToE;e.y+=ay*pushToE;ne.x-=ax*pushToNe;ne.y-=ay*pushToNe;moved=true}}}}
if(!moved)break}
}

// ==================== PROJECTILES ====================
function updateProjectiles(dt){
for(let i=G.projectiles.length-1;i>=0;i--){
const p=G.projectiles[i];if(!p.trail)p.trail=[];p.trail.push({x:p.x,y:p.y});if(p.trail.length>3)p.trail.shift();
	// Homing
	if(p.homing&&p.owner==='enemy'){const ha=angle(p.x,p.y,G.px,G.py);const ca=Math.atan2(p.dy,p.dx);const da=angleDiff(ca,ha);const turn=clamp(da,-p.homing*60*dt,p.homing*60*dt);const na=ca+turn;p.dx=Math.cos(na);p.dy=Math.sin(na)}
	p.x+=p.dx*p.speed*60*dt;p.y+=p.dy*p.speed*60*dt;p.lifetime-=dt;
if(p.lifetime<=0){G.projectiles.splice(i,1);continue}
if(p.owner==='player'){
const near=G.spatial.query(p.x,p.y,30);
for(const e of near){if(!e.isEnemy||e.dead)continue;if(dist(p.x,p.y,e.x,e.y)<e.size/2+3){
damageEnemy(e,p.damage,!!p.isCrit);
if(p.knockback){const ka=angle(G.px,G.py,e.x,e.y);e.x+=Math.cos(ka)*10*p.knockback;e.y+=Math.sin(ka)*10*p.knockback}
if(p.piercing>0)p.piercing--;else{G.projectiles.splice(i,1);break}}}
}else if(p.owner==='enemy'){
if(dist(p.x,p.y,G.px,G.py)<G.charDef.size/2+4){damagePlayer(p.damage,null);G.projectiles.splice(i,1)}
}
}
}