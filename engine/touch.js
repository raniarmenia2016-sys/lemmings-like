// ============================================================
// engine/touch.js – Touch & mouse input handler
// ============================================================

export class TouchHandler {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game   = game;
    this._drag  = null;
    this._bindEvents();
  }

  _bindEvents() {
    const c = this.canvas;
    // Touch events (tablet)
    c.addEventListener('touchstart', e => { e.preventDefault(); this._onStart(e.touches[0]); }, { passive: false });
    c.addEventListener('touchmove',  e => { e.preventDefault(); this._onMove(e.touches[0]);  }, { passive: false });
    c.addEventListener('touchend',   e => { e.preventDefault(); this._onEnd(e.changedTouches[0]); }, { passive: false });
    // Mouse events (desktop dev/testing)
    c.addEventListener('mousedown',  e => this._onStart(e));
    c.addEventListener('mousemove',  e => this._onMove(e));
    c.addEventListener('mouseup',    e => this._onEnd(e));
  }

  _canvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width  / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left)  * scaleX,
      y: (e.clientY - rect.top)   * scaleY,
    };
  }

  _onStart(e) {
    const pos = this._canvasPos(e);
    this._drag = { startX: pos.x, startY: pos.y, moved: false };
    // Highlight player under finger immediately
    this.game.highlightPlayerAt(pos.x, pos.y);
  }

  _onMove(e) {
    if (!this._drag) return;
    const pos = this._canvasPos(e);
    const dx = Math.abs(pos.x - this._drag.startX);
    if (dx > 8) this._drag.moved = true; // panning, not tap
    if (this._drag.moved) {
      // scroll viewport
      this.game.scrollBy(this._drag.startX - pos.x);
      this._drag.startX = pos.x;
    }
  }

  _onEnd(e) {
    if (!this._drag) return;
    const pos = this._canvasPos(e);
    if (!this._drag.moved) {
      // It's a tap – delegate to game
      this.game.handleTap(pos.x, pos.y);
    }
    this._drag = null;
    this.game.clearHighlight();
  }
}
