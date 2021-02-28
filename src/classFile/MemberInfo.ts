import { AttributeInfo, readAttributes } from './attributeInfo'
import CodeAttribute from './attributeInfo/CodeAttribute'
import ConstantValueAttribute from './attributeInfo/ConstantValueAttribute'
import ClassReader from './ClassReader'
import ConstantPool from './ConstantPool'
import { u2 } from './types'

export default class MemberInfo {
  constructor(
    private _constantPool: ConstantPool,
    private _accessFlags: u2,
    private _nameIndex: u2,
    private _descriptorIndex: u2,
    private _attributes: AttributeInfo[]
  ) {}

  get accessFlags(): u2 {
    return this._accessFlags
  }

  get name(): string {
    return this._constantPool.getUtf8(this._nameIndex)
  }

  get descriptor(): string {
    return this._constantPool.getUtf8(this._descriptorIndex)
  }

  get codeAttribute(): CodeAttribute {
    for (const attr of this._attributes) {
      if (attr instanceof CodeAttribute) return attr
    }
  }

  get constantValueAttribute(): ConstantValueAttribute {
    for (const attr of this._attributes) {
      if (attr instanceof ConstantValueAttribute) return attr
    }
  }

  static listFromReader(reader: ClassReader, cp: ConstantPool): MemberInfo[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => MemberInfo.fromReader(reader, cp))
  }

  static fromReader(reader: ClassReader, cp: ConstantPool): MemberInfo {
    const accessFlags = reader.readU2()
    const nameIndex = reader.readU2()
    const descriptorIndex = reader.readU2()
    const attributes = readAttributes(reader, cp)
    return new MemberInfo(cp, accessFlags, nameIndex, descriptorIndex, attributes)
  }
}
