import ClassReader from '../ClassReader'
import { u2 } from '../types'

class LineNumberTableEntry {
  constructor(private _startPc: u2, private _lineNumber: u2) {}

  static fromReader(reader: ClassReader) {
    return new LineNumberTableEntry(reader.readU2(), reader.readU2())
  }

  static listFromReader(reader: ClassReader) {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => LineNumberTableEntry.fromReader(reader))
  }

  toString(): string {
    return `pc: #${this._startPc} line: ${this._lineNumber}`
  }
}

export default class LineNumberTableAttribute {
  constructor(private _table: LineNumberTableEntry[]) {}

  static fromReader(reader: ClassReader): LineNumberTableAttribute {
    return new LineNumberTableAttribute(LineNumberTableEntry.listFromReader(reader))
  }

  toString(): string {
    const res: string[] = []
    res.push('LineNumberTable:')
    for (const entry of this._table) {
      res.push(entry.toString())
    }
    return res.join('\n')
  }
}
