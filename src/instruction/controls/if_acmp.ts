import { BranchInstruction } from '..'
import Frame from '../../thread/Frame'

export class IfACmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 === ref2) this.branch(frame)
  }
}

export class IfACmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 !== ref2) this.branch(frame)
  }
}

export class IfNull extends BranchInstruction {
  execute(frame: Frame): void {
    const ref = frame.operandStack.popRef()
    if (ref === null) this.branch(frame)
  }
}

export class IfNonNull extends BranchInstruction {
  execute(frame: Frame): void {
    const ref = frame.operandStack.popRef()
    if (ref !== null) this.branch(frame)
  }
}
