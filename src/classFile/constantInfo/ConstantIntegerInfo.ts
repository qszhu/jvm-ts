import ClassReader from '../ClassReader'

export default class ConstantIntegerInfo {
  constructor(private _val: number) {}

  get val(): number {
    return this._val
  }

  static fromReader(reader: ClassReader): ConstantIntegerInfo {
    return new ConstantIntegerInfo(reader.readInteger())
  }

  toString(): string {
    return `Integer: ${this.val}`
  }
}
