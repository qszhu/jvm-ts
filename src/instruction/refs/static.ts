import Frame from '../../thread/Frame'
import Index16Instruction from '../base/Index16Instruction'
import { initClass } from '../utils'

export class PutStatic extends Index16Instruction {
  execute(frame: Frame): void {
    const curMethod = frame.method
    const curClass = curMethod.class
    const cp = curClass.constantPool
    const fieldRef = cp.getFieldRef(this._index)
    const field = fieldRef.resolvedField
    const klass = field.class

    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
      return
    }

    if (!field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    if (field.isFinal) {
      if (curClass !== klass || curMethod.name !== '<clinit>')
        throw new Error('java.lang.IllegalAccessError')
    }

    const { descriptor, slotId } = field
    const slots = klass.staticVars
    const stack = frame.operandStack
    switch (descriptor[0]) {
      case 'Z':
      case 'B':
      case 'C':
      case 'S':
      case 'I':
        slots.setInt(slotId, stack.popInt())
        break
      case 'F':
        slots.setFloat(slotId, stack.popFloat())
        break
      case 'J':
        slots.setLong(slotId, stack.popLong())
        break
      case 'D':
        slots.setDouble(slotId, stack.popDouble())
        break
      case 'L':
      case '[':
        slots.setRef(slotId, stack.popRef())
        break
    }
  }

  toString(): string {
    return `pop to static field value at {${this._index}}`
  }
}

export class GetStatic extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const fieldRef = cp.getFieldRef(this._index)
    const field = fieldRef.resolvedField
    const klass = field.class

    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
      return
    }

    if (!field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const { descriptor, slotId } = field
    const slots = klass.staticVars
    const stack = frame.operandStack

    switch (descriptor[0]) {
      case 'Z':
      case 'B':
      case 'C':
      case 'S':
      case 'I':
        stack.pushInt(slots.getInt(slotId))
        break
      case 'F':
        stack.pushFloat(slots.getFloat(slotId))
        break
      case 'J':
        stack.pushLong(slots.getLong(slotId))
        break
      case 'D':
        stack.pushDouble(slots.getDouble(slotId))
        break
      case 'L':
      case '[':
        stack.pushRef(slots.getRef(slotId))
        break
    }
  }

  toString(): string {
    return `push static field value at {${this._index}}`
  }
}
