import BaseClass from '../class/class/BaseClass'
import Method from '../class/member/Method'
import BaseObject from '../class/object/BaseObject'
import Frame from '../thread/Frame'
import Thread from '../thread/Thread'

export function invokeMethod(invokerFrame: Frame, method: Method): void {
  const thread = invokerFrame.thread
  const newFrame = thread.newFrame(method)
  thread.pushFrame(newFrame)

  const argSlotCount = method.argSlotCount
  if (argSlotCount > 0) {
    for (let i = argSlotCount - 1; i >= 0; i--) {
      const slot = invokerFrame.operandStack.popSlot()
      newFrame.localVars.setSlot(i, slot)
    }
  }
}

export function initClass(thread: Thread, klass: BaseClass): void {
  klass.startInit()
  scheduleClinit(thread, klass)
  initSuperClass(thread, klass)
}

function scheduleClinit(thread: Thread, klass: BaseClass): void {
  const clinit = klass.clinitMethod
  if (clinit && clinit.class === klass) {
    const newFrame = thread.newFrame(clinit)
    thread.pushFrame(newFrame)
  }
}

function initSuperClass(thread: Thread, klass: BaseClass): void {
  if (!klass.isInterface) {
    const superClass = klass.superClass
    if (superClass && !superClass.hasInitStarted) {
      initClass(thread, superClass)
    }
  }
}

export function checkNotNil(ref: BaseObject): void {
  if (!ref) throw new Error('java.lang.NullPointerException')
}

export function checkIndex(arrLen: number, idx: number): void {
  if (idx < 0 || idx >= arrLen) throw new Error('ArrayIndexOutOfBoundsException')
}
