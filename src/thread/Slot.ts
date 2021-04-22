import Bits from '../bits'

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
    [slot1.num, slot2.num] = Bits.longToBits(val)
  }

  static getLong(slot1: Slot, slot2: Slot): bigint {
    return Bits.longFromBits(slot1.num, slot2.num)
  }
}
