import BufferPool from "./BufferPool"

export default class Bits {
  static floatToBits(n: number): number {
    const idx = BufferPool.alloc(4)
    BufferPool.buffer.writeFloatBE(n, idx)
    return BufferPool.buffer.readInt32BE(idx)
  }

  static floatFromBits(n: number): number {
    const idx = BufferPool.alloc(4)
    BufferPool.buffer.writeInt32BE(n, idx)
    return BufferPool.buffer.readFloatBE(idx)
  }

  static doubleToBits(n: number): bigint {
    const idx = BufferPool.alloc(8)
    BufferPool.buffer.writeDoubleBE(n, idx)
    return BufferPool.buffer.readBigInt64BE(idx)
  }

  static doubleFromBits(n: bigint): number {
    const idx = BufferPool.alloc(8)
    BufferPool.buffer.writeBigInt64BE(n, idx)
    return BufferPool.buffer.readDoubleBE(idx)
  }
}
