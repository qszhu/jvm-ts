import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ConstantInvokeDynamicInfo {
  static fromReader(reader: ClassReader): ConstantInvokeDynamicInfo {
    return new ConstantInvokeDynamicInfo(reader.readU2(), reader.readU2())
  }

  constructor(private _bootstrapMethodAttrIdx: u2, private _nameTypeIdx: u2) {}

  get bootstrapMethodAttrIndex(): u2 {
    return this._bootstrapMethodAttrIdx
  }

  get nameAndTypeIndex(): u2 {
    return this._nameTypeIdx
  }

  toString(): string {
    return `InvokeDynamic: {${this.bootstrapMethodAttrIndex}} {${this.nameAndTypeIndex}}`
  }
}
