import Obj from '../class/Obj'

export class Slot {
  constructor(public num = 0, public ref: any = undefined) {}

  toString(): string {
    if (this.ref === void 0) return `${this.num}`
    if (this.ref === null) return 'null'
    return this.ref.toString()
  }
}

export function floatToSlot(slot: Slot, val: number): void {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(val)
  slot.num = buf.readInt32BE()
}

export function floatFromSlot(slot: Slot): number {
  const buf = Buffer.alloc(4)
  buf.writeInt32BE(slot.num)
  return buf.readFloatBE()
}

export function longToSlots(slot1: Slot, slot2: Slot, val: bigint): void {
  const buf = Buffer.alloc(8)
  buf.writeBigInt64BE(val)
  slot1.num = buf.readInt32BE()
  slot2.num = buf.readInt32BE(4)
}

export function longFromSlots(slot1: Slot, slot2: Slot): bigint {
  const buf = Buffer.alloc(8)
  buf.writeInt32BE(slot1.num)
  buf.writeInt32BE(slot2.num, 4)
  return buf.readBigInt64BE()
}

export function doubleToSlots(slot1: Slot, slot2: Slot, val: number): void {
  const buf = Buffer.alloc(8)
  buf.writeDoubleBE(val)
  longToSlots(slot1, slot2, buf.readBigInt64BE())
}

export function doubleFromSlots(slot1: Slot, slot2: Slot): number {
  const buf = Buffer.alloc(8)
  buf.writeBigInt64BE(longFromSlots(slot1, slot2))
  return buf.readDoubleBE()
}

export class Slots {
  private _data: Slot[] = []

  toString(): string {
    return this._data.map((d, i) => `${i} ${d.toString()}`).join('\n')
  }

  constructor(maxSize: number) {
    if (!maxSize) return
    this._data = new Array(maxSize).fill(null).map(() => new Slot())
  }

  setInt(idx: number, val: number): void {
    this._data[idx].num = val
  }

  getInt(idx: number): number {
    return this._data[idx].num
  }

  setFloat(idx: number, val: number): void {
    floatToSlot(this._data[idx], val)
  }

  getFloat(idx: number): number {
    return floatFromSlot(this._data[idx])
  }

  setLong(idx: number, val: bigint): void {
    longToSlots(this._data[idx], this._data[idx + 1], val)
  }

  getLong(idx: number): bigint {
    return longFromSlots(this._data[idx], this._data[idx + 1])
  }

  setDouble(idx: number, val: number): void {
    doubleToSlots(this._data[idx], this._data[idx + 1], val)
  }

  getDouble(idx: number): number {
    return doubleFromSlots(this._data[idx], this._data[idx + 1])
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
