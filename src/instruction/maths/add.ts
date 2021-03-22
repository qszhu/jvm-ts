import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class DAdd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popDouble()
    const v1 = stack.popDouble()
    const res = v1 + v2
    stack.pushDouble(res)
  }

  toString(): string {
    return 'double a + double b'
  }
}

export class FAdd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popFloat()
    const v1 = stack.popFloat()
    const res = v1 + v2
    stack.pushFloat(res)
  }

  toString(): string {
    return 'float a + float b'
  }
}

export class IAdd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const res = v1 + v2
    stack.pushInt(res)
  }

  toString(): string {
    return 'int a + int b'
  }
}

export class LAdd extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    const res = v1 + v2
    stack.pushLong(res)
  }

  toString(): string {
    return 'long a + long b'
  }
}
