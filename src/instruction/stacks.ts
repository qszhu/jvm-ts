import { NoOperandsInstruction } from '.'
import Frame from '../thread/Frame'

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
    throw new Error('Method not implemented.')
  }
}

export class DupX2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    throw new Error('Method not implemented.')
  }
}

export class Dup2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    throw new Error('Method not implemented.')
  }
}

export class Dup2X1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    throw new Error('Method not implemented.')
  }
}

export class Dup2X2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    throw new Error('Method not implemented.')
  }
}

export class Swap extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot1 = stack.popSlot()
    const slot2 = stack.popSlot()
    stack.pushSlot(slot1)
    stack.pushSlot(slot2)
  }
}
