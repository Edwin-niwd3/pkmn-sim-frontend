import {type Pokemon} from './Pokemon';

// Two VGC 2025 Reg I legal teams for quick testing of the doubles path.
// Both pass TeamValidator for gen9vgc2025regi (checked 2026-10-17).
// Not legal in Doubles OU (restricted/DUber species) or singles tiers.
export const DEFAULT_FORMAT = 'gen9vgc2025regi';

export const defaultTeam1: Pokemon[] = [
  {"name":null,"species":"Miraidon","types":["electric","dragon"],"item":"Choice Specs","gender":null,"ability":"Hadron Engine","nature":"Timid","evs":{"hp":4,"atk":0,"def":0,"spa":252,"spd":0,"spe":252},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Electro Drift","Draco Meteor","Volt Switch","Dazzling Gleam"]},
  {"name":null,"species":"Whimsicott","types":["grass","fairy"],"item":"Covert Cloak","gender":null,"ability":"Prankster","nature":"Timid","evs":{"hp":252,"atk":0,"def":4,"spa":0,"spd":0,"spe":252},"ivs":{"hp":31,"atk":0,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Tailwind","Moonblast","Encore","Protect"]},
  {"name":null,"species":"Incineroar","types":["fire","dark"],"item":"Safety Goggles","gender":null,"ability":"Intimidate","nature":"Careful","evs":{"hp":252,"atk":4,"def":0,"spa":0,"spd":252,"spe":0},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Fake Out","Flare Blitz","Knock Off","Parting Shot"]},
  {"name":null,"species":"Farigiraf","types":["normal","psychic"],"item":"Throat Spray","gender":null,"ability":"Armor Tail","nature":"Modest","evs":{"hp":252,"atk":0,"def":4,"spa":252,"spd":0,"spe":0},"ivs":{"hp":31,"atk":0,"def":31,"spa":31,"spd":31,"spe":0},"moves":["Hyper Voice","Psychic","Trick Room","Protect"]},
  {"name":null,"species":"Urshifu-Rapid-Strike","types":["fighting","water"],"item":"Mystic Water","gender":null,"ability":"Unseen Fist","nature":"Jolly","evs":{"hp":4,"atk":252,"def":0,"spa":0,"spd":0,"spe":252},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Surging Strikes","Close Combat","Aqua Jet","Detect"]},
  {"name":null,"species":"Iron Hands","types":["fighting","electric"],"item":"Assault Vest","gender":null,"ability":"Quark Drive","nature":"Adamant","evs":{"hp":4,"atk":252,"def":0,"spa":0,"spd":252,"spe":0},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Drain Punch","Wild Charge","Fake Out","Heavy Slam"]}
];

export const defaultTeam2: Pokemon[] = [
  {"name":null,"species":"Calyrex-Shadow","types":["psychic","ghost"],"item":"Focus Sash","gender":null,"ability":"As One (Spectrier)","nature":"Timid","evs":{"hp":4,"atk":0,"def":0,"spa":252,"spd":0,"spe":252},"ivs":{"hp":31,"atk":0,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Astral Barrage","Psychic","Nasty Plot","Protect"]},
  {"name":null,"species":"Rillaboom","types":["grass"],"item":"Miracle Seed","gender":null,"ability":"Grassy Surge","nature":"Adamant","evs":{"hp":252,"atk":252,"def":0,"spa":0,"spd":4,"spe":0},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Fake Out","Wood Hammer","Grassy Glide","U-turn"]},
  {"name":null,"species":"Amoonguss","types":["grass","poison"],"item":"Rocky Helmet","gender":null,"ability":"Regenerator","nature":"Calm","evs":{"hp":252,"atk":0,"def":4,"spa":0,"spd":252,"spe":0},"ivs":{"hp":31,"atk":0,"def":31,"spa":31,"spd":31,"spe":0},"moves":["Spore","Rage Powder","Pollen Puff","Protect"]},
  {"name":null,"species":"Flutter Mane","types":["ghost","fairy"],"item":"Booster Energy","gender":null,"ability":"Protosynthesis","nature":"Timid","evs":{"hp":4,"atk":0,"def":0,"spa":252,"spd":0,"spe":252},"ivs":{"hp":31,"atk":0,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Moonblast","Shadow Ball","Icy Wind","Protect"]},
  {"name":null,"species":"Chien-Pao","types":["dark","ice"],"item":"Life Orb","gender":null,"ability":"Sword of Ruin","nature":"Jolly","evs":{"hp":4,"atk":252,"def":0,"spa":0,"spd":0,"spe":252},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Icicle Crash","Sucker Punch","Sacred Sword","Protect"]},
  {"name":null,"species":"Landorus-Therian","types":["ground","flying"],"item":"Choice Scarf","gender":null,"ability":"Intimidate","nature":"Jolly","evs":{"hp":4,"atk":252,"def":0,"spa":0,"spd":0,"spe":252},"ivs":{"hp":31,"atk":31,"def":31,"spa":31,"spd":31,"spe":31},"moves":["Stomping Tantrum","Rock Slide","U-turn","Tera Blast"]}
];
