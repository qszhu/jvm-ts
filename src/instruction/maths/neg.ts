import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class DNeg extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v = stack.popDouble()
    const res = -v
    stack.pushDouble(res)
  }
}

export class FNeg extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v = stack.popFloat()
    const res = -v
    stack.pushFloat(res)
  }
}

export class INeg extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v = stack.popInt()
    const res = -v
    stack.pushInt(res)
  }
}

export class LNeg extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v = stack.popLong()
    const res = -v
    stack.pushLong(res)
  }
}
