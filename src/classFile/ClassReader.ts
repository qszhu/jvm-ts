import { u1, u2, u4 } from './types'

export default class ClassReader {
  private _readBuffer: Buffer

  constructor(private _data: Buffer) {
    this._readBuffer = this._data.slice()
  }

  readU1(): u1 {
    const res = this._readBuffer.readUInt8()
    this._readBuffer = this._readBuffer.slice(1)
    return res
  }

  readU2(): u2 {
    const res = this._readBuffer.readUInt16BE()
    this._readBuffer = this._readBuffer.slice(2)
    return res
  }

  readU4(): u4 {
    const res = this._readBuffer.readUInt32BE()
    this._readBuffer = this._readBuffer.slice(4)
    return res
  }

  readInteger(): number {
    const res = this._readBuffer.readInt32BE()
    this._readBuffer = this._readBuffer.slice(4)
    return res
  }

  readFloat(): number {
    const res = this._readBuffer.readFloatBE()
    this._readBuffer = this._readBuffer.slice(4)
    return res
  }

  readDouble(): number {
    const res = this._readBuffer.readDoubleBE()
    this._readBuffer = this._readBuffer.slice(8)
    return res
  }

  readLong(): bigint {
    const res = this._readBuffer.readBigInt64BE()
    this._readBuffer = this._readBuffer.slice(8)
    return res
  }

  readU2List(): u2[] {
    const n = this.readU2()
    const res = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      res[i] = this.readU2()
    }
    return res
  }

  readBytes(n: number): Buffer {
    const res = this._readBuffer.slice(0, n)
    this._readBuffer = this._readBuffer.slice(n)
    return res
  }
}
