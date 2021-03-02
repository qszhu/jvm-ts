import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function fstore(frame: Frame, index: number) {
  const val = frame.operandStack.popFloat()
  frame.localVars.setFloat(index, val)
}

export class FStore extends Index8Instruction {
  execute(frame: Frame): void {
    fstore(frame, this._index)
  }
}

export class FStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fstore(frame, 0)
  }
}

export class FStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fstore(frame, 1)
  }
}

export class FStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fstore(frame, 2)
  }
}

export class FStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fstore(frame, 3)
  }
}
