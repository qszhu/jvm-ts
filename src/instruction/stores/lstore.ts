import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function lstore(frame: Frame, index: number) {
  const val = frame.operandStack.popLong()
  frame.localVars.setLong(index, val)
}

export class LStore extends Index8Instruction {
  execute(frame: Frame): void {
    lstore(frame, this._index)
  }
}

export class LStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lstore(frame, 0)
  }
}

export class LStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lstore(frame, 1)
  }
}

export class LStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lstore(frame, 2)
  }
}

export class LStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    lstore(frame, 3)
  }
}
