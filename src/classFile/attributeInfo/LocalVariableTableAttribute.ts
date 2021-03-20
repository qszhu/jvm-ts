import ClassReader from '../ClassReader'
import { u2 } from '../types'

class LocalVariableTableEntry {
  constructor(
    private _startPc: u2,
    private _length: u2,
    private _nameIdx: u2,
    private _descriptorIdx: u2,
    private _idx: u2
  ) {}

  static fromReader(reader: ClassReader) {
    return new LocalVariableTableEntry(
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2()
    )
  }

  static listFromReader(reader: ClassReader) {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => LocalVariableTableEntry.fromReader(reader))
  }

  toString(): string {
    return `#${this._startPc} ${this._length} {${this._nameIdx}} {${this._descriptorIdx}} {${this._idx}}`
  }
}

export default class LocalVariableTableAttribute {
  constructor(private _table: LocalVariableTableEntry[]) {}

  static fromReader(reader: ClassReader): LocalVariableTableAttribute {
    return new LocalVariableTableAttribute(LocalVariableTableEntry.listFromReader(reader))
  }

  toString(): string {
    const res: string[] = []
    res.push('LocalVariableTable')
    for (const entry of this._table) {
      res.push(entry.toString())
    }
    return res.join('\n')
  }
}
