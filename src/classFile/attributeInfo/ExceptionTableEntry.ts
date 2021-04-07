import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ExceptionTableEntry {
  static listFromReader(reader: ClassReader): ExceptionTableEntry[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => ExceptionTableEntry.fromReader(reader))
  }

  static fromReader(reader: ClassReader): ExceptionTableEntry {
    return new ExceptionTableEntry(
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2()
    )
  }

  constructor(
    private _startPc: u2,
    private _endPc: u2,
    private _handlerPc: u2,
    private _catchType: u2
  ) {}

  get startPc(): u2 {
    return this._startPc
  }

  get endPc(): u2 {
    return this._endPc
  }

  get handlerPc(): u2 {
    return this._handlerPc
  }

  get catchType(): u2 {
    return this._catchType
  }
}
