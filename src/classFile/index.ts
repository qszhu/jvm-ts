import { accessFlagsToString } from '../class/AccessFlag'
import { AttributeInfo, readAttributes } from './attributeInfo'
import ClassReader from './ClassReader'
import ConstantPool from './ConstantPool'
import MemberInfo from './MemberInfo'
import { u2, u4 } from './types'

export default class ClassFile {
  private _reader: ClassReader
  private _magic: u4
  private _minorVersion: u2
  private _majorVersion: u2
  private _constantPool: ConstantPool
  private _accessFlags: u2
  private _thisClass: u2
  private _superClass: u2
  private _interfaces: u2[]
  private _fields: MemberInfo[]
  private _methods: MemberInfo[]
  private _attributes: AttributeInfo[]

  constructor(data: Buffer) {
    this._reader = new ClassReader(data)

    this.readAndCheckMagic()
    this.readAndCheckVersion()

    this._constantPool = ConstantPool.readFrom(this._reader)

    this._accessFlags = this._reader.readU2()
    this._thisClass = this._reader.readU2()
    this._superClass = this._reader.readU2()
    this._interfaces = this._reader.readU2List()

    this._fields = MemberInfo.listFromReader(this._reader, this._constantPool)
    this._methods = MemberInfo.listFromReader(this._reader, this._constantPool)

    this._attributes = readAttributes(this._reader, this._constantPool)
  }

  private readAndCheckMagic() {
    this._magic = this._reader.readU4()
    if (this._magic !== 0xcafebabe) throw new Error('java.lang.ClassFormatError: magic')
  }

  private readAndCheckVersion() {
    this._minorVersion = this._reader.readU2()
    this._majorVersion = this._reader.readU2()
    if (this._majorVersion === 45) return
    if ([46, 47, 48, 49, 50, 51, 52].includes(this._majorVersion) && this._minorVersion === 0)
      return
    throw new Error(
      `java.lang.UnsupportedClassVersionError: major ${this._majorVersion} minor ${this._minorVersion}`
    )
  }

  get minorVersion(): u2 {
    return this._minorVersion
  }

  get majorVersion(): u2 {
    return this._majorVersion
  }

  get constantPool(): ConstantPool {
    return this._constantPool
  }

  get accessFlags(): u2 {
    return this._accessFlags
  }

  get className(): string {
    return this._constantPool.getClassName(this._thisClass)
  }

  get superClassName(): string {
    if (this._superClass > 0) return this._constantPool.getClassName(this._superClass)
    return ''
  }

  get interfaceNames(): string[] {
    return this._interfaces.map((idx) => this._constantPool.getClassName(idx))
  }

  get fields(): MemberInfo[] {
    return this._fields.slice()
  }

  get methods(): MemberInfo[] {
    return this._methods.slice()
  }

  findAttribute(pred: (attr: AttributeInfo) => boolean): AttributeInfo {
    return this._attributes.find(pred)
  }

  toString(): string {
    return `
magic: ${this._magic}
minor version: ${this._minorVersion}
major version: ${this._majorVersion}

constant pool:
${this._constantPool.toString()}

access flags: ${accessFlagsToString(this._accessFlags)}
this class: {${this._thisClass}}${this.className}
super class: {${this._superClass}}${this.superClassName}

interfaces:
${this._interfaces.map((iface, idx) => `{${iface}}${this.interfaceNames[idx]}`).join('\n')}

fields:
${this._fields.map((f) => f.toString()).join('\n')}

methods:
${this._methods.map((m) => m.toString()).join('\n')}

attributes:
${this._attributes.map((a) => a.toString()).join('\n')}
`
  }
}
