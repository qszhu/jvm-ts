import { Index16Instruction, Index8Instruction } from '..'
import {
  ClassConstant,
  DoubleConstant,
  FloatConstant,
  IntegerConstant,
  LongConstant,
  StringConstant,
} from '../../class'
import Frame from '../../thread/Frame'

function ldc(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const cp = frame.method.class.constantPool
  const c = cp.getConstant(idx)
  if (c instanceof IntegerConstant) {
    stack.pushInt(c.data)
  } else if (c instanceof FloatConstant) {
    stack.pushFloat(c.data)
  } else if (c instanceof StringConstant) {
  } else if (c instanceof ClassConstant) {
  } else {
    throw new Error('ldc not implemented')
  }
}

export class Ldc extends Index8Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }
}

export class LdcW extends Index16Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }
}

export class Ldc2W extends Index16Instruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const cp = frame.method.class.constantPool
    const c = cp.getConstant(this._index)
    if (c instanceof LongConstant) {
      stack.pushLong(c.data)
    } else if (c instanceof DoubleConstant) {
      stack.pushDouble(c.data)
    } else {
      throw new Error('java.lang.ClassFormatError')
    }
  }
}
