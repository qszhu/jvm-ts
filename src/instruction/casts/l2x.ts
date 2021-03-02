import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class L2D extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const l = stack.popLong()
    const d = new Float64Array([Number(l)])[0]
    stack.pushDouble(d)
  }
}

export class L2F extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const l = stack.popLong()
    const f = new Float32Array([Number(l)])[0]
    stack.pushFloat(f)
  }
}

export class L2I extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const l = stack.popLong()
    const i = new Int32Array([Number(l)])[0]
    stack.pushInt(i)
  }
}
