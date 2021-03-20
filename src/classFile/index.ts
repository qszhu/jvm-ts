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
    return this._fields
  }

  get methods(): MemberInfo[] {
    return this._methods
  }

  constructor(data: Buffer) {
    this._reader = new ClassReader(data)

    this.readAndCheckMagic()
    this.readAndCheckVersion()

    this._constantPool = new ConstantPool()
    this._constantPool.readFrom(this._reader)

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

  toString(): string {
    const res: string[] = []
    res.push(`magic: ${this._magic}`)
    res.push(`minor version: ${this.minorVersion}`)
    res.push(`major version: ${this.majorVersion}`)
    res.push('constant pool:')
    res.push(this.constantPool.toString())
    res.push(`access flags: ${this.accessFlags}`)
    res.push(`this class: {${this._thisClass}}${this.className}`)
    res.push(`super class: {${this._superClass}}${this.superClassName}`)
    res.push('interfaces:')
    for (let i = 0; i < this.interfaceNames.length; i++) {
      res.push(`{${this._interfaces[i]}}${this.interfaceNames[i]}`)
    }
    res.push('fields:')
    for (const field of this.fields) {
      res.push(field.toString())
    }
    res.push('methods:')
    for (const method of this.methods) {
      res.push(method.toString())
    }
    res.push('attributes:')
    return res.join('\n')
  }
}
