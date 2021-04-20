import Frame from '../../thread/Frame'
import Index8Instruction from '../base/Index8Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

function dstore(frame: Frame, index: number) {
  const val = frame.operandStack.popDouble()
  frame.localVars.setDouble(index, val)
}

export class DStore extends Index8Instruction {
  execute(frame: Frame): void {
    dstore(frame, this._index)
  }
}

export class DStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dstore(frame, 0)
  }
}

export class DStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dstore(frame, 1)
  }
}

export class DStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dstore(frame, 2)
  }
}

export class DStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dstore(frame, 3)
  }
}
