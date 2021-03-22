import { Thread } from '.'
import Method from '../class/ClassMember/Method'
import {
  doubleFromSlots,
  doubleToSlots,
  floatFromSlot,
  floatToSlot,
  longFromSlots,
  longToSlots,
  Slot,
  Slots,
} from './Slots'

export class OperandStack {
  private _slots: Slot[] = []
  private _size = 0

  toString(): string {
    return `
Operand stack:
size: ${this._size}
${this._slots
  .map((slot, idx) => `${idx}: ${slot.toString()}`)
  .slice(0, this._size)
  .reverse()
  .join('\n')}
`
  }

  constructor(maxSize: number) {
    if (!maxSize) return
    this._slots = new Array(maxSize).fill(null).map(() => new Slot())
    // maxSize + 1?
    // this._slots = new Array(maxSize + 1).fill(null).map(() => new Slot())
  }

  /*
  push<T>(val: T) {
    this._slots[this._size++].ref = val
  }

  pop<T>(): T {
    return this._slots[--this._size].ref
  }
  */

  pushSlot(slot: Slot): void {
    this._slots[this._size++] = slot
  }

  popSlot(): Slot {
    return this._slots[--this._size]
  }

  pushInt(val: number): void {
    this._slots[this._size++].num = val
  }

  popInt(): number {
    return this._slots[--this._size].num
  }

  pushBoolean(val: boolean): void {
    this.pushInt(val ? 1 : 0)
  }

  popBoolean(): boolean {
    return Boolean(this.popInt())
  }

  pushLong(val: bigint): void {
    const i = this._size
    longToSlots(this._slots[i], this._slots[i + 1], val)
    this._size += 2
  }

  popLong(): bigint {
    const i = this._size - 2
    const res = longFromSlots(this._slots[i], this._slots[i + 1])
    this._size = i
    return res
  }

  pushFloat(val: number): void {
    floatToSlot(this._slots[this._size++], val)
  }

  popFloat(): number {
    return floatFromSlot(this._slots[--this._size])
  }

  pushDouble(val: number): void {
    const i = this._size
    doubleToSlots(this._slots[i], this._slots[i + 1], val)
    this._size += 2
  }

  popDouble(): number {
    const i = this._size - 2
    const res = doubleFromSlots(this._slots[i], this._slots[i + 1])
    this._size = i
    return res
  }

  pushRef(ref: any): void {
    this._slots[this._size++].ref = ref
  }

  popRef(): any {
    this._size--
    const res = this._slots[this._size].ref
    this._slots[this._size] = new Slot()
    return res
  }

  getRefFromTop(n: number): any {
    return this._slots[this._size - 1 - n].ref
  }
}

export default class Frame {
  private _lower: Frame
  private _localVars: Slots
  private _operandStack: OperandStack
  private _nextPc = 0

  constructor(private _thread: Thread, private _method: Method) {
    this._localVars = new Slots(this._method.maxLocals)
    this._operandStack = new OperandStack(this._method.maxStack)
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

  get method(): Method {
    return this._method
  }

  get nextPc(): number {
    return this._nextPc
  }

  set nextPc(pc: number) {
    this._nextPc = pc
  }

  revertNextPc(): void {
    this._nextPc = this._thread.pc
  }

  toString(): string {
    return `
Frame:

Local vars:
${this._localVars.toString()}
${this._operandStack.toString()}
`
  }
}
