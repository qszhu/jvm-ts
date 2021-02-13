import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'

export default class ConstantStringInfo {
  constructor(private _cp: ConstantPool, private _stringIdx: u2) {}

  get string(): string {
    return this._cp.getUtf8(this._stringIdx)
  }

  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantStringInfo {
    return new ConstantStringInfo(cp, reader.readU2())
  }
}
