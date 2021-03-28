import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlObject = 'java/lang/Object'

export function init(): void {
  register(jlObject, 'getClass', '()Ljava/lang/Class;', getClass)
  // register(jlObject, 'hashCode', '()I', hashCode)
  // register(jlObject, 'clone', '()Ljava/lang/Object;', clone)
}

function getClass(frame: Frame) {
  const thiz = frame.localVars.getThis()
  const klass = thiz.class.jClass
  frame.operandStack.pushRef(klass)
  console.log('Object#getClass', klass.toString())
}
