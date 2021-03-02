import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class I2B extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const b = new Int8Array([i])[0]
    stack.pushInt(b)
  }
}

export class I2C extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const c = new Uint16Array([i])[0]
    stack.pushInt(c)
  }
}

export class I2S extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const s = new Int16Array([i])[0]
    stack.pushInt(s)
  }
}

export class I2L extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const l = BigInt(i)
    stack.pushLong(l)
  }
}

export class I2F extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const f = new Float32Array([i])[0]
    stack.pushFloat(f)
  }
}

export class I2D extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const i = stack.popInt()
    const d = new Float64Array([i])[0]
    stack.pushDouble(d)
  }
}
