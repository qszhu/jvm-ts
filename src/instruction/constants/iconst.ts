import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class IConstM1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(-1)
  }
}

export class IConst0 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(0)
  }
}

export class IConst1 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(1)
  }
}

export class IConst2 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(2)
  }
}

export class IConst3 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(3)
  }
}

export class IConst4 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(4)
  }
}

export class IConst5 extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushInt(5)
  }
}
