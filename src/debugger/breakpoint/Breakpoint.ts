import Frame from '../../thread/Frame'

export default abstract class Breakpoint {
  private _enabled = true

  abstract shouldBreak(frame: Frame): boolean

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
  }

  isEnabled(): boolean {
    return this._enabled
  }
}
