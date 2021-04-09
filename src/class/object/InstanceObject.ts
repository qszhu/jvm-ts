import Class from '..'
import Slots from '../../thread/Slots'
import BaseObject from './BaseObject'

export default class InstanceObject extends BaseObject {
  constructor(klass: Class, private _fields?: Slots) {
    super(klass)
    this._fields = _fields || new Slots(klass.instanceSlotCount)
  }

  clone(): InstanceObject {
    return new InstanceObject(this._class, this._fields.clone())
  }

  get fields(): Slots {
    return this._fields
  }

  setRefVar(name: string, descriptor: string, ref: BaseObject): void {
    const field = Class.getField(this._class, name, descriptor, false)
    this._fields.setRef(field.slotId, ref)
  }

  getRefVar(name: string, descriptor: string): BaseObject {
    const field = Class.getField(this._class, name, descriptor, false)
    return this._fields.getRef(field.slotId)
  }
}
