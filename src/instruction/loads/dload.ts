import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function dLoad(frame: Frame, idx: number) {
  const val = frame.localVars.getDouble(idx)
  frame.operandStack.pushDouble(val)
}

export class DLoad extends Index8Instruction {
  execute(frame: Frame): void {
    dLoad(frame, this._index)
  }
}

export class DLoad0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dLoad(frame, 0)
  }
}

export class DLoad1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dLoad(frame, 1)
  }
}

export class DLoad2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dLoad(frame, 2)
  }
}

export class DLoad3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dLoad(frame, 3)
  }
}
