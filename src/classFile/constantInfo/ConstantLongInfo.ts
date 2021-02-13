import ClassReader from '../ClassReader'

export default class ConstantLongInfo {
  constructor(private _val: bigint) {}

  get val(): bigint {
    return this._val
  }

  static fromReader(reader: ClassReader): ConstantLongInfo {
    return new ConstantLongInfo(reader.readLong())
  }
}
