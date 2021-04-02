import { internString } from '../../../class/StringPool'
import Frame from '../../../thread/Frame'
import { register } from '../../registry'

const jlString = 'java/lang/String'

export function init(): void {
  register(jlString, 'intern', '()Ljava/lang/String;', intern)
}

function intern(frame: Frame) {
  const thiz = frame.localVars.getThis()
  const interned = internString(thiz)
  frame.operandStack.pushRef(interned)
}
