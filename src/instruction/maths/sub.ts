import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class DSub extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popDouble()
    const v1 = stack.popDouble()
    const res = v1 - v2
    stack.pushDouble(res)
  }
}

export class FSub extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popFloat()
    const v1 = stack.popFloat()
    const res = v1 - v2
    stack.pushFloat(res)
  }
}

export class ISub extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const res = v1 - v2
    stack.pushInt(res)
  }
}

export class LSub extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    const res = v1 - v2
    stack.pushLong(res)
  }
}
