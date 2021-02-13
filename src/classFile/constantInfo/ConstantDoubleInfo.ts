import ClassReader from '../ClassReader'

export default class ConstantDoubleInfo {
  constructor(private _val: number) {}

  get val(): number {
    return this._val
  }

  static fromReader(reader: ClassReader): ConstantDoubleInfo {
    return new ConstantDoubleInfo(reader.readDouble())
  }
}
