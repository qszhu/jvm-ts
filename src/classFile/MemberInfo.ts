import { accessFlagsToString } from '../class/AccessFlag'
import AttributeInfo from './attributeInfo/AttributeInfo'
import AttributeInfoFactory from './attributeInfo/AttributeInfoFactory'
import AttributesHolder from './AttributesHolder'
import ClassReader from './ClassReader'
import ConstantPool from './ConstantPool'
import { u2 } from './types'

export default class MemberInfo extends AttributesHolder {
  static listFromReader(reader: ClassReader, cp: ConstantPool): MemberInfo[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => MemberInfo.fromReader(reader, cp))
  }

  private static fromReader(reader: ClassReader, cp: ConstantPool): MemberInfo {
    const accessFlags = reader.readU2()
    const nameIndex = reader.readU2()
    const descriptorIndex = reader.readU2()
    const attributes = AttributeInfoFactory.readAttributes(reader, cp)
    return new MemberInfo(cp, accessFlags, nameIndex, descriptorIndex, attributes)
  }

  constructor(
    private _constantPool: ConstantPool,
    private _accessFlags: u2,
    private _nameIndex: u2,
    private _descriptorIndex: u2,
    _attributes: AttributeInfo[]
  ) {
    super(_attributes)
  }

  get accessFlags(): u2 {
    return this._accessFlags
  }

  get name(): string {
    return this._constantPool.getUtf8(this._nameIndex)
  }

  get descriptor(): string {
    return this._constantPool.getUtf8(this._descriptorIndex)
  }

  toString(): string {
    return `
access flags: ${accessFlagsToString(this._accessFlags)}
name: {${this._nameIndex}}${this.name}
descriptor: {${this._descriptorIndex}}${this.descriptor}
attributes:
${this._attributes.map((a) => a.toString()).join('\n')}
`
  }
}
