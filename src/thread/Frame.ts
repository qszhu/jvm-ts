import { Thread } from '.'
import Method from '../class/ClassMember/Method'
import Obj from '../class/Obj'
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
    return `size: ${this._size}
${this._slots
  .map((slot, idx) => `${idx}: ${slot ? slot.toString() : slot}`)
  .slice(0, this._size)
  .join('\n')}
`
  }

  get size(): number {
    return this._size
  }

  constructor(maxSize: number) {
    if (!maxSize) return
    this._slots = new Array(maxSize).fill(void 0)
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
    longToSlots(slot1, slot2, val)
    this.pushSlot(slot1)
    this.pushSlot(slot2)
  }

  popLong(): bigint {
    const slot2 = this.popSlot()
    const slot1 = this.popSlot()
    return longFromSlots(slot1, slot2)
  }

  pushFloat(val: number): void {
    const slot = new Slot()
    floatToSlot(slot, val)
    this.pushSlot(slot)
  }

  popFloat(): number {
    const slot = this.popSlot()
    return floatFromSlot(slot)
  }

  pushDouble(val: number): void {
    const slot1 = new Slot()
    const slot2 = new Slot()
    doubleToSlots(slot1, slot2, val)
    this.pushSlot(slot1)
    this.pushSlot(slot2)
  }

  popDouble(): number {
    const slot2 = this.popSlot()
    const slot1 = this.popSlot()
    return doubleFromSlots(slot1, slot2)
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

Method: ${this.method.class.name}.${this.method.name}${this.method.descriptor}

Local vars:
${this._localVars.toString()}

Operand stack:
${this._operandStack.toString()}
`
  }
}
