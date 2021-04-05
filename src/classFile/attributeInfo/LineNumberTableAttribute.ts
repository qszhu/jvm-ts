import ClassReader from '../ClassReader'
import { u2 } from '../types'

class LineNumberTableEntry {
  constructor(private _startPc: u2, private _lineNumber: u2) {}

  get startPc(): u2 {
    return this._startPc
  }

  get lineNumber(): u2 {
    return this._lineNumber
  }

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

  getLineNumber(pc: number): number {
    for (let i = this._table.length - 1; i >= 0; i--) {
      const entry = this._table[i]
      if (pc >= entry.startPc) return entry.lineNumber
    }
    return -1
  }

  toString(): string {
    return `
LineNumberTable:
${this._table.map((e) => e.toString()).join('\n')}
`
  }
}
