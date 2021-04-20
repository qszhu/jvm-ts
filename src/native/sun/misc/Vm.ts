import Class from '../../../class/class/Class'
import StringPool from '../../../class/StringPool'
import { invokeMethod } from '../../../instruction/utils'
import Frame from '../../../thread/Frame'
import Registry from '../../Registry'

export function init(registry: Registry): void {
  registry.register('sun/misc/VM', 'initialize', '()V', initialize)
}

function initialize(frame: Frame) {
  const vmClass = frame.method.class as Class
  const savedProps = vmClass.getRefVar('savedProps', 'Ljava/util/Properties;')
  const key = StringPool.jString(vmClass.loader, 'foo')
  const val = StringPool.jString(vmClass.loader, 'bar')
  frame.operandStack.pushRef(savedProps)
  frame.operandStack.pushRef(key)
  frame.operandStack.pushRef(val)
  const propsClass = vmClass.loader.loadClass('java/util/Properties')
  const setPropMethod = propsClass.getInstanceMethod(
    'setProperty',
    '(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;'
  )
  invokeMethod(frame, setPropMethod)
  /*
  const classLoader = frame.method.class.loader
  const jlSysClass = classLoader.loadClass('java/lang/System')
  const initSysClass = jlSysClass.getStaticMethod('initializeSystemClass', '()V')
  invokeMethod(frame, initSysClass)
  */
}
