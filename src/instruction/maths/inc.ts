import Frame from '../../thread/Frame'
import Instruction from '../base/Instruction'
import BytecodeReader from '../BytecodeReader'

export class IInc implements Instruction {
  constructor(private _idx?: number, private _const?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._idx = reader.readUint8()
    this._const = reader.readInt8()
  }

  execute(frame: Frame): void {
    const vars = frame.localVars
    let val = vars.getInt(this._idx)
    val += this._const
    vars.setInt(this._idx, val)
  }

  toString(): string {
    return `inc int at var ${this._idx} by ${this._const}`
  }
}
