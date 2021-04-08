import Obj from '../class/Obj'
import Slot from './Slot'

export default class Slots {
  private _data: Slot[] = []

  toString(): string {
    return this._data.map((d, i) => `${i} ${d.toString()}`).join('\n')
  }

  constructor(maxSize: number) {
    if (!maxSize) return
    this._data = new Array(maxSize).fill(null).map(() => new Slot())
  }

  clone(): Slots {
    const slots = new Slots(0)
    slots._data = this._data.map((slot) => slot.clone())
    return slots
  }

  setInt(idx: number, val: number): void {
    this._data[idx].num = val
  }

  getInt(idx: number): number {
    return this._data[idx].num
  }

  setFloat(idx: number, val: number): void {
    Slot.setFloat(this._data[idx], val)
  }

  getFloat(idx: number): number {
    return Slot.getFloat(this._data[idx])
  }

  setLong(idx: number, val: bigint): void {
    Slot.setLong(this._data[idx], this._data[idx + 1], val)
  }

  getLong(idx: number): bigint {
    return Slot.getLong(this._data[idx], this._data[idx + 1])
  }

  setDouble(idx: number, val: number): void {
    Slot.setDouble(this._data[idx], this._data[idx + 1], val)
  }

  getDouble(idx: number): number {
    return Slot.getDouble(this._data[idx], this._data[idx + 1])
  }

  setRef(idx: number, ref: Obj): void {
    this._data[idx].ref = ref
  }

  getRef(idx: number): Obj {
    return this._data[idx].ref || null
  }

  setSlot(idx: number, slot: Slot): void {
    this._data[idx] = slot
  }

  getThis(): Obj {
    return this.getRef(0)
  }
}
