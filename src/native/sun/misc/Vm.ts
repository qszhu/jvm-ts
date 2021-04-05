import { jString } from '../../../class/StringPool'
import { invokeMethod } from '../../../instruction'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

export function init(): void {
  register('sun/misc/VM', 'initialize', '()V', initialize)
}

function initialize(frame: Frame) {
  const vmClass = frame.method.class
  const savedProps = vmClass.getRefVar('savedProps', 'Ljava/util/Properties;')
  const key = jString(vmClass.loader, 'foo')
  const val = jString(vmClass.loader, 'bar')
  frame.operandStack.pushRef(savedProps)
  frame.operandStack.pushRef(key)
  frame.operandStack.pushRef(val)
  const propsClass = vmClass.loader.loadClass('java/util/Properties')
  const setPropMethod = propsClass.getInstanceMethod(
    'setProperty',
    '(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;'
  )
  invokeMethod(frame, setPropMethod)
}
