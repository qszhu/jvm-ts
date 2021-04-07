import ClassReader from '../../ClassReader'
import BaseConstantNumericInfo from './BaseConstantNumericInfo'

export default class ConstantIntegerInfo extends BaseConstantNumericInfo<number> {
  static fromReader(reader: ClassReader): ConstantIntegerInfo {
    return new ConstantIntegerInfo(reader.readInteger())
  }

  toString(): string {
    return `Integer: ${this.val}`
  }
}
