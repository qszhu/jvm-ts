import Class from '.'
import { Slots } from '../thread/Slots'

export default class Obj {
  private _class: Class
  private _data: any

  static newObject(klass: Class): Obj {
    const obj = new Obj()
    obj._class = klass
    obj._data = new Slots(klass.instanceSlotCount)
    return obj
  }

  static newArray(klass: Class, data: any[]): Obj {
    const obj = new Obj()
    obj._class = klass
    obj._data = data
    return obj
  }

  get class(): Class {
    return this._class
  }

  get fields(): Slots {
    return this._data
  }

  get bytes(): number[] {
    return this._data
  }

  get shorts(): number[] {
    return this._data
  }

  get ints(): number[] {
    return this._data
  }

  get longs(): bigint[] {
    return this._data
  }

  get chars(): number[] {
    return this._data
  }

  get floats(): number[] {
    return this._data
  }

  get doubles(): number[] {
    return this._data
  }

  get refs(): Obj[] {
    return this._data
  }

  get arrayLength(): number {
    return this._data.length
  }

  isInstanceOf(other: Class): boolean {
    return other.isAssignableFrom(this._class)
  }
}
