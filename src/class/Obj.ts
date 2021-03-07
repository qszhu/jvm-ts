import Class from '.'
import { Slots } from '../thread/Slots'

export default class Obj {
  private _class: Class
  private _fields: Slots

  constructor(klass: Class) {
    this._class = klass
    this._fields = new Slots(klass.instanceSlotCount)
  }

  get class(): Class {
    return this._class
  }

  get fields(): Slots {
    return this._fields
  }

  isInstanceOf(other: Class): boolean {
    return other.isAssignableFrom(this._class)
  }
}
