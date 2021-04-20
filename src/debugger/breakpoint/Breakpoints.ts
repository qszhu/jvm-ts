import Frame from '../../thread/Frame'
import Breakpoint from './Breakpoint'
import EmptyBreakpoint from './EmptyBreakpoint'
import StepBreakpoint from './StepBreakpoint'

export const stepBreakpoint = new StepBreakpoint()

export const emptyBreakPoint = new EmptyBreakpoint()

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
