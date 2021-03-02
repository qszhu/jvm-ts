import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class DConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushDouble(0)
  }
}

export class DConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushDouble(1)
  }
}
