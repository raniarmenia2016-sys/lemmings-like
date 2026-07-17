// ============================================================
// engine/player.js – Player entity with AI, physics, skill states
// ============================================================
import { TILE_SIZE } from './world.js';
import { TILE } from '../levels/data.js';

// Player state machine
export const STATE = {
  WALKING: 'walking', FALLING: 'falling', CLIMBING: 'climbing',
  BUILDING: 'building', DIGGING: 'digging', BASHING: 'bashing',
  BLOCKING: 'blocking', FLOATING: 'floating', EXPLODING: 'exploding',
  SHOOTING: 'shooting', SPRINTING: 'sprinting', GOALKEEPING: 'goalkeeping',
  DEAD: 'dead', SAFE: 'safe',
};

// Country caricature colors (jersey, shorts, skin)
const PLAYER_TYPES = [
  { jersey:'#e63946', shorts:'#1d3557', skin:'#f4a261', name:'El Capitán' },
  { jersey:'#2196f3', shorts:'#ffc107', skin:'#ffbe99', name:'Le Artiste' },
  { jersey:'#4caf50', shorts:'#fff', skin:'#8d5524', name:'O Fenômeno' },
  { jersey:'#fff', shorts:'#e63946', skin:'#ffbe99', name:'Der Kaiser' },
  { jersey:'#ff9800', shorts:'#212121', skin:'#f4a261', name:'Il Maestro' },
];

const GRAVITY       = 0.45;   // px/frame²
const WALK_SPEED    = 1.4;     // px/frame
const SPRINT_SPEED  = 4.0;
const FALL_DEATH_H  = 140;     // px fall before death (unless floater)
const STEP_HEIGHT   = TILE_SIZE; // max step player can walk up

export class Player {
  constructor(x, y, world, id) {
    this.id       = id;
    this.world    = world;
    this.x        = x;
    this.y        = y;
    this.vx       = WALK_SPEED;  // start walking right
    this.vy       = 0;
    this.state    = STATE.FALLING;
    this.dir      = 1;           // 1=right, -1=left
    this.skill    = null;        // assigned skill
    this.w        = 20;
    this.h        = 32;
    this.fallFrom = y;
    this.dead     = false;
    this.safe     = false;
    this.skillTimer  = 0;
    this.buildStep   = 0;
    this.digDepth    = 0;
    this.bashCount   = 0;
    this.explodeTimer= 0;
    this.shootTimer  = 0;
    this.animated    = 0;        // frame counter for animations
    this.isFloater   = false;
    this.isClimber   = false;
    this.isSprinter  = false;
    this.type        = PLAYER_TYPES[id % PLAYER_TYPES.length];
    this.highlight   = false;   // hover/selection highlight
    this.skillIcon   = null;
  }

  // ── Assign skill ────────────────────────────────────────
  assignSkill(skill) {
    if (this.dead || this.safe || this.state === STATE.BLOCKING) return false;
    this.skill = skill;
    this.skillIcon = skill;
    switch (skill) {
      case 'parachuter': this.isFloater  = true; break;
      case 'climber':    this.isClimber  = true; break;
      case 'sprinter':   this.isSprinter = true; this.vx = this.dir * SPRINT_SPEED; break;
      case 'blocker':    this.state = STATE.BLOCKING; this.vx = 0; break;
      case 'builder':    this.state = STATE.BUILDING; this.buildStep = 0; break;
      case 'digger':     this.state = STATE.DIGGING;  this.digDepth  = 0; break;
      case 'basher':     this.state = STATE.BASHING;  this.bashCount = 0; break;
      case 'redcard':    this.state = STATE.EXPLODING; this.explodeTimer = 180; break;
      case 'goalkeeper': this.state = STATE.GOALKEEPING; break;
      case 'shooter':    this.state = STATE.SHOOTING; this.shootTimer = 60; break;
    }
    return true;
  }

  // ── Main update ─────────────────────────────────────────
  update() {
    if (this.dead || this.safe) return;
    this.animated++;

    switch (this.state) {
      case STATE.WALKING:    this._updateWalk();    break;
      case STATE.FALLING:    this._updateFall();    break;
      case STATE.CLIMBING:   this._updateClimb();   break;
      case STATE.BUILDING:   this._updateBuild();   break;
      case STATE.DIGGING:    this._updateDig();     break;
      case STATE.BASHING:    this._updateBash();    break;
      case STATE.BLOCKING:   /* stationary */       break;
      case STATE.FLOATING:   this._updateFloat();   break;
      case STATE.EXPLODING:  this._updateExplode(); break;
      case STATE.SHOOTING:   this._updateShoot();   break;
      case STATE.SPRINTING:  this._updateWalk();    break;
      case STATE.GOALKEEPING:this._updateWalk();    break;
    }

    // check hazards
    this._checkLethal();
    // check exit
    this._checkExit();
  }

  // ── Walk (also Sprinter + Goalkeeper) ───────────────────
  _updateWalk() {
    const speed = this.isSprinter ? SPRINT_SPEED : WALK_SPEED;
    const nextX  = this.x + this.dir * speed;
    const footY  = this.y + this.h;
    const headY  = this.y;

    // check wall ahead at head and body level
    if (this.world.isSolidAt(nextX + (this.dir > 0 ? this.w/2 : -this.w/2), this.y + this.h * 0.5)) {
      // try to step up one tile
      if (!this.world.isSolidAt(nextX + (this.dir>0?this.w/2:-this.w/2), this.y + this.h * 0.5 - TILE_SIZE)) {
        this.y -= TILE_SIZE;
      } else {
        // can't pass – turn around
        this._turn();
        return;
      }
    }

    this.x = nextX;

    // check if still on ground
    if (!this.world.isSolidAt(this.x, footY) && !this.world.isSolidAt(this.x + this.w, footY)) {
      // no ground → fall
      this.fallFrom = this.y;
      this.vy = 0;
      this.state = this.isFloater ? STATE.FLOATING : STATE.FALLING;
    } else {
      // snap to ground
      this._snapToGround();
      if (this.state !== STATE.BLOCKING) this.state = STATE.WALKING;
    }
  }

  // ── Fall ────────────────────────────────────────────────
  _updateFall() {
    this.vy = Math.min(this.vy + GRAVITY, 12);
    this.y += this.vy;
    const footY = this.y + this.h;
    if (this.world.isSolidAt(this.x + this.w*0.3, footY) ||
        this.world.isSolidAt(this.x + this.w*0.7, footY)) {
      this._snapToGround();
      const fallDist = this.y - this.fallFrom;
      if (fallDist > FALL_DEATH_H) {
        this._die();
        return;
      }
      this.vy = 0;
      this.state = STATE.WALKING;
    }
  }

  // ── Float (Parachuter) ──────────────────────────────────
  _updateFloat() {
    this.vy = Math.min(this.vy + GRAVITY * 0.1, 1.5); // very slow fall
    this.y += this.vy;
    const footY = this.y + this.h;
    if (this.world.isSolidAt(this.x + this.w*0.3, footY) ||
        this.world.isSolidAt(this.x + this.w*0.7, footY)) {
      this._snapToGround();
      this.vy = 0;
      this.state = STATE.WALKING;
    }
    this.x += this.dir * WALK_SPEED * 0.5; // slight drift
  }

  // ── Climb ────────────────────────────────────────────────
  _updateClimb() {
    const wallSideX = this.dir > 0 ? this.x + this.w : this.x;
    if (this.world.isSolidAt(wallSideX, this.y + this.h * 0.5)) {
      this.y -= WALK_SPEED;
      if (!this.world.isSolidAt(wallSideX, this.y + this.h * 0.5)) {
        // reached top → move forward and start walking
        this.x += this.dir * TILE_SIZE;
        this.state = STATE.WALKING;
      }
    } else {
      this.state = STATE.FALLING;
    }
  }

  // ── Build ────────────────────────────────────────────────
  _updateBuild() {
    if (this.animated % 15 !== 0) return;
    const tx = Math.floor((this.x + (this.dir > 0 ? this.w : 0)) / TILE_SIZE);
    const ty = Math.floor((this.y + this.h) / TILE_SIZE);
    if (!this.world.isSolid(tx, ty) && !this.world.isSolid(tx, ty - 1)) {
      this.world.setTile(tx, ty, TILE.EARTH);
      this.x += this.dir * TILE_SIZE;
      this.y -= TILE_SIZE * 0.5;
      this.buildStep++;
    }
    if (this.buildStep >= 6 || this.world.isSolid(tx, ty - 1)) {
      this.state = STATE.WALKING;
    }
  }

  // ── Dig ──────────────────────────────────────────────────
  _updateDig() {
    if (this.animated % 8 !== 0) return;
    const cx = Math.floor(this.x / TILE_SIZE);
    const ty = Math.floor((this.y + this.h) / TILE_SIZE);
    for (let dx = 0; dx <= 1; dx++) {
      if (this.world.isDestructible(cx + dx, ty)) {
        this.world.setTile(cx + dx, ty, TILE.EMPTY);
      }
    }
    this.digDepth++;
    if (this.digDepth > 4) {
      this.state = STATE.FALLING;
      this.fallFrom = this.y;
    }
  }

  // ── Bash ─────────────────────────────────────────────────
  _updateBash() {
    if (this.animated % 6 !== 0) return;
    const tx = Math.floor((this.x + (this.dir>0?this.w:-1)) / TILE_SIZE);
    const ty = Math.floor((this.y + this.h * 0.5) / TILE_SIZE);
    for (let dy = -1; dy <= 1; dy++) {
      if (this.world.isDestructible(tx, ty + dy)) {
        this.world.setTile(tx, ty + dy, TILE.EMPTY);
      }
    }
    this.x += this.dir * 2;
    this.bashCount++;
    if (this.bashCount > 20 || !this.world.isSolidAt(this.x + (this.dir>0?this.w:-1), this.y + this.h * 0.5)) {
      this.state = STATE.WALKING;
    }
  }

  // ── Red Card explode ─────────────────────────────────────
  _updateExplode() {
    this.explodeTimer--;
    if (this.explodeTimer <= 0) {
      // clear a radius of tiles
      const cx = Math.floor(this.x / TILE_SIZE);
      const cy = Math.floor(this.y / TILE_SIZE);
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (this.world.isDestructible(cx+dx, cy+dy)) {
            this.world.setTile(cx+dx, cy+dy, TILE.EMPTY);
          }
        }
      }
      this._die(true); // silent explosion death
    }
  }

  // ── Shooter ──────────────────────────────────────────────
  _updateShoot() {
    this.shootTimer--;
    if (this.shootTimer <= 0) {
      // trigger nearest switch (handled in game.js via event)
      this._shootBall();
      this.state = STATE.WALKING;
    }
  }

  _shootBall() {
    // Emit a ball event – will be picked up by hazard system for switch-flip
    window.dispatchEvent(new CustomEvent('playerShot', {
      detail: { x: this.x, y: this.y, dir: this.dir }
    }));
  }

  // ── Helpers ──────────────────────────────────────────────
  _turn() {
    this.dir = -this.dir;
    this.vx  = -this.vx;
    this.x  += this.dir * 2;
  }

  _snapToGround() {
    const ty = Math.floor((this.y + this.h) / TILE_SIZE);
    this.y = ty * TILE_SIZE - this.h;
  }

  _checkLethal() {
    if (this.world.isLethalAt(this.x + this.w/2, this.y + this.h - 2)) {
      this._die();
    }
  }

  _checkExit() {
    const ep  = this.world.exitPx;
    const dx  = Math.abs(this.x + this.w/2 - ep.x - 16);
    const dy  = Math.abs(this.y + this.h   - ep.y - 16);
    if (dx < 24 && dy < 24) {
      this.safe = true;
      this.state = STATE.SAFE;
    }
  }

  _die(silent = false) {
    this.dead  = true;
    this.state = STATE.DEAD;
    if (!silent) {
      window.dispatchEvent(new CustomEvent('playerDied', { detail: { id: this.id, x: this.x, y: this.y } }));
    }
  }

  // ── Render ───────────────────────────────────────────────
  render(ctx, viewX, viewY) {
    if (this.dead && this.state === STATE.DEAD) {
      this._renderDeath(ctx, viewX, viewY);
      return;
    }
    if (this.state === STATE.SAFE) return;

    const sx = this.x - viewX;
    const sy = this.y - viewY;
    const t  = this.type;

    ctx.save();
    if (this.dir < 0) {
      ctx.translate(sx + this.w, sy);
      ctx.scale(-1, 1);
      ctx.translate(-this.w, 0);
    } else {
      ctx.translate(sx, sy);
    }

    // Body
    ctx.fillStyle = t.jersey;
    ctx.fillRect(3, 14, 14, 12);
    // Shorts
    ctx.fillStyle = t.shorts;
    ctx.fillRect(3, 22, 6, 8);
    ctx.fillRect(9, 22, 6, 8);
    // Legs & boots
    ctx.fillStyle = t.skin;
    ctx.fillRect(4, 28, 4, 6);
    ctx.fillRect(11, 28, 4, 6);
    ctx.fillStyle = '#222';
    ctx.fillRect(2, 32, 7, 3);  // boot left
    ctx.fillRect(10, 32, 7, 3); // boot right
    // Big caricature head
    ctx.fillStyle = t.skin;
    ctx.beginPath();
    ctx.ellipse(10, 9, 11, 13, 0, 0, Math.PI*2);
    ctx.fill();
    // Hair
    ctx.fillStyle = '#3d2b1f';
    ctx.fillRect(1, 0, 18, 6);
    ctx.beginPath(); ctx.arc(10, 0, 9, Math.PI, 0); ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(4, 6, 5, 4);
    ctx.fillRect(11, 6, 5, 4);
    ctx.fillStyle = '#222';
    const eyeOff = this.state === STATE.EXPLODING ? 0 : 1;
    ctx.fillRect(5+eyeOff, 7, 3, 3);
    ctx.fillRect(12+eyeOff, 7, 3, 3);
    // Mouth expression
    this._drawMouth(ctx);
    // Jersey number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 7px Arial';
    ctx.fillText(((this.id % 11)+1).toString(), 6, 20);
    // Arms
    ctx.fillStyle = t.skin;
    this._drawArms(ctx);
    // Skill icon above head
    if (this.skill && !['walking','falling'].includes(this.state)) {
      ctx.restore();
      ctx.save();
      ctx.font = '14px serif';
      ctx.fillText(SKILL_ICONS[this.skill] || '⭐', sx + 3, sy - 5);
    }
    // Highlight ring
    if (this.highlight) {
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + this.w/2, sy + this.h/2, 18, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawMouth(ctx) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    switch (this.state) {
      case STATE.EXPLODING:
        ctx.arc(10, 14, 4, 0, Math.PI*2); // O face
        break;
      case STATE.BLOCKING:
        ctx.moveTo(5, 14); ctx.lineTo(15, 14); // serious
        break;
      case STATE.DEAD:
        ctx.arc(10, 16, 4, Math.PI, 0); // sad
        break;
      default:
        ctx.arc(10, 12, 4, 0, Math.PI); // smile
    }
    ctx.stroke();
  }

  _drawArms(ctx) {
    const anim = Math.sin(this.animated * 0.3) * 3;
    // left arm
    ctx.fillRect(0, 15, 4, 3);
    ctx.fillRect(0, 15 + anim, 3, 7);
    // right arm
    ctx.fillRect(16, 15, 4, 3);
    ctx.fillRect(17, 15 - anim, 3, 7);

    // skill-specific arm poses
    if (this.state === STATE.BUILDING) {
      ctx.fillStyle = '#cd853f';
      ctx.fillRect(15, 10, 8, 3); // holding brick
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(19, 8, 5, 5);
    }
    if (this.state === STATE.DIGGING) {
      ctx.fillStyle = '#888';
      ctx.fillRect(14, 18, 8, 2); // pickaxe
    }
    if (this.state === STATE.SHOOTING) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(20, 14, 4, 0, Math.PI*2); ctx.fill(); // ball
    }
    if (this.state === STATE.FLOATING) {
      // parachute lines
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.moveTo(3, 0); ctx.lineTo(-5, -20);
      ctx.moveTo(17, 0); ctx.lineTo(25, -20);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,200,0,0.7)';
      ctx.beginPath(); ctx.arc(10, -20, 14, Math.PI, 0); ctx.fill();
    }
  }

  _renderDeath(ctx, viewX, viewY) {
    const sx = this.x - viewX;
    const sy = this.y - viewY;
    // explosion particles
    ctx.fillStyle = 'rgba(255,100,0,0.7)';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(sx + Math.cos(angle)*15, sy + Math.sin(angle)*10, 4, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // ── Bounding box ─────────────────────────────────────────
  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

// Map skill name → emoji icon
export const SKILL_ICONS = {
  builder:'🔨', digger:'⛏️', blocker:'🧱', parachuter:'🪂',
  redcard:'🟥', climber:'🧗', sprinter:'🏃', goalkeeper:'🥅',
  shooter:'🎯', basher:'🪓',
};
