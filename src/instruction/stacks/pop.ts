import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class Pop extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.popSlot()
  }
}

export class Pop2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    stack.popSlot()
    stack.popSlot()
  }
}
