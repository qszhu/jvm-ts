import AttributeInfoFactory from '../../classFile/attributeInfo/AttributeInfoFactory'
import SourceFileAttribute from '../../classFile/attributeInfo/SourceFileAttribute'
import ClassFile from '../../classFile/ClassFile'
import Slots from '../../thread/Slots'
import AccessFlags from '../AccessFlags'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import Field from '../member/Field'
import Method from '../member/Method'
import { JIO_SERIALIZABLE, JL_CLONEABLE, JL_OBJECT } from '../names'
import ArrayObject from '../object/ArrayObject'
import BaseObject from '../object/BaseObject'
import InstanceObject from '../object/InstanceObject'
import PrimitiveTypes from '../PrimitiveTypes'
import ClassHierarchy from './ClassHierarchy'
import ClassLoader from './ClassLoader'
import ClassReflection from './ClassReflection'

function getArrayClassName(name: string): string {
  return `[${toDescriptor(name)}`
}

function toDescriptor(name: string): string {
  if (name.startsWith('[')) return name
  if (PrimitiveTypes.has(name)) return PrimitiveTypes.getDescriptor(name)
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
  for (const className of PrimitiveTypes.names) {
    if (PrimitiveTypes.getDescriptor(className) === descriptor) return className
  }
  throw new Error(`Invalid descriptor: ${descriptor}`)
}

function getSourceFile(cf: ClassFile): string {
  const sfAttr = AttributeInfoFactory.getSourceFileAttribute(cf)
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
  private _instanceSlotCount = 0
  private _staticSlotCount = 0
  private _staticVars: Slots = new Slots(0)
  private _initStarted: boolean
  private _jClass: BaseObject
  private _sourceFile: string
  private _hierarchy: ClassHierarchy
  private _reflection: ClassReflection

  constructor() {
    this._hierarchy = new ClassHierarchy(this)
    this._reflection = new ClassReflection(this)
  }

  static newClass(cf: ClassFile, loader: ClassLoader): Class {
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

    klass._loader = loader
    if (!klass.isJlObject) {
      klass._superClass = loader.loadClass(klass._superClassName)
    }
    klass._interfaces = klass._interfaceNames.map((iface) => loader.loadClass(iface))
    return klass
  }

  static newArrayClass(name: string, loader: ClassLoader): Class {
    const klass = new Class()
    klass._accessFlags = new AccessFlags()
    klass._name = name
    klass._loader = loader
    klass._initStarted = true
    klass._superClass = loader.loadClass(JL_OBJECT)
    klass._interfaces = [loader.loadClass(JL_CLONEABLE), loader.loadClass(JIO_SERIALIZABLE)]
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

  get name(): string {
    return this._name
  }

  get constantPool(): RuntimeConstantPool {
    return this._constantPool
  }

  get fields(): Field[] {
    return this._fields
  }

  get methods(): Method[] {
    return this._methods
  }

  get loader(): ClassLoader {
    return this._loader
  }

  get superClass(): Class {
    return this._superClass
  }

  get interfaces(): Class[] {
    return this._interfaces.slice()
  }

  get instanceSlotCount(): number {
    return this._instanceSlotCount
  }

  set instanceSlotCount(c: number) {
    this._instanceSlotCount = c
  }

  get staticSlotCount(): number {
    return this._staticSlotCount
  }

  set staticSlotCount(c: number) {
    this._staticSlotCount = c
  }

  get staticVars(): Slots {
    return this._staticVars
  }

  set staticVars(slots: Slots) {
    this._staticVars = slots
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

  get isPublic(): boolean {
    return this._accessFlags.isPublic
  }

  get isInterface(): boolean {
    return this._accessFlags.isInterface
  }

  get isSuper(): boolean {
    return this._accessFlags.isSuper
  }

  get isAbstract(): boolean {
    return this._accessFlags.isAbstract
  }

  startInit(): void {
    this._initStarted = true
  }

  isAccessibleTo(other: Class): boolean {
    return this._hierarchy.isAccessibleTo(other)
  }

  isAssignableFrom(other: Class): boolean {
    return this._hierarchy.isAssignableFrom(other)
  }

  isSubClassOf(other: Class): boolean {
    return this._hierarchy.isSubClassOf(other)
  }

  isSuperClassOf(other: Class): boolean {
    return this._hierarchy.isSuperClassOf(other)
  }

  isSubInterfaceOf(iface: Class): boolean {
    return this._hierarchy.isSubInterfaceOf(iface)
  }

  isSuperInterfaceOf(iface: Class): boolean {
    return this._hierarchy.isSuperInterfaceOf(iface)
  }

  implements(iface: Class): boolean {
    return this._hierarchy.implements(iface)
  }

  get isJlObject(): boolean {
    return this._name === JL_OBJECT
  }

  get isJlCloneable(): boolean {
    return this._name === JL_CLONEABLE
  }

  get isJioSerializable(): boolean {
    return this._name === JIO_SERIALIZABLE
  }

  get packageName(): string {
    const p = this._name.lastIndexOf('/')
    if (p === -1) return ''
    return this._name.substring(0, p)
  }

  get mainMethod(): Method {
    return this._reflection.getStaticMethod('main', '([Ljava/lang/String;)V')
  }

  get clinitMethod(): Method {
    return this._reflection.getStaticMethod('<clinit>', '()V')
  }

  getStaticMethod(name: string, descriptor: string): Method {
    return this._reflection.getStaticMethod(name, descriptor)
  }

  getInstanceMethod(name: string, descriptor: string): Method {
    return this._reflection.getInstanceMethod(name, descriptor)
  }

  getStaticField(name: string, descriptor: string): Field {
    return this._reflection.getStaticField(name, descriptor)
  }

  getInstanceField(name: string, descriptor: string): Field {
    return this._reflection.getInstanceField(name, descriptor)
  }

  lookupField(name: string, descriptor: string): Field {
    return this._reflection.lookupField(name, descriptor)
  }

  lookupMethod(name: string, descriptor: string): Method {
    return this._reflection.lookupMethod(name, descriptor)
  }

  lookupInterfaceMethod(name: string, descriptor: string): Method {
    return this._reflection.lookupInterfaceMethod(name, descriptor)
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
    return PrimitiveTypes.has(this.name)
  }

  getRefVar(fieldName: string, fieldDescriptor: string): BaseObject {
    const field = this._reflection.getStaticField(fieldName, fieldDescriptor)
    return this._staticVars.getRef(field.slotId)
  }

  setRefVar(fieldName: string, fieldDescriptor: string, ref: BaseObject): void {
    const field = this._reflection.getStaticField(fieldName, fieldDescriptor)
    this._staticVars.setRef(field.slotId, ref)
  }

  toString(): string {
    return `${this._accessFlags.toString()} ${this._name}`
  }
}
