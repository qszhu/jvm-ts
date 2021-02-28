import { BytecodeReader, Index16Instruction, Index8Instruction, Instruction, NoOperandsInstruction } from '.'
import Frame from '../thread/Frame'

export class AConstNull extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushRef(null)
  }
}

export class DConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushDouble(0)
  }
}

export class DConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushDouble(1)
  }
}

export class FConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(0)
  }
}

export class FConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(1)
  }
}

export class FConst2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(2)
  }
}

export class IConstM1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(-1)
  }
}

export class IConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(0)
  }
}

export class IConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(1)
  }
}

export class IConst2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(2)
  }
}

export class IConst3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(3)
  }
}

export class IConst4 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(4)
  }
}

export class IConst5 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(5)
  }
}

export class LConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushLong(BigInt(0))
  }
}

export class LConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushLong(BigInt(1))
  }
}

export class BiPush implements Instruction {
  constructor(private _val?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._val = reader.readInt8()
  }

  execute(frame: Frame): void {
    frame.operandStack.pushInt(this._val)
  }
}

export class SiPush implements Instruction {
  constructor(private _val?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._val = reader.readInt16()
  }

  execute(frame: Frame): void {
    frame.operandStack.pushInt(this._val)
  }
}

function ldc(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const cp = frame.method.class.constantPool
  const c = cp.getConstant(idx)
  throw new Error('not implemented')
}

export class Ldc extends Index8Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }
}

export class LdcW extends Index16Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }
}

export class Ldc2W extends Index16Instruction {
  execute(frame: Frame): void {
    //
  }
}
