import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class IShl extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const s = v2 & 0x1f
    const res = v1 << s
    stack.pushInt(res)
  }
}

export class IShr extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const s = v2 & 0x1f
    const res = v1 >> s
    stack.pushInt(res)
  }
}

export class IUShr extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    const s = v2 & 0x1f
    const res = v1 >>> s
    stack.pushInt(res)
  }
}

export class LShl extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popLong()
    const s = v2 & 0x3f
    const res = v1 << BigInt(s)
    stack.pushLong(res)
  }
}

export class LShr extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popLong()
    const s = v2 & 0x3f
    const res = v1 >> BigInt(s)
    stack.pushLong(res)
  }
}

export class LUShr extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popLong()
    const s = v2 & 0x3f
    let bits = v1.toString(2)
    bits = bits.substring(0, bits.length - s)
    const res = BigInt(`0b${bits}`)
    stack.pushLong(res)
  }
}
