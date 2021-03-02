import { BranchInstruction, BytecodeReader } from '..'
import Frame from '../../thread/Frame'

export class Goto extends BranchInstruction {
  execute(frame: Frame): void {
    this.branch(frame)
  }
}

export class GotoW extends BranchInstruction {
  fetchOperands(reader: BytecodeReader): void {
    this._offset = reader.readInt32()
  }

  execute(frame: Frame): void {
    this.branch(frame)
  }
}
