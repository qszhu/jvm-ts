import Bits from '../../../bits'
import { JL_FLOAT } from '../../../class/names'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

export function init(): void {
  register(JL_FLOAT, 'floatToRawIntBits', '(F)I', floatToRawIntBits)
  register(JL_FLOAT, 'intBitsToFloat', '(I)F', intBitsToFloat)
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
