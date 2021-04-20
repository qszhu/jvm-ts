import Frame from '../../thread/Frame'
import BranchInstruction from '../base/BranchInstruction'
import BytecodeReader from '../BytecodeReader'

export class Goto extends BranchInstruction {
  execute(frame: Frame): void {
    this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset}`
  }
}

export class GotoW extends BranchInstruction {
  fetchOperands(reader: BytecodeReader): void {
    this._offset = reader.readInt32()
  }

  execute(frame: Frame): void {
    this.branch(frame)
  }

  toString(): string {
    return `jump ${this._offset}`
  }
}
