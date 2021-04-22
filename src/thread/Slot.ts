import Bits from '../bits'
import BufferPool from '../BufferPool'

export default class Slot {
  constructor(public num = 0, public ref: any = undefined) {}

  clone(): Slot {
    return new Slot(this.num, this.ref)
  }

  toString(): string {
    if (this.ref === void 0) return `${this.num}`
    if (this.ref === null) return 'null'
    return this.ref.toString()
  }

  static setFloat(slot: Slot, val: number): void {
    slot.num = Bits.floatToBits(val)
  }

  static getFloat(slot: Slot): number {
    return Bits.floatFromBits(slot.num)
  }

  static setDouble(slot1: Slot, slot2: Slot, val: number): void {
    const longVal = Bits.doubleToBits(val)
    Slot.setLong(slot1, slot2, longVal)
  }

  static getDouble(slot1: Slot, slot2: Slot): number {
    const longVal = Slot.getLong(slot1, slot2)
    return Bits.doubleFromBits(longVal)
  }

  static setLong(slot1: Slot, slot2: Slot, val: bigint): void {
    const idx = BufferPool.alloc(8)
    BufferPool.buffer.writeBigInt64BE(val, idx)
    slot1.num = BufferPool.buffer.readInt32BE(idx)
    slot2.num = BufferPool.buffer.readInt32BE(idx + 4)
  }

  static getLong(slot1: Slot, slot2: Slot): bigint {
    const idx = BufferPool.alloc(8)
    BufferPool.buffer.writeInt32BE(slot1.num, idx)
    BufferPool.buffer.writeInt32BE(slot2.num, idx + 4)
    return BufferPool.buffer.readBigInt64BE(idx)
  }
}
