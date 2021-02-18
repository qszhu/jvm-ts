import ClassFile from '../classFile'
import cfConstantPool from '../classFile/ConstantPool'
import MemberInfo from '../classFile/memberInfo'

enum AccessFlag {
  PUBLIC = 0x0001,
  PRIVATE = 0x0002,
  PROTECTED = 0x0004,
  STATIC = 0x0008,
  FINAL = 0x0010,
  SUPER = 0x0020,
  SYNCHRONIZED = 0x0020,
  VOLATILE = 0x0040,
  BRIDGE = 0x0040,
  TRANSIENT = 0x0080,
  VARARGS = 0x0080,
  NATIVE = 0x0100,
  INTERFACE = 0x0200,
  ABSTRACT = 0x0400,
  STRICT = 0x0800,
  SYNTHETIC = 0x1000,
  ANNOTATION = 0x2000,
  ENUM = 0x4000,
}

abstract class ClassMember {
  protected _accessFlags: number
  protected _name: string
  protected _descriptor: string

  constructor(private _class: Class, memberInfo: MemberInfo) {
    this._accessFlags = memberInfo.accessFlags
    this._name = memberInfo.name
    this._descriptor = memberInfo.descriptor
  }

  protected hasAccessFlag(f: AccessFlag) {
    return (this._accessFlags & f) !== 0
  }
}

class Field extends ClassMember {
  static newFields(cls: Class, fields: MemberInfo[]) {
    const res = new Array(fields.length).fill(null)
    for (let i = 0; i < res.length; i++) {
      res[i] = new Field(cls, fields[i])
    }
    return res
  }

  isPublic() {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  isPrivate() {
    return this.hasAccessFlag(AccessFlag.PRIVATE)
  }

  isProtected() {
    return this.hasAccessFlag(AccessFlag.PROTECTED)
  }

  isStatic() {
    return this.hasAccessFlag(AccessFlag.STATIC)
  }

  isFinal() {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  isVolatile() {
    return this.hasAccessFlag(AccessFlag.VOLATILE)
  }

  isTransient() {
    return this.hasAccessFlag(AccessFlag.TRANSIENT)
  }

  isSynthetic() {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  isEnum() {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }
}

class Method extends ClassMember {
  private _maxStack: number
  private _maxLocals: number
  private _code: Buffer

  constructor(cls: Class, method: MemberInfo) {
    super(cls, method)
    if (method.codeAttribute) {
      const codeAttr = method.codeAttribute
      this._maxStack = codeAttr.maxStack
      this._maxLocals = codeAttr.maxLocals
      this._code = codeAttr.code
    }
  }

  static newMethods(cls: Class, methods: MemberInfo[]) {
    const res = new Array(methods.length).fill(null)
    for (let i = 0; i < res.length; i++) {
      res[i] = new Method(cls, methods[i])
    }
    return res
  }

  isPublic() {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  isPrivate() {
    return this.hasAccessFlag(AccessFlag.PRIVATE)
  }

  isProtected() {
    return this.hasAccessFlag(AccessFlag.PROTECTED)
  }

  isStatic() {
    return this.hasAccessFlag(AccessFlag.STATIC)
  }

  isFinal() {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  isSynchronized() {
    return this.hasAccessFlag(AccessFlag.SYNCHRONIZED)
  }

  isBridge() {
    return this.hasAccessFlag(AccessFlag.BRIDGE)
  }

  isVarArgs() {
    return this.hasAccessFlag(AccessFlag.VARARGS)
  }

  isNative() {
    return this.hasAccessFlag(AccessFlag.NATIVE)
  }

  isAbstract() {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  isStrict() {
    return this.hasAccessFlag(AccessFlag.STRICT)
  }

  isSynthetic() {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }
}

class Constant {}

class ConstantPool {
  private _consts: Constant[]

  constructor(private _class: Class, cp: cfConstantPool) {}
}

class ClassLoader {}

class Slots {}

class Class {
  private _accessFlags: number
  private _name: string
  private _superClassName: string
  private _interfaceNames: string[]
  private _constantPool: ConstantPool
  private _fields: Field[]
  private _methods: Method[]
  private _loader: ClassLoader
  private _superClass: Class
  private _interfaces: Class[]
  private _instanceSlotCount: number
  private _staticSlotCount: number
  private _staticVars: Slots

  constructor(cf: ClassFile) {
    this._accessFlags = cf.accessFlags
    this._name = cf.className
    this._superClassName = cf.superClassName
    this._interfaceNames = cf.interfaceNames
    this._constantPool = new ConstantPool(this, cf.constantPool)
    this._fields = Field.newFields(this, cf.fields)
    this._methods = Method.newMethods(this, cf.methods)
  }

  private hasAccessFlag(f: AccessFlag) {
    return (this._accessFlags & f) !== 0
  }

  isPublic() {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  isFinal() {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  isSuper() {
    return this.hasAccessFlag(AccessFlag.SUPER)
  }

  isInterface() {
    return this.hasAccessFlag(AccessFlag.INTERFACE)
  }

  isAbstract() {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  isSynthetic() {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  isAnnotation() {
    return this.hasAccessFlag(AccessFlag.ANNOTATION)
  }

  isEnum() {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }
}
