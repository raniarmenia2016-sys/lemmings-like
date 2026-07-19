// ============================================================
// game.js – Main game controller: state machine + game loop
// ============================================================
import { LEVELS }          from './levels/data.js';
import { World, TILE_SIZE } from './engine/world.js';
import { Player }           from './engine/player.js';
import { HazardManager }    from './engine/hazards.js';
import { TouchHandler }     from './engine/touch.js';
import { KeyboardHandler }  from './engine/keyboard.js';
import { HUD }              from './ui/hud.js';
import { ComicScreen }      from './ui/comic.js';
import { LevelSelectScreen }from './ui/levelSelect.js';
import { LevelDesigner }    from './ui/levelDesigner.js';

// Game states
const GS = {
  MENU:          'menu',
  LEVEL_SELECT:  'level_select',
  COMIC:         'comic',
  PLAYING:       'playing',
  PAUSED:        'paused',
  LEVEL_COMPLETE:'level_complete',
  LEVEL_FAIL:    'level_fail',
  DESIGNER:      'designer',
};

class Game {
  constructor() {
    this.canvas     = document.getElementById('gameCanvas');
    this.ctx        = this.canvas.getContext('2d');
    this.uiRoot     = document.getElementById('ui-root');
    this.state      = GS.MENU;
    this._level     = null;
    this._world     = null;
    this._players   = [];
    this._hazards   = null;
    this._hud       = null;
    this._touch     = null;
    this._keyboard  = null;
    this._levelSelect = null;
    this._comic     = null;
    this._designer  = null;
    this._selectedSkill = null;
    this._focusedPlayer = null;
    this._skillCounts   = {};
    this._spawnTimer    = 0;
    this._spawnedCount  = 0;
    this._timeLeft      = 0;
    this._lastTime      = 0;
    this._fastMode      = false;
    this._particles     = [];
    this._pendingComicWorld = null;
    this._currentLevelIdx   = 0;
    this._menuBg    = new Image();
    this._menuBg.src = 'assets/menu_bg.png';
    this._initUI();
    this._initCanvas();
    this._startLoop();
    window.addEventListener('playerDied', e => this._onPlayerDied(e.detail));
  }

  // ── Init ─────────────────────────────────────────────────
  _initCanvas() {
    const resize = () => {
      const ratio = 16 / 9;
      const ww    = window.innerWidth, wh = window.innerHeight;
      if (ww / wh > ratio) {
        this.canvas.style.height = wh + 'px';
        this.canvas.style.width  = (wh * ratio) + 'px';
      } else {
        this.canvas.style.width  = ww + 'px';
        this.canvas.style.height = (ww / ratio) + 'px';
      }
      const displayWidth = Math.min(ww, wh * ratio);
      this.uiRoot.style.transform = `translateX(-50%) scale(${displayWidth / this.canvas.width})`;
    };
    window.addEventListener('resize', resize);
    resize();
    this._touch = new TouchHandler(this.canvas, this);
    this._keyboard = new KeyboardHandler(this);
  }

  _initUI() {
    // HUD
    this._hud = new HUD(this.uiRoot, this);
    this._hud.hide();

    // Comic
    this._comic = new ComicScreen(this.uiRoot, () => {
      this._hud.show();
      this.setState(GS.PLAYING);
    });

    // Level Select
    this._levelSelect = new LevelSelectScreen(
      this.uiRoot,
      idx => { this._currentLevelIdx = idx; this._startLevel(LEVELS[idx]); },
      ()  => this._showDesigner(),
      ()  => { this.returnToMenu(); }
    );

    // Designer
    this._designer = new LevelDesigner(this.uiRoot, this);

    // Menu
    this._buildMenu();
    this._buildResultScreen();
  }

  _buildMenu() {
    const el = document.createElement('div');
    el.id = 'menu-screen';
    el.innerHTML = `
      <div id="menu-inner">
        <h1 id="menu-title">⚽ גיבורי גביע העולם</h1>
        <h2 id="menu-sub">World Cup Heroes</h2>
        <div id="menu-btns">
          <button class="menu-btn primary" id="btn-play">▶ שחק</button>
          <button class="menu-btn" id="btn-how">❓ איך לשחק</button>
          <button class="menu-btn" id="btn-design">🎨 עצב שלב</button>
        </div>
        <div id="menu-howto" style="display:none">
          <h3>איך לשחק:</h3>
          <ul>
            <li>⚽ שחקני הכדורגל יוצאים מהמנהרה ומתחילים ללכת</li>
            <li>👆 הקש על מיומנות בתחתית המסך, ואז הקש על שחקן כדי להקצות אותה</li>
            <li>🎯 העבר מספיק שחקנים לשער הירוק!</li>
            <li>🔨 בנאי – בונה מדרגות | ⛏️ חפר – חופר | 🧱 חוסם – עוצר</li>
            <li>🪂 צנחן – שורד נפילות | 🥅 שוער – מגן | 🏃 ספרינטר – מהיר</li>
            <li>🧗 מטפס – טיפוס קירות | 🪓 מפרץ – שבירה | 🟥 כרטיס – פיצוץ</li>
            <li>🎯 קלע – בועט כדור להפעיל מתגים</li>
          </ul>
          <button id="btn-howclose">✕ סגור</button>
        </div>
      </div>
    `;
    this.uiRoot.appendChild(el);
    document.getElementById('btn-play').onclick   = () => this._showLevelSelect();
    document.getElementById('btn-design').onclick = () => this._showDesigner();
    document.getElementById('btn-how').onclick    = () => { document.getElementById('menu-howto').style.display='block'; };
    document.getElementById('btn-howclose').onclick = () => { document.getElementById('menu-howto').style.display='none'; };
    this._menuEl = el;
  }

  _buildResultScreen() {
    const el = document.createElement('div');
    el.id = 'result-screen';
    el.style.display = 'none';
    el.innerHTML = `
      <div id="result-inner">
        <div id="result-icon"></div>
        <h2 id="result-title"></h2>
        <div id="result-stars"></div>
        <div id="result-stats"></div>
        <div id="result-btns">
          <button class="menu-btn primary" id="btn-retry">🔄 נסה שוב</button>
          <button class="menu-btn" id="btn-next">▶ הבא</button>
          <button class="menu-btn" id="btn-levels">📋 רמות</button>
        </div>
      </div>
    `;
    this.uiRoot.appendChild(el);
    this._resultEl = el;
    document.getElementById('btn-retry').onclick  = () => { el.style.display='none'; this._startLevel(this._level); };
    document.getElementById('btn-next').onclick   = () => { el.style.display='none'; this._nextLevel(); };
    document.getElementById('btn-levels').onclick = () => this._showLevelSelect();
  }

  // ── State machine ────────────────────────────────────────
  setState(s) { this.state = s; }

  _hideAllOverlays() {
    this._menuEl.style.display = 'none';
    this._levelSelect.hide();
    this._designer.hide();
    this._comic._el.style.display = 'none';
    this._resultEl.style.display = 'none';
    this._hud.hide();
  }

  _showLevelSelect() {
    this._hideAllOverlays();
    this._levelSelect.show();
    this.setState(GS.LEVEL_SELECT);
  }

  _showDesigner() {
    this._hideAllOverlays();
    this._designer.show();
    this.setState(GS.DESIGNER);
  }

  _startLevel(levelData) {
    if (!levelData?.tiles || !levelData.entry || !levelData.exit) {
      console.error('Cannot start an invalid level.', levelData);
      this._showLevelSelect();
      return;
    }

    this._hideAllOverlays();
    this.setState(GS.PLAYING);

    try {
      this._level       = levelData;
      this._players     = [];
      this._particles   = [];
      this._spawnTimer  = 0;
      this._spawnedCount= 0;
      this._timeLeft    = levelData.timeLimit * 1000;
      this._fastMode    = false;
      this._selectedSkill = null;
      this._focusedPlayer = null;
      this._skillCounts = { ...levelData.skills };
      this._world       = new World(levelData, this.canvas);
      this._hazards     = new HazardManager(this._world, this.canvas);
      this._hazards.load(levelData.hazards ?? []);
      this._hud.buildSkillBar(this._skillCounts);

      if (levelData.comicWorld) {
        this.setState(GS.COMIC);
        this._comic.show(levelData.comicWorld);
      } else {
        this._hud.show();
      }
    } catch (error) {
      console.error('Unable to start level.', error);
      this._showLevelSelect();
      alert('לא ניתן לפתוח את השלב. נסה לבחור שלב אחר.');
    }
  }

  // ── Player spawning ──────────────────────────────────────
  _spawnPlayer() {
    const ep = this._world.entryPx;
    const p  = new Player(ep.x - 10, ep.y, this._world, this._spawnedCount);
    this._players.push(p);
    this._spawnedCount++;
    this._addParticle(ep.x, ep.y, '#ffd700', 12);
  }

  // ── Particles ────────────────────────────────────────────
  _addParticle(x, y, color, count = 6) {
    for (let i=0;i<count;i++) {
      const angle = Math.random()*Math.PI*2;
      const speed = 1 + Math.random()*3;
      this._particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        color, life: 30+Math.random()*30, maxLife:60,
      });
    }
  }

  _updateParticles() {
    this._particles = this._particles.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
      return p.life > 0;
    });
  }

  _renderParticles(ctx) {
    for (const p of this._particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      ctx.beginPath(); ctx.arc(p.x - this._world.viewX, p.y - this._world.viewY, 3, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Touch handlers ───────────────────────────────────────
  handleTap(cx, cy) {
    if (this.state === GS.PAUSED || this.state !== GS.PLAYING) return;
    if (!this._selectedSkill) return;

    // convert canvas coords to world coords
    const wx = cx + this._world.viewX;
    const wy = cy + this._world.viewY;

    // find player under tap
    for (const p of this._players) {
      if (p.dead || p.safe) continue;
      const dx = Math.abs(p.x + p.w/2 - wx);
      const dy = Math.abs(p.y + p.h/2 - wy);
      if (dx < 24 && dy < 24) {
        this._assignSkillToPlayer(p);
        break;
      }
    }
  }

  _assignSkillToPlayer(player) {
    const skill = this._selectedSkill;
    if (!skill || !player || this._skillCounts[skill] <= 0) return false;

    const wasState = this.state;
    const assigned = player.assignSkill(skill);
    if (!assigned) return false;

    this._skillCounts[skill]--;
    this._hud.updateSkillCount(skill, this._skillCounts[skill]);
    this._addParticle(player.x + player.w / 2, player.y, '#00ff88', 8);
    this.setState(GS.PAUSED);
    setTimeout(() => {
      if (this.state === GS.PAUSED) this.setState(wasState);
    }, 200);
    return true;
  }

  highlightPlayerAt(cx, cy) {
    if (this.state !== GS.PLAYING && this.state !== GS.PAUSED) return;
    const wx = cx + (this._world?.viewX ?? 0);
    const wy = cy + (this._world?.viewY ?? 0);
    for (const p of this._players) {
      const dx = Math.abs(p.x+p.w/2 - wx), dy = Math.abs(p.y+p.h/2 - wy);
      p.highlight = dx < 24 && dy < 24;
    }
  }

  clearHighlight() {
    this._players?.forEach(p => p.highlight = false);
  }

  focusNextPlayer(direction = 1) {
    if (this.state !== GS.PLAYING || !this._players.length) return;
    const candidates = this._players.filter(p => !p.dead && !p.safe);
    if (!candidates.length) return;

    const current = candidates.indexOf(this._focusedPlayer);
    const next = current < 0
      ? (direction < 0 ? candidates.length - 1 : 0)
      : (current + direction + candidates.length) % candidates.length;
    this._focusedPlayer = candidates[next];
    this._players.forEach(p => p.focused = p === this._focusedPlayer);
    this._world.scrollTo(this._focusedPlayer.x + this._focusedPlayer.w / 2);
  }

  selectSkillByKeyboard(skill) {
    if (this.state !== GS.PLAYING) return;
    this._hud.selectSkillByKeyboard(skill);
  }

  assignSkillToFocusedPlayer() {
    if (this.state !== GS.PLAYING) return;
    if (!this._focusedPlayer || this._focusedPlayer.dead || this._focusedPlayer.safe) {
      this.focusNextPlayer();
    }
    this._assignSkillToPlayer(this._focusedPlayer);
  }

  scrollBy(delta) {
    if (!this._world) return;
    this._world.viewX = Math.max(0,
      Math.min(this._world.viewX + delta, this._world.pixelW - this._world.canvasW));
  }

  selectSkill(skill) { this._selectedSkill = skill; }

  // ── Controls ─────────────────────────────────────────────
  togglePause() {
    if (this.state === GS.PLAYING) this.setState(GS.PAUSED);
    else if (this.state === GS.PAUSED) this.setState(GS.PLAYING);
  }
  toggleFast() { this._fastMode = !this._fastMode; }

  nukeAll() {
    this._players.filter(p=>!p.dead&&!p.safe).forEach(p => {
      p.assignSkill('redcard');
    });
  }

  returnToMenu() {
    this._hideAllOverlays();
    this._menuEl.style.display = 'flex';
    this.setState(GS.MENU);
  }

  returnToLevelSelect() {
    this._showLevelSelect();
  }

  // Play a generated custom level
  playLevel(levelData) {
    this._startLevel(levelData);
  }

  // ── Win/lose checks ──────────────────────────────────────
  _checkEndCondition() {
    const alive   = this._players.filter(p=>!p.dead&&!p.safe).length;
    const safe    = this._players.filter(p=>p.safe).length;
    const dead    = this._players.filter(p=>p.dead).length;
    const spawned = this._spawnedCount;
    const total   = this._level.players;

    // All players spawned and processed
    if (spawned >= total && alive === 0) {
      this._endLevel(safe);
      return;
    }
    // Time expired
    if (this._timeLeft <= 0 && spawned >= total) {
      this._endLevel(safe);
      return;
    }
    // Enough saved already
    if (safe >= this._level.toSave && spawned >= total && alive === 0) {
      this._endLevel(safe);
    }
  }

  _endLevel(saved) {
    const need  = this._level.toSave;
    const win   = saved >= need;
    const pct   = Math.round(saved / this._level.players * 100);
    const stars  = saved < need ? 0
                 : saved >= this._level.players ? 3
                 : saved >= need + Math.floor((this._level.players - need) / 2) ? 2 : 1;

    // Save progress
    this._levelSelect.saveResult(this._level.id, stars);

    this.setState(win ? GS.LEVEL_COMPLETE : GS.LEVEL_FAIL);
    this._hud.hide();

    document.getElementById('result-icon').textContent  = win ? '🏆' : '😢';
    document.getElementById('result-title').textContent =
      win ? `הצלחת! ${saved}/${this._level.players} ניצלו` : `כישלון! רק ${saved}/${need} ניצלו`;
    document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3-stars);
    document.getElementById('result-stats').textContent =
      `הצלת ${pct}% | נדרשו ${Math.round(need/this._level.players*100)}%`;

    const nextBtn = document.getElementById('btn-next');
    nextBtn.disabled = !win || this._currentLevelIdx >= LEVELS.length - 1;

    this._resultEl.style.display = 'flex';
    this._addParticle(640, 360, win ? '#ffd700' : '#ff4444', 30);
  }

  _nextLevel() {
    if (this._currentLevelIdx < LEVELS.length - 1) {
      this._currentLevelIdx++;
      this._startLevel(LEVELS[this._currentLevelIdx]);
    } else {
      this.returnToMenu();
    }
  }

  _onPlayerDied(detail) {
    this._addParticle(detail.x, detail.y, '#ff4444', 10);
  }

  // ── Main game loop ───────────────────────────────────────
  _startLoop() {
    const loop = (ts) => {
      const dt = Math.min(ts - this._lastTime, 50); // cap at 50ms
      this._lastTime = ts;
      const steps = this._fastMode ? 3 : 1;
      for (let i=0;i<steps;i++) this._update(dt/steps);
      this._render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  _update(dt) {
    if (this.state !== GS.PLAYING) return;

    const level = this._level;
    if (!level) return;

    // Spawn players
    if (this._spawnedCount < level.players) {
      this._spawnTimer += dt;
      if (this._spawnTimer >= level.entry.rate) {
        this._spawnTimer = 0;
        this._spawnPlayer();
      }
    }

    // Update world
    this._world.update(dt);

    // Update players
    for (const p of this._players) p.update();

    // Update hazards
    this._hazards.update(dt, this._players);

    // Update particles
    this._updateParticles();

    // Viewport scroll: follow centroid of alive players
    const alive = this._players.filter(p=>!p.dead&&!p.safe);
    if (alive.length > 0) {
      const cx = alive.reduce((s,p)=>s+p.x+p.w/2, 0) / alive.length;
      this._world.scrollTo(cx);
    }

    // Timer
    this._timeLeft -= dt;

    // Update HUD
    this._hud.update({
      total:    level.players,
      saved:    this._players.filter(p=>p.safe).length,
      lost:     this._players.filter(p=>p.dead).length,
      toSave:   level.toSave,
      timeLeft: this._timeLeft,
    });

    // Check end condition
    this._checkEndCondition();
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.state) {
      case GS.MENU:
        this._renderMenu(ctx); break;
      case GS.PLAYING:
      case GS.PAUSED:
      case GS.LEVEL_COMPLETE:
      case GS.LEVEL_FAIL:
        this._renderGame(ctx); break;
      default:
        // For level select / comic / designer, just render dark background
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  _renderMenu(ctx) {
    if (this._menuBg.complete) {
      ctx.drawImage(this._menuBg, 0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // animated floating footballs
    const t = Date.now() * 0.001;
    for (let i=0;i<6;i++) {
      const x = (i/6)*1280 + Math.sin(t*0.5+i)*30;
      const y = 100 + Math.sin(t*0.7+i*1.3)*40;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI*2); ctx.fill();
    }
  }

  _renderGame(ctx) {
    if (!this._world) return;
    const gameH = this.canvas.height - 80;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.canvas.width, gameH);
    ctx.clip();

    this._world.render(ctx);
    this._hazards.render(ctx, this._world.viewX, this._world.viewY);

    for (const p of this._players) {
      p.render(ctx, this._world.viewX, this._world.viewY);
    }

    this._renderParticles(ctx);

    if (this.state === GS.PAUSED) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0,0,this.canvas.width, gameH);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Heebo, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⏸ מושהה', this.canvas.width/2, gameH/2);
      ctx.textAlign = 'start';
    }

    // skill cursor indicator
    if (this._selectedSkill) {
      ctx.fillStyle = 'rgba(255,255,0,0.2)';
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      // draw indicator at player positions as reminder
      for (const p of this._players) {
        if (p.dead||p.safe) continue;
        const sx = p.x + p.w/2 - this._world.viewX;
        const sy = p.y - this._world.viewY - 20;
        ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI*2); ctx.stroke();
      }
    }

    ctx.restore();

    // Level name banner (top strip)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 200, 24);
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px Heebo, Arial';
    ctx.fillText(this._level?.nameHe ?? '', 4, 16);
    if (this._fastMode) {
      ctx.fillStyle = '#ff9900';
      ctx.fillText('⏩ מהיר', 210, 16);
    }
    // tip banner
    if (this._level?.tip) {
      const tipW = 400;
      ctx.fillStyle = 'rgba(0,60,0,0.7)';
      ctx.fillRect(this.canvas.width/2 - tipW/2, 0, tipW, 22);
      ctx.fillStyle = '#afffaf';
      ctx.font = '11px Heebo, Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this._level.tip, this.canvas.width/2, 15);
      ctx.textAlign = 'start';
    }
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window._game = new Game();
});
