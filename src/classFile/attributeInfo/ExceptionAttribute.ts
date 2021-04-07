import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ExceptionsAttribute {
  static fromReader(reader: ClassReader): ExceptionsAttribute {
    return new ExceptionsAttribute(reader.readU2List())
  }

  constructor(private _exceptionIdxTable: u2[]) {}

  get exceptionIndexTable(): u2[] {
    return this._exceptionIdxTable.slice()
  }

  toString(): string {
    return `
Exceptions:
${this._exceptionIdxTable.map((e) => e.toString()).join('\n')}
`
  }
}
