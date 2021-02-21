import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import BaseConstantMemberRefInfo from './BaseConstantMemberRefInfo'

export default class ConstantFieldRefInfo extends BaseConstantMemberRefInfo {
  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantFieldRefInfo {
    return new ConstantFieldRefInfo(cp, reader.readU2(), reader.readU2())
  }
}
