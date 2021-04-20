import Frame from '../../thread/Frame'
import BranchInstruction from '../base/BranchInstruction'

export class IfICmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 === v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a == int b`
  }
}

export class IfICmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 !== v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a != int b`
  }
}

export class IfICmpLT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 < v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a < int b`
  }
}

export class IfICmpLE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 <= v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a <= int b`
  }
}

export class IfICmpGT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 > v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a > int b`
  }
}

export class IfICmpGE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 >= v2) this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset} if int a >= int b`
  }
}
