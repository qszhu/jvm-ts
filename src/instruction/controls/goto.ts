import { BranchInstruction, BytecodeReader } from '..'
import Frame from '../../thread/Frame'

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
