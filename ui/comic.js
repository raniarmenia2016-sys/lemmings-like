// ============================================================
// ui/comic.js – Comic panel story screens between worlds
// ============================================================

const WORLD_COMICS = {
  1: {
    image: 'assets/comic_w1.png',
    titleHe: 'עולם 1: שדה האימון',
    captionHe: 'הכוכבים מגיעים לשדה האימון!\nהם חייבים לעבור את המכשולים...\nהשתמש במיומנויות שלהם כדי להצליח!',
  },
  2: {
    image: 'assets/comic_w2.png',
    titleHe: 'עולם 2: רחובות העיר',
    captionHe: 'הכוכבים יוצאים לרחובות העיר!\nסכנות חדשות מחכות...\nמטפסים, ספרינטרים, ויריבים!',
  },
  3: {
    image: 'assets/comic_w3.png',
    titleHe: 'עולם 3: הגמר הגדול!',
    captionHe: '🏆 גביע העולם בהישג יד!\nאצטדיון האויב מלא בסכנות...\nהקרב האחרון – הצלח!',
  },
};

export class ComicScreen {
  constructor(container, onDone) {
    this.container = container;
    this.onDone    = onDone;
    this._el       = null;
    this._build();
  }

  _build() {
    const el = document.createElement('div');
    el.id = 'comic-screen';
    el.innerHTML = `
      <div id="comic-inner">
        <div id="comic-title"></div>
        <div id="comic-panel">
          <img id="comic-img" src="" alt="comic strip" />
        </div>
        <div id="comic-caption"></div>
        <button id="comic-next">▶ המשך לשחק</button>
      </div>
    `;
    this.container.appendChild(el);
    this._el = el;
    document.getElementById('comic-next').onclick = () => this.hide();
    el.style.display = 'none';
  }

  show(worldNum) {
    const data = WORLD_COMICS[worldNum];
    if (!data) { this.onDone(); return; }
    document.getElementById('comic-title').textContent   = data.titleHe;
    document.getElementById('comic-img').src             = data.image;
    document.getElementById('comic-caption').innerHTML   =
      data.captionHe.split('\n').map(l => `<p>${l}</p>`).join('');
    this._el.style.display = 'flex';
    // animate in
    this._el.style.opacity = '0';
    this._el.style.transition = 'opacity 0.5s';
    requestAnimationFrame(() => { this._el.style.opacity = '1'; });
  }

  hide() {
    this._el.style.opacity = '0';
    setTimeout(() => {
      this._el.style.display = 'none';
      this.onDone();
    }, 500);
  }
}
