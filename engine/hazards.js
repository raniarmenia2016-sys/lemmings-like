// ============================================================
// engine/hazards.js – All 9 hazard types with animation & collision
// ============================================================
import { TILE_SIZE } from './world.js';

export class HazardManager {
  constructor(world, canvas) {
    this.world    = world;
    this.canvas   = canvas;
    this.hazards  = [];
    this._phase   = 0;
    this._balls   = [];   // rendered shot balls (from Shooter skill)
    // listen for shot balls
    window.addEventListener('playerShot', e => this._spawnBall(e.detail));
  }

  load(hazardList) {
    this.hazards = hazardList.map(h => ({ ...h, _timer: 0, _active: true }));
    this._balls = [];
  }

  _spawnBall(detail) {
    this._balls.push({ x: detail.x, y: detail.y, dir: detail.dir, life: 120 });
  }

  update(dt, players) {
    this._phase += dt * 0.001;

    for (const h of this.hazards) {
      if (!h._active) continue;
      switch (h.type) {
        case 'rolling_ball': this._updateBall(h, dt, players); break;
        case 'wind':         this._updateWind(h, players);     break;
        case 'electric':     this._updateElectric(h, players); break;
        case 'trapdoor':     this._updateTrap(h, dt, players); break;
        case 'referee':      this._updateRef(h, dt, players);  break;
        case 'fireworks':    this._updateFireworks(h, dt, players); break;
        case 'magnet':       this._updateMagnet(h, players);   break;
        case 'mud_pool':     this._updateMudPool(h, players);  break;
      }
    }

    // update shot balls
    this._balls = this._balls.filter(b => {
      b.x += b.dir * 6;
      b.life--;
      // check switch triggers
      const tx = Math.floor(b.x / TILE_SIZE);
      const ty = Math.floor(b.y / TILE_SIZE);
      if (this.world.isSolid(tx, ty)) return false;
      return b.life > 0;
    });
  }

  _updateBall(h, dt, players) {
    h._timer += dt;
    // move ball
    h.x += h.speed * h.dir;
    const ty = Math.floor(h.y / TILE_SIZE);
    // bounce off walls
    if (this.world.isSolidAt(h.x + (h.dir > 0 ? 16 : -16), h.y)) {
      h.dir = -h.dir;
    }
    // roll down slopes (gravity)
    if (!this.world.isSolidAt(h.x, h.y + 16)) {
      h.y = Math.min(h.y + 3, this.world.pixelH - 32);
    }
    // kill players on contact
    for (const p of players) {
      if (p.dead || p.safe) continue;
      if (p.state === 'goalkeeping') continue; // GK absorbs
      const dx = Math.abs(p.x + p.w/2 - h.x);
      const dy = Math.abs(p.y + p.h/2 - h.y);
      if (dx < 20 && dy < 20) {
        if (p.state === 'goalkeeping') {
          h._active = false; // ball destroyed
        } else {
          p._die();
        }
      }
    }
  }

  _updateWind(h, players) {
    for (const p of players) {
      if (p.dead || p.safe) continue;
      const inZone =
        p.x + p.w > h.x && p.x < h.x + h.width &&
        p.y + p.h > h.y && p.y < h.y + h.height;
      if (inZone) {
        const push = h.force * (p.isSprinter ? 0.3 : 1);
        p.x += h.dir * push;
        // clip to world bounds
        p.x = Math.max(0, Math.min(p.x, this.world.pixelW - p.w));
      }
    }
  }

  _updateElectric(h, players) {
    for (const p of players) {
      if (p.dead || p.safe) continue;
      if (p.state === 'goalkeeping') continue;
      const inZone =
        p.x + p.w > h.x && p.x < h.x + h.width &&
        p.y + p.h > h.y && p.y < h.y + h.height;
      if (inZone) p._die();
    }
  }

  _updateTrap(h, dt, players) {
    h._timer += dt;
    const isOpen = Math.sin(h._timer * 0.004) > 0.3; // pulsing open/close
    h._isOpen = isOpen;
    if (!isOpen) return;
    for (const p of players) {
      if (p.dead || p.safe) continue;
      const dx = Math.abs(p.x + p.w/2 - h.x - 16);
      const dy = Math.abs(p.y + p.h - h.y - 16);
      if (dx < 20 && dy < 10) {
        p.state = 'falling'; p.fallFrom = p.y; p.y += 32; p.vy = 2;
      }
    }
  }

  _updateRef(h, dt, players) {
    h._timer += dt;
    h.x += h.speed * (h._dir || 1);
    if (!h._range) h._range = { min: h.x - h.patrol, max: h.x + h.patrol };
    if (h.x >= h._range.max || h.x <= h._range.min) h._dir = -(h._dir || 1);

    for (const p of players) {
      if (p.dead || p.safe) continue;
      if (p.state === 'goalkeeping') continue;
      const dx = Math.abs(p.x + p.w/2 - h.x);
      const dy = Math.abs(p.y + p.h/2 - h.y);
      if (dx < 24 && dy < 24) p._die();
    }
  }

  _updateFireworks(h, dt, players) {
    h._timer += dt;
    if (h._timer >= h.interval) {
      h._timer = 0;
      h._exploding = true;
      h._explodeTimer = 30;
    }
    if (h._exploding) {
      h._explodeTimer--;
      if (h._explodeTimer <= 0) h._exploding = false;
      for (const p of players) {
        if (p.dead || p.safe) continue;
        if (p.state === 'goalkeeping') continue;
        const dx = Math.abs(p.x + p.w/2 - h.x);
        const dy = Math.abs(p.y + p.h/2 - h.y);
        if (dx < 64 && dy < 64) p._die();
      }
    }
  }

  _updateMagnet(h, players) {
    for (const p of players) {
      if (p.dead || p.safe) continue;
      if (!h.inverted) continue;
      const inZone =
        p.x + p.w > h.x && p.x < h.x + h.width &&
        p.y + p.h > h.y && p.y < h.y + h.height;
      if (inZone) {
        // reverse gravity: move player up
        p.y -= 1.5;
        if (p.state === 'falling') p.vy = -Math.abs(p.vy);
        if (p.y < 0) p._die(); // hit ceiling
      }
    }
  }

  _updateMudPool(h, players) {
    for (const p of players) {
      if (p.dead || p.safe) continue;
      const inZone =
        p.x + p.w > h.x && p.x < h.x + h.width &&
        p.y + p.h > h.y && p.y < h.y + h.height;
      if (inZone) p._die();
    }
  }

  // ── Render ───────────────────────────────────────────────
  render(ctx, viewX, viewY) {
    for (const h of this.hazards) {
      if (!h._active) continue;
      const sx = h.x - viewX;
      const sy = h.y - viewY;
      switch (h.type) {
        case 'rolling_ball': this._renderBall(ctx, h, sx, sy);      break;
        case 'wind':         this._renderWind(ctx, h, viewX, viewY);break;
        case 'electric':     this._renderElec(ctx, h, viewX, viewY);break;
        case 'trapdoor':     this._renderTrap(ctx, h, sx, sy);      break;
        case 'referee':      this._renderRef(ctx, h, viewX, viewY); break;
        case 'fireworks':    this._renderFW(ctx, h, viewX, viewY);  break;
        case 'magnet':       this._renderMagnet(ctx, h, viewX, viewY); break;
        case 'mud_pool':     this._renderMudPool(ctx, h, viewX, viewY); break;
      }
    }
    // shot balls
    for (const b of this._balls) {
      const sx = b.x - viewX, sy = b.y - viewY;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
      const angle = Date.now() * 0.01;
      ctx.strokeStyle = '#888';
      ctx.beginPath();
      ctx.arc(sx, sy, 5, angle, angle + Math.PI); ctx.stroke();
    }
  }

  _renderBall(ctx, h, sx, sy) {
    const angle = this._phase * 3 * h.dir;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.stroke();
    // pentagon patches
    ctx.fillStyle = '#333';
    for (let i=0;i<5;i++) {
      const a = (i/5)*Math.PI*2;
      ctx.beginPath(); ctx.arc(Math.cos(a)*5, Math.sin(a)*5, 3, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  _renderWind(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    ctx.fillStyle = `rgba(100,200,255,0.07)`;
    ctx.fillRect(sx, sy, h.width, h.height);
    ctx.strokeStyle = `rgba(100,200,255,0.3)`;
    ctx.lineWidth = 1.5;
    const offset = (this._phase * 40) % 60;
    for (let y = sy; y < sy + h.height; y += 15) {
      const arrowX = h.dir > 0 ? sx + offset : sx + h.width - offset;
      ctx.beginPath();
      ctx.moveTo(arrowX, y);
      ctx.lineTo(arrowX + h.dir * 20, y);
      ctx.stroke();
      // arrowhead
      ctx.fillStyle = `rgba(100,200,255,0.5)`;
      ctx.beginPath();
      ctx.moveTo(arrowX + h.dir*20, y);
      ctx.lineTo(arrowX + h.dir*14, y-4);
      ctx.lineTo(arrowX + h.dir*14, y+4);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = 'rgba(100,200,255,0.6)';
    ctx.font = '16px serif';
    ctx.fillText(h.dir > 0 ? '💨➡️' : '⬅️💨', sx + (h.dir > 0 ? 0 : h.width - 30), sy + 16);
  }

  _renderElec(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    const flicker = Math.sin(this._phase * 20) > 0;
    ctx.fillStyle = flicker ? 'rgba(255,255,0,0.3)' : 'rgba(255,255,0,0.1)';
    ctx.fillRect(sx, sy, h.width, h.height);
    ctx.strokeStyle = flicker ? '#ffff00' : '#aaaa00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let y = sy; y < sy + h.height; y += 20) {
      ctx.moveTo(sx + h.width/2, y);
      ctx.lineTo(sx + h.width/2 + (Math.random()-0.5)*20, y + 10);
      ctx.lineTo(sx + h.width/2 + (Math.random()-0.5)*20, y + 20);
    }
    ctx.stroke();
    ctx.font = '16px serif';
    ctx.fillText('⚡', sx, sy + 16);
  }

  _renderTrap(ctx, h, sx, sy) {
    const isOpen = h._isOpen;
    ctx.fillStyle = isOpen ? '#cc2222' : '#555';
    ctx.fillRect(sx, sy, 32, 8);
    if (isOpen) {
      // pit visual
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(sx + 4, sy + 8, 24, 24);
      ctx.font = '10px serif';
      ctx.fillText('🪤', sx, sy + 24);
    }
  }

  _renderRef(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    const dir = h._dir || 1;
    ctx.save();
    if (dir < 0) { ctx.translate(sx+20, sy); ctx.scale(-1,1); ctx.translate(-20,0); }
    else ctx.translate(sx, sy);
    // referee body – black & white stripes
    for (let i=0;i<3;i++) {
      ctx.fillStyle = i%2===0?'#000':'#fff';
      ctx.fillRect(4, 14 + i*4, 12, 4);
    }
    ctx.fillRect(4, 26, 5, 8);   // left leg
    ctx.fillRect(10, 26, 5, 8);  // right leg
    ctx.fillStyle = '#f4a261';   // head
    ctx.beginPath(); ctx.ellipse(10, 9, 10, 11, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#222';      // hair
    ctx.fillRect(0, 0, 20, 5);
    // angry eyes
    ctx.fillStyle = '#f00';
    ctx.fillRect(4, 6, 4, 3);
    ctx.fillRect(12, 6, 4, 3);
    ctx.fillStyle = '#222'; ctx.fillRect(5,6,2,3); ctx.fillRect(13,6,2,3);
    // whistle
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(12, 13, 6, 3);
    // red card held up
    ctx.fillStyle = '#e00';
    ctx.fillRect(18, 4, 8, 10);
    ctx.restore();
  }

  _renderFW(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    ctx.font = '20px serif'; ctx.fillText('🎇', sx - 10, sy + 10);
    if (h._exploding) {
      const r = (30 - h._explodeTimer) * 3;
      const colors = ['#ff4500','#ffd700','#ff69b4','#00ff7f'];
      for (let i = 0; i < 8; i++) {
        const angle = (i/8)*Math.PI*2 + this._phase;
        ctx.fillStyle = colors[i%colors.length];
        ctx.beginPath();
        ctx.arc(sx + Math.cos(angle)*r, sy + Math.sin(angle)*r, 5, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  _renderMagnet(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    ctx.fillStyle = 'rgba(150,0,255,0.08)';
    ctx.fillRect(sx, sy, h.width, h.height);
    ctx.strokeStyle = 'rgba(150,0,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4,4]);
    ctx.strokeRect(sx+1, sy+1, h.width-2, h.height-2);
    ctx.setLineDash([]);
    // upward arrows
    for (let x = sx; x < sx+h.width; x += 24) {
      const arrowY = sy + h.height - ((this._phase*30)%h.height);
      ctx.fillStyle = 'rgba(200,100,255,0.5)';
      ctx.font = '14px serif'; ctx.fillText('🧲', x, sy+20);
    }
  }

  _renderMudPool(ctx, h, viewX, viewY) {
    const sx = h.x - viewX, sy = h.y - viewY;
    ctx.fillStyle = '#3d2206';
    ctx.fillRect(sx, sy, h.width, h.height);
    ctx.fillStyle = 'rgba(80,40,0,0.5)';
    for (let bx=4; bx<h.width; bx+=14) {
      ctx.beginPath();
      ctx.ellipse(sx+bx, sy+4+Math.sin(this._phase+bx)*3, 4,3,0,0,Math.PI*2);
      ctx.fill();
    }
  }
}
