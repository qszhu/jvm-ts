import Frame from '../../thread/Frame'
import Breakpoint from './Breakpoint'

export default class StepBreakpoint extends Breakpoint {
  shouldBreak(frame: Frame): boolean {
    return true
  }
}
