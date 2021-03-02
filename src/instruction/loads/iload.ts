import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function iLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getInt(idx)
  frame.operandStack.pushInt(val)
}

export class ILoad extends Index8Instruction {
  execute(frame: Frame): void {
    iLoad(frame, this._index)
  }
}

export class ILoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 0)
  }
}

export class ILoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 1)
  }
}

export class ILoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 2)
  }
}

export class ILoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    iLoad(frame, 3)
  }
}
