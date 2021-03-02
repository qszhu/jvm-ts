import ClassMember from '.'
import Class from '..'
import MemberInfo from '../../classFile/MemberInfo'
import AccessFlag from '../AccessFlag'

export default class Field extends ClassMember {
  private _constValueIndex: number
  private _slotId: number

  constructor(klass: Class, field: MemberInfo) {
    super(klass, field)
    const valAttr = field.constantValueAttribute
    if (valAttr) this._constValueIndex = valAttr.constantValueIndex
  }

  static newFields(cls: Class, fields: MemberInfo[]): Field[] {
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

  get isVolatile(): boolean {
    return this.hasAccessFlag(AccessFlag.VOLATILE)
  }

  get isTransient(): boolean {
    return this.hasAccessFlag(AccessFlag.TRANSIENT)
  }

  get isEnum(): boolean {
    return this.hasAccessFlag(AccessFlag.ENUM)
  }

  get isLongOrDouble(): boolean {
    return this._descriptor === 'J' || this._descriptor === 'D'
  }
}
