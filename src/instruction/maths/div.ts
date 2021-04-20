import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class DDiv extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popDouble()
    const v1 = stack.popDouble()
    const res = v1 / v2
    stack.pushDouble(res)
  }

  toString(): string {
    return `push double a / b`
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

  toString(): string {
    return `push float a / b`
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

  toString(): string {
    return `push int a / b`
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

  toString(): string {
    return `push long a / b`
  }
}
