import Slots from '../../thread/Slots'
import AccessFlags from '../AccessFlags'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import Field from '../member/Field'
import Method from '../member/Method'
import { JIO_SERIALIZABLE, JL_CLONEABLE, JL_OBJECT } from '../names'
import BaseObject from '../object/BaseObject'
import InstanceObject from '../object/InstanceObject'
import PrimitiveTypes from '../PrimitiveTypes'
import ArrayClass from './ArrayClass'
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

export default abstract class BaseClass {
  protected _accessFlags: AccessFlags
  protected _name: string
  protected _loader: ClassLoader
  protected _initStarted: boolean
  protected _jClass: BaseObject
  protected _instanceSlotCount = 0
  protected _staticSlotCount = 0
  protected _staticVars: Slots = new Slots(0)
  protected _constantPool: RuntimeConstantPool

  protected _fields: Field[] = []
  protected _methods: Method[] = []

  protected _superClass: BaseClass
  protected _interfaces: BaseClass[]

  private _hierarchy: ClassHierarchy
  protected _reflection: ClassReflection

  protected _sourceFile: string

  constructor() {
    this._hierarchy = new ClassHierarchy(this)
    this._reflection = new ClassReflection(this)
  }

  get name(): string {
    return this._name
  }

  get fields(): Field[] {
    return this._fields
  }

  get methods(): Method[] {
    return this._methods
  }

  get constantPool(): RuntimeConstantPool {
    return this._constantPool
  }

  get loader(): ClassLoader {
    return this._loader
  }

  get sourceFile(): string {
    return this._sourceFile
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

  get jClass(): BaseObject {
    return this._jClass
  }

  set jClass(klass: BaseObject) {
    this._jClass = klass
  }

  get superClass(): BaseClass {
    return this._superClass
  }

  get interfaces(): BaseClass[] {
    return this._interfaces.slice()
  }

  get hasInitStarted(): boolean {
    return this._initStarted
  }

  startInit(): void {
    this._initStarted = true
  }

  get javaName(): string {
    return this._name.replace(/\//g, '.')
  }

  get arrayClass(): ArrayClass {
    const arrayClassName = getArrayClassName(this._name)
    return this._loader.loadClass(arrayClassName) as ArrayClass
  }

  get packageName(): string {
    const p = this._name.lastIndexOf('/')
    if (p === -1) return ''
    return this._name.substring(0, p)
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

  newObject(): InstanceObject {
    return new InstanceObject(this)
  }

  isAccessibleTo(other: BaseClass): boolean {
    return this._hierarchy.isAccessibleTo(other)
  }

  isAssignableFrom(other: BaseClass): boolean {
    return this._hierarchy.isAssignableFrom(other)
  }

  isSubClassOf(other: BaseClass): boolean {
    return this._hierarchy.isSubClassOf(other)
  }

  isSuperClassOf(other: BaseClass): boolean {
    return this._hierarchy.isSuperClassOf(other)
  }

  isSubInterfaceOf(iface: BaseClass): boolean {
    return this._hierarchy.isSubInterfaceOf(iface)
  }

  isSuperInterfaceOf(iface: BaseClass): boolean {
    return this._hierarchy.isSuperInterfaceOf(iface)
  }

  implements(iface: BaseClass): boolean {
    return this._hierarchy.implements(iface)
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

  toString(): string {
    return `${this._accessFlags.toString()} ${this._name}`
  }
}
