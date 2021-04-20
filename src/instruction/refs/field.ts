import InstanceObject from '../../class/object/InstanceObject'
import Frame from '../../thread/Frame'
import Index16Instruction from '../base/Index16Instruction'

export class PutField extends Index16Instruction {
  execute(frame: Frame): void {
    const curMethod = frame.method
    const curClass = curMethod.class
    const cp = curClass.constantPool
    const fieldRef = cp.getFieldRef(this._index)
    const field = fieldRef.resolvedField

    if (field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    if (field.isFinal) {
      if (curClass !== field.class || curMethod.name !== '<init>')
        throw new Error('java.lang.IllegalAccessError')
    }

    const { descriptor, slotId } = field
    const stack = frame.operandStack
    let val, ref
    switch (descriptor[0]) {
      case 'Z':
      case 'B':
      case 'C':
      case 'S':
      case 'I':
        val = stack.popInt()
        ref = stack.popRef() as InstanceObject
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setInt(slotId, val)
        break
      case 'F':
        val = stack.popFloat()
        ref = stack.popRef() as InstanceObject
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setFloat(slotId, val)
        break
      case 'J':
        val = stack.popLong()
        ref = stack.popRef() as InstanceObject
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setLong(slotId, val)
        break
      case 'D':
        val = stack.popDouble()
        ref = stack.popRef() as InstanceObject
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setDouble(slotId, val)
        break
      case 'L':
      case '[':
        val = stack.popRef()
        ref = stack.popRef() as InstanceObject
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setRef(slotId, val)
        break
    }
  }

  toString(): string {
    return `set a's field at {${this._index}} with value b`
  }
}

export class GetField extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const fieldRef = cp.getFieldRef(this._index)
    const field = fieldRef.resolvedField

    if (field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const stack = frame.operandStack
    const ref = stack.popRef() as InstanceObject
    if (!ref) throw new Error('java.lang.NullPointerException')

    const { descriptor, slotId } = field
    const slots = ref.fields
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
    return `push a's field at {${this._index}}`
  }
}
