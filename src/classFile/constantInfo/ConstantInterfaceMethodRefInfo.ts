import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import BaseConstantMemberRefInfo from './BaseConstantMemberRefInfo'

export default class ConstantInterfaceMethodRefInfo extends BaseConstantMemberRefInfo {
  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantInterfaceMethodRefInfo {
    return new ConstantInterfaceMethodRefInfo(cp, reader.readU2(), reader.readU2())
  }

  toString(): string {
    const [name, type] = this.nameAndDescriptor
    return `InterfaceMethodRef: {${this._classIdx}}${this.className}.{${this._nameTypeIdx}}${name}:${type}`
  }
}
