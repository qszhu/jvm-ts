import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlFloat = 'java/lang/Float'

export function init(): void {
  register(jlFloat, 'floatToRawIntBits', '(F)I', floatToRawIntBits)
  register(jlFloat, 'intBitsToFloat', '(I)F', intBitsToFloat)
}

function floatToRawIntBits(frame: Frame) {
  const value = frame.localVars.getFloat(0)
  const bits = float32ToBits(value)
  frame.operandStack.pushInt(bits)
}

function intBitsToFloat(frame: Frame) {
  const bits = frame.localVars.getInt(0)
  const value = float32FromBits(bits)
  frame.operandStack.pushFloat(value)
}

function float32ToBits(n: number) {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(n)
  return buf.readInt32BE()
}

function float32FromBits(n: number) {
  const buf = Buffer.alloc(4)
  buf.writeInt32BE(n)
  return buf.readFloatBE()
}
