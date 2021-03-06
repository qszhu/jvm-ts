import ClassReader from '../../ClassReader'
import ConstantPool from '../../ConstantPool'
import BaseConstantMemberRefInfo from './BaseConstantMemberRefInfo'

export default class ConstantFieldRefInfo extends BaseConstantMemberRefInfo {
  static fromReader(reader: ClassReader, cp: ConstantPool): ConstantFieldRefInfo {
    return new ConstantFieldRefInfo(cp, reader.readU2(), reader.readU2())
  }

  toString(): string {
    const [name, type] = this.nameAndDescriptor
    return `FieldRef: {${this._classIdx}}${this.className}.{${this._nameTypeIdx}}${name}:${type}`
  }
}
