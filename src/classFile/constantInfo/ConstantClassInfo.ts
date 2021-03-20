import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'

export default class ConstantClassInfo {
  constructor(private _cp: ConstantPool, private _nameIdx: u2) {}

  get name(): string {
    return this._cp.getUtf8(this._nameIdx)
  }

  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantClassInfo {
    return new ConstantClassInfo(cp, reader.readU2())
  }

  toString(): string {
    return `Class: {${this._nameIdx}}${this.name}`
  }
}
