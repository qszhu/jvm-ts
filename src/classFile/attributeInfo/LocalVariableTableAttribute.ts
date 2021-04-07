import ClassReader from '../ClassReader'
import LocalVariableTableEntry from './tableEntry/LocalVariableTableEntry'

export default class LocalVariableTableAttribute {
  static fromReader(reader: ClassReader): LocalVariableTableAttribute {
    return new LocalVariableTableAttribute(LocalVariableTableEntry.listFromReader(reader))
  }

  constructor(private _table: LocalVariableTableEntry[]) {}

  toString(): string {
    return `
LocalVariableTable:
${this._table.map((e) => e.toString()).join('\n')}
`
  }
}
