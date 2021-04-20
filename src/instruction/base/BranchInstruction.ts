import Frame from '../../thread/Frame'
import BytecodeReader from '../BytecodeReader'
import Instruction from './Instruction'

export default abstract class BranchInstruction implements Instruction {
  constructor(protected _offset?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._offset = reader.readInt16()
  }

  protected branch(frame: Frame): void {
    const pc = frame.thread.pc
    frame.nextPc = pc + this._offset
  }

  abstract execute(frame: Frame): void
}
