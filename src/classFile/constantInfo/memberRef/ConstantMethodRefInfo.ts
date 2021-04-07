import ClassReader from '../../ClassReader'
import ConstantPool from '../../ConstantPool'
import BaseConstantMemberRefInfo from './BaseConstantMemberRefInfo'

export default class ConstantMethodRefInfo extends BaseConstantMemberRefInfo {
  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantMethodRefInfo {
    return new ConstantMethodRefInfo(cp, reader.readU2(), reader.readU2())
  }

  toString(): string {
    const [name, type] = this.nameAndDescriptor
    return `MethodRef: {${this._classIdx}}${this.className}.{${this._nameTypeIdx}}${name}:${type}`
  }
}
