import Frame from '../../thread/Frame'
import Index8Instruction from '../base/Index8Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

function fLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getFloat(idx)
  frame.operandStack.pushFloat(val)
}

export class FLoad extends Index8Instruction {
  execute(frame: Frame): void {
    fLoad(frame, this._index)
  }
}

export class FLoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fLoad(frame, 0)
  }
}

export class FLoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fLoad(frame, 1)
  }
}

export class FLoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fLoad(frame, 2)
  }
}

export class FLoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fLoad(frame, 3)
  }
}
