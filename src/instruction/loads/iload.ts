import Frame from '../../thread/Frame'
import Index8Instruction from '../base/Index8Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

function iLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getInt(idx)
  frame.operandStack.pushInt(val)
}

export class ILoad extends Index8Instruction {
  execute(frame: Frame): void {
    iLoad(frame, this._index)
  }

  toString(): string {
    return `push int at var ${this._index}`
  }
}

export class ILoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 0)
  }

  toString(): string {
    return 'push int at var 0'
  }
}

export class ILoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 1)
  }

  toString(): string {
    return 'push int at var 1'
  }
}

export class ILoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 2)
  }

  toString(): string {
    return 'push int at var 2'
  }
}

export class ILoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 3)
  }

  toString(): string {
    return 'push int at var 3'
  }
}
