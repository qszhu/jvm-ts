import Class from '../../../class/class/Class'
import { JL_CLASS } from '../../../class/names'
import InstanceObject from '../../../class/object/InstanceObject'
import StringPool from '../../../class/StringPool'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

export function init(): void {
  register(
    JL_CLASS,
    'getPrimitiveClass',
    '(Ljava/lang/String;)Ljava/lang/Class;',
    getPrimitiveClass
  )
  register(JL_CLASS, 'getName0', '()Ljava/lang/String;', getName0)
  register(JL_CLASS, 'desiredAssertionStatus0', '(Ljava/lang/Class;)Z', desiredAssertionStatus0)
}

function getPrimitiveClass(frame: Frame) {
  const nameObj = frame.localVars.getRef(0) as InstanceObject
  const name = StringPool.jsString(nameObj)

  const loader = frame.method.class.loader
  const klass = loader.loadClass(name).jClass

  frame.operandStack.pushRef(klass)
}

function getName0(frame: Frame) {
  const thiz = frame.localVars.getRef(0)
  const klass = thiz.extra as Class

  const name = klass.javaName
  const nameObj = StringPool.jString(klass.loader, name)

  frame.operandStack.pushRef(nameObj)
}

function desiredAssertionStatus0(frame: Frame) {
  frame.operandStack.pushBoolean(false)
}
