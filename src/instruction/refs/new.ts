import { Index16Instruction } from '..'
import { ClassConstant, RuntimeConstantPool } from '../../class'
import Frame from '../../thread/Frame'

export class New extends Index16Instruction {
  execute(frame: Frame): void {
    const cp: RuntimeConstantPool = frame.method.class.constantPool
    const classRef = (cp.getConstant(this._index) as ClassConstant).data
    const cls = classRef.resolvedClass
    if (cls.isInterface || cls.isAbstract) throw new Error('java.lang.InstantiationError')

    const ref = cls.newObject()
    frame.operandStack.pushRef(ref)
  }
}
