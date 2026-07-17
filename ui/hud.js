// ============================================================
// ui/hud.js – Bottom skill bar + top status counters (Hebrew RTL)
// ============================================================
import { SKILL_ICONS } from '../engine/player.js';

const SKILL_NAMES_HE = {
  builder:'בנאי', digger:'חפר', blocker:'חוסם', parachuter:'צנחן',
  redcard:'כרטיס', climber:'מטפס', sprinter:'ספרינטר',
  goalkeeper:'שוער', shooter:'קלע', basher:'מפרץ',
};

export class HUD {
  constructor(container, game) {
    this.container    = container;
    this.game         = game;
    this.selectedSkill= null;
    this._el          = null;
    this._build();
  }

  _build() {
    const el = document.createElement('div');
    el.id = 'hud';
    el.innerHTML = `
      <div id="hud-top">
        <div class="hud-stat" id="stat-total"><span class="hud-icon">⚽</span><span id="val-total">0</span></div>
        <div class="hud-stat" id="stat-saved"><span class="hud-icon">✅</span><span id="val-saved">0</span></div>
        <div class="hud-stat" id="stat-lost"><span class="hud-icon">❌</span><span id="val-lost">0</span></div>
        <div class="hud-stat" id="stat-goal"><span class="hud-icon">🎯</span><span id="val-goal">0</span></div>
        <div class="hud-timer" id="stat-timer">⏱ 0:00</div>
        <button class="hud-btn-ctrl" id="btn-pause" title="עצור">⏸</button>
        <button class="hud-btn-ctrl" id="btn-fast"  title="מהיר">⏩</button>
        <button class="hud-btn-ctrl" id="btn-nuke"  title="נוקה הכל">💣</button>
        <button class="hud-btn-ctrl" id="btn-quit"  title="יציאה">🚪</button>
      </div>
      <div id="hud-skills"></div>
    `;
    this.container.appendChild(el);
    this._el = el;
    document.getElementById('btn-pause').onclick = () => this.game.togglePause();
    document.getElementById('btn-fast').onclick  = () => this.game.toggleFast();
    document.getElementById('btn-nuke').onclick  = () => this.game.nukeAll();
    document.getElementById('btn-quit').onclick  = () => this.game.returnToMenu();
  }

  buildSkillBar(skills) {
    const bar = document.getElementById('hud-skills');
    bar.innerHTML = '';
    this.selectedSkill = null;
    for (const [key, count] of Object.entries(skills)) {
      if (count <= 0) continue;
      const btn = document.createElement('button');
      btn.className = 'skill-btn';
      btn.id = `skill-${key}`;
      btn.dataset.skill = key;
      btn.innerHTML = `
        <span class="skill-icon">${SKILL_ICONS[key]}</span>
        <span class="skill-name">${SKILL_NAMES_HE[key]}</span>
        <span class="skill-count" id="cnt-${key}">${count}</span>
      `;
      btn.onclick = () => this._selectSkill(key, btn);
      bar.appendChild(btn);
    }
  }

  _selectSkill(skill, btn) {
    // deselect previous
    document.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('selected'));
    if (this.selectedSkill === skill) {
      this.selectedSkill = null;
      this.game.selectSkill(null);
    } else {
      btn.classList.add('selected');
      this.selectedSkill = skill;
      this.game.selectSkill(skill);
    }
  }

  updateSkillCount(skill, count) {
    const el = document.getElementById(`cnt-${skill}`);
    if (!el) return;
    el.textContent = count;
    if (count <= 0) {
      const btn = document.getElementById(`skill-${skill}`);
      if (btn) btn.disabled = true;
      if (this.selectedSkill === skill) {
        this.selectedSkill = null;
        this.game.selectSkill(null);
        btn?.classList.remove('selected');
      }
    }
  }

  update(stats) {
    document.getElementById('val-total').textContent = stats.total;
    document.getElementById('val-saved').textContent = stats.saved;
    document.getElementById('val-lost').textContent  = stats.lost;
    document.getElementById('val-goal').textContent  = `${stats.toSave}/${stats.total}`;
    const secs = Math.max(0, Math.ceil(stats.timeLeft / 1000));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    document.getElementById('stat-timer').textContent =
      `⏱ ${m}:${s.toString().padStart(2,'0')}`;
    if (secs <= 10) document.getElementById('stat-timer').style.color = '#f00';
    else            document.getElementById('stat-timer').style.color = '';
  }

  show() { this._el.style.display = 'flex'; }
  hide() { this._el.style.display = 'none'; }
}
