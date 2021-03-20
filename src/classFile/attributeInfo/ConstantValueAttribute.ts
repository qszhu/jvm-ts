import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ConstantValueAttribute {
  constructor(private _constValIdx: u2) {}

  get constantValueIndex(): u2 {
    return this._constValIdx
  }

  static fromReader(reader: ClassReader): ConstantValueAttribute {
    return new ConstantValueAttribute(reader.readU2())
  }

  toString(): string {
    return `ConstantValue: {${this._constValIdx}}`
  }
}
