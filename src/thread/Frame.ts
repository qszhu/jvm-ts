import { Thread } from '.'
import { Method } from '../heap'
import { doubleFromSlot, doubleToSlot, floatFromSlot, floatToSlot, longFromSlot, longToSlot, Slot, Slots } from './Slots'

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
  private _lower: Frame
  private _localVars: Slots
  private _operandStack: OperandStack
  private _nextPc = 0

  constructor(private _thread: Thread, maxLocals: number, maxStack: number) {
    this._localVars = new Slots(maxLocals)
    this._operandStack = new OperandStack(maxStack)
  }

  get method(): Method {
    throw new Error('not implemented')
  }

  get localVars(): Slots {
    return this._localVars
  }

  get operandStack(): OperandStack {
    return this._operandStack
  }

  get thread(): Thread {
    return this._thread
  }

  get nextPc(): number {
    return this._nextPc
  }

  set nextPc(pc: number) {
    this._nextPc = pc
  }
}
