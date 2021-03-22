import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function aLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getRef(idx)
  frame.operandStack.pushRef(val)
}

export class ALoad extends Index8Instruction {
  execute(frame: Frame): void {
    aLoad(frame, this._index)
  }

  toString(): string {
    return `push object at var ${this._index}`
  }
}

export class ALoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 0)
  }

  toString(): string {
    return 'push object at var 0'
  }
}

export class ALoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 1)
  }

  toString(): string {
    return 'push object at var 1'
  }
}

export class ALoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 2)
  }

  toString(): string {
    return 'push object at var 2'
  }
}

export class ALoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 3)
  }

  toString(): string {
    return 'push object at var 3'
  }
}
