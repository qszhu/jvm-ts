import { NoOperandsInstruction } from '.'
import Frame from '../thread/Frame'

export class LCmp extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popLong()
    const v1 = stack.popLong()
    if (v1 > v2) stack.pushInt(1)
    else if (v1 < v2) stack.pushInt(-1)
    else stack.pushInt(0)
  }
}

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
