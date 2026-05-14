// ==================== ENEMIES ====================
const ENEMY_DEFS={
walker:{hp:10,speed:1.0,dmg:5,size:12,color:'#4a7c59',gold:1,xp:1,special:false},
runner:{hp:7,speed:2.5,dmg:5,size:10,color:'#7c4a4a',gold:1,xp:1,special:false},
swarmer:{hp:5,speed:2.0,dmg:3,size:8,color:'#6b6b4a',gold:1,xp:1,special:false},
spitter:{hp:20,speed:0.8,dmg:8,size:14,color:'#4a4a7c',gold:2,xp:3,special:true},
bomber:{hp:15,speed:1.5,dmg:15,size:13,color:'#7c5a4a',gold:2,xp:3,special:true},
shielder:{hp:25,speed:1.0,dmg:5,size:15,color:'#5a5a5a',gold:3,xp:3,special:true},
healer:{hp:18,speed:0.8,dmg:3,size:12,color:'#4a7c7c',gold:3,xp:3,special:true},
flanker:{hp:14,speed:2.2,dmg:7,size:11,color:'#7c4a7c',gold:2,xp:3,special:true},
charger:{hp:22,speed:1.2,dmg:12,size:14,color:'#7c7c4a',gold:3,xp:4,special:true},
teleporter:{hp:16,speed:1.0,dmg:6,size:11,color:'#7c4a9c',gold:3,xp:4,special:true},
necrotic:{hp:20,speed:0.9,dmg:8,size:13,color:'#4a6a3c',gold:3,xp:4,special:true}
};
const BOSS_DEFS={
colossus:{hp:2000,speed:0.6,dmg:20,size:40,color:'#3d2b1f',gold:45},
necromancer:{hp:1500,speed:1.0,dmg:12,size:30,color:'#2b1f3d',gold:60},
hiveQueen:{hp:3000,speed:0.8,dmg:15,size:45,color:'#3d3d1f',gold:75},
warlord:{hp:4000,speed:0.7,dmg:18,size:38,color:'#5a2d1a',gold:90},
plagueDoctor:{hp:3500,speed:0.9,dmg:10,size:32,color:'#2a3d1a',gold:105},
abyssKing:{hp:6000,speed:0.5,dmg:22,size:50,color:'#1a1a2d',gold:120}
};
const BOSS_KEYS=['colossus','necromancer','hiveQueen','warlord','plagueDoctor','abyssKing'];