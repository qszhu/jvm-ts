import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class Return extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.thread.popFrame()
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
}

export class DReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popDouble()
    invokerFrame.operandStack.pushDouble(retVal)
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
}

export class IReturn extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const thread = frame.thread
    const currentFrame = thread.popFrame()
    const invokerFrame = thread.topFrame
    const retVal = currentFrame.operandStack.popInt()
    invokerFrame.operandStack.pushInt(retVal)
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
}
