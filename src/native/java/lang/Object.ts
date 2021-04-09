import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlObject = 'java/lang/Object'

export function init(): void {
  register(jlObject, 'getClass', '()Ljava/lang/Class;', getClass)
  register(jlObject, 'hashCode', '()I', hashCode)
  register(jlObject, 'clone', '()Ljava/lang/Object;', clone)
}

function getClass(frame: Frame) {
  const thiz = frame.localVars.getRef(0)
  const klass = thiz.class.jClass
  frame.operandStack.pushRef(klass)
}

function hashCode(frame: Frame) {
  const thiz = frame.localVars.getRef(0)
  const hash = thiz.hashCode()
  frame.operandStack.pushInt(hash)
}

function clone(frame: Frame) {
  const thiz = frame.localVars.getRef(0)
  const cloneable = thiz.class.loader.loadClass('java/lang/Cloneable')
  if (!thiz.class.implements(cloneable)) {
    throw new Error('java.lang.CloneNotSupportedException')
  }
  frame.operandStack.pushRef(thiz.clone())
}
