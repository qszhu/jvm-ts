import Method from '../../class/member/Method'
import Frame from '../../thread/Frame'
import Breakpoint from './Breakpoint'

export default class MethodBreakpoint extends Breakpoint {
  constructor(private _method: Method) {
    super()
  }

  shouldBreak(frame: Frame): boolean {
    return frame.method === this._method
  }
}
