import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class FConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(0)
  }
}

export class FConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(1)
  }
}

export class FConst2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushFloat(2)
  }
}
