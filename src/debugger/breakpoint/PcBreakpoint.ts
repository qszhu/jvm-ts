import Method from '../../class/member/Method'
import Frame from '../../thread/Frame'
import Breakpoint from './Breakpoint'

export default class PcBreakpoint extends Breakpoint {
  constructor(private _method: Method, private _pc: number) {
    super()
  }

  shouldBreak(frame: Frame): boolean {
    return frame.method === this._method && frame.thread.pc === this._pc
  }
}
