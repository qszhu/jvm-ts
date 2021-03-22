import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function istore(frame: Frame, index: number) {
  const val = frame.operandStack.popInt()
  frame.localVars.setInt(index, val)
}

export class IStore extends Index8Instruction {
  execute(frame: Frame): void {
    istore(frame, this._index)
  }

  toString(): string {
    return `pop int to var ${this._index}`
  }
}

export class IStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 0)
  }

  toString(): string {
    return 'pop int to var 0'
  }
}

export class IStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 1)
  }

  toString(): string {
    return 'pop int to var 1'
  }
}

export class IStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 2)
  }

  toString(): string {
    return 'pop int to var 2'
  }
}

export class IStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 3)
  }

  toString(): string {
    return 'pop int to var 3'
  }
}
