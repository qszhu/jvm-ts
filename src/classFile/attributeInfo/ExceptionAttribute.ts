import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ExceptionsAttribute {
  constructor(private _exceptionIdxTable: u2[]) {}

  get ExceptionIndexTable(): u2[] {
    return this._exceptionIdxTable.slice()
  }

  static fromReader(reader: ClassReader): ExceptionsAttribute {
    return new ExceptionsAttribute(reader.readU2List())
  }
}
