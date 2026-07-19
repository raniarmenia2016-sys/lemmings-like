// ============================================================
// ui/levelSelect.js – Level selection screen (3 tier tabs)
// ============================================================
import { LEVELS, WORLD_NAMES } from '../levels/data.js';

export class LevelSelectScreen {
  constructor(container, onSelect, onDesigner, onBack) {
    this.container  = container;
    this.onSelect   = onSelect;
    this.onDesigner = onDesigner;
    this.onBack     = onBack;
    this._el        = null;
    this._build();
  }

  _build() {
    const el = document.createElement('div');
    el.id = 'level-select';
    el.innerHTML = `
      <button id="ls-back-btn">✖ חזור</button>
      <div id="ls-header">
        <h1>⚽ גיבורי גביע העולם</h1>
        <p>בחר שלב</p>
      </div>
      <div id="ls-tabs">
        <button class="ls-tab active" data-world="easy">🟢 קל</button>
        <button class="ls-tab"        data-world="medium">🟡 בינוני</button>
        <button class="ls-tab"        data-world="hard">🔴 קשה</button>
      </div>
      <div id="ls-grid"></div>
      <section id="ls-keyboard-help" aria-label="פקדי מקלדת">
        <strong>פקדי מקלדת</strong>
        <span><kbd>Tab</kbd> מעבר בין שחקנים</span>
        <span><kbd>1</kbd>-<kbd>0</kbd> בחירת מיומנות</span>
        <span><kbd>Enter</kbd>/<kbd>Space</kbd> הקצאה</span>
        <span><kbd>←</kbd><kbd>→</kbd> גלילה</span>
        <span><kbd>P</kbd> השהיה</span>
        <span><kbd>F</kbd> מהיר</span>
        <span><kbd>N</kbd> נקה</span>
        <span><kbd>Esc</kbd> יציאה</span>
        <small>1 בנאי, 2 חפר, 3 חוסם, 4 צנחן, 5 כרטיס, 6 מטפס, 7 ספרינטר, 8 שוער, 9 קלע, 0 מפרץ</small>
      </section>
      <div id="ls-bottom">
        <button id="ls-designer-btn">🎨 עצב שלב חדש</button>
      </div>
    `;
    this.container.appendChild(el);
    this._el = el;

    document.getElementById('ls-back-btn').onclick = () => this.onBack();

    el.querySelectorAll('.ls-tab').forEach(btn => {
      btn.onclick = () => {
        el.querySelectorAll('.ls-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._renderGrid(btn.dataset.world);
      };
    });

    document.getElementById('ls-designer-btn').onclick = () => this.onDesigner();
    this._renderGrid('easy');
    el.style.display = 'none';
  }

  _renderGrid(world) {
    const grid    = document.getElementById('ls-grid');
    const levels  = LEVELS.filter(l => l.world === world);
    const prog    = this._loadProgress();
    grid.innerHTML = '';

    levels.forEach((lvl, i) => {
      const globalIdx = LEVELS.indexOf(lvl);
      const stars     = prog.stars?.[lvl.id] ?? 0;
      const unlocked  = globalIdx === 0 || (prog.stars?.[LEVELS[globalIdx-1]?.id] ?? 0) > 0;
      const card      = document.createElement('div');
      card.className  = `ls-card ${unlocked ? '' : 'locked'}`;
      card.innerHTML  = `
        <div class="ls-card-num">${globalIdx + 1}</div>
        <div class="ls-card-name">${lvl.nameHe}</div>
        <div class="ls-card-meta">
          ⚽${lvl.players} | 🎯${lvl.toSave} | ⏱${lvl.timeLimit}s
        </div>
        <div class="ls-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        ${unlocked ? '' : '<div class="ls-lock">🔒</div>'}
      `;
      if (unlocked) card.onclick = () => this.onSelect(globalIdx);
      grid.appendChild(card);
    });
  }

  _loadProgress() {
    try { return JSON.parse(localStorage.getItem('wch_progress') ?? '{}'); }
    catch { return {}; }
  }

  saveResult(levelId, stars) {
    const prog = this._loadProgress();
    if (!prog.stars) prog.stars = {};
    prog.stars[levelId] = Math.max(prog.stars[levelId] ?? 0, stars);
    localStorage.setItem('wch_progress', JSON.stringify(prog));
  }

  show() { this._el.style.display = 'flex'; }
  hide() { this._el.style.display = 'none'; }
}
