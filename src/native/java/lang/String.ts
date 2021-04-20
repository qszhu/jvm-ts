import { JL_STRING } from '../../../class/names'
import InstanceObject from '../../../class/object/InstanceObject'
import StringPool from '../../../class/StringPool'
import Frame from '../../../thread/Frame'
import Registry from '../../Registry'

export function init(registry: Registry): void {
  registry.register(JL_STRING, 'intern', '()Ljava/lang/String;', intern)
}

function intern(frame: Frame) {
  const thiz = frame.localVars.getRef(0) as InstanceObject
  const interned = StringPool.intern(thiz)
  frame.operandStack.pushRef(interned)
}
