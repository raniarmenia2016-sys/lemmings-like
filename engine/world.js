// ============================================================
// engine/world.js – Tile-based world: rendering, collision, terrain modification
// ============================================================
import { TILE } from '../levels/data.js';

export const TILE_SIZE = 32;

export class World {
  constructor(levelData, canvas) {
    this.levelData  = levelData;
    this.canvas     = canvas;
    this.ctx        = canvas.getContext('2d');
    this.tiles      = levelData.tiles.map(row => [...row]); // mutable copy
    this.width      = this.tiles[0]?.length ?? 0;
    this.height     = this.tiles.length;
    this.pixelW     = this.width  * TILE_SIZE;
    this.pixelH     = this.height * TILE_SIZE;
    this.viewX      = 0; // scroll offset (pixels)
    this.viewY      = 0;
    this.canvasW    = canvas.width;
    this.canvasH    = canvas.height - 80; // 80px HUD at bottom
    this._buildGradients();
    this._waterPhase = 0;
  }

  // ── Gradients & palette ──────────────────────────────────
  _buildGradients() {
    this._skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvasH);
    this._skyGrad.addColorStop(0,   '#0a1628');
    this._skyGrad.addColorStop(0.4, '#1a2e4a');
    this._skyGrad.addColorStop(1,   '#0f3b6c');
  }

  // ── Tile accessors ───────────────────────────────────────
  getTile(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) return TILE.STEEL;
    return this.tiles[ty][tx];
  }
  setTile(tx, ty, type) {
    if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) return;
    this.tiles[ty][tx] = type;
  }
  isSolid(tx, ty)  { const t = this.getTile(tx,ty); return t===TILE.EARTH||t===TILE.STEEL; }
  isLethal(tx, ty) { const t = this.getTile(tx,ty); return t===TILE.WATER||t===TILE.MUD; }
  isDestructible(tx, ty) { return this.getTile(tx,ty) === TILE.EARTH; }

  // ── Pixel → tile ────────────────────────────────────────
  pixToTile(px, py) {
    return { tx: Math.floor(px / TILE_SIZE), ty: Math.floor(py / TILE_SIZE) };
  }

  // ── Check if world-pixel position is solid ───────────────
  isSolidAt(px, py) { const {tx,ty}=this.pixToTile(px,py); return this.isSolid(tx,ty); }
  isLethalAt(px, py){ const {tx,ty}=this.pixToTile(px,py); return this.isLethal(tx,ty); }

  // ── Viewport scrolling (follow player centroid) ──────────
  scrollTo(cx) {
    const halfW = this.canvasW / 2;
    this.viewX = Math.max(0, Math.min(cx - halfW, this.pixelW - this.canvasW));
  }

  // ── Entry / Exit positions in pixels ────────────────────
  get entryPx() {
    const {x,y} = this.levelData.entry.tile;
    return { x: x * TILE_SIZE + TILE_SIZE/2, y: y * TILE_SIZE };
  }
  get exitPx() {
    const {x,y} = this.levelData.exit.tile;
    return { x: x * TILE_SIZE, y: y * TILE_SIZE };
  }

  // ── Update ───────────────────────────────────────────────
  update(dt) {
    this._waterPhase += dt * 0.002;
  }

  // ── Rendering ────────────────────────────────────────────
  render(ctx) {
    // sky background
    ctx.fillStyle = this._skyGrad;
    ctx.fillRect(0, 0, this.canvasW, this.canvasH);

    // stadium crowd silhouette (top strip)
    this._drawCrowd(ctx);

    // tiles
    const startX = Math.floor(this.viewX / TILE_SIZE);
    const endX   = Math.min(startX + Math.ceil(this.canvasW / TILE_SIZE) + 1, this.width);
    const startY = Math.floor(this.viewY / TILE_SIZE);
    const endY   = Math.min(startY + Math.ceil(this.canvasH / TILE_SIZE) + 1, this.height);

    for (let ty = startY; ty < endY; ty++) {
      for (let tx = startX; tx < endX; tx++) {
        const tile = this.tiles[ty][tx];
        if (tile === TILE.EMPTY) continue;
        const sx = tx * TILE_SIZE - this.viewX;
        const sy = ty * TILE_SIZE - this.viewY;
        this._drawTile(ctx, tile, sx, sy, tx, ty);
      }
    }

    // entry hatch
    this._drawEntry(ctx);
    // exit goal
    this._drawExit(ctx);
  }

  _drawTile(ctx, type, sx, sy, tx, ty) {
    const S = TILE_SIZE;
    switch (type) {
      case TILE.EARTH: {
        // Check if top is grass (tile above is empty)
        const hasGrass = this.getTile(tx, ty - 1) === TILE.EMPTY;
        ctx.fillStyle = '#5c3d1e';
        ctx.fillRect(sx, sy, S, S);
        if (hasGrass) {
          ctx.fillStyle = '#3a7d44';
          ctx.fillRect(sx, sy, S, 6);
        }
        // shading
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(sx, sy + S - 4, S, 4);
        break;
      }
      case TILE.STEEL: {
        ctx.fillStyle = '#3a4a5c';
        ctx.fillRect(sx, sy, S, S);
        ctx.fillStyle = '#4a5a6c';
        ctx.fillRect(sx+1, sy+1, S-2, 4);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(sx, sy, S, S/2);
        // rivet dots
        ctx.fillStyle = '#2a3a4c';
        for (let rx=4;rx<S;rx+=12) for (let ry=4;ry<S;ry+=12) {
          ctx.beginPath(); ctx.arc(sx+rx, sy+ry, 2, 0, Math.PI*2); ctx.fill();
        }
        break;
      }
      case TILE.WATER: {
        ctx.fillStyle = '#1a3a8c';
        ctx.fillRect(sx, sy, S, S);
        // animated waves
        const wave = Math.sin(this._waterPhase + tx * 0.5) * 3;
        ctx.fillStyle = 'rgba(80,160,255,0.4)';
        ctx.fillRect(sx, sy + 4 + wave, S, 6);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(sx, sy + wave, S, 3);
        break;
      }
      case TILE.MUD: {
        ctx.fillStyle = '#3d2206';
        ctx.fillRect(sx, sy, S, S);
        // mud bubbles
        ctx.fillStyle = '#4d3010';
        for (let bx=4;bx<S;bx+=10) {
          const by = 4 + Math.sin(this._waterPhase*0.5 + bx) * 3;
          ctx.beginPath(); ctx.ellipse(sx+bx, sy+by, 3, 2, 0, 0, Math.PI*2); ctx.fill();
        }
        break;
      }
      case TILE.LADDER: {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(sx+4, sy, 4, S);
        ctx.fillRect(sx+S-8, sy, 4, S);
        for (let ry = 4; ry < S; ry += 8) {
          ctx.fillRect(sx+4, sy+ry, S-8, 3);
        }
        break;
      }
    }
  }

  _drawCrowd(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < this.canvasW; i += 12) {
      const h = 20 + Math.sin(i * 0.1) * 8;
      ctx.beginPath();
      ctx.arc(i, 35 + h, 5, 0, Math.PI*2);
      ctx.fill();
    }
  }

  _drawEntry(ctx) {
    const ep = this.entryPx;
    const sx = ep.x - this.viewX - 16;
    const sy = ep.y - this.viewY;
    // locker room door
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(sx, sy - 32, 32, 32);
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx+2, sy-30, 28, 28);
    // arrow pointing right (entry direction)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('▼', sx+9, sy-10);
  }

  _drawExit(ctx) {
    const ep = this.exitPx;
    const sx = ep.x - this.viewX;
    const sy = ep.y - this.viewY;
    // goal net
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 32; x += 8) {
      ctx.beginPath(); ctx.moveTo(sx+x, sy); ctx.lineTo(sx+x, sy+32); ctx.stroke();
    }
    for (let y = 0; y <= 32; y += 8) {
      ctx.beginPath(); ctx.moveTo(sx, sy+y); ctx.lineTo(sx+32, sy+y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,255,100,0.3)';
    ctx.fillRect(sx, sy, 32, 32);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(sx, sy, 32, 32);
    // pulsing glow
    const glow = 0.3 + 0.2 * Math.sin(Date.now() * 0.005);
    ctx.fillStyle = `rgba(0,255,100,${glow})`;
    ctx.fillRect(sx-4, sy-4, 40, 40);
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#0f0';
    ctx.fillText('יציאה', sx-2, sy-6);
  }
}
