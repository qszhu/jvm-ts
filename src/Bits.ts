export default class Bits {
  static floatToBits(n: number): number {
    const buf = Buffer.allocUnsafe(4)
    buf.writeFloatBE(n)
    return buf.readInt32BE()
  }

  static floatFromBits(n: number): number {
    const buf = Buffer.allocUnsafe(4)
    buf.writeInt32BE(n)
    return buf.readFloatBE()
  }

  static doubleToBits(n: number): bigint {
    const buf = Buffer.allocUnsafe(8)
    buf.writeDoubleBE(n)
    return buf.readBigInt64BE()
  }

  static doubleFromBits(n: bigint): number {
    const buf = Buffer.allocUnsafe(8)
    buf.writeBigInt64BE(n)
    return buf.readDoubleBE()
  }
}
