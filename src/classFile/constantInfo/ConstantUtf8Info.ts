import ClassReader from '../ClassReader'

export default class ConstantUtf8Info {
  constructor(private _str: string) {}

  get str(): string {
    return this._str
  }

  static fromReader(reader: ClassReader): ConstantUtf8Info {
    const len = reader.readU2()
    const bytes = reader.readBytes(len)
    return new ConstantUtf8Info(bytes.toString('utf-8')) // TODO: Modified UTF-8
  }
}
