import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'

export default class SourceFileAttribute {
  static fromReader(reader: ClassReader, cp: ConstantPool): SourceFileAttribute {
    return new SourceFileAttribute(cp, reader.readU2())
  }

  constructor(private _cp: ConstantPool, private _srcFileIdx: u2) {}

  get fileName(): string {
    return this._cp.getUtf8(this._srcFileIdx)
  }

  toString(): string {
    return `SourceFile: {${this._srcFileIdx}}${this.fileName}`
  }
}
