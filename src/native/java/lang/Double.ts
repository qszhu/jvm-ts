import Bits from '../../../bits'
import { JL_DOUBLE } from '../../../class/names'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

export function init(): void {
  register(JL_DOUBLE, 'doubleToRawLongBits', '(D)J', doubleToRawLongBits)
  register(JL_DOUBLE, 'longBitsToDouble', '(J)D', longBitsToDouble)
}

function doubleToRawLongBits(frame: Frame) {
  const value = frame.localVars.getDouble(0)
  const bits = Bits.doubleToBits(value)
  frame.operandStack.pushLong(bits)
}

function longBitsToDouble(frame: Frame) {
  const bits = frame.localVars.getLong(0)
  const value = Bits.doubleFromBits(bits)
  frame.operandStack.pushDouble(value)
}
