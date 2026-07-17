// ============================================================
// levels/data.js – All 30 level definitions
// ============================================================
// Tile Key:
//   '.' = EMPTY (air)
//   '#' = EARTH (solid, destructible)
//   'S' = STEEL (solid, indestructible)
//   'W' = WATER (lethal liquid)
//   'M' = MUD   (lethal pit)
//   'L' = LADDER (climbable vine/rope)
// Metadata: entry, exit, hazards, skills defined separately
// ============================================================

export const TILE = { EMPTY: 0, EARTH: 1, STEEL: 2, WATER: 3, MUD: 4, LADDER: 5 };

function parseTileMap(rows) {
  return rows.map(row =>
    [...row].map(c => {
      if (c === '#') return TILE.EARTH;
      if (c === 'S') return TILE.STEEL;
      if (c === 'W') return TILE.WATER;
      if (c === 'M') return TILE.MUD;
      if (c === 'L') return TILE.LADDER;
      return TILE.EMPTY;
    })
  );
}

// ─────────────────────────────────────────────────────────────
// EASY WORLD (1-10) – Training Ground / Stadium
// ─────────────────────────────────────────────────────────────

const EASY_1 = {
  id: 'easy_01', nameHe: 'שדה האימון', nameEn: 'Training Ground',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 6, timeLimit: 180,
  skills: { builder: 5, blocker: 2, digger: 0, parachuter: 0, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 1 }, rate: 1500 },
  exit:  { tile: { x: 37, y: 14 } },
  comicWorld: null,
  tip: 'השתמש בבנאי כדי לגשר על הפער!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S......................................SS',
    'S######.......#########################S',
    'S......................................SS',
    'S......................................SS',
    'S.......#######........................SS',
    'S......................................SS',
    'S.........................................S',
    'S################.......###############SS',
    'S...........................................S',
    'S...........................................S',
    'S##########..........######################S',
    'S...........................................S',
    'S.........................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_2 = {
  id: 'easy_02', nameHe: 'הצוק הירוק', nameEn: 'Green Cliff',
  world: 'easy', difficulty: 1,
  players: 12, toSave: 8, timeLimit: 200,
  skills: { builder: 4, blocker: 3, digger: 0, parachuter: 0, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 13 } },
  comicWorld: 1,
  tip: 'השתמש בחוסם כדי למנוע נפילה לבריכה!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S......................................SS',
    'S########..............................SS',
    'S......................................SS',
    'S......................................SS',
    'S......WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWS',
    'S......WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWS',
    'S......WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWS',
    'S############################..........SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_3 = {
  id: 'easy_03', nameHe: 'הצניחה הגדולה', nameEn: 'The Big Drop',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 7, timeLimit: 180,
  skills: { builder: 2, blocker: 2, digger: 0, parachuter: 5, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1800 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'הצנחן שורד כל נפילה!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##########............................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S...####################...............SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_4 = {
  id: 'easy_04', nameHe: 'המנהרה', nameEn: 'The Tunnel',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 6, timeLimit: 200,
  skills: { builder: 0, blocker: 2, digger: 5, parachuter: 2, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'החפר יכול לחפור מתחת לרגליים!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##################################....SS',
    'S###################################...SS',
    'S####################################..SS',
    'S####################################..SS',
    'S####################################..SS',
    'S##############################........SS',
    'S##############################........SS',
    'S##############################........SS',
    'S..................................####SS',
    'S..................................####SS',
    'S..................................####SS',
    'S##################################....SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_5 = {
  id: 'easy_05', nameHe: 'הכדורים המתגלגלים', nameEn: 'Rolling Balls',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 6, timeLimit: 180,
  skills: { builder: 3, blocker: 3, digger: 0, parachuter: 0, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 3, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'השוער בולע כדורים מתגלגלים!',
  hazards: [
    { type: 'rolling_ball', x: 600, y: 352, speed: 2, dir: -1 },
    { type: 'rolling_ball', x: 900, y: 192, speed: 2, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S#############.........................SS',
    'S......................................SS',
    'S......................................SS',
    'S.................#####................SS',
    'S.................#####................SS',
    'S...####.......................####....SS',
    'S...####.......................####....SS',
    'S..................................####SS',
    'S##################################....SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_6 = {
  id: 'easy_06', nameHe: 'הבוץ הקטלני', nameEn: 'Deadly Mud',
  world: 'easy', difficulty: 1,
  players: 12, toSave: 8, timeLimit: 220,
  skills: { builder: 4, blocker: 2, digger: 2, parachuter: 2, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'בנה גשר מעל הבוץ!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S#######...............................SS',
    'S......................................SS',
    'S......................................SS',
    'S..MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMSS',
    'S..MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMSS',
    'S..MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMSS',
    'S######################################SS',
    'S......................................SS',
    'S......................................SS',
    'S.......MMMMMMMMMMMM...................SS',
    'S.......MMMMMMMMMMMM...................SS',
    'S######################################SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_7 = {
  id: 'easy_07', nameHe: 'מלכודת הרשת', nameEn: 'The Net Trap',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 6, timeLimit: 200,
  skills: { builder: 4, blocker: 2, digger: 3, parachuter: 2, redcard: 0, climber: 0, sprinter: 0, goalkeeper: 2, shooter: 0, basher: 2 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'המפרץ יכול לשבור קירות לרוחב!',
  hazards: [
    { type: 'trapdoor', x: 512, y: 320 },
    { type: 'trapdoor', x: 704, y: 320 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##########............................SS',
    'S......................................SS',
    'S....###SS##SS##SS###..................SS',
    'S......................................SS',
    'S......................................SS',
    'S.........SSSSSSSSSSSSS................SS',
    'S.........SSSSSSSSSSSSS................SS',
    'S.........SSSSSSSSSSSSS................SS',
    'S#########################.............SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_8 = {
  id: 'easy_08', nameHe: 'הרוח הסוחפת', nameEn: 'Blowing Wind',
  world: 'easy', difficulty: 1,
  players: 10, toSave: 6, timeLimit: 200,
  skills: { builder: 3, blocker: 2, digger: 0, parachuter: 3, redcard: 0, climber: 0, sprinter: 3, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'הספרינטר רץ מהר מספיק לעמוד ברוח!',
  hazards: [
    { type: 'wind', x: 320, y: 64, width: 320, height: 400, dir: 1, force: 0.8 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S########..............................SS',
    'S......................................SS',
    'S......................................SS',
    'S...........###........................SS',
    'S...........###........................SS',
    'S......................................SS',
    'S......................................SS',
    'S...............###....................SS',
    'S...............###....................SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_9 = {
  id: 'easy_09', nameHe: 'זרקורי הסכנה', nameEn: 'Danger Lights',
  world: 'easy', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 220,
  skills: { builder: 4, blocker: 2, digger: 2, parachuter: 3, redcard: 0, climber: 0, sprinter: 2, goalkeeper: 3, shooter: 0, basher: 2 },
  entry: { tile: { x: 2, y: 1 }, rate: 1300 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'השוער מגן מפני כדורים וזרקורים!',
  hazards: [
    { type: 'electric', x: 448, y: 128, width: 32, height: 256 },
    { type: 'electric', x: 832, y: 128, width: 32, height: 256 },
    { type: 'rolling_ball', x: 700, y: 352, speed: 3, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S#########.............................SS',
    'S......................................SS',
    'S......................................SS',
    'S...############.....##########........SS',
    'S......................................SS',
    'S......................................SS',
    'S.................#######..............SS',
    'S......................................SS',
    'S......................................SS',
    'S##############################........SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const EASY_10 = {
  id: 'easy_10', nameHe: 'שלב הסיום – הקל', nameEn: 'Easy Boss Stage',
  world: 'easy', difficulty: 2,
  players: 15, toSave: 10, timeLimit: 240,
  skills: { builder: 5, blocker: 3, digger: 3, parachuter: 3, redcard: 1, climber: 0, sprinter: 2, goalkeeper: 3, shooter: 0, basher: 2 },
  entry: { tile: { x: 2, y: 1 }, rate: 1200 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'כאן תשתמש בכל מה שלמדת!',
  hazards: [
    { type: 'rolling_ball', x: 640, y: 320, speed: 2.5, dir: -1 },
    { type: 'wind', x: 256, y: 64, width: 200, height: 384, dir: 1, force: 0.6 },
    { type: 'electric', x: 960, y: 192, width: 32, height: 192 },
    { type: 'trapdoor', x: 384, y: 384 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S####..............................####SS',
    'S......................................SS',
    'S......MMMM..........MMMM..............SS',
    'S......MMMM..........MMMM..............SS',
    'S######MMMM######SSSSSSSSSSSS..........SS',
    'S......................................SS',
    'S......................................SS',
    'S...#####.......####.......#####.......SS',
    'S......................................SS',
    'S......................................SS',
    'S##############################........SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

// ─────────────────────────────────────────────────────────────
// MEDIUM WORLD (11-20) – City Streets / Airport
// ─────────────────────────────────────────────────────────────

const MEDIUM_11 = {
  id: 'med_01', nameHe: 'הקיר הגבוה', nameEn: 'The High Wall',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 200,
  skills: { builder: 3, blocker: 2, digger: 2, parachuter: 2, redcard: 0, climber: 5, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 13 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 2 } },
  comicWorld: 2,
  tip: 'המטפס עולה על קירות אנכיים!',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S...##########################..........S',
    'S......................................SS',
    'S..............................########SS',
    'S......................................SS',
    'S...##########################.........SS',
    'S......................................SS',
    'S..............................########SS',
    'S......................................SS',
    'S...##########################.........SS',
    'S......................................SS',
    'S......................................SS',
    'S##########............................SS',
    'S......................................SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_12 = {
  id: 'med_02', nameHe: 'הכרטיס האדום', nameEn: 'Red Card!',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 7, timeLimit: 200,
  skills: { builder: 3, blocker: 2, digger: 0, parachuter: 2, redcard: 4, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'הכרטיס האדום מפוצץ קירות! שלם הקרבה.',
  hazards: [],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S########SSSSSSSSSSSSS.................SS',
    'S........SSSSSSSSSSSSS.................SS',
    'S........SSSSSSSSSSSSS.................SS',
    'S........SSSSSSS#######................SS',
    'S........SSSSSSS...............########SS',
    'S........SSSSSSS.......SSSSSSSS........SS',
    'S........SSSSSSS.......SSSSSSSS........SS',
    'S........SSSSSSS.......SSSSSSSS........SS',
    'S#############################.........SS',
    'S......................................SS',
    'S......................................SS',
    'S##############################........SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_13 = {
  id: 'med_03', nameHe: 'המגרש האווירי', nameEn: 'Airport Dash',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 180,
  skills: { builder: 3, blocker: 2, digger: 0, parachuter: 2, redcard: 0, climber: 2, sprinter: 5, goalkeeper: 2, shooter: 0, basher: 0 },
  entry: { tile: { x: 2, y: 13 }, rate: 1200 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'הספרינטר מקפץ מעל פרצות קצרות!',
  hazards: [
    { type: 'wind', x: 512, y: 0, width: 256, height: 480, dir: -1, force: 1.2 },
    { type: 'rolling_ball', x: 800, y: 416, speed: 3, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S#####...###...###...###...###.........SS',
    'S...........................................S',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_14 = {
  id: 'med_04', nameHe: 'גגות העיר', nameEn: 'City Rooftops',
  world: 'medium', difficulty: 2,
  players: 10, toSave: 7, timeLimit: 220,
  skills: { builder: 4, blocker: 2, digger: 2, parachuter: 3, redcard: 2, climber: 3, sprinter: 2, goalkeeper: 0, shooter: 2, basher: 2 },
  entry: { tile: { x: 2, y: 14 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 2 } },
  comicWorld: null,
  tip: 'שתף פעולה: מטפס, בנאי, וצנחן!',
  hazards: [
    { type: 'electric', x: 640, y: 0, width: 32, height: 224 },
    { type: 'fireworks', x: 960, y: 256, interval: 3000 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S.....####.............................SS',
    'S.....####.............................SS',
    'S.....#####....###########.............SS',
    'S.....#####....###########.............SS',
    'S.....#####....###########......####...SS',
    'S..............................####....SS',
    'S..............................####....SS',
    'S...########...........................SS',
    'S...########...........................SS',
    'S...#########..........................SS',
    'S......................................SS',
    'S......................................SS',
    'S#########.............................SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_15 = {
  id: 'med_05', nameHe: 'המנהרות התת-קרקעיות', nameEn: 'Underground',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 240,
  skills: { builder: 3, blocker: 2, digger: 6, parachuter: 2, redcard: 2, climber: 0, sprinter: 0, goalkeeper: 0, shooter: 2, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 13 } },
  comicWorld: null,
  tip: 'חפור דרך המדרגות האדמה!',
  hazards: [
    { type: 'trapdoor', x: 288, y: 224 },
    { type: 'trapdoor', x: 608, y: 352 },
    { type: 'mud_pool', x: 800, y: 416, width: 128, height: 32 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##########............................SS',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S#########################################S',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_16 = {
  id: 'med_06', nameHe: 'השפט האויב', nameEn: 'Enemy Referee',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 200,
  skills: { builder: 4, blocker: 3, digger: 2, parachuter: 2, redcard: 2, climber: 2, sprinter: 3, goalkeeper: 3, shooter: 2, basher: 2 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'השוער מגן מפני השפט!',
  hazards: [
    { type: 'referee', x: 480, y: 320, speed: 1.5, patrol: 200 },
    { type: 'referee', x: 800, y: 192, speed: 2, patrol: 150 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S########..............................SS',
    'S......................................SS',
    'S......................................SS',
    'S..........#########...................SS',
    'S......................................SS',
    'S......................................SS',
    'S...................#########...........SS',
    'S......................................SS',
    'S##############################........SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_17 = {
  id: 'med_07', nameHe: 'הזיקוקים הסכנויים', nameEn: 'Fireworks Maze',
  world: 'medium', difficulty: 2,
  players: 12, toSave: 8, timeLimit: 220,
  skills: { builder: 4, blocker: 3, digger: 2, parachuter: 3, redcard: 0, climber: 2, sprinter: 0, goalkeeper: 3, shooter: 2, basher: 2 },
  entry: { tile: { x: 2, y: 2 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'השוער מגן מפני זיקוקים!',
  hazards: [
    { type: 'fireworks', x: 320, y: 192, interval: 2000 },
    { type: 'fireworks', x: 640, y: 320, interval: 2500 },
    { type: 'fireworks', x: 960, y: 192, interval: 2000 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S########..............................SS',
    'S......................................SS',
    'S.....#######..################........SS',
    'S......................................SS',
    'S......................................SS',
    'S..........#######.....................SS',
    'S..........#######.....................SS',
    'S##############################........SS',
    'S......................................SS',
    'S......................................SS',
    'S...........##########.................SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_18 = {
  id: 'med_08', nameHe: 'המגנט המוזר', nameEn: 'Magnetic Zone',
  world: 'medium', difficulty: 3,
  players: 12, toSave: 8, timeLimit: 220,
  skills: { builder: 4, blocker: 2, digger: 2, parachuter: 2, redcard: 2, climber: 4, sprinter: 2, goalkeeper: 2, shooter: 2, basher: 2 },
  entry: { tile: { x: 2, y: 14 }, rate: 1500 },
  exit:  { tile: { x: 36, y: 2 } },
  comicWorld: null,
  tip: 'אזור מגנטי הופך את כוח הכבידה!',
  hazards: [
    { type: 'magnet', x: 320, y: 0, width: 256, height: 480, inverted: true },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S.....#######..........................SS',
    'S......................................SS',
    'S......................................SS',
    'S......SSSSSSSS........................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S..........#####################.......SS',
    'S......................................SS',
    'S#########.............................SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_19 = {
  id: 'med_09', nameHe: 'מסלול הקומבינציה', nameEn: 'Combo Course',
  world: 'medium', difficulty: 3,
  players: 14, toSave: 9, timeLimit: 240,
  skills: { builder: 4, blocker: 2, digger: 3, parachuter: 3, redcard: 2, climber: 3, sprinter: 3, goalkeeper: 3, shooter: 2, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1300 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'תכנן היטב לפני שאתה מקצה מיומנויות!',
  hazards: [
    { type: 'rolling_ball', x: 640, y: 192, speed: 3, dir: -1 },
    { type: 'wind', x: 704, y: 0, width: 128, height: 384, dir: -1, force: 1 },
    { type: 'referee', x: 960, y: 352, speed: 2, patrol: 200 },
    { type: 'electric', x: 320, y: 224, width: 32, height: 192 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S########..............................SS',
    'S......................................SS',
    'S.......WWWWWWW........................SS',
    'S.......WWWWWWW........................SS',
    'S########WWWWWWW###############........SS',
    'S......................................SS',
    'S......................................SS',
    'S.........######.......................SS',
    'S......................................SS',
    'S......................................SS',
    'S..............MMMMMMMM................SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const MEDIUM_20 = {
  id: 'med_10', nameHe: 'שלב הסיום – הבינוני', nameEn: 'Medium Boss Stage',
  world: 'medium', difficulty: 3,
  players: 15, toSave: 10, timeLimit: 260,
  skills: { builder: 4, blocker: 3, digger: 3, parachuter: 3, redcard: 3, climber: 3, sprinter: 3, goalkeeper: 3, shooter: 3, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1200 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'כל המיומנויות יידרשו כאן!',
  hazards: [
    { type: 'rolling_ball', x: 500, y: 160, speed: 3, dir: -1 },
    { type: 'rolling_ball', x: 900, y: 352, speed: 2.5, dir: -1 },
    { type: 'wind', x: 320, y: 64, width: 128, height: 448, dir: 1, force: 0.8 },
    { type: 'electric', x: 768, y: 128, width: 32, height: 288 },
    { type: 'referee', x: 640, y: 320, speed: 2, patrol: 150 },
    { type: 'fireworks', x: 896, y: 128, interval: 2000 },
    { type: 'trapdoor', x: 448, y: 320 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S###...................................SS',
    'S......................................SS',
    'S....MMMM..............MMMM............SS',
    'S....MMMM..............MMMM............SS',
    'S####MMMM####SSSSSS####MMMM############SS',
    'S......................................SS',
    'S......................................SS',
    'S...####.......####.......####.........SS',
    'S......................................SS',
    'S......................................SS',
    'S...WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.....SS',
    'S...WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.....SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

// ─────────────────────────────────────────────────────────────
// HARD WORLD (21-30) – Enemy Stadium / World Cup Finals
// ─────────────────────────────────────────────────────────────

const HARD_21 = {
  id: 'hard_01', nameHe: 'האצטדיון של האויב', nameEn: "Enemy's Stadium",
  world: 'hard', difficulty: 3,
  players: 15, toSave: 10, timeLimit: 240,
  skills: { builder: 4, blocker: 3, digger: 3, parachuter: 3, redcard: 3, climber: 3, sprinter: 3, goalkeeper: 3, shooter: 3, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1200 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: 3,
  tip: 'הישאר ממוקד! כל אויב כאן.',
  hazards: [
    { type: 'rolling_ball', x: 500, y: 352, speed: 3, dir: -1 },
    { type: 'referee', x: 700, y: 320, speed: 2.5, patrol: 200 },
    { type: 'electric', x: 320, y: 192, width: 32, height: 192 },
    { type: 'fireworks', x: 800, y: 192, interval: 1800 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##########............................SS',
    'S......................................SS',
    'S.....SSSSSSSSSSS......................SS',
    'S.....S.......SS.......................SS',
    'S#####S########S########...............SS',
    'S.....S........S.......#...............SS',
    'S.....S........S.......#...............SS',
    'S.....SSSSSSSSSS.......#...............SS',
    'S.....................MMMM.............SS',
    'S.....................MMMM.............SS',
    'S##############################........SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_22 = {
  id: 'hard_02', nameHe: 'אזור המגנטים', nameEn: 'Magnet Madness',
  world: 'hard', difficulty: 3,
  players: 14, toSave: 9, timeLimit: 240,
  skills: { builder: 4, blocker: 2, digger: 3, parachuter: 3, redcard: 2, climber: 5, sprinter: 2, goalkeeper: 2, shooter: 2, basher: 3 },
  entry: { tile: { x: 2, y: 14 }, rate: 1300 },
  exit:  { tile: { x: 36, y: 2 } },
  comicWorld: null,
  tip: 'אזורי מגנט הופכים כבידה – השתמש במטפס!',
  hazards: [
    { type: 'magnet', x: 256, y: 0, width: 192, height: 480, inverted: true },
    { type: 'magnet', x: 768, y: 0, width: 192, height: 480, inverted: true },
    { type: 'electric', x: 576, y: 192, width: 32, height: 192 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S.....##########.....##########........SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......SSSSSSSSS.....SSSSSSSSSSS.......SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................................SS',
    'S#########.............................SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_23 = {
  id: 'hard_03', nameHe: 'מבוך המלכודות', nameEn: 'Trapdoor Maze',
  world: 'hard', difficulty: 3,
  players: 14, toSave: 9, timeLimit: 240,
  skills: { builder: 4, blocker: 3, digger: 3, parachuter: 4, redcard: 2, climber: 3, sprinter: 2, goalkeeper: 2, shooter: 3, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1400 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'מלכודות בכל מקום! השתמש בצנחן.',
  hazards: [
    { type: 'trapdoor', x: 256, y: 224 },
    { type: 'trapdoor', x: 480, y: 160 },
    { type: 'trapdoor', x: 704, y: 288 },
    { type: 'trapdoor', x: 928, y: 192 },
    { type: 'rolling_ball', x: 640, y: 352, speed: 3, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S###########...........................SS',
    'S......................................SS',
    'S.....#########........................SS',
    'S......................................SS',
    'S..........########....................SS',
    'S......................................SS',
    'S...............########...............SS',
    'S......................................SS',
    'S######################................SS',
    'S......................................SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_24 = {
  id: 'hard_04', nameHe: 'המרוץ נגד הזמן', nameEn: 'Race Against Time',
  world: 'hard', difficulty: 3,
  players: 12, toSave: 9, timeLimit: 120,
  skills: { builder: 5, blocker: 2, digger: 3, parachuter: 3, redcard: 3, climber: 3, sprinter: 5, goalkeeper: 2, shooter: 2, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 800 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'רק 120 שניות! הזדרז!',
  hazards: [
    { type: 'wind', x: 384, y: 0, width: 192, height: 480, dir: -1, force: 1.5 },
    { type: 'rolling_ball', x: 800, y: 192, speed: 4, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S####..................................SS',
    'S......................................SS',
    'S......................................SS',
    'S.........######.......................SS',
    'S......................................SS',
    'S......................................SS',
    'S................#####.................SS',
    'S......................................SS',
    'S......................................SS',
    'S......................######...........SS',
    'S......................................SS',
    'S...############################.......SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_25 = {
  id: 'hard_05', nameHe: 'כל הסכנות', nameEn: 'All Hazards',
  world: 'hard', difficulty: 3,
  players: 15, toSave: 10, timeLimit: 260,
  skills: { builder: 5, blocker: 3, digger: 3, parachuter: 4, redcard: 3, climber: 3, sprinter: 3, goalkeeper: 4, shooter: 3, basher: 3 },
  entry: { tile: { x: 2, y: 2 }, rate: 1300 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'כל הסכנות, כל המיומנויות!',
  hazards: [
    { type: 'rolling_ball', x: 400, y: 352, speed: 3, dir: -1 },
    { type: 'rolling_ball', x: 800, y: 192, speed: 3, dir: -1 },
    { type: 'wind', x: 576, y: 0, width: 128, height: 480, dir: 1, force: 1 },
    { type: 'electric', x: 288, y: 128, width: 32, height: 256 },
    { type: 'electric', x: 960, y: 128, width: 32, height: 256 },
    { type: 'referee', x: 640, y: 320, speed: 2, patrol: 160 },
    { type: 'fireworks', x: 512, y: 192, interval: 2000 },
    { type: 'fireworks', x: 832, y: 288, interval: 2500 },
    { type: 'trapdoor', x: 384, y: 256 },
    { type: 'trapdoor', x: 704, y: 160 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S######................................SS',
    'S......................................SS',
    'S....MMMM..........WWWW................SS',
    'S....MMMM..........WWWW................SS',
    'S####MMMM####SSSS##WWWW################SS',
    'S......................................SS',
    'S......................................SS',
    'S....####.......####.......####........SS',
    'S......................................SS',
    'S......................................SS',
    'S.....WWWWWWWWWWWWWWWWWWWWWWWWWWWWW....SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_26 = {
  id: 'hard_06', nameHe: 'דיוק מדויק', nameEn: 'Precision Puzzle',
  world: 'hard', difficulty: 3,
  players: 10, toSave: 9, timeLimit: 300,
  skills: { builder: 2, blocker: 1, digger: 1, parachuter: 1, redcard: 1, climber: 1, sprinter: 1, goalkeeper: 1, shooter: 1, basher: 1 },
  entry: { tile: { x: 2, y: 2 }, rate: 2000 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'מיומנויות מוגבלות מאוד! תכנן בקפידה.',
  hazards: [
    { type: 'electric', x: 416, y: 192, width: 32, height: 288 },
    { type: 'rolling_ball', x: 800, y: 352, speed: 2.5, dir: -1 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S######................................SS',
    'S......................................SS',
    'S......SSSSSS..........................SS',
    'S......SSSSSS..........................SS',
    'S######SSSSSS######################....SS',
    'S......................................SS',
    'S......................................SS',
    'S..............MMMMMM..................SS',
    'S..............MMMMMM..................SS',
    'S##############################........SS',
    'S......................................SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_27 = {
  id: 'hard_07', nameHe: 'תגובת השרשרת', nameEn: 'Chain Reaction',
  world: 'hard', difficulty: 3,
  players: 14, toSave: 9, timeLimit: 240,
  skills: { builder: 3, blocker: 2, digger: 3, parachuter: 3, redcard: 5, climber: 2, sprinter: 2, goalkeeper: 2, shooter: 4, basher: 2 },
  entry: { tile: { x: 2, y: 2 }, rate: 1400 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'כרטיסים אדומים יוצרים שרשרת פיצוצים!',
  hazards: [
    { type: 'fireworks', x: 352, y: 224, interval: 1500 },
    { type: 'fireworks', x: 576, y: 224, interval: 1500 },
    { type: 'fireworks', x: 800, y: 224, interval: 1500 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S##########............................SS',
    'S......................................SS',
    'S.....SSSSSSSSSSSSSSSSSSSSSSSSSS.......SS',
    'S.....S............................S...SS',
    'S.....SSSSSSSSSSSSSSSSSSSSSSSSSSSS.....SS',
    'S......................................SS',
    'S......................................SS',
    'S....####..........####..........####..SS',
    'S......................................SS',
    'S......................................SS',
    'S...WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWSS',
    'S...WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWSS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_28 = {
  id: 'hard_08', nameHe: 'שלב ההקרבה', nameEn: 'Sacrifice Stage',
  world: 'hard', difficulty: 3,
  players: 15, toSave: 8, timeLimit: 240,
  skills: { builder: 3, blocker: 2, digger: 2, parachuter: 2, redcard: 7, climber: 2, sprinter: 2, goalkeeper: 2, shooter: 2, basher: 2 },
  entry: { tile: { x: 2, y: 2 }, rate: 1200 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'כמה שחקנים חייבים להקריב עצמם!',
  hazards: [
    { type: 'electric', x: 352, y: 128, width: 32, height: 352 },
    { type: 'electric', x: 672, y: 128, width: 32, height: 352 },
    { type: 'electric', x: 992, y: 128, width: 32, height: 352 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S######................................SS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......SSSSSSSSSS..SSSSSSSSSS..SSSSSSSS',
    'S......................................SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_29 = {
  id: 'hard_09', nameHe: 'חצי גמר', nameEn: 'Semi-Final',
  world: 'hard', difficulty: 3,
  players: 15, toSave: 11, timeLimit: 260,
  skills: { builder: 5, blocker: 3, digger: 4, parachuter: 4, redcard: 3, climber: 4, sprinter: 3, goalkeeper: 4, shooter: 3, basher: 4 },
  entry: { tile: { x: 2, y: 2 }, rate: 1100 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: 'חצי גמר! כל כישרון יידרש.',
  hazards: [
    { type: 'rolling_ball', x: 500, y: 160, speed: 3.5, dir: -1 },
    { type: 'rolling_ball', x: 900, y: 352, speed: 3, dir: -1 },
    { type: 'wind', x: 256, y: 64, width: 128, height: 448, dir: 1, force: 1 },
    { type: 'wind', x: 832, y: 64, width: 128, height: 448, dir: -1, force: 1 },
    { type: 'electric', x: 576, y: 128, width: 32, height: 352 },
    { type: 'referee', x: 700, y: 352, speed: 2.5, patrol: 200 },
    { type: 'fireworks', x: 384, y: 192, interval: 1800 },
    { type: 'fireworks', x: 832, y: 288, interval: 2000 },
    { type: 'trapdoor', x: 448, y: 256 },
    { type: 'trapdoor', x: 768, y: 160 },
    { type: 'magnet', x: 960, y: 0, width: 128, height: 480, inverted: true },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S####..................................SS',
    'S......................................SS',
    'S....MMMM..........WWWW..........MMMM.SS',
    'S....MMMM..........WWWW..........MMMM.SS',
    'S####MMMM##########WWWW##########MMMM#SS',
    'S......................................SS',
    'S......................................SS',
    'S....####.......####.......####........SS',
    'S......................................SS',
    'S......................................SS',
    'S..SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS..SS',
    'S......................................SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

const HARD_30 = {
  id: 'hard_10', nameHe: '🏆 גמר גביע העולם! 🏆', nameEn: '🏆 World Cup Final! 🏆',
  world: 'hard', difficulty: 3,
  players: 20, toSave: 15, timeLimit: 300,
  skills: { builder: 6, blocker: 4, digger: 5, parachuter: 5, redcard: 4, climber: 5, sprinter: 4, goalkeeper: 5, shooter: 4, basher: 5 },
  entry: { tile: { x: 2, y: 2 }, rate: 900 },
  exit:  { tile: { x: 36, y: 14 } },
  comicWorld: null,
  tip: '🏆 הגמר! כל הסכנות, כל האתגרים! הצלח!',
  hazards: [
    { type: 'rolling_ball', x: 400, y: 160, speed: 4, dir: -1 },
    { type: 'rolling_ball', x: 700, y: 352, speed: 3.5, dir: -1 },
    { type: 'rolling_ball', x: 950, y: 192, speed: 4, dir: -1 },
    { type: 'wind', x: 256, y: 0, width: 128, height: 480, dir: 1, force: 1.2 },
    { type: 'wind', x: 768, y: 0, width: 128, height: 480, dir: -1, force: 1.2 },
    { type: 'electric', x: 448, y: 96, width: 32, height: 384 },
    { type: 'electric', x: 832, y: 96, width: 32, height: 384 },
    { type: 'referee', x: 600, y: 320, speed: 3, patrol: 200 },
    { type: 'referee', x: 800, y: 160, speed: 2.5, patrol: 150 },
    { type: 'fireworks', x: 320, y: 192, interval: 1500 },
    { type: 'fireworks', x: 576, y: 128, interval: 1800 },
    { type: 'fireworks', x: 896, y: 224, interval: 1500 },
    { type: 'trapdoor', x: 352, y: 320 },
    { type: 'trapdoor', x: 672, y: 192 },
    { type: 'trapdoor', x: 928, y: 352 },
    { type: 'magnet', x: 960, y: 0, width: 160, height: 480, inverted: true },
    { type: 'mud_pool', x: 576, y: 416, width: 192, height: 32 },
  ],
  tiles: parseTileMap([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'S......................................SS',
    'S####..................................SS',
    'S......................................SS',
    'S....MMMM....WWWW....MMMM....WWWW.....SS',
    'S....MMMM....WWWW....MMMM....WWWW.....SS',
    'S####MMMM####WWWW####MMMM####WWWW######SS',
    'S......................................SS',
    'S....SSSSSSSSSSSSSSSSSSSSSSSSSSSS......SS',
    'S....S..S..S..S..S..S..S..S..S..S.....SS',
    'S....SSSSSSSSSSSSSSSSSSSSSSSSSSSS......SS',
    'S......................................SS',
    'S......................................SS',
    'S##############################........SS',
    'S.......................................ES',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ])
};

export const LEVELS = [
  EASY_1, EASY_2, EASY_3, EASY_4, EASY_5,
  EASY_6, EASY_7, EASY_8, EASY_9, EASY_10,
  MEDIUM_11, MEDIUM_12, MEDIUM_13, MEDIUM_14, MEDIUM_15,
  MEDIUM_16, MEDIUM_17, MEDIUM_18, MEDIUM_19, MEDIUM_20,
  HARD_21, HARD_22, HARD_23, HARD_24, HARD_25,
  HARD_26, HARD_27, HARD_28, HARD_29, HARD_30,
];

export const WORLD_ORDER = ['easy', 'medium', 'hard'];
export const WORLD_NAMES = {
  easy:   { he: 'קל – שדה האימון', en: 'Easy – Training Ground' },
  medium: { he: 'בינוני – רחובות העיר', en: 'Medium – City Streets' },
  hard:   { he: 'קשה – הגמר', en: 'Hard – The Finals' },
};
