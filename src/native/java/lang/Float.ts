import Bits from '../../../bits'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlFloat = 'java/lang/Float'

export function init(): void {
  register(jlFloat, 'floatToRawIntBits', '(F)I', floatToRawIntBits)
  register(jlFloat, 'intBitsToFloat', '(I)F', intBitsToFloat)
}

function floatToRawIntBits(frame: Frame) {
  const value = frame.localVars.getFloat(0)
  const bits = Bits.floatToBits(value)
  frame.operandStack.pushInt(bits)
}

function intBitsToFloat(frame: Frame) {
  const bits = frame.localVars.getInt(0)
  const value = Bits.floatFromBits(bits)
  frame.operandStack.pushFloat(value)
}
