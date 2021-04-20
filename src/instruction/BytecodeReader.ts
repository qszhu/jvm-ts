export default class BytecodeReader {
  private _pc = 0

  constructor(private _code?: Buffer) {}

  get pc(): number {
    return this._pc
  }

  reset(code: Buffer, pc: number): void {
    this._code = code
    this._pc = pc
  }

  readUint8(): number {
    return this._code.readUInt8(this._pc++)
  }

  readInt8(): number {
    return this._code.readInt8(this._pc++)
  }

  readUint16(): number {
    const res = this._code.readUInt16BE(this._pc)
    this._pc += 2
    return res
  }

  readInt16(): number {
    const res = this._code.readInt16BE(this._pc)
    this._pc += 2
    return res
  }

  readInt32(): number {
    const res = this._code.readInt32BE(this._pc)
    this._pc += 4
    return res
  }

  readInt32List(n: number): number[] {
    const res = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      res[i] = this.readInt32()
    }
    return res
  }

  skipPadding(): void {
    while (this._pc % 4 !== 0) this.readUint8()
  }
}
