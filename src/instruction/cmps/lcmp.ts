import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class LCmp extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    if (v1 > v2) stack.pushInt(1)
    else if (v1 < v2) stack.pushInt(-1)
    else stack.pushInt(0)
  }
}
