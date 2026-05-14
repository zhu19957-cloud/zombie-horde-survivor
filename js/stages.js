const STAGE_DEFS=[
{diffMult:1.0,timer:300,bossTime:240,specialFromWave:99,normalSpawnMult:1,specialSpawnMult:1,hazards:[],totalWaves:5,enemiesPerWave:20,eliteWaves:[3]},
{diffMult:1.5,timer:300,bossTime:240,specialFromWave:2,normalSpawnMult:1,specialSpawnMult:1,hazards:['ember'],totalWaves:6,enemiesPerWave:25,eliteWaves:[3,5]},
{diffMult:2.0,timer:300,bossTime:240,specialFromWave:2,normalSpawnMult:2,specialSpawnMult:1,hazards:['toxic'],totalWaves:7,enemiesPerWave:30,eliteWaves:[3,5]},
{diffMult:2.5,timer:300,bossTime:240,specialFromWave:1,normalSpawnMult:3,specialSpawnMult:1,hazards:['spike','ember'],totalWaves:8,enemiesPerWave:35,eliteWaves:[3,5,7]},
{diffMult:3.0,timer:330,bossTime:240,specialFromWave:1,normalSpawnMult:4,specialSpawnMult:2,hazards:['lightning','toxic'],totalWaves:9,enemiesPerWave:40,eliteWaves:[3,5,7]},
{diffMult:4.0,timer:360,bossTime:210,specialFromWave:1,normalSpawnMult:4,specialSpawnMult:2,hazards:['lightning','spike','void'],totalWaves:10,enemiesPerWave:50,eliteWaves:[3,5,7,9]}
];
const WAVE_SPAWN=[0.7,0.5,0.35,0.25,0.18,0.4,0.2];// seconds per enemy for waves 1-7
const WAVE_MULT=[1.0,1.05,1.1,1.2,1.3,1.4,1.5,1.65,1.8,2.0,2.2];// stat multiplier per wave number
const POWERUP_TYPES=[
{id:'atkSurge',color:'#ff4444',icon:'⚔',duration:8,effect:p=>{p.atkMult*=1.4}},
{id:'spdBoost',color:'#44ffff',icon:'»',duration:7,effect:p=>{p.spdMult*=1.35}},
{id:'ironSkin',color:'#888888',icon:'⬡',duration:10,effect:p=>{p.defMult*=0.6}},
{id:'dblStrike',color:'#ffcc00',icon:'★',duration:6,effect:p=>{p.atkSpdMult*=1.5}},
{id:'goldRush',color:'#ffaa00',icon:'$',duration:8,effect:p=>{p.goldMult*=1.8}},
{id:'healPulse',color:'#44ff44',icon:'+',duration:8,effect:p=>{p.healPS+=3}}
];