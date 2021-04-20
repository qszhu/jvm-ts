import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class Dup extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const slot = stack.popSlot()
    stack.pushSlot(slot)
    stack.pushSlot(slot)
  }

  toString(): string {
    return 'duplicate top [a] -> [a, a]'
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

  toString(): string {
    return 'duplicate top skip 1 [a, b] -> [b, a, b]'
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

  toString(): string {
    return 'duplicate top skip 2 [a, b, c] -> [c, a, b, c]'
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

  toString(): string {
    return 'duplicate top 2 [a, b] -> [a, b, a, b]'
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

  toString(): string {
    return 'duplicate top 2 skip 1 [a, b, c] -> [b, c, a, b, c]'
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

  toString(): string {
    return 'duplicate top 2 skip 2 [a, b, c, d] -> [c, d, a, b, c, d]'
  }
}
