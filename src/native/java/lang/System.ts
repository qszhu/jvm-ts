import ArrayClass from '../../../class/class/ArrayClass'
import PrimitiveClass from '../../../class/class/PrimitiveClass'
import { JL_SYSTEM } from '../../../class/names'
import ArrayObject from '../../../class/object/ArrayObject'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

export function init(): void {
  register(JL_SYSTEM, 'arraycopy', '(Ljava/lang/Object;ILjava/lang/Object;II)V', arraycopy)
}

function arraycopy(frame: Frame) {
  const vars = frame.localVars

  const src = vars.getRef(0) as ArrayObject
  const srcPos = vars.getInt(1)
  const dest = vars.getRef(2) as ArrayObject
  const destPos = vars.getInt(3)
  const length = vars.getInt(4)

  if (!src || !dest) {
    throw new Error('java.lang.NullPointerException')
  }

  if (!checkArrayCopy(src, dest)) {
    throw new Error('java.lang.ArrayStoreException')
  }

  if (
    srcPos < 0 ||
    destPos < 0 ||
    length < 0 ||
    srcPos + length > src.arrayLength ||
    destPos + length > dest.arrayLength
  ) {
    throw new Error('java.lang.IndexOutOfBoundsException')
  }

  ArrayObject.arrayCopy(src, dest, srcPos, destPos, length)
}

function checkArrayCopy(src: ArrayObject, dest: ArrayObject) {
  const srcClass = src.class
  const destClass = dest.class

  if (!(srcClass instanceof ArrayClass) || !(destClass instanceof ArrayClass)) return false

  if (
    srcClass.componentClass instanceof PrimitiveClass ||
    destClass.componentClass instanceof PrimitiveClass
  ) {
    return srcClass === destClass
  }

  return true
}
