export default class Bits {
  private static _buffer = new ArrayBuffer(8)
  private static _int32s = new Int32Array(Bits._buffer)
  private static _int64s = new BigInt64Array(Bits._buffer)
  private static _floats = new Float32Array(Bits._buffer)
  private static _doubles = new Float64Array(Bits._buffer)

  static floatToBits(n: number): number {
    Bits._floats[0] = n
    return Bits._int32s[0]
  }

  static floatFromBits(n: number): number {
    Bits._int32s[0] = n
    return Bits._floats[0]
  }

  static doubleToBits(n: number): bigint {
    Bits._doubles[0] = n
    return Bits._int64s[0]
  }

  static doubleFromBits(n: bigint): number {
    Bits._int64s[0] = n
    return Bits._doubles[0]
  }

  static longToBits(n: bigint): [number, number] {
    Bits._int64s[0] = n
    return [Bits._int32s[0], Bits._int32s[1]]
  }

  static longFromBits(slot1: number, slot2: number): bigint {
    Bits._int32s[0] = slot1
    Bits._int32s[1] = slot2
    return Bits._int64s[0]
  }
}
