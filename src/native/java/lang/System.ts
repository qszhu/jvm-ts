import Obj from '../../../class/Obj'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlSystem = 'java/lang/System'

export function init(): void {
  register(jlSystem, 'arraycopy', '(Ljava/lang/Object;ILjava/lang/Object;II)V', arraycopy)
}

function arraycopy(frame: Frame) {
  const vars = frame.localVars

  const src = vars.getRef(0)
  const srcPos = vars.getInt(1)
  const dest = vars.getRef(2)
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

  Obj.arrayCopy(src, dest, srcPos, destPos, length)
}

function checkArrayCopy(src: Obj, dest: Obj) {
  const srcClass = src.class
  const destClass = dest.class

  if (!srcClass.isArray || !destClass.isArray) return false

  if (srcClass.componentClass.isPrimitive || destClass.componentClass.isPrimitive) {
    return srcClass === destClass
  }

  return true
}
