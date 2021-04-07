import ClassReader from '../../ClassReader'
import BaseConstantNumericInfo from './BaseConstantNumericInfo'

export default class ConstantDoubleInfo extends BaseConstantNumericInfo<number> {
  static fromReader(reader: ClassReader): ConstantDoubleInfo {
    return new ConstantDoubleInfo(reader.readDouble())
  }

  toString(): string {
    return `Double: ${this.val}`
  }
}
