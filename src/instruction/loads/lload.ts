import Frame from '../../thread/Frame'
import Index8Instruction from '../base/Index8Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

function lLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getLong(idx)
  frame.operandStack.pushLong(val)
}

export class LLoad extends Index8Instruction {
  execute(frame: Frame): void {
    lLoad(frame, this._index)
  }
}

export class LLoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lLoad(frame, 0)
  }
}

export class LLoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lLoad(frame, 1)
  }
}

export class LLoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lLoad(frame, 2)
  }
}

export class LLoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lLoad(frame, 3)
  }
}
