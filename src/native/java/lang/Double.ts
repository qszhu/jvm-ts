import Bits from '../../../bits'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlDouble = 'java/lang/Double'

export function init(): void {
  register(jlDouble, 'doubleToRawLongBits', '(D)J', doubleToRawLongBits)
  register(jlDouble, 'longBitsToDouble', '(J)D', longBitsToDouble)
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
