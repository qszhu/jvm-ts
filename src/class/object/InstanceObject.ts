import Slots from '../../thread/Slots'
import BaseClass from '../class/BaseClass'
import BaseObject from './BaseObject'

export default class InstanceObject extends BaseObject {
  constructor(klass: BaseClass, private _fields?: Slots) {
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
    const field = this._class.getInstanceField(name, descriptor)
    this._fields.setRef(field.slotId, ref)
  }

  getRefVar(name: string, descriptor: string): BaseObject {
    const field = this._class.getInstanceField(name, descriptor)
    return this._fields.getRef(field.slotId)
  }
}
