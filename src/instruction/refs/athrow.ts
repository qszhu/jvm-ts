import InstanceObject from '../../class/object/InstanceObject'
import StringPool from '../../class/StringPool'
import Frame from '../../thread/Frame'
import Thread from '../../thread/Thread'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class AThrow extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const ex = frame.operandStack.popRef() as InstanceObject
    if (!ex) throw new Error('java.lang.NullPointerException')

    const thread = frame.thread
    if (!findAndGotExceptionHandler(thread, ex)) {
      handleUncaughtException(thread, ex)
    }
  }

  toString(): string {
    return `throw exception a`
  }
}

function findAndGotExceptionHandler(thread: Thread, ex: InstanceObject): boolean {
  while (true) {
    const frame = thread.currentFrame
    const pc = frame.nextPc - 1
    const handlerPc = frame.method.findExceptionHandler(ex.class, pc)
    if (handlerPc > 0) {
      const stack = frame.operandStack
      stack.clear()
      stack.pushRef(ex)
      frame.nextPc = handlerPc
      return true
    }

    thread.popFrame()

    if (thread.isStackEmpty) break
  }
  return false
}

function handleUncaughtException(thread: Thread, ex: InstanceObject): void {
  thread.clearStack()

  const jMsg = ex.getRefVar('detailMessage', 'Ljava/lang/String;') as InstanceObject
  const jsMsg = StringPool.jsString(jMsg)
  console.log(`${ex.class.javaName}: ${jsMsg}`)

  const stes = ex.extra as unknown[]
  for (const ste of stes) {
    console.log(`\tat ${ste.toString()}`)
  }
}
