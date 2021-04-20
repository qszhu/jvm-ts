import Frame from '../../thread/Frame'
import Index16Instruction from '../base/Index16Instruction'
import { initClass } from '../utils'

export class New extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const classRef = cp.getClassRef(this._index)
    const klass = classRef.resolvedClass

    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
      return
    }

    if (klass.isInterface || klass.isAbstract) throw new Error('java.lang.InstantiationError')

    const ref = klass.newObject()
    frame.operandStack.pushRef(ref)
  }

  toString(): string {
    return `push new object of class at {${this._index}}`
  }
}
