import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlDouble = 'java/lang/Double'

export function init(): void {
  register(jlDouble, 'doubleToRawLongBits', '(D)J', doubleToRawLongBits)
  register(jlDouble, 'longBitsToDouble', '(J)D', longBitsToDouble)
}

function doubleToRawLongBits(frame: Frame) {
  const value = frame.localVars.getDouble(0)
  const bits = float64ToBits(value)
  frame.operandStack.pushLong(bits)
}

function longBitsToDouble(frame: Frame) {
  const bits = frame.localVars.getLong(0)
  const value = float64FromBits(bits)
  frame.operandStack.pushDouble(value)
}

function float64ToBits(n: number) {
  const buf = Buffer.alloc(8)
  buf.writeDoubleBE(n)
  return buf.readBigInt64BE()
}

function float64FromBits(n: bigint) {
  const buf = Buffer.alloc(8)
  buf.writeBigInt64BE(n)
  return buf.readDoubleBE()
}
