import AttributeInfoFactory from '../../classFile/attributeInfo/AttributeInfoFactory'
import MemberInfo from '../../classFile/MemberInfo'
import Class from '../Class'
import ClassMember from './ClassMember'

export default class Field extends ClassMember {
  private _constValueIndex: number
  private _slotId: number

  toString(): string {
    return `Field: [${this._slotId}] ${this._accessFlags.toString()} ${this._class.name}.${
      this._name
    }:${this._descriptor}`
  }

  constructor(klass: Class, field: MemberInfo) {
    super(klass, field)
    const valAttr = AttributeInfoFactory.getConstantValueAttribute(field)
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

  get isLongOrDouble(): boolean {
    return this._descriptor === 'J' || this._descriptor === 'D'
  }

  get isStatic(): boolean {
    return this._accessFlags.isStatic
  }

  get isFinal(): boolean {
    return this._accessFlags.isFinal
  }
}
