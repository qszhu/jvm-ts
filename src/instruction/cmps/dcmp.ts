import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function dcmp(frame: Frame, gFlag: boolean) {
  const stack = frame.operandStack
  const v2 = stack.popDouble()
  const v1 = stack.popDouble()
  if (isNaN(v1) || isNaN(v2)) {
    return gFlag ? 1 : -1
  }
  if (v1 > v2) stack.pushInt(1)
  else if (v1 < v2) stack.pushInt(-1)
  else stack.pushInt(0)
}

export class DCmpG extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dcmp(frame, true)
  }
}

export class DCmpL extends NoOperandsInstruction {
  execute(frame: Frame): void {
    dcmp(frame, false)
  }
}
