import ClassReader from '../ClassReader'
import { u1, u2 } from '../types'

export default class ConstantMethodHandleInfo {
  constructor(private _refKind: u1, private _refIdx: u2) {}

  get referenceKind(): u1 {
    return this._refKind
  }

  get referenceIndex(): u2 {
    return this._refIdx
  }

  static fromReader(reader: ClassReader): ConstantMethodHandleInfo {
    return new ConstantMethodHandleInfo(reader.readU1(), reader.readU1())
  }
}
