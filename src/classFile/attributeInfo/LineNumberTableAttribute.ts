import ClassReader from '../ClassReader'
import LineNumberTableEntry from './tableEntry/LineNumberTableEntry'

export default class LineNumberTableAttribute {
  static fromReader(reader: ClassReader): LineNumberTableAttribute {
    return new LineNumberTableAttribute(LineNumberTableEntry.listFromReader(reader))
  }

  constructor(private _table: LineNumberTableEntry[]) {}

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
