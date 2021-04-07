import ClassReader from '../../ClassReader'
import BaseConstantNumericInfo from './BaseConstantNumericInfo'

export default class ConstantLongInfo extends BaseConstantNumericInfo<bigint> {
  static fromReader(reader: ClassReader): ConstantLongInfo {
    return new ConstantLongInfo(reader.readLong())
  }

  toString(): string {
    return `Long: ${this.val}`
  }
}
