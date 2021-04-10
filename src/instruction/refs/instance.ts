import { Index16Instruction } from '..'
import BaseObject from '../../class/object/BaseObject'
import { ClassConstant } from '../../class/RuntimeConstant'
import Frame from '../../thread/Frame'

function instanceOf(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const ref = stack.popRef() as BaseObject
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

  toString(): string {
    return `push whether a is instanceof class at {${this._index}}`
  }
}

export class CheckCast extends Index16Instruction {
  execute(frame: Frame): void {
    const { stack, ref, res } = instanceOf(frame, this._index)
    stack.pushRef(ref)
    if (!res) throw new Error('java.lang.ClassCastException')
  }

  toString(): string {
    return `check whether a is instanceof class at {${this._index}}`
  }
}
