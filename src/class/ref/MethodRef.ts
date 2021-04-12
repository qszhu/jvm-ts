import ConstantMethodRefInfo from '../../classFile/constantInfo/memberRef/ConstantMethodRefInfo'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import Method from '../member/Method'
import MemberRef from './MemberRef'

export default class MethodRef extends MemberRef {
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

  toString(): string {
    return `MethodRef: ${this._className}.${this._name}:${this._descriptor}`
  }
}
