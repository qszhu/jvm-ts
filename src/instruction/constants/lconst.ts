import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class LConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushLong(BigInt(0))
  }
}

export class LConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushLong(BigInt(1))
  }
}
