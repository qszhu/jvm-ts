import ConstantFieldRefInfo from '../../classFile/constantInfo/memberRef/ConstantFieldRefInfo'
import Field from '../member/Field'
import RuntimeConstantPool from '../RuntimeContantPool'
import MemberRef from './MemberRef'

export default class FieldRef extends MemberRef {
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

  toString(): string {
    return `FieldRef: ${this._className}.${this._name}:${this._descriptor}`
  }
}
