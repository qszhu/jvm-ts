import ClassFile from '../classFile'
import BaseConstantMemberRefInfo from '../classFile/constantInfo/BaseConstantMemberRefInfo'
import ConstantClassInfo from '../classFile/constantInfo/ConstantClassInfo'
import ConstantDoubleInfo from '../classFile/constantInfo/ConstantDoubleInfo'
import ConstantFieldRefInfo from '../classFile/constantInfo/ConstantFieldRefInfo'
import ConstantFloatInfo from '../classFile/constantInfo/ConstantFloatInfo'
import ConstantIntegerInfo from '../classFile/constantInfo/ConstantIntegerInfo'
import ConstantInterfaceMethodRefInfo from '../classFile/constantInfo/ConstantInterfaceMethodRefInfo'
import ConstantLongInfo from '../classFile/constantInfo/ConstantLongInfo'
import ConstantMethodRefInfo from '../classFile/constantInfo/ConstantMethodRefInfo'
import ConstantStringInfo from '../classFile/constantInfo/ConstantStringInfo'
import ConstantPool from '../classFile/ConstantPool'
import { Slots } from '../thread/Slots'
import AccessFlag from './AccessFlag'
import ClassLoader from './ClassLoader'
import Field from './ClassMember/Field'
import Method from './ClassMember/Method'
import Obj from './Obj'

abstract class SymRef {
  protected _cp: RuntimeConstantPool
  protected _className: string
  protected _class: Class

  constructor(cp: RuntimeConstantPool) {
    this._cp = cp
  }

  get resolvedClass(): Class {
    if (!this._class) this.resolveClassRef()
    return this._class
  }

  private resolveClassRef(): void {
    const d = this._cp.class
    const c = d.loader.loadClass(this._className)
    if (!c.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')
    this._class = c
  }
}

class ClassRef extends SymRef {
  constructor(cp: RuntimeConstantPool, classInfo: ConstantClassInfo) {
    super(cp)
    this._className = classInfo.name
  }
}

abstract class MemberRef extends SymRef {
  protected _name: string
  protected _descriptor: string

  constructor(cp: RuntimeConstantPool, refInfo: BaseConstantMemberRefInfo) {
    super(cp)
    this._className = refInfo.className
    ;[this._name, this._descriptor] = refInfo.nameAndDescriptor
  }

  get name(): string {
    return this._name
  }

  get descriptor(): string {
    return this._descriptor
  }
}

class FieldRef extends MemberRef {
  private _field: Field

  constructor(cp: RuntimeConstantPool, refInfo: ConstantFieldRefInfo) {
    super(cp, refInfo)
  }

  get resolvedField(): Field {
    if (!this._field) this.resolveFieldRef()
    return this._field
  }

  private resolveFieldRef(): void {
    const d = this._cp.class
    const c = this.resolvedClass
    const field = c.lookupField(this.name, this.descriptor)
    if (!field) throw new Error('java.lang.NoSuchFieldError')
    if (!field.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')
    this._field = field
  }
}

class MethodRef extends MemberRef {
  private _method: Method

  constructor(cp: RuntimeConstantPool, refInfo: ConstantMethodRefInfo) {
    super(cp, refInfo)
  }

  get resolvedMethod(): Method {
    if (!this._method) this.resolveMethodRef()
    return this._method
  }

  private resolveMethodRef(): void {
    const c = this.resolvedClass
    if (c.isInterface) throw new Error('java.lang.IncompatibleClassChangeError')

    const method = c.lookupMethod(this._name, this._descriptor)
    if (!method) throw new Error('java.lang.NoSuchmethodError')

    const d = this._cp.class
    if (!method.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')

    this._method = method
  }
}

class InterfaceMethodRef extends MemberRef {
  private _method: Method

  constructor(cp: RuntimeConstantPool, refInfo: ConstantInterfaceMethodRefInfo) {
    super(cp, refInfo)
  }

  get resolvedInterfaceMethod(): Method {
    if (!this._method) this.resolveInterfaceMethodRef()
    return this._method
  }

  private resolveInterfaceMethodRef(): void {
    const c = this.resolvedClass
    if (!c.isInterface) throw new Error('java.lang.IncompatibleClassChangeError')

    const method = c.lookupInterfaceMethod(this._name, this._descriptor)
    if (!method) throw new Error('java.lang.NoSuchmethodError')

    const d = this._cp.class
    if (!method.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')

    this._method = method
  }
}

abstract class Constant<T> {
  constructor(private _data: T) {}

  get data(): T {
    return this._data
  }
}

export class IntegerConstant extends Constant<number> {}

export class FloatConstant extends Constant<number> {}

export class LongConstant extends Constant<bigint> {}

export class DoubleConstant extends Constant<number> {}

export class StringConstant extends Constant<string> {}

export class ClassConstant extends Constant<ClassRef> {}

export class FieldRefConstant extends Constant<FieldRef> {}

export class MethodRefConstant extends Constant<MethodRef> {}

export class InterfaceMethodRefConstant extends Constant<InterfaceMethodRef> {}

type RuntimeConstant = Constant<number | bigint | string | SymRef>

export class RuntimeConstantPool {
  private _class: Class
  private _consts: RuntimeConstant[]

  constructor(klass: Class, cp: ConstantPool) {
    this._class = klass
    this._consts = new Array(cp.size).fill(null)
    for (let i = 1; i < this._consts.length; i++) {
      const cpInfo = cp.getConstantInfo(i)
      if (cpInfo instanceof ConstantIntegerInfo) this._consts[i] = new IntegerConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantFloatInfo) this._consts[i] = new FloatConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantLongInfo) this._consts[i++] = new LongConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantDoubleInfo)
        this._consts[i++] = new DoubleConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantStringInfo)
        this._consts[i] = new StringConstant(cpInfo.string)
      else if (cpInfo instanceof ConstantClassInfo)
        this._consts[i] = new ClassConstant(new ClassRef(this, cpInfo))
      else if (cpInfo instanceof ConstantFieldRefInfo)
        this._consts[i] = new FieldRefConstant(new FieldRef(this, cpInfo))
      else if (cpInfo instanceof ConstantMethodRefInfo)
        this._consts[i] = new MethodRefConstant(new MethodRef(this, cpInfo))
      else if (cpInfo instanceof ConstantInterfaceMethodRefInfo)
        this._consts[i] = new InterfaceMethodRefConstant(new InterfaceMethodRef(this, cpInfo))
    }
  }

  get class(): Class {
    return this._class
  }

  getConstant(idx: number): RuntimeConstant {
    const res = this._consts[idx]
    if (res) return res
    throw new Error(`No constants at index ${idx}`)
  }
}

const primitiveTypes = new Map<string, string>([
  ['void', 'V'],
  ['boolean', 'Z'],
  ['byte', 'B'],
  ['short', 'S'],
  ['int', 'I'],
  ['long', 'J'],
  ['char', 'C'],
  ['float', 'F'],
  ['double', 'D']
])

function getArrayClassName(name: string): string {
  return `[${toDescriptor(name)}`
}

function toDescriptor(name: string): string {
  if (name.startsWith('[')) return name
  if (primitiveTypes.has(name)) return primitiveTypes.get(name)
  return `L${name};`
}

export default class Class {
  private _accessFlags: number
  private _name: string
  private _superClassName: string
  private _interfaceNames: string[]
  private _constantPool: RuntimeConstantPool
  private _fields: Field[]
  private _methods: Method[]
  private _loader: ClassLoader
  private _superClass: Class
  private _interfaces: Class[]
  private _instanceSlotCount: number
  private _staticSlotCount: number
  private _staticVars: Slots
  private _initStarted: boolean

  static newClass(cf: ClassFile): Class {
    const klass = new Class()
    klass._accessFlags = cf.accessFlags
    klass._name = cf.className
    klass._superClassName = cf.superClassName
    klass._interfaceNames = cf.interfaceNames
    klass._constantPool = new RuntimeConstantPool(klass, cf.constantPool)
    klass._fields = Field.newFields(klass, cf.fields)
    klass._methods = Method.newMethods(klass, cf.methods)
    klass._initStarted = false
    return klass
  }

  static newArrayClass(name: string, loader: ClassLoader): Class {
    const klass = new Class()
    klass._accessFlags = AccessFlag.PUBLIC
    klass._name = name
    klass._loader = loader
    klass._initStarted = true
    klass._superClass = loader.loadClass('java/lang/Object')
    klass._interfaces = [
      loader.loadClass('java/lang/Cloneable'),
      loader.loadClass('java/io/Serializable')
    ]
    return klass
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

  get hasInitStarted(): boolean {
    return this._initStarted
  }

  startInit(): void {
    this._initStarted = true
  }

  private hasAccessFlag(f: AccessFlag) {
    return (this._accessFlags & f) !== 0
  }

  get isPublic(): boolean {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  get isFinal(): boolean {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  get isSuper(): boolean {
    return this.hasAccessFlag(AccessFlag.SUPER)
  }

  get isInterface(): boolean {
    return this.hasAccessFlag(AccessFlag.INTERFACE)
  }

  get isAbstract(): boolean {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  get isSynthetic(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  get isAnnotation(): boolean {
    return this.hasAccessFlag(AccessFlag.ANNOTATION)
  }

  get isEnum(): boolean {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }

  isAccessibleTo(other: Class): boolean {
    return this.isPublic || this.packageName === other.packageName
  }

  isAssignableFrom(other: Class): boolean {
    const [s, t] = [other, this]
    if (s === t) return true
    if (t.isInterface) return s.isSubClassOf(t)
    return s.implements(t)
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
    return this.getStaticMethod('main', '([Ljava/lang/String;)V')
  }

  get clinitMethod(): Method {
    return this.getStaticMethod('<clinit>', '()V')
  }

  private getStaticMethod(name: string, descriptor: string): Method {
    for (const method of this._methods) {
      if (method.isStatic && method.name === name && method.descriptor === descriptor) return method
    }
  }

  newObject(): Obj {
    return Obj.newObject(this)
  }

  get isArray(): boolean {
    return this._name.startsWith('[')
  }

  newArray(count: number): Obj {
    if (!this.isArray) throw new Error(`Not array class: ${this.name}`)
    switch (this.name) {
      case '[Z':
      case '[B':
      case '[C':
      case '[S':
      case '[I':
      case '[F':
      case '[D':
        return Obj.newArray(this, new Array<number>(count))
      case '[J':
        return Obj.newArray(this, new Array<bigint>(count))
      default:
        return Obj.newArray(this, new Array<Obj>(count))
    }
  }

  get arrayClass(): Class {
    const arrayClassName = getArrayClassName(this._name)
    return this._loader.loadClass(arrayClassName)
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
      if (field.isStatic) continue
      field.slotId = slotId++
      if (field.isLongOrDouble) slotId++
    }
    this._instanceSlotCount = slotId
  }

  private calcStaticFieldSlotIds(): void {
    let slotId = 0
    for (const field of this._fields) {
      if (!field.isStatic) continue
      field.slotId = slotId++
      if (field.isLongOrDouble) slotId++
    }
    this._staticSlotCount = slotId
  }

  private allocAndInitStaticVars() {
    this._staticVars = new Slots(this._staticSlotCount)
    for (const field of this._fields) {
      if (field.isStatic && field.isFinal) {
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
        throw new Error('string const not implemented')
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
}