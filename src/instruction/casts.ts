import { NoOperandsInstruction } from '.'
import Frame from '../thread/Frame'

export class D2F extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const d = stack.popDouble()
    const f = new Float32Array([d])[0]
    stack.pushFloat(f)
  }
}

export class D2I extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const d = stack.popDouble()
    const i = new Int32Array([d])[0]
    stack.pushInt(i)
  }
}

export class D2L extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const d = stack.popDouble()
    const l = BigInt(d)
    stack.pushLong(l)
  }
}
