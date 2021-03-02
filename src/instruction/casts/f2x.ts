import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class F2D extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const f = stack.popFloat()
    const d = new Float64Array([f])[0]
    stack.pushDouble(d)
  }
}

export class F2I extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const f = stack.popFloat()
    const i = new Int32Array([f])[0]
    stack.pushInt(i)
  }
}

export class F2L extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const f = stack.popFloat()
    const l = BigInt(f)
    stack.pushLong(l)
  }
}
