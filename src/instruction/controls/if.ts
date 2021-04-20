import Frame from '../../thread/Frame'
import BranchInstruction from '../base/BranchInstruction'

export class IfEq extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val === 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a == 0`
  }
}

export class IfNE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val !== 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a != 0`
  }
}

export class IfLT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val < 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a < 0`
  }
}

export class IfLE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val <= 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a <= 0`
  }
}

export class IfGT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val > 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a > 0`
  }
}

export class IfGE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val >= 0) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a >= 0`
  }
}
