import Class from '.'
import { Slots } from '../thread/Slots'

class HashCodeGenerator {
  private _id: number

  constructor() {
    this._id = new Date().getTime() % 2 ** 32
  }

  next(): number {
    return this._id++
  }
}

const hashCodeGenerator = new HashCodeGenerator()

export default class Obj {
  private _extra: any
  private _hashCode: number

  constructor(private _class?: Class, private _data?: any) {
    this._hashCode = hashCodeGenerator.next()
  }

  toString(): string {
    return `object: ${this._class.toString()}`
    /*
    return `(
class: ${this._class.toString()}
data:
${this._data.toString()}
extra:
${this._extra ? this._extra : '' })
`
*/
  }

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
    if (!Array.isArray(this._data)) throw new Error('not array')
    return this._data.length
  }

  get extra(): any {
    return this._extra
  }

  set extra(e: any) {
    this._extra = e
  }

  isInstanceOf(other: Class): boolean {
    return other.isAssignableFrom(this._class)
  }

  setRefVar(name: string, descriptor: string, ref: Obj): void {
    const field = Class.getField(this._class, name, descriptor, false)
    const slots = this._data as Slots
    slots.setRef(field.slotId, ref)
  }

  getRefVar(name: string, descriptor: string): Obj {
    const field = Class.getField(this._class, name, descriptor, false)
    const slots = this._data as Slots
    return slots.getRef(field.slotId)
  }

  static arrayCopy(src: Obj, dest: Obj, srcPos: number, destPos: number, length: number): void {
    dest._data.splice(destPos, length, ...src._data.slice(srcPos, length))
  }

  hashCode(): number {
    return this._hashCode
  }
}
