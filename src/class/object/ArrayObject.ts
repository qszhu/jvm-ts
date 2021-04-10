import Class from '../Class'
import BaseObject from './BaseObject'

export default class ArrayObject extends BaseObject {
  constructor(klass: Class, private _arr: unknown[]) {
    super(klass)
  }

  clone(): ArrayObject {
    let newArr
    if (this._arr.length > 0 && this._arr[0] instanceof BaseObject) {
      newArr = this._arr.map((o: BaseObject) => o.clone())
    } else {
      newArr = this._arr.slice()
    }
    return new ArrayObject(this._class, newArr)
  }

  get bytes(): number[] {
    return this._arr as number[]
  }

  get shorts(): number[] {
    return this._arr as number[]
  }

  get ints(): number[] {
    return this._arr as number[]
  }

  get longs(): bigint[] {
    return this._arr as bigint[]
  }

  get chars(): number[] {
    return this._arr as number[]
  }

  get floats(): number[] {
    return this._arr as number[]
  }

  get doubles(): number[] {
    return this._arr as number[]
  }

  get refs(): BaseObject[] {
    return this._arr as BaseObject[]
  }

  get arrayLength(): number {
    return this._arr.length
  }

  static arrayCopy(
    src: ArrayObject,
    dest: ArrayObject,
    srcPos: number,
    destPos: number,
    len: number
  ): void {
    for (let i = 0; i < len; i++) {
      dest._arr[destPos + i] = src._arr[srcPos + i]
    }
  }
}
