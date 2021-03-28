import Method from './class/ClassMember/Method'
import Frame from './thread/Frame'

export abstract class Breakpoint {
  private _enabled = true

  abstract shouldBreak(frame: Frame): boolean

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
  }

  isEnabled(): boolean {
    return this._enabled
  }
}

export class MethodBreakpoint extends Breakpoint {
  constructor(private _method: Method) {
    super()
  }

  shouldBreak(frame: Frame): boolean {
    return frame.method === this._method
  }
}

class StepBreakpoint extends Breakpoint {
  shouldBreak(frame: Frame): boolean {
    return true
  }
}

export const stepBreakpoint = new StepBreakpoint()

export default class Breakpoints {
  private _breakpoints: Breakpoint[] = []

  add(b: Breakpoint): void {
    this._breakpoints.push(b)
  }

  remove(b: Breakpoint): void {
    const p = this._breakpoints.findIndex((e) => e === b)
    if (p !== -1) this._breakpoints.splice(p, 1)
  }

  clear(): void {
    this._breakpoints = []
  }

  shouldBreak(frame: Frame): boolean {
    return this._breakpoints.some((b) => b.isEnabled() && b.shouldBreak(frame))
  }
}
