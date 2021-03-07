import { Index16Instruction, initClass } from '..'
import { ClassConstant, RuntimeConstantPool } from '../../class'
import Frame from '../../thread/Frame'

export class New extends Index16Instruction {
  execute(frame: Frame): void {
    const cp: RuntimeConstantPool = frame.method.class.constantPool
    const classRef = (cp.getConstant(this._index) as ClassConstant).data
    const klass = classRef.resolvedClass

    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
    }

    if (klass.isInterface || klass.isAbstract) throw new Error('java.lang.InstantiationError')

    const ref = klass.newObject()
    frame.operandStack.pushRef(ref)
  }
}
