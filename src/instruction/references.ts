import { Index16Instruction } from '.'
import { ClassRef, ConstantPool, FieldRef, Obj } from '../heap'
import Frame from '../thread/Frame'

export class New extends Index16Instruction {
  execute(frame: Frame): void {
    const cp: ConstantPool = frame.method.class.constantPool
    const classRef = cp.getConstant(this._index) as ClassRef
    const cls = classRef.resolvedClass
    if (cls.isInterface || cls.isAbstract) throw new Error('java.lang.InstantiationError')

    const ref = cls.newObject()
    frame.operandStack.pushRef(ref)
  }
}

export class PutStatic extends Index16Instruction {
  execute(frame: Frame): void {
    const curMethod = frame.method
    const curClass = curMethod.class
    const cp = curClass.constantPool
    const fieldRef = cp.getConstant(this._index) as FieldRef
    const field = fieldRef.resolvedField
    const klass = field.class

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
}

export class GetStatic extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const fieldRef = cp.getConstant(this._index) as FieldRef
    const field = fieldRef.resolvedField

    if (!field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const {
      descriptor,
      slotId,
      class: { staticVars: slots },
    } = field
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
}

export class PutField extends Index16Instruction {
  execute(frame: Frame): void {
    const curMethod = frame.method
    const curClass = curMethod.class
    const cp = curClass.constantPool
    const fieldRef = cp.getConstant(this._index) as FieldRef
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
        ref = stack.popRef() as Obj
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setInt(slotId, val)
        break
      case 'F':
        val = stack.popFloat()
        ref = stack.popRef() as Obj
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setFloat(slotId, val)
        break
      case 'J':
        val = stack.popLong()
        ref = stack.popRef() as Obj
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setLong(slotId, val)
        break
      case 'D':
        val = stack.popDouble()
        ref = stack.popRef() as Obj
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setDouble(slotId, val)
        break
      case 'L':
      case '[':
        val = stack.popRef()
        ref = stack.popRef() as Obj
        if (!ref) throw new Error('java.lang.NullPointerException')
        ref.fields.setRef(slotId, val)
        break
    }
  }
}

export class GetField extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const fieldRef = cp.getConstant(this._index) as FieldRef
    const field = fieldRef.resolvedField

    if (field.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const stack = frame.operandStack
    const ref = stack.popRef() as Obj
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
}

function instanceOf(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const ref = stack.popRef() as Obj
  if (!ref) return { stack, ref, res: false }

  const cp = frame.method.class.constantPool
  const classRef = cp.getConstant(idx) as ClassRef
  const klass = classRef.resolvedClass
  return { stack, ref, res: ref.isInstanceOf(klass) }
}

export class InstanceOf extends Index16Instruction {
  execute(frame: Frame): void {
    const { stack, ref, res } = instanceOf(frame, this._index)
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
