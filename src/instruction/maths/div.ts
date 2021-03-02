import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class DDiv extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popDouble()
    const v1 = stack.popDouble()
    const res = v1 / v2
    stack.pushDouble(res)
  }
}

export class FDiv extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popFloat()
    const v1 = stack.popFloat()
    const res = v1 / v2
    stack.pushFloat(res)
  }
}

export class IDiv extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v2 === 0) throw new Error('java.lang.ArithmeticException: divide by zero')
    const res = Math.floor(v1 / v2)
    stack.pushInt(res)
  }
}

export class LDiv extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    if (v2 === BigInt(0)) throw new Error('java.lang.ArithmeticException: divide by zero')
    const res = v1 / v2
    stack.pushLong(res)
  }
}
