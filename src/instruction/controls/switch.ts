import { BranchInstruction, BytecodeReader } from '..'
import Frame from '../../thread/Frame'

export class TableSwitch extends BranchInstruction {
  private _defaultOffset: number
  private _low: number
  private _high: number
  private _jumpOffsets: number[]

  fetchOperands(reader: BytecodeReader): void {
    reader.skipPadding()
    this._defaultOffset = reader.readInt32()
    this._low = reader.readInt32()
    this._high = reader.readInt32()
    const offsetsCount = this._high - this._low + 1
    this._jumpOffsets = reader.readInt32List(offsetsCount)
  }

  execute(frame: Frame): void {
    const idx = frame.operandStack.popInt()
    this._offset =
      idx >= this._low && idx <= this._high
        ? this._jumpOffsets[idx - this._low]
        : this._defaultOffset
    this.branch(frame)
  }
}

export class LookupSwitch extends BranchInstruction {
  private _defaultOffset: number
  private _pairsCount: number
  private _matchOffsets: number[]

  fetchOperands(reader: BytecodeReader): void {
    reader.skipPadding()
    this._defaultOffset = reader.readInt32()
    this._pairsCount = reader.readInt32()
    this._matchOffsets = reader.readInt32List(this._pairsCount * 2)
  }

  execute(frame: Frame): void {
    const key = frame.operandStack.popInt()
    for (let i = 0; i < this._pairsCount; i += 2) {
      if (this._matchOffsets[i] === key) {
        this._offset = this._matchOffsets[i + 1]
        this.branch(frame)
        return
      }
    }
    this._offset = this._defaultOffset
    this.branch(frame)
  }
}
