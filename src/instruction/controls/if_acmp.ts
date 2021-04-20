import Frame from '../../thread/Frame'
import BranchInstruction from '../base/BranchInstruction'

export class IfACmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 === ref2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if object a == object b`
  }
}

export class IfACmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 !== ref2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if object a != object b`
  }
}

export class IfNull extends BranchInstruction {
  execute(frame: Frame): void {
    const ref = frame.operandStack.popRef()
    if (ref === null) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if object a is null`
  }
}

export class IfNonNull extends BranchInstruction {
  execute(frame: Frame): void {
    const ref = frame.operandStack.popRef()
    if (ref !== null) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if object a is not null`
  }
}
