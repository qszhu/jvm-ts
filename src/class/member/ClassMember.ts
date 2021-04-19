import MemberInfo from '../../classFile/MemberInfo'
import AccessFlags from '../AccessFlags'
import BaseClass from '../class/BaseClass'

export default abstract class ClassMember {
  protected _accessFlags: AccessFlags
  protected _name: string
  protected _descriptor: string
  protected _class: BaseClass

  constructor(klass: BaseClass, memberInfo: MemberInfo) {
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

  get class(): BaseClass {
    return this._class
  }

  isAccessibleTo(d: BaseClass): boolean {
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
