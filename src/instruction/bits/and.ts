import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class IAnd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const res = v1 & v2
    stack.pushInt(res)
  }
}

export class LAnd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    const res = v1 & v2
    stack.pushLong(res)
  }
}
