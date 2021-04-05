import { NoOperandsInstruction } from '..'
import Obj from '../../class/Obj'
import { jsString } from '../../class/StringPool'
import { StackTraceElement } from '../../native/java/lang/Throwable'
import { Thread } from '../../thread'
import Frame from '../../thread/Frame'

export class AThrow extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const ex = frame.operandStack.popRef()
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

function findAndGotExceptionHandler(thread: Thread, ex: Obj): boolean {
  while (true) {
    const frame = thread.currentFrame()
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

function handleUncaughtException(thread: Thread, ex: Obj): void {
  thread.clearStack()

  const jMsg = ex.getRefVar('detailMessage', 'Ljava/lang/String;')
  const jsMsg = jsString(jMsg)
  console.log(`${ex.class.javaName}: ${jsMsg}`)

  const stes = ex.extra as StackTraceElement[]
  for (const ste of stes) {
    console.log(`\tat ${ste.toString()}`)
  }
}
