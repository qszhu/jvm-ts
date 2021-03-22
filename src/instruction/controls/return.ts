import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class Return extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.thread.popFrame()
  }

  toString(): string {
    return 'return'
  }
}

export class AReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const ref = currentFrame.operandStack.popRef()
    invokerFrame.operandStack.pushRef(ref)
  }

  toString(): string {
    return 'return object'
  }
}

export class DReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popDouble()
    invokerFrame.operandStack.pushDouble(retVal)
  }

  toString(): string {
    return 'return double'
  }
}

export class FReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popFloat()
    invokerFrame.operandStack.pushFloat(retVal)
  }

  toString(): string {
    return 'return float'
  }
}

export class IReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popInt()
    invokerFrame.operandStack.pushInt(retVal)
  }

  toString(): string {
    return 'return int'
  }
}

export class LReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popLong()
    invokerFrame.operandStack.pushLong(retVal)
  }

  toString(): string {
    return 'return long'
  }
}
