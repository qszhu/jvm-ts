import ClassReader from '../ClassReader'

export default class ConstantUtf8Info {
  static fromReader(reader: ClassReader): ConstantUtf8Info {
    const len = reader.readU2()
    const bytes = reader.readBytes(len)
    return new ConstantUtf8Info(bytes.toString('utf-8'))
  }

  constructor(private _str: string) {}

  get str(): string {
    return this._str
  }

  toString(): string {
    return `Utf8: ${this.str}`
  }
}
