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
}

export class IStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 0)
  }
}

export class IStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 1)
  }
}

export class IStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 2)
  }
}

export class IStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    istore(frame, 3)
  }
}
