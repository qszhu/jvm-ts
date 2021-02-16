import { Thread } from "."

class Slot {
  constructor(public num = 0, public ref: any = undefined) {}
}

function floatToSlot(slot: Slot, val: number) {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(val)
  slot.num = buf.readInt32BE()
}

function floatFromSlot(slot: Slot): number {
  const buf = Buffer.alloc(4)
  buf.writeInt32BE(slot.num)
  return buf.readFloatBE()
}

function longToSlot(slot1: Slot, slot2: Slot, val: bigint) {
  const buf = Buffer.alloc(8)
  buf.writeBigInt64BE(val)
  slot1.num = buf.readInt32BE()
  slot2.num = buf.readInt32BE(4)
}

function longFromSlot(slot1: Slot, slot2: Slot): bigint {
  const buf = Buffer.alloc(8)
  buf.writeInt32BE(slot1.num)
  buf.writeInt32BE(slot2.num, 4)
  return buf.readBigInt64BE()
}

function doubleToSlot(slot1: Slot, slot2: Slot, val: number) {
  const buf = Buffer.alloc(8)
  buf.writeDoubleBE(val)
  longToSlot(slot1, slot2, buf.readBigInt64BE())
}

function doubleFromSlot(slot1: Slot, slot2: Slot): number {
  const buf = Buffer.alloc(8)
  buf.writeBigInt64BE(longFromSlot(slot1, slot2))
  return buf.readDoubleBE()
}

class LocalVars {
  private _data: Slot[]

  constructor(private maxSize: number) {
    if (maxSize <= 0) return
    this._data = new Array(maxSize).fill(null)
    for (let i = 0; i < this._data.length; i++) this._data[i] = new Slot()
  }

  setInt(idx: number, val: number) {
    this._data[idx].num = val
  }

  getInt(idx: number): number {
    return this._data[idx].num
  }

  setFloat(idx: number, val: number) {
    floatToSlot(this._data[idx], val)
  }

  getFloat(idx: number): number {
    return floatFromSlot(this._data[idx])
  }

  setLong(idx: number, val: bigint) {
    longToSlot(this._data[idx], this._data[idx + 1], val)
  }

  getLong(idx: number): bigint {
    return longFromSlot(this._data[idx], this._data[idx + 1])
  }

  setDouble(idx: number, val: number) {
    doubleToSlot(this._data[idx], this._data[idx + 1], val)
  }

  getDouble(idx: number): number {
    return doubleFromSlot(this._data[idx], this._data[idx + 1])
  }

  setRef(idx: number, ref: any) {
    this._data[idx].ref = ref
  }

  getRef(idx: number): any {
    return this._data[idx].ref
  }
}

class OperandStack {
  private _slots: Slot[]
  private _size = 0

  constructor(private maxSize: number) {
    if (maxSize <= 0) return
    this._slots = new Array(maxSize).fill(null).map(() => new Slot())
  }

  pushSlot(slot: Slot) {
    this._slots[this._size++] = slot
  }

  popSlot() {
    return this._slots[--this._size]
  }

  pushInt(val: number) {
    this._slots[this._size++].num = val
  }

  popInt(): number {
    return this._slots[--this._size].num
  }

  pushLong(val: bigint) {
    const i = this._size
    longToSlot(this._slots[i], this._slots[i + 1], val)
    this._size += 2
  }

  popLong(): bigint {
    const i = this._size - 2
    const res = longFromSlot(this._slots[i], this._slots[i + 1])
    this._size -= 2
    return res
  }

  pushFloat(val: number) {
    floatToSlot(this._slots[this._size++], val)
  }

  popFloat(): number {
    return floatFromSlot(this._slots[--this._size])
  }

  pushDouble(val: number) {
    const i = this._size
    doubleToSlot(this._slots[i], this._slots[i + 1], val)
    this._size += 2
  }

  popDouble(): number {
    const i = this._size - 2
    const res = doubleFromSlot(this._slots[i], this._slots[i + 1])
    this._size -= 2
    return res
  }

  pushRef(ref: any) {
    this._slots[this._size++].ref = ref
  }

  popRef(): any {
    const i = this._size
    const res = this._slots[i].ref
    this._slots[i] = null
    return res
  }
}

export default class Frame {
  private _localVars: LocalVars
  private _operandStack: OperandStack
  private _thread: Thread

  constructor(private maxLocals: number, private maxStack: number) {
    this._localVars = new LocalVars(maxLocals)
    this._operandStack = new OperandStack(maxStack)
  }

  get localVars(): LocalVars {
    return this._localVars
  }

  get operandStack(): OperandStack {
    return this._operandStack
  }

  get thread(): Thread {
    return this._thread
  }

  setNextPc(pc: number): void {
    throw new Error('Method not implemented.')
  }
}
