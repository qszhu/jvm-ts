import { BranchInstruction } from '..'
import Frame from '../../thread/Frame'

export class IfICmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 === v2) this.branch(frame)
  }
}

export class IfICmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 !== v2) this.branch(frame)
  }
}

export class IfICmpLT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 < v2) this.branch(frame)
  }
}

export class IfICmpLE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 <= v2) this.branch(frame)
  }
}

export class IfICmpGT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 > v2) this.branch(frame)
  }
}

export class IfICmpGE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 >= v2) this.branch(frame)
  }
}