import Class from '..'
import MemberInfo from '../../classFile/MemberInfo'
import AccessFlag from '../AccessFlag'

export default abstract class ClassMember {
  protected _accessFlags: number
  protected _name: string
  protected _descriptor: string
  protected _class: Class

  constructor(klass: Class, memberInfo: MemberInfo) {
    this._class = klass
    this._accessFlags = memberInfo.accessFlags
    this._name = memberInfo.name
    this._descriptor = memberInfo.descriptor
  }

  protected hasAccessFlag(f: AccessFlag): boolean {
    return (this._accessFlags & f) !== 0
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

  get isSynthetic(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  get name(): string {
    return this._name
  }

  get descriptor(): string {
    return this._descriptor
  }

  get class(): Class {
    return this._class
  }

  isAccessibleTo(d: Class): boolean {
    if (this.isPublic) return true
    const c = this._class
    if (this.isProtected) return d === c || d.isSubClassOf(c) || c.packageName == d.packageName
    if (!this.isPrivate) return c.packageName === d.packageName
    return d === c
  }
}
