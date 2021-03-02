import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

function fcmp(frame: Frame, gFlag: boolean) {
  const stack = frame.operandStack
  const v2 = stack.popFloat()
  const v1 = stack.popFloat()
  if (isNaN(v1) || isNaN(v2)) {
    return gFlag ? 1 : -1
  }
  if (v1 > v2) stack.pushInt(1)
  else if (v1 < v2) stack.pushInt(-1)
  else stack.pushInt(0)
}

export class FCmpG extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fcmp(frame, true)
  }
}

export class FCmpL extends NoOperandsInstruction {
  execute(frame: Frame): void {
    fcmp(frame, false)
  }
}
