/**
 * Centralized TimeScale manager for game speed scaling and pause.
 */
export class GameTime {
  private _scale: number = 1.0;
  private _isPaused: boolean = false;
  private _previousScale: number = 1.0;

  get scale(): number {
    return this._isPaused ? 0 : this._scale;
  }

  get rawScale(): number {
    return this._scale;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  setScale(scale: number): void {
    if (scale <= 0) {
      this.pause();
    } else {
      this._scale = Math.max(0.25, Math.min(10, scale));
      this._isPaused = false;
    }
  }

  pause(): void {
    if (!this._isPaused) {
      this._previousScale = this._scale;
      this._isPaused = true;
    }
  }

  resume(): void {
    if (this._isPaused) {
      this._isPaused = false;
      this._scale = this._previousScale || 1.0;
    }
  }

  togglePause(): boolean {
    if (this._isPaused) {
      this.resume();
    } else {
      this.pause();
    }
    return this._isPaused;
  }

  /**
   * Transforms raw frame delta time (in seconds) by the active time scale.
   */
  getDelta(rawDeltaSeconds: number): number {
    if (this._isPaused) return 0;
    // Cap max delta to prevent physics explosion on lag spikes
    const clamped = Math.min(rawDeltaSeconds, 0.1);
    return clamped * this._scale;
  }
}
