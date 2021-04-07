import ClassReader from '../ClassReader'
import { u2 } from '../types'

export default class ConstantValueAttribute {
  static fromReader(reader: ClassReader): ConstantValueAttribute {
    return new ConstantValueAttribute(reader.readU2())
  }

  constructor(private _constValIdx: u2) {}

  get constantValueIndex(): u2 {
    return this._constValIdx
  }

  toString(): string {
    return `ConstantValue: {${this._constValIdx}}`
  }
}
