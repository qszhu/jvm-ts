import ClassReader from '../../ClassReader'
import { u2 } from '../../types'

export default class LineNumberTableEntry {
  static listFromReader(reader: ClassReader): LineNumberTableEntry[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => LineNumberTableEntry.fromReader(reader))
  }

  static fromReader(reader: ClassReader): LineNumberTableEntry {
    return new LineNumberTableEntry(reader.readU2(), reader.readU2())
  }

  constructor(private _startPc: u2, private _lineNumber: u2) {}

  get startPc(): u2 {
    return this._startPc
  }

  get lineNumber(): u2 {
    return this._lineNumber
  }

  toString(): string {
    return `pc: #${this._startPc} line: ${this._lineNumber}`
  }
}
