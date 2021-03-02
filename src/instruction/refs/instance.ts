import { Index16Instruction } from '..'
import { ClassConstant } from '../../class'
import Obj from '../../class/Obj'
import Frame from '../../thread/Frame'

function instanceOf(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const ref = stack.popRef() as Obj
  if (!ref) return { stack, ref, res: false }

  const cp = frame.method.class.constantPool
  const classRef = (cp.getConstant(idx) as ClassConstant).data
  const klass = classRef.resolvedClass
  return { stack, ref, res: ref.isInstanceOf(klass) }
}

export class InstanceOf extends Index16Instruction {
  execute(frame: Frame): void {
    const { stack, res } = instanceOf(frame, this._index)
    stack.pushInt(res ? 1 : 0)
  }
}

export class CheckCast extends Index16Instruction {
  execute(frame: Frame): void {
    const { stack, ref, res } = instanceOf(frame, this._index)
    stack.pushRef(ref)
    if (!res) throw new Error('java.lang.ClassCastException')
  }
}
