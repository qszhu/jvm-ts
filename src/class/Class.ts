import SourceFileAttribute from '../classFile/attributeInfo/SourceFileAttribute'
import ClassFile from '../classFile/ClassFile'
import Slots from '../thread/Slots'
import AccessFlags from './AccessFlags'
import ClassLoader, { primitiveTypes } from './ClassLoader'
import Field from './member/Field'
import Method from './member/Method'
import ArrayObject from './object/ArrayObject'
import BaseObject from './object/BaseObject'
import InstanceObject from './object/InstanceObject'
import {
  DoubleConstant,
  FloatConstant,
  IntegerConstant,
  LongConstant,
  StringConstant,
} from './RuntimeConstant'
import RuntimeConstantPool from './RuntimeContantPool'
import { jString } from './StringPool'

function getArrayClassName(name: string): string {
  return `[${toDescriptor(name)}`
}

function toDescriptor(name: string): string {
  if (name.startsWith('[')) return name
  if (primitiveTypes.has(name)) return primitiveTypes.get(name)
  return `L${name};`
}

function getComponentClassName(name: string): string {
  if (name.startsWith('[')) {
    const componentTypeDescriptor = name.substring(1)
    return toClassName(componentTypeDescriptor)
  }
  throw new Error(`Not array: ${name}`)
}

function toClassName(descriptor: string): string {
  if (descriptor.startsWith('[')) return descriptor
  if (descriptor.startsWith('L')) return descriptor.substring(1, descriptor.length - 1)
  for (const [className, d] of primitiveTypes.entries()) {
    if (d === descriptor) return className
  }
  throw new Error(`Invalid descriptor: ${descriptor}`)
}

function getSourceFile(cf: ClassFile): string {
  const sfAttr = cf.findAttribute((attr) => attr instanceof SourceFileAttribute)
  if (sfAttr) return (sfAttr as SourceFileAttribute).fileName
  return 'Unknown'
}

export default class Class {
  private _accessFlags: AccessFlags
  private _name: string
  private _superClassName: string
  private _interfaceNames: string[]
  private _constantPool: RuntimeConstantPool
  private _fields: Field[] = []
  private _methods: Method[] = []
  private _loader: ClassLoader
  private _superClass: Class
  private _interfaces: Class[]
  private _instanceSlotCount: number
  private _staticSlotCount = 0
  private _staticVars: Slots = new Slots(0)
  private _initStarted: boolean
  private _jClass: BaseObject
  private _sourceFile: string

  static newClass(cf: ClassFile): Class {
    const klass = new Class()
    klass._accessFlags = new AccessFlags(cf.accessFlags)
    klass._name = cf.className
    klass._superClassName = cf.superClassName
    klass._interfaceNames = cf.interfaceNames
    klass._constantPool = new RuntimeConstantPool(klass, cf.constantPool)
    klass._fields = Field.newFields(klass, cf.fields)
    klass._methods = Method.newMethods(klass, cf.methods)
    klass._initStarted = false
    klass._sourceFile = getSourceFile(cf)
    return klass
  }

  static newArrayClass(name: string, loader: ClassLoader): Class {
    const klass = new Class()
    klass._accessFlags = new AccessFlags()
    klass._name = name
    klass._loader = loader
    klass._initStarted = true
    klass._superClass = loader.loadClass('java/lang/Object')
    klass._interfaces = [
      loader.loadClass('java/lang/Cloneable'),
      loader.loadClass('java/io/Serializable'),
    ]
    return klass
  }

  static newPrimitiveClass(className: string, loader: ClassLoader, jClass: BaseObject): Class {
    const klass = new Class()
    klass._accessFlags = new AccessFlags()
    klass._name = className
    klass._loader = loader
    klass._initStarted = true

    klass._jClass = jClass
    klass._jClass.extra = klass
    return klass
  }

  get accessFlags(): AccessFlags {
    return this._accessFlags
  }

  get name(): string {
    return this._name
  }

  get constantPool(): RuntimeConstantPool {
    return this._constantPool
  }

  set loader(loader: ClassLoader) {
    this._loader = loader
  }

  get loader(): ClassLoader {
    return this._loader
  }

  get superClass(): Class {
    return this._superClass
  }

  get instanceSlotCount(): number {
    return this._instanceSlotCount
  }

  get staticVars(): Slots {
    return this._staticVars
  }

  get fields(): Field[] {
    return this._fields
  }

  get hasInitStarted(): boolean {
    return this._initStarted
  }

  get jClass(): BaseObject {
    return this._jClass
  }

  set jClass(klass: BaseObject) {
    this._jClass = klass
  }

  get sourceFile(): string {
    return this._sourceFile
  }

  get javaName(): string {
    return this._name.replace(/\//g, '.')
  }

  startInit(): void {
    this._initStarted = true
  }

  isAccessibleTo(other: Class): boolean {
    return this.accessFlags.isPublic || this.packageName === other.packageName
  }

  isAssignableFrom(other: Class): boolean {
    const [s, t] = [other, this]
    if (s === t) return true
    if (!s.isArray) {
      if (!s.accessFlags.isInterface)
        return t.accessFlags.isInterface ? s.implements(t) : s.isSubClassOf(t)
      else return t.accessFlags.isInterface ? t.isSuperInterfaceOf(s) : t.isJlObject
    } else {
      if (!t.isArray)
        return t.accessFlags.isInterface ? t.isJlCloneable || t.isJioSerializable : t.isJlObject
      else {
        const [sc, tc] = [s.componentClass, t.componentClass]
        return sc === tc || tc.isAssignableFrom(sc)
      }
    }
  }

  get isJlObject(): boolean {
    return this._name === 'java/lang/Object'
  }

  get isJlCloneable(): boolean {
    return this._name === 'java/lang/Cloneable'
  }

  get isJioSerializable(): boolean {
    return this._name === 'java/io/Serializable'
  }

  isSubClassOf(other: Class): boolean {
    for (let c = this._superClass; c; c = c._superClass) {
      if (c === other) return true
    }
    return false
  }

  isSuperClassOf(other: Class): boolean {
    return other.isSubClassOf(this)
  }

  isSubInterfaceOf(iface: Class): boolean {
    for (const superInterface of this._interfaces) {
      if (superInterface === iface || superInterface.isSubInterfaceOf(iface)) return true
    }
    return false
  }

  isSuperInterfaceOf(iface: Class): boolean {
    return iface.isSubInterfaceOf(this)
  }

  implements(iface: Class): boolean {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let c: Class = this
    for (; c; c = c._superClass) {
      for (const i of c._interfaces) {
        if (i === iface || i.isSubInterfaceOf(iface)) return true
      }
    }
    return false
  }

  get packageName(): string {
    const p = this._name.lastIndexOf('/')
    if (p === -1) return ''
    return this._name.substring(0, p)
  }

  get mainMethod(): Method {
    return Class.getMethod(this, 'main', '([Ljava/lang/String;)V', true)
  }

  get clinitMethod(): Method {
    return Class.getMethod(this, '<clinit>', '()V', true)
  }

  static getMethod(klass: Class, name: string, descriptor: string, isStatic: boolean): Method {
    for (let c = klass; c; c = c.superClass) {
      for (const method of c._methods) {
        if (
          method.name === name &&
          method.descriptor === descriptor &&
          method.accessFlags.isStatic === isStatic
        )
          return method
      }
    }
  }

  static getField(klass: Class, name: string, descriptor: string, isStatic: boolean): Field {
    for (let c = klass; c; c = c.superClass) {
      for (const field of c._fields) {
        if (
          field.name === name &&
          field.descriptor === descriptor &&
          field.accessFlags.isStatic === isStatic
        )
          return field
      }
    }
  }

  newObject(): InstanceObject {
    return new InstanceObject(this)
  }

  get isArray(): boolean {
    return this._name.startsWith('[')
  }

  newArray(count: number): ArrayObject {
    if (!this.isArray) throw new Error(`Not array class: ${this.name}`)
    switch (this.name) {
      case '[Z':
      case '[B':
      case '[C':
      case '[S':
      case '[I':
      case '[F':
      case '[D':
        return new ArrayObject(this, new Array<number>(count).fill(0))
      case '[J':
        return new ArrayObject(this, new Array<bigint>(count).fill(BigInt(0)))
      default:
        return new ArrayObject(this, new Array<BaseObject>(count).fill(null))
    }
  }

  get arrayClass(): Class {
    const arrayClassName = getArrayClassName(this._name)
    return this._loader.loadClass(arrayClassName)
  }

  get componentClass(): Class {
    const componentClassName = getComponentClassName(this._name)
    return this._loader.loadClass(componentClassName)
  }

  get isPrimitive(): boolean {
    return primitiveTypes.has(this.name)
  }

  getInstanceMethod(name: string, descriptor: string): Method {
    return Class.getMethod(this, name, descriptor, false)
  }

  getStaticMethod(name: string, descriptor: string): Method {
    return Class.getMethod(this, name, descriptor, true)
  }

  getRefVar(fieldName: string, fieldDescriptor: string): BaseObject {
    const field = Class.getField(this, fieldName, fieldDescriptor, true)
    return this._staticVars.getRef(field.slotId)
  }

  setRefVar(fieldName: string, fieldDescriptor: string, ref: BaseObject): void {
    const field = Class.getField(this, fieldName, fieldDescriptor, true)
    this._staticVars.setRef(field.slotId, ref)
  }

  static parse(data: Buffer): Class {
    const cf = new ClassFile(data)
    return Class.newClass(cf)
  }

  resolveSuperClass(): void {
    if (this._name !== 'java/lang/Object') {
      this._superClass = this._loader.loadClass(this._superClassName)
    }
  }

  resolveInterfaces(): void {
    this._interfaces = this._interfaceNames.map((ifaceName) => this._loader.loadClass(ifaceName))
  }

  link(): void {
    this.verify()
    this.prepare()
  }

  private verify(): void {
    //
  }

  private prepare(): void {
    this.calcInstanceFieldSlotIds()
    this.calcStaticFieldSlotIds()
    this.allocAndInitStaticVars()
  }

  private calcInstanceFieldSlotIds(): void {
    let slotId = 0
    if (this._superClass) slotId = this._superClass._instanceSlotCount
    for (const field of this._fields) {
      if (field.accessFlags.isStatic) continue
      field.slotId = slotId++
      if (field.isLongOrDouble) slotId++
    }
    this._instanceSlotCount = slotId
  }

  private calcStaticFieldSlotIds(): void {
    let slotId = 0
    for (const field of this._fields) {
      if (!field.accessFlags.isStatic) continue
      field.slotId = slotId++
      if (field.isLongOrDouble) slotId++
    }
    this._staticSlotCount = slotId
  }

  private allocAndInitStaticVars() {
    this._staticVars = new Slots(this._staticSlotCount)
    for (const field of this._fields) {
      if (field.accessFlags.isStatic && field.accessFlags.isFinal) {
        this.initStaticFinalVar(field)
      }
    }
  }

  private initStaticFinalVar(field: Field) {
    const cpIdx = field.constValueIndex
    if (!cpIdx) return

    const cp = this._constantPool
    const aConst = cp.getConstant(cpIdx)

    const sVars = this._staticVars
    const slotId = field.slotId
    switch (field.descriptor) {
      case 'Z':
      case 'B':
      case 'C':
      case 'S':
      case 'I':
        sVars.setInt(slotId, (aConst as IntegerConstant).data)
        break
      case 'J':
        sVars.setLong(slotId, (aConst as LongConstant).data)
        break
      case 'F':
        sVars.setFloat(slotId, (aConst as FloatConstant).data)
        break
      case 'D':
        sVars.setDouble(slotId, (aConst as DoubleConstant).data)
        break
      case 'Ljava/lang/String;':
        const str = (aConst as StringConstant).data
        const jStr = jString(this.loader, str)
        sVars.setRef(slotId, jStr)
        break
    }
  }

  lookupField(name: string, descriptor: string): Field {
    for (const field of this._fields) {
      if (field.name === name && field.descriptor === descriptor) return field
    }
    for (const iface of this._interfaces) {
      const field = iface.lookupField(name, descriptor)
      if (field) return field
    }
    if (this._superClass) return this._superClass.lookupField(name, descriptor)
  }

  lookupMethod(name: string, descriptor: string): Method {
    let method = Class.lookupMethodInClass(this, name, descriptor)
    if (!method) method = Class.lookupMethodInInterfaces(this._interfaces, name, descriptor)
    return method
  }

  lookupInterfaceMethod(name: string, descriptor: string): Method {
    for (const method of this._methods) {
      if (method.name === name && method.descriptor === descriptor) return method
    }
    return Class.lookupMethodInInterfaces(this._interfaces, name, descriptor)
  }

  static lookupMethodInClass(klass: Class, name: string, descriptor: string): Method {
    for (let c = klass; c; c = c._superClass) {
      for (const method of c._methods) {
        if (method.name === name && method.descriptor === descriptor) return method
      }
    }
  }

  static lookupMethodInInterfaces(ifaces: Class[], name: string, descriptor: string): Method {
    for (const iface of ifaces) {
      for (const method of iface._methods) {
        if (method.name === name && method.descriptor === descriptor) return method
      }
      const method = Class.lookupMethodInInterfaces(iface._interfaces, name, descriptor)
      if (method) return method
    }
  }

  toString(): string {
    return `${this._accessFlags.toString()} ${this._name}`
  }
}
