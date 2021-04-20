import Frame from '../../thread/Frame'
import Breakpoint from './Breakpoint'

export default class EmptyBreakpoint extends Breakpoint {
  shouldBreak(frame: Frame): boolean {
    return false
  }
}
