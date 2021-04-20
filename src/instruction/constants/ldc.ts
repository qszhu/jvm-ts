import {
  ClassConstant,
  DoubleConstant,
  FloatConstant,
  IntegerConstant,
  LongConstant,
  StringConstant,
} from '../../class/constantPool/RuntimeConstant'
import StringPool from '../../class/StringPool'
import Frame from '../../thread/Frame'
import Index16Instruction from '../base/Index16Instruction'
import Index8Instruction from '../base/Index8Instruction'

function ldc(frame: Frame, idx: number) {
  const stack = frame.operandStack
  const klass = frame.method.class
  const c = klass.constantPool.getConstant(idx)
  if (c instanceof IntegerConstant) {
    stack.pushInt(c.data)
  } else if (c instanceof FloatConstant) {
    stack.pushFloat(c.data)
  } else if (c instanceof StringConstant) {
    const internedStr = StringPool.jString(klass.loader, c.data)
    stack.pushRef(internedStr)
  } else if (c instanceof ClassConstant) {
    const classRef = c.data
    const classObj = classRef.resolvedClass.jClass
    stack.pushRef(classObj)
  } else {
    throw new Error('ldc not implemented')
  }
}

export class Ldc extends Index8Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }

  toString(): string {
    return `push constant at {${this._index}}`
  }
}

export class LdcW extends Index16Instruction {
  execute(frame: Frame): void {
    ldc(frame, this._index)
  }

  toString(): string {
    return `push constant at {${this._index}}`
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

  toString(): string {
    return `push constant at {${this._index}}`
  }
}
