import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class IConstM1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(-1)
  }

  toString(): string {
    return 'push int -1'
  }
}

export class IConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(0)
  }

  toString(): string {
    return 'push int 0'
  }
}

export class IConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(1)
  }

  toString(): string {
    return 'push int 1'
  }
}

export class IConst2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(2)
  }

  toString(): string {
    return 'push int 2'
  }
}

export class IConst3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(3)
  }

  toString(): string {
    return 'push int 3'
  }
}

export class IConst4 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(4)
  }

  toString(): string {
    return 'push int 4'
  }
}

export class IConst5 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(5)
  }

  toString(): string {
    return 'push int 5'
  }
}
