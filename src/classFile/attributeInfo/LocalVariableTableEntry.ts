import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class LocalVariableTableEntry {
  static listFromReader(reader: ClassReader): LocalVariableTableEntry[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => LocalVariableTableEntry.fromReader(reader))
  }

  static fromReader(reader: ClassReader): LocalVariableTableEntry {
    return new LocalVariableTableEntry(
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2()
    )
  }

  constructor(
    private _startPc: u2,
    private _length: u2,
    private _nameIdx: u2,
    private _descriptorIdx: u2,
    private _idx: u2
  ) {}

  toString(): string {
    return `#${this._startPc} ${this._length} {${this._nameIdx}} {${this._descriptorIdx}} {${this._idx}}`
  }
}
