import MemberInfo from '../../classFile/MemberInfo'
import AccessFlags from '../AccessFlags'
import Class from '../class/Class'

export default abstract class ClassMember {
  protected _accessFlags: AccessFlags
  protected _name: string
  protected _descriptor: string
  protected _class: Class

  constructor(klass: Class, memberInfo: MemberInfo) {
    this._class = klass
    this._accessFlags = new AccessFlags(memberInfo.accessFlags)
    this._name = memberInfo.name
    this._descriptor = memberInfo.descriptor
  }

  get isPublic(): boolean {
    return this._accessFlags.isPublic
  }

  get isProtected(): boolean {
    return this._accessFlags.isProtected
  }

  get isPrivate(): boolean {
    return this._accessFlags.isPrivate
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
    if (this.isProtected) {
      return d === c || d.isSubClassOf(c) || c.packageName == d.packageName
    }

    if (!this.isPrivate) {
      return c.packageName === d.packageName
    }

    return d === c
  }
}
