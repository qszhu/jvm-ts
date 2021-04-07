import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ConstantNameAndTypeInfo {
  static fromReader(reader: ClassReader): ConstantNameAndTypeInfo {
    return new ConstantNameAndTypeInfo(reader.readU2(), reader.readU2())
  }

  constructor(private _nameIdx: u2, private _descriptorIdx: u2) {}

  get nameIndex(): u2 {
    return this._nameIdx
  }

  get descriptorIndex(): u2 {
    return this._descriptorIdx
  }

  toString(): string {
    return `NameAndType: {${this.nameIndex}} {${this.descriptorIndex}}`
  }
}
