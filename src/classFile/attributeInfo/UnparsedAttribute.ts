import ClassReader from '../ClassReader'

export default class UnparsedAttribute {
  constructor(private _name: string, private _length: number, private _info: Buffer) {}

  get name(): string {
    return this._name
  }

  get length(): number {
    return this._length
  }

  get info(): Buffer {
    return this._info
  }

  static fromReader(name: string, length: number, reader: ClassReader): UnparsedAttribute {
    return new UnparsedAttribute(name, length, reader.readBytes(length))
  }

  toString(): string {
    return `skipped: ${this._name} ${this._length} ${this._info.toString('hex')}`
  }
}
