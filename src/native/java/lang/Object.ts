import { JL_OBJECT } from '../../../class/names'
import Frame from '../../../thread/Frame'
import Registry from '../../Registry'

export function init(registry: Registry): void {
  registry.register(JL_OBJECT, 'getClass', '()Ljava/lang/Class;', getClass)
  registry.register(JL_OBJECT, 'hashCode', '()I', hashCode)
  registry.register(JL_OBJECT, 'clone', '()Ljava/lang/Object;', clone)
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
