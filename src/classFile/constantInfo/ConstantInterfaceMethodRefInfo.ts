import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import BaseConstantMemberRefInfo from './BaseConstantMemberRefInfo'

export default class ConstantInterfaceMethodRefInfo extends BaseConstantMemberRefInfo {
  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantInterfaceMethodRefInfo {
    return new ConstantInterfaceMethodRefInfo(cp, reader.readU2(), reader.readU2())
  }
}
