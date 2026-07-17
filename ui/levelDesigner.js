// ============================================================
// ui/levelDesigner.js – Prompt-based level generator (offline rule-based)
// ============================================================
import { TILE } from '../levels/data.js';

// Keyword → level elements mapping (Hebrew + English)
const KEYWORDS = {
  // terrain
  pit:         { en:['pit','gap','hole','abyss'], he:['בור','פרצה','חלל','תהום'] },
  wall:        { en:['wall','barrier','block'], he:['קיר','מחסום','חסימה'] },
  stairs:      { en:['stair','step','hill','slope'], he:['מדרגות','גבעה','שיפוע'] },
  tunnel:      { en:['tunnel','underground','dig'], he:['מנהרה','מחתרת','חפירה'] },
  // hazards
  wind:        { en:['wind','blow','fan','storm'], he:['רוח','מאוורר','סופה'] },
  ball:        { en:['ball','rolling','kick'], he:['כדור','מתגלגל'] },
  electric:    { en:['electric','spark','light','zap'], he:['חשמל','זרקור','ברק'] },
  mud:         { en:['mud','swamp','bog','slow'], he:['בוץ','ביצה','טיט'] },
  water:       { en:['water','flood','swim','drown'], he:['מים','שיטפון','שחייה'] },
  fireworks:   { en:['firework','explode','pyro','blast'], he:['זיקוק','פיצוץ'] },
  referee:     { en:['referee','ref','judge','enemy'], he:['שפט','אויב','שופט'] },
  trapdoor:    { en:['trap','trapdoor','snare','pitfall'], he:['מלכודת','פח'] },
  magnet:      { en:['magnet','gravity','float','inverse'], he:['מגנט','כבידה','הפוכה'] },
  // skills
  builder:     { en:['build','bridge','stair','construct'], he:['בנה','גשר','בנאי'] },
  digger:      { en:['dig','tunnel','mine','shovel'], he:['חפר','כרה','מנהרה'] },
  blocker:     { en:['block','stop','wall','shield'], he:['חסום','עצור','מגן'] },
  parachuter:  { en:['parachute','float','fall','safe'], he:['צנחן','צנח','נחת'] },
  climber:     { en:['climb','wall','scale','ascend'], he:['טפס','קיר','עלה'] },
  sprinter:    { en:['sprint','fast','speed','run'], he:['ספרינטר','מהיר','ריצה'] },
  basher:      { en:['bash','break','smash','destroy'], he:['שבור','הרס','פרץ'] },
  redcard:     { en:['bomb','explode','sacrifice','red card','blast'], he:['פצצה','כרטיס אדום','קרבן'] },
  goalkeeper:  { en:['goalkeeper','keeper','save','block','gk'], he:['שוער','מגן'] },
  shooter:     { en:['shoot','kick','trigger','switch'], he:['בעט','ירה','מתג'] },
};

const TILE_STR = {
  '.': TILE.EMPTY, '#': TILE.EARTH, 'S': TILE.STEEL, 'W': TILE.WATER, 'M': TILE.MUD
};

export class LevelDesigner {
  constructor(container, game) {
    this.container = container;
    this.game      = game;
    this._el       = null;
    this._preview  = null;
    this._build();
  }

  _build() {
    const el = document.createElement('div');
    el.id = 'designer';
    el.innerHTML = `
      <div id="des-inner">
        <h2>🎨 מעצב שלבים</h2>
        <p id="des-desc">תאר את השלב שלך בעברית או באנגלית. לדוגמה:<br>
          <em>"שלב עם בור עמוק ורוח חזקה, צריך בנאי וצנחן"</em>
        </p>
        <div id="des-input-row">
          <textarea id="des-prompt" rows="3" placeholder="תאר את השלב כאן..."></textarea>
          <button id="des-generate">✨ צור שלב</button>
        </div>
        <div id="des-result" style="display:none">
          <h3 id="des-level-title"></h3>
          <div id="des-summary"></div>
          <canvas id="des-preview" width="800" height="300"></canvas>
          <div id="des-actions">
            <button id="des-play">▶ שחק עכשיו</button>
            <button id="des-save">💾 שמור שלב</button>
            <button id="des-regen">🔄 נסה שוב</button>
          </div>
        </div>
        <button id="des-close">✖ סגור</button>
      </div>
    `;
    this.container.appendChild(el);
    this._el = el;

    document.getElementById('des-generate').onclick = () => this._generate();
    document.getElementById('des-play').onclick     = () => this._playGenerated();
    document.getElementById('des-regen').onclick    = () => this._generate();
    document.getElementById('des-save').onclick     = () => this._save();
    document.getElementById('des-close').onclick    = () => { this.hide(); this.game.returnToMenu(); };

    el.style.display = 'none';
  }

  _parsePrompt(text) {
    const lower = text.toLowerCase();
    const found = { hazards: [], skills: {}, terrain: [] };

    for (const [key, wordlists] of Object.entries(KEYWORDS)) {
      const words = [...wordlists.en, ...wordlists.he];
      const hit   = words.some(w => lower.includes(w));
      if (!hit) continue;

      // classify
      const hazardKeys = ['wind','ball','electric','mud','water','fireworks','referee','trapdoor','magnet'];
      const skillKeys  = ['builder','digger','blocker','parachuter','climber','sprinter','basher','redcard','goalkeeper','shooter'];
      const terrainKeys= ['pit','wall','stairs','tunnel'];

      if (hazardKeys.includes(key))  found.hazards.push(key);
      if (skillKeys.includes(key))   found.skills[key] = 3 + Math.floor(Math.random()*3);
      if (terrainKeys.includes(key)) found.terrain.push(key);
    }

    // extract numbers for player count / save requirement
    const nums = text.match(/\d+/g)?.map(Number) ?? [];
    found.players = nums[0] ? Math.min(20, Math.max(5, nums[0])) : 10;
    found.toSave  = nums[1] ? Math.min(found.players-1, Math.max(3, nums[1])) : Math.floor(found.players * 0.6);

    return found;
  }

  _generateTerrain(parsed) {
    // Build a 40×15 tile map based on terrain keywords
    const W = 40, H = 15;
    const grid = Array.from({length: H}, () => Array(W).fill(TILE.EMPTY));

    // Steel border
    for (let x=0;x<W;x++) { grid[0][x]=TILE.STEEL; grid[H-1][x]=TILE.STEEL; }
    for (let y=0;y<H;y++) { grid[y][0]=TILE.STEEL; grid[y][W-1]=TILE.STEEL; }

    // Base ground
    for (let x=1;x<W-1;x++) grid[H-2][x] = TILE.EARTH;

    // Apply terrain patterns
    if (parsed.terrain.includes('pit')) {
      const px = 10 + Math.floor(Math.random()*15);
      for (let x=px;x<px+5;x++) grid[H-2][x]=TILE.EMPTY;
    }
    if (parsed.terrain.includes('wall')) {
      const wx = 15 + Math.floor(Math.random()*10);
      for (let y=H-5;y<H-1;y++) grid[y][wx]=TILE.EARTH;
    }
    if (parsed.terrain.includes('stairs')) {
      for (let i=0;i<6;i++) grid[H-3-i][5+i]=TILE.EARTH;
    }
    if (parsed.terrain.includes('tunnel')) {
      for (let x=5;x<W-5;x++) {
        grid[H-4][x]=TILE.EARTH;
        grid[H-3][x]=TILE.EARTH;
      }
      for (let x=8;x<W-8;x++) { grid[H-4][x]=TILE.EMPTY; grid[H-3][x]=TILE.EMPTY; }
    }

    // Add platforms in the middle
    const platforms = 2 + Math.floor(Math.random()*2);
    for (let p=0;p<platforms;p++) {
      const py = 4 + Math.floor(Math.random()*5);
      const px = 5 + Math.floor(Math.random()*(W-15));
      const pw = 5 + Math.floor(Math.random()*6);
      for (let x=px;x<Math.min(W-1,px+pw);x++) grid[py][x]=TILE.EARTH;
    }

    // Apply hazard terrain features
    if (parsed.hazards.includes('water')) {
      const wx = 10+Math.floor(Math.random()*15);
      for (let x=wx;x<wx+4;x++) grid[H-2][x]=TILE.WATER;
    }
    if (parsed.hazards.includes('mud')) {
      const mx = 5+Math.floor(Math.random()*20);
      for (let x=mx;x<mx+3;x++) grid[H-2][x]=TILE.MUD;
    }

    return grid;
  }

  _generate() {
    const text   = document.getElementById('des-prompt').value.trim();
    if (!text) { alert('נא להזין תיאור שלב!'); return; }

    const parsed = this._parsePrompt(text);

    // Default at least 2 skills if none detected
    if (Object.keys(parsed.skills).length < 2) {
      parsed.skills.builder    = 4;
      parsed.skills.blocker    = 2;
    }

    const tilemap = this._generateTerrain(parsed);

    // Build hazard objects from keywords
    const hazards = [];
    if (parsed.hazards.includes('ball'))      hazards.push({ type:'rolling_ball', x:300, y:tilemap.length*32-64, speed:2.5, dir:-1 });
    if (parsed.hazards.includes('wind'))      hazards.push({ type:'wind', x:200, y:0, width:150, height:480, dir:1, force:0.8 });
    if (parsed.hazards.includes('electric'))  hazards.push({ type:'electric', x:500, y:100, width:32, height:300 });
    if (parsed.hazards.includes('fireworks')) hazards.push({ type:'fireworks', x:600, y:200, interval:2500 });
    if (parsed.hazards.includes('referee'))   hazards.push({ type:'referee', x:400, y:tilemap.length*32-96, speed:2, patrol:150 });
    if (parsed.hazards.includes('trapdoor'))  hazards.push({ type:'trapdoor', x:350, y:tilemap.length*32-100 });
    if (parsed.hazards.includes('magnet'))    hazards.push({ type:'magnet', x:700, y:0, width:150, height:480, inverted:true });

    this._generatedLevel = {
      id: `custom_${Date.now()}`,
      nameHe: `שלב מותאם אישית`,
      nameEn: 'Custom Level',
      world: 'custom',
      difficulty: 2,
      players: parsed.players,
      toSave: parsed.toSave,
      timeLimit: 200,
      skills: parsed.skills,
      entry: { tile: { x: 2, y: 1 }, rate: 1500 },
      exit:  { tile: { x: tilemap[0].length - 4, y: tilemap.length - 2 } },
      comicWorld: null,
      tip: 'שלב מותאם אישית!',
      hazards,
      tiles: tilemap,
    };

    this._renderPreview(tilemap);
    const el = document.getElementById('des-result');
    el.style.display = 'block';

    document.getElementById('des-level-title').textContent = `שלב: ${text.substring(0,50)}`;
    document.getElementById('des-summary').innerHTML = `
      <b>שחקנים:</b> ${parsed.players} | <b>לשרוד:</b> ${parsed.toSave} |
      <b>מיומנויות:</b> ${Object.keys(parsed.skills).map(k=>`${k}:${parsed.skills[k]}`).join(', ')} |
      <b>סכנות:</b> ${parsed.hazards.join(', ') || 'ללא'}
    `;
  }

  _renderPreview(tilemap) {
    const canvas = document.getElementById('des-preview');
    const ctx    = canvas.getContext('2d');
    const TW     = canvas.width  / tilemap[0].length;
    const TH     = canvas.height / tilemap.length;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const colors = { 0:'transparent', 1:'#5c3d1e', 2:'#3a4a5c', 3:'#1a3a8c', 4:'#3d2206' };
    for (let ty=0;ty<tilemap.length;ty++) {
      for (let tx=0;tx<tilemap[ty].length;tx++) {
        const t = tilemap[ty][tx];
        if (t===0) continue;
        ctx.fillStyle = colors[t]||'#888';
        ctx.fillRect(tx*TW, ty*TH, TW-1, TH-1);
        if (t===1 && (ty===0||tilemap[ty-1]?.[tx]===0)) {
          ctx.fillStyle = '#3a7d44';
          ctx.fillRect(tx*TW, ty*TH, TW-1, 2);
        }
      }
    }
    // Entry & Exit
    ctx.fillStyle = '#ffd700'; ctx.fillRect(2*TW, TH, TW, TH);
    ctx.fillStyle = '#00ff55'; ctx.fillRect((tilemap[0].length-4)*TW, (tilemap.length-2)*TH, TW, TH);
    ctx.fillStyle = '#fff'; ctx.font = '8px Arial';
    ctx.fillText('▼', 2*TW+1, TH+TH*0.7);
    ctx.fillText('E', (tilemap[0].length-4)*TW+1, (tilemap.length-2)*TH+TH*0.7);
  }

  _playGenerated() {
    if (this._generatedLevel) {
      this.hide();
      this.game.playLevel(this._generatedLevel);
    }
  }

  _save() {
    if (!this._generatedLevel) return;
    const saved = JSON.parse(localStorage.getItem('wch_custom') ?? '[]');
    saved.push(this._generatedLevel);
    localStorage.setItem('wch_custom', JSON.stringify(saved));
    alert('✅ השלב נשמר בהצלחה!');
  }

  show() { this._el.style.display = 'flex'; }
  hide() { this._el.style.display = 'none'; }
}
