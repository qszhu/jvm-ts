import ConstantInterfaceMethodRefInfo from '../../classFile/constantInfo/memberRef/ConstantInterfaceMethodRefInfo'
import Method from '../member/Method'
import RuntimeConstantPool from '../RuntimeContantPool'
import MemberRef from './MemberRef'

export default class InterfaceMethodRef extends MemberRef {
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
    if (!c.accessFlags.isInterface) throw new Error('java.lang.IncompatibleClassChangeError')

    const method = c.lookupInterfaceMethod(this._name, this._descriptor)
    if (!method) throw new Error('java.lang.NoSuchmethodError')

    const d = this._cp.class
    if (!method.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')

    this._method = method
  }

  toString(): string {
    return `InterfaceMethod: ${this._className}.${this._name}:${this._descriptor}`
  }
}
