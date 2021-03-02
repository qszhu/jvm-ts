import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class Dup extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot = stack.popSlot()
    stack.pushSlot(slot)
    stack.pushSlot(slot)
  }
}

export class DupX1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    stack.pushSlot(slot1)
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
  }
}

export class DupX2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    const slot3 = stack.popSlot()
    stack.pushSlot(slot1)
    stack.pushSlot(slot3)
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
  }
}

export class Dup2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
  }
}

export class Dup2X1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    const slot3 = stack.popSlot()
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
    stack.pushSlot(slot3)
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
  }
}

export class Dup2X2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    const slot3 = stack.popSlot()
    const slot4 = stack.popSlot()
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
    stack.pushSlot(slot4)
    stack.pushSlot(slot3)
    stack.pushSlot(slot2)
    stack.pushSlot(slot1)
  }
}
