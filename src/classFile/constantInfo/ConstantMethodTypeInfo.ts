import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ConstantMethodTypeInfo {
  static fromReader(reader: ClassReader): ConstantMethodTypeInfo {
    return new ConstantMethodTypeInfo(reader.readU2())
  }

  constructor(private _descriptorIdx: u2) {}

  get descriptorIndex(): u2 {
    return this._descriptorIdx
  }

  toString(): string {
    return `MethodType: {${this.descriptorIndex}}`
  }
}
