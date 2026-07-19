// ============================================================
// engine/keyboard.js - Desktop keyboard input handler
// ============================================================

const SKILL_KEYS = [
  'builder', 'digger', 'blocker', 'parachuter', 'redcard',
  'climber', 'sprinter', 'goalkeeper', 'shooter', 'basher',
];

export class KeyboardHandler {
  constructor(game) {
    this.game = game;
    window.addEventListener('keydown', event => this._onKeyDown(event));
  }

  _onKeyDown(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;

    const key = event.key.toLowerCase();
    if (key === 'escape') {
      if (this.game.state === 'playing' || this.game.state === 'paused') {
        event.preventDefault();
        this.game.returnToLevelSelect();
      }
      return;
    }

    if (this.game.state !== 'playing' && this.game.state !== 'paused') return;

    if (key === 'p') {
      event.preventDefault();
      this.game.togglePause();
      return;
    }
    if (this.game.state !== 'playing') return;

    if (key === 'tab') {
      event.preventDefault();
      this.game.focusNextPlayer(event.shiftKey ? -1 : 1);
      return;
    }
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      this.game.assignSkillToFocusedPlayer();
      return;
    }
    if (key === 'arrowleft' || key === 'arrowright') {
      event.preventDefault();
      this.game.scrollBy(key === 'arrowleft' ? -64 : 64);
      return;
    }
    if (key === 'f') {
      event.preventDefault();
      this.game.toggleFast();
      return;
    }
    if (key === 'n') {
      event.preventDefault();
      this.game.nukeAll();
      return;
    }

    const keyNumber = Number(key);
    if (!Number.isInteger(keyNumber) || keyNumber < 0 || keyNumber > 9) return;
    event.preventDefault();
    this.game.selectSkillByKeyboard(SKILL_KEYS[keyNumber === 0 ? 9 : keyNumber - 1]);
  }
}