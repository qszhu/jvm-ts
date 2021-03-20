import ClassReader from '../ClassReader'

export default class ConstantFloatInfo {
  constructor(private _val: number) {}

  get val(): number {
    return this._val
  }

  static fromReader(reader: ClassReader): ConstantFloatInfo {
    return new ConstantFloatInfo(reader.readFloat())
  }

  toString(): string {
    return `Float: ${this.val}`
  }
}
