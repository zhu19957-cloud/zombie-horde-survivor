// ==================== SPATIAL HASH ====================
class SpatialHash{
constructor(cs){this.cs=cs;this.m={}}
clear(){this.m={}}
insert(e){const k=`${Math.floor(e.x/this.cs)},${Math.floor(e.y/this.cs)}`;(this.m[k]||(this.m[k]=[])).push(e)}
query(x,y,r){const res=[];const x0=Math.floor((x-r)/this.cs),x1=Math.floor((x+r)/this.cs),y0=Math.floor((y-r)/this.cs),y1=Math.floor((y+r)/this.cs);for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++){const c=this.m[`${cx},${cy}`];if(c)for(const e of c)res.push(e)}return res}
}