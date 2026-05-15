// ==================== CHARACTERS ====================
const CHARS={
guardian:{name:'Guardian',color:'#4488cc',baseHP:120,baseATK:12,baseSPD:2.6,baseATKSPD:1.25,baseCRIT:0.05,baseCRITDMG:1.5,
  size:18,autoRange:50,autoCD:0.8,cleaveArc:Math.PI/2,projSpeed:0,ultCD:45,ultDuration:4,
  ultShockwaveRange:150,ultShockwaveDmg:35,ultShockwaveCD:1.5},
gunslinger:{name:'Gunslinger',color:'#cc8844',baseHP:70,baseATK:10,baseSPD:2.8,baseATKSPD:2.0,baseCRIT:0.10,baseCRITDMG:2.0,
  size:14,autoRange:250,autoCD:0.5,projSpeed:8,ultCD:45,ultDuration:6,ultBullets:5,ultBulletCD:0.35,ultPierce:3},
shadow:{name:'Shadow',color:'#8844cc',baseHP:80,baseATK:9,baseSPD:3.8,baseATKSPD:1.67,baseCRIT:0.20,baseCRITDMG:1.8,
  size:12,autoRange:150,autoCD:0.6,shadowBladeDmg:1.8,projSpeed:0,ultCD:45,ultDuration:6,ultClones:2,afterimageChance:1.0,afterimageMult:0.6}
};