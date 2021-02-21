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
import cfConstantPool from '../classFile/ConstantPool'
import MemberInfo from '../classFile/memberInfo'
import ClassPath from '../classPath'
import { Slots } from '../thread/Slots'

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

  get class(): Class {
    return this._class
  }

  get name(): string {
    return this._name
  }

  get descriptor(): string {
    return this._descriptor
  }

  constructor(protected _class: Class, memberInfo: MemberInfo) {
    this._accessFlags = memberInfo.accessFlags
    this._name = memberInfo.name
    this._descriptor = memberInfo.descriptor
  }

  protected hasAccessFlag(f: AccessFlag) {
    return (this._accessFlags & f) !== 0
  }
}

class Field extends ClassMember {
  private _constValueIndex: number
  private _slotId: number

  constructor(private cls: Class, field: MemberInfo) {
    super(cls, field)
    const valAttr = field.constantValueAttribute
    if (valAttr) this._constValueIndex = valAttr.constantValueIndex
  }

  static newFields(cls: Class, fields: MemberInfo[]) {
    const res = new Array(fields.length).fill(null)
    for (let i = 0; i < res.length; i++) {
      res[i] = new Field(cls, fields[i])
    }
    return res
  }

  get constValueIndex(): number {
    return this._constValueIndex
  }

  set slotId(id: number) {
    this._slotId = id
  }

  get slotId(): number {
    return this._slotId
  }

  get isPublic() {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  get isPrivate() {
    return this.hasAccessFlag(AccessFlag.PRIVATE)
  }

  get isProtected() {
    return this.hasAccessFlag(AccessFlag.PROTECTED)
  }

  get isStatic() {
    return this.hasAccessFlag(AccessFlag.STATIC)
  }

  get isFinal() {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  get isVolatile() {
    return this.hasAccessFlag(AccessFlag.VOLATILE)
  }

  get isTransient() {
    return this.hasAccessFlag(AccessFlag.TRANSIENT)
  }

  get isSynthetic() {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  get isEnum() {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }

  get isLongOrDouble() {
    return this._descriptor === 'J' || this._descriptor === 'D'
  }

  isAccessibleTo(d: Class) {
    if (this.isPublic) return true
    const c = this._class
    if (this.isProtected) return d === c || d.isSubClassOf(c) || c.packageName == d.packageName
    if (!this.isPrivate) return c.packageName === d.packageName
    return d === c
  }
}

export class Method extends ClassMember {
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

  static newMethods(cls: Class, methods: MemberInfo[]): Method[] {
    const res = new Array(methods.length).fill(null)
    for (let i = 0; i < res.length; i++) {
      res[i] = new Method(cls, methods[i])
    }
    return res
  }

  get isPublic(): boolean {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  get isPrivate(): boolean {
    return this.hasAccessFlag(AccessFlag.PRIVATE)
  }

  get isProtected(): boolean {
    return this.hasAccessFlag(AccessFlag.PROTECTED)
  }

  get isStatic(): boolean {
    return this.hasAccessFlag(AccessFlag.STATIC)
  }

  get isFinal(): boolean {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  get isSynchronized(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNCHRONIZED)
  }

  get isBridge(): boolean {
    return this.hasAccessFlag(AccessFlag.BRIDGE)
  }

  get isVarArgs(): boolean {
    return this.hasAccessFlag(AccessFlag.VARARGS)
  }

  get isNative(): boolean {
    return this.hasAccessFlag(AccessFlag.NATIVE)
  }

  get isAbstract(): boolean {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  get isStrict(): boolean {
    return this.hasAccessFlag(AccessFlag.STRICT)
  }

  get isSynthetic(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }
}

class SymRef {
  protected _cp: ConstantPool
  protected _className: string
  protected _class: Class

  get resolvedClass(): Class {
    if (!this._class) this.resolveClassRef()
    return this._class
  }

  resolveClassRef(): void {
    const d = this._cp.class
    const c = d.loader.loadClass(this._className)
    if (!c.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')
    this._class = c
  }
}

export class ClassRef extends SymRef {
  constructor(cp: ConstantPool, classInfo: ConstantClassInfo) {
    super()
    this._cp = cp
    this._className = classInfo.name
  }
}

class MemberRef extends SymRef {
  private _name: string
  private _descriptor: string

  get name() {
    return this._name
  }

  get descriptor() {
    return this._descriptor
  }

  constructor(cp: ConstantPool, refInfo: BaseConstantMemberRefInfo) {
    super()
    this._cp = cp
    this._className = refInfo.className
    ;[this._name, this._descriptor] = refInfo.nameAndDescriptor
  }
}

export class FieldRef extends MemberRef {
  private _field: Field

  constructor(cp: ConstantPool, refInfo: ConstantFieldRefInfo) {
    super(cp, refInfo)
  }

  get resolvedField(): Field {
    if (!this._field) this.resolveFieldRef()
    return this._field
  }

  resolveFieldRef(): void {
    const d = this._cp.class
    const c = this.resolvedClass
    const field = lookupField(c, this.name, this.descriptor)
    if (!field) throw new Error('java.lang.NoSuchFieldError')
    if (!field.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')
    this._field = field
  }
}

export class MethodRef extends MemberRef {
  private _method: Method

  constructor(cp: ConstantPool, refInfo: ConstantMethodRefInfo) {
    super(cp, refInfo)
  }
}

class InterfaceMethodRef extends MemberRef {
  private _method: Method

  constructor(cp: ConstantPool, refInfo: ConstantInterfaceMethodRefInfo) {
    super(cp, refInfo)
  }
}

class Constant {}

export class ConstantPool {
  private _consts: Constant[] // use ConstantInfo?

  constructor(private _class: Class, cp: cfConstantPool) {
    this._consts = new Array(cp.size).fill(null)
    for (let i = 0; i < this._consts.length; i++) {
      const cpInfo = cp.getConstantInfo(i)
      if (cpInfo instanceof ConstantIntegerInfo) this._consts[i] = cpInfo.val
      else if (cpInfo instanceof ConstantFloatInfo) this._consts[i] = cpInfo.val
      else if (cpInfo instanceof ConstantLongInfo) this._consts[i++] = cpInfo.val
      else if (cpInfo instanceof ConstantDoubleInfo) this._consts[i++] = cpInfo.val
      else if (cpInfo instanceof ConstantStringInfo) this._consts[i] = cpInfo.string
      else if (cpInfo instanceof ConstantClassInfo) this._consts[i] = new ClassRef(this, cpInfo)
      else if (cpInfo instanceof ConstantFieldRefInfo) this._consts[i] = new FieldRef(this, cpInfo)
      else if (cpInfo instanceof ConstantMethodRefInfo)
        this._consts[i] = new MethodRef(this, cpInfo)
      else if (cpInfo instanceof ConstantInterfaceMethodRefInfo)
        this._consts[i] = new InterfaceMethodRef(this, cpInfo)
    }
  }

  get class() {
    return this._class
  }

  getConstant(idx: number): Constant {
    const res = this._consts[idx]
    if (res) return res
    throw new Error(`No constants at index ${idx}`)
  }
}

class ClassLoader {
  private _classMap: Map<string, Class>

  constructor(private _cp: ClassPath) {
    this._classMap = new Map()
  }

  loadClass(name: string): Class {
    if (this._classMap.has(name)) return this._classMap.get(name)
    const res = this.loadNonArrayClass(name)
    return res
  }

  loadNonArrayClass(name: string): Class {
    const { data, entry } = this.readClass(name)
    const cls = this.defineClass(data)
    link(cls)
    console.log(`Loaded ${name} from ${entry}`)
    return cls
  }

  readClass(name: string) {
    const { data, entry } = this._cp.readClass(name)
    return { data, entry }
  }

  defineClass(data: Buffer) {
    const cls = parseClass(data)
    cls.loader = this
    resolveSuperClass(cls)
    resolveInterfaces(cls)
    this._classMap.set(cls.name, cls)
    return cls
  }
}

// ------ TODO: move to Class
function parseClass(data: Buffer): Class {
  const cf = new ClassFile(data)
  return new Class(cf)
}

function resolveSuperClass(cls: Class): void {
  if (cls.name !== 'java/lang/Object') {
    cls.superClass = cls.loader.loadClass(cls.superClassName)
  }
}

function resolveInterfaces(cls: Class): void {
  const interfaceCount = cls.interfaceNames.length
  const interfaces = new Array(interfaceCount).fill(null)
  for (let i = 0; i < cls.interfaceNames.length; i++) {
    interfaces[i] = cls.loader.loadClass(cls.interfaceNames[i])
  }
  cls.interfaces = interfaces
}

function link(cls: Class): void {
  verify(cls)
  prepare(cls)
}

function verify(cls: Class): void {
  //
}

function prepare(cls: Class): void {
  calcInstanceFieldSlotIds(cls)
  calcStaticFieldSlotIds(cls)
  allocAndInitStaticVars(cls)
}

function calcInstanceFieldSlotIds(cls: Class): void {
  let slotId = 0
  if (cls.superClass) slotId = cls.superClass.instanceSlotCount
  for (const field of cls.fields) {
    if (field.isStatic) continue
    field.slotId = slotId++
    if (field.isLongOrDouble) slotId++
  }
  cls.instanceSlotCount = slotId
}

function calcStaticFieldSlotIds(cls: Class): void {
  let slotId = 0
  for (const field of cls.fields) {
    if (!field.isStatic) continue
    field.slotId = slotId++
    if (field.isLongOrDouble) slotId++
  }
  cls.staticSlotCount = slotId
}

function allocAndInitStaticVars(cls: Class) {
  cls.staticVars = new Slots(cls.staticSlotCount)
  for (const field of cls.fields) {
    if (field.isStatic && field.isFinal) {
      initStaticFinalVar(cls, field)
    }
  }
}

function initStaticFinalVar(cls: Class, field: Field) {
  const cpIdx = field.constValueIndex
  if (cpIdx <= 0) return

  const cp = cls.constantPool
  const aConst = cp.getConstant(cpIdx)

  const sVars = cls.staticVars
  const slotId = field.slotId
  switch (field.descriptor) {
    case 'Z':
    case 'B':
    case 'C':
    case 'S':
    case 'I':
      sVars.setInt(slotId, (aConst as ConstantIntegerInfo).val)
      break
    case 'J':
      sVars.setLong(slotId, (aConst as ConstantLongInfo).val)
      break
    case 'F':
      sVars.setFloat(slotId, (aConst as ConstantFloatInfo).val)
      break
    case 'D':
      sVars.setDouble(slotId, (aConst as ConstantDoubleInfo).val)
      break
    case 'Ljava/lang/String;':
      throw new Error('string const not implemented')
  }
}

function lookupField(c: Class, name: string, descriptor: string): Field {
  for (const field of c.fields) {
    if (field.name === name && field.descriptor === descriptor) return field
  }
  for (const iface of c.interfaces) {
    const field = lookupField(iface, name, descriptor)
    if (field) return field
  }
  if (c.superClass) return lookupField(c.superClass, name, descriptor)
}
// ------

class Obj {
  private _fields: Slots

  constructor(private _class: Class) {
    this._fields = new Slots(_class.instanceSlotCount)
  }
}

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

  get name(): string {
    return this._name
  }

  get superClassName(): string {
    return this._superClassName
  }

  get interfaceNames(): string[] {
    return this._interfaceNames.slice()
  }

  get constantPool(): ConstantPool {
    return this._constantPool
  }

  get fields(): Field[] {
    return this._fields.slice()
  }

  set loader(loader: ClassLoader) {
    this._loader = loader
  }

  get loader(): ClassLoader {
    return this._loader
  }

  set superClass(cls: Class) {
    this._superClass = cls
  }

  set interfaces(interfaces: Class[]) {
    this._interfaces = interfaces
  }

  set instanceSlotCount(n: number) {
    this._instanceSlotCount = n
  }

  set staticSlotCount(n: number) {
    this._staticSlotCount = n
  }

  set staticVars(slots: Slots) {
    this._staticVars = slots
  }

  get staticVars(): Slots {
    return this._staticVars
  }

  private hasAccessFlag(f: AccessFlag) {
    return (this._accessFlags & f) !== 0
  }

  get isPublic() {
    return this.hasAccessFlag(AccessFlag.PUBLIC)
  }

  get isFinal() {
    return this.hasAccessFlag(AccessFlag.FINAL)
  }

  get isSuper() {
    return this.hasAccessFlag(AccessFlag.SUPER)
  }

  get isInterface() {
    return this.hasAccessFlag(AccessFlag.INTERFACE)
  }

  get isAbstract() {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  get isSynthetic() {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  get isAnnotation() {
    return this.hasAccessFlag(AccessFlag.ANNOTATION)
  }

  get isEnum() {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }

  isAccessibleTo(other: Class): boolean {
    return this.isPublic || this.packageName === other.packageName
  }

  get packageName(): string {
    const p = this.name.lastIndexOf('/')
    if (p === -1) return ''
    return this.name.substring(0, p)
  }

  newObject(): Obj {
    return new Obj(this)
  }
}
