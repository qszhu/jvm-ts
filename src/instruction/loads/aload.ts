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
}

export class ALoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 0)
  }
}

export class ALoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 1)
  }
}

export class ALoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 2)
  }
}

export class ALoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    aLoad(frame, 3)
  }
}
