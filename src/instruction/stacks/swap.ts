import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class Swap extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    stack.pushSlot(slot1)
    stack.pushSlot(slot2)
  }
}
