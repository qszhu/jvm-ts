import { Index16Instruction, initClass } from '..'
import { ClassConstant } from '../../class/RuntimeConstant'
import Frame from '../../thread/Frame'

export class New extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const classRef = (cp.getConstant(this._index) as ClassConstant).data
    const klass = classRef.resolvedClass

    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
      return
    }

    if (klass.accessFlags.isInterface || klass.accessFlags.isAbstract)
      throw new Error('java.lang.InstantiationError')

    const ref = klass.newObject()
    frame.operandStack.pushRef(ref)
  }

  toString(): string {
    return `push new object of class at {${this._index}}`
  }
}
