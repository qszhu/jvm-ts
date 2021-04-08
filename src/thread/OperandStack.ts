import Obj from '../class/Obj'
import Slot from './Slot'

export default class OperandStack {
  private _slots: Slot[] = []
  private _size = 0

  constructor(maxSize: number) {
    if (!maxSize) return
    this._slots = new Array(maxSize).fill(void 0)
  }

  clear(): void {
    this._slots = new Array(this._slots.length).fill(void 0)
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  pushSlot(slot: Slot): void {
    this._slots[this._size++] = slot
  }

  popSlot(): Slot {
    const slot = this._slots[--this._size]
    this._slots[this._size] = void 0
    return slot
  }

  pushInt(val: number): void {
    const slot = new Slot()
    slot.num = val
    this.pushSlot(slot)
  }

  popInt(): number {
    const slot = this.popSlot()
    return slot.num
  }

  pushBoolean(val: boolean): void {
    this.pushInt(val ? 1 : 0)
  }

  popBoolean(): boolean {
    return Boolean(this.popInt())
  }

  pushLong(val: bigint): void {
    const slot1 = new Slot()
    const slot2 = new Slot()
    Slot.setLong(slot1, slot2, val)
    this.pushSlot(slot1)
    this.pushSlot(slot2)
  }

  popLong(): bigint {
    const slot2 = this.popSlot()
    const slot1 = this.popSlot()
    return Slot.getLong(slot1, slot2)
  }

  pushFloat(val: number): void {
    const slot = new Slot()
    Slot.setFloat(slot, val)
    this.pushSlot(slot)
  }

  popFloat(): number {
    const slot = this.popSlot()
    return Slot.getFloat(slot)
  }

  pushDouble(val: number): void {
    const slot1 = new Slot()
    const slot2 = new Slot()
    Slot.setDouble(slot1, slot2, val)
    this.pushSlot(slot1)
    this.pushSlot(slot2)
  }

  popDouble(): number {
    const slot2 = this.popSlot()
    const slot1 = this.popSlot()
    return Slot.getDouble(slot1, slot2)
  }

  pushRef(ref: Obj): void {
    const slot = new Slot()
    slot.ref = ref
    this.pushSlot(slot)
  }

  popRef(): Obj {
    const slot = this.popSlot()
    return slot.ref || null
  }

  getRefFromTop(n: number): Obj {
    return this._slots[this._size - 1 - n].ref || null
  }

  toString(): string {
    return `size: ${this._size}
${this._slots
  .map((slot, idx) => `${idx}: ${slot ? slot.toString() : slot}`)
  .slice(0, this._size)
  .join('\n')}
`
  }
}
