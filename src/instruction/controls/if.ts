import { BranchInstruction } from '..'
import Frame from '../../thread/Frame'

export class IfEq extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val === 0) this.branch(frame)
  }
}

export class IfNE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val !== 0) this.branch(frame)
  }
}

export class IfLT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val < 0) this.branch(frame)
  }
}

export class IfLE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val <= 0) this.branch(frame)
  }
}

export class IfGT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val > 0) this.branch(frame)
  }
}

export class IfGE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val >= 0) this.branch(frame)
  }
}
