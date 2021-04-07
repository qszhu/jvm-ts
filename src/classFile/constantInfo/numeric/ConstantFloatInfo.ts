import ClassReader from '../../ClassReader'
import BaseConstantNumericInfo from './BaseConstantNumericInfo'

export default class ConstantFloatInfo extends BaseConstantNumericInfo<number> {
  static fromReader(reader: ClassReader): ConstantFloatInfo {
    return new ConstantFloatInfo(reader.readFloat())
  }

  toString(): string {
    return `Float: ${this.val}`
  }
}
