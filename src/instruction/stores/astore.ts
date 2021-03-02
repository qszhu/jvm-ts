import { Index8Instruction, NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function astore(frame: Frame, index: number) {
  const val = frame.operandStack.popRef()
  frame.localVars.setRef(index, val)
}

export class AStore extends Index8Instruction {
  execute(frame: Frame): void {
    astore(frame, this._index)
  }
}

export class AStore0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 0)
  }
}

export class AStore1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 1)
  }
}

export class AStore2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 2)
  }
}

export class AStore3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    astore(frame, 3)
  }
}
