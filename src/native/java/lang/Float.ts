import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlFloat = 'java/lang/Float'

export function init(): void {
  register(jlFloat, 'floatToRawIntBits', '(F)I', floatToRawIntBits)
}

function floatToRawIntBits(frame: Frame) {
  const value = frame.localVars.getFloat(0)
  const bits = float32Bits(value)
  frame.operandStack.pushInt(bits)
}

function float32Bits(n: number) {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(n)
  return buf.readInt32BE()
}
