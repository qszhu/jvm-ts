import Frame from '../../thread/Frame'
import Index8Instruction from '../base/Index8Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

function astore(frame: Frame, index: number) {
  const val = frame.operandStack.popRef()
  frame.localVars.setRef(index, val)
}

export class AStore extends Index8Instruction {
  execute(frame: Frame): void {
    astore(frame, this._index)
  }

  toString(): string {
    return `pop object to var ${this._index}`
  }
}

export class AStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 0)
  }

  toString(): string {
    return 'pop object to var 0'
  }
}

export class AStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 1)
  }

  toString(): string {
    return 'pop object to var 1'
  }
}

export class AStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 2)
  }

  toString(): string {
    return 'pop object to var 2'
  }
}

export class AStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 3)
  }

  toString(): string {
    return 'pop object to var 3'
  }
}
