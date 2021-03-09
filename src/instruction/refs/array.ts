import { BytecodeReader, Index16Instruction, Instruction, NoOperandsInstruction } from '..'
import Class, { ClassConstant } from '../../class'
import ClassLoader from '../../class/ClassLoader'
import Obj from '../../class/Obj'
import Frame, { OperandStack } from '../../thread/Frame'

enum AType {
  Boolean = 4,
  Char = 5,
  Float = 6,
  Double = 7,
  Byte = 8,
  Short = 9,
  Int = 10,
  Long = 11,
}

function getPrimitiveArrayClass(loader: ClassLoader, atype: number): Class {
  switch (atype) {
    case AType.Boolean:
      return loader.loadClass('[Z')
    case AType.Byte:
      return loader.loadClass('[B')
    case AType.Char:
      return loader.loadClass('[C')
    case AType.Short:
      return loader.loadClass('[S')
    case AType.Int:
      return loader.loadClass('[I')
    case AType.Long:
      return loader.loadClass('[J')
    case AType.Float:
      return loader.loadClass('[F')
    case AType.Double:
      return loader.loadClass('[D')
    default:
      throw new Error('Invalid atype')
  }
}

export class NewArray implements Instruction { // can use Index8Instruction
  constructor(private _atype?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._atype = reader.readUint8()
  }

  execute(frame: Frame): void {
    const stack = frame.operandStack
    const count = stack.popInt()
    if (count < 0) throw new Error('java.lang.NegativeArraySizeException')

    const classLoader = frame.method.class.loader
    const arrClass = getPrimitiveArrayClass(classLoader, this._atype)
    const arr = arrClass.newArray(count)
    stack.pushRef(arr)
  }
}

export class ANewArray extends Index16Instruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const count = stack.popInt()
    if (count < 0) throw new Error('java.lang.NegativeArraySizeException')

    const cp = frame.method.class.constantPool
    const classRef = (cp.getConstant(this._index) as ClassConstant).data
    const componentClass = classRef.resolvedClass
    const arrClass = componentClass.arrayClass
    const arr = arrClass.newArray(count)
    stack.pushRef(arr)
  }
}

export class ArrayLength extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const arrRef = stack.popRef()
    if (!arrRef) throw new Error('java.lang.NullPointerException')
    const arrLen = (arrRef as Obj).arrayLength
    stack.pushInt(arrLen)
  }
}

export class MultiANewArray implements Instruction {
  constructor(private _idx?: number, private _dims?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._idx = reader.readUint16()
    this._dims = reader.readUint8()
  }

  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const classRef = (cp.getConstant(this._idx) as ClassConstant).data
    const arrClass = classRef.resolvedClass
    const stack = frame.operandStack
    const counts = popAndCheckCounts(stack, this._dims)
    const arr = newMultiDimensionalArray(counts, arrClass)
    stack.pushRef(arr)
  }
}

function popAndCheckCounts(stack: OperandStack, dims: number) {
  const counts = new Array(dims).fill(0)
  for (let i = dims - 1; i >= 0; i--) {
    counts[i] = stack.popInt()
    if (counts[i] < 0) throw new Error('java.lang.NegativeArraySizeException')
  }
  return counts
}

function newMultiDimensionalArray(counts: number[], arrClass: Class) {
  const count = counts[0]
  const arr = arrClass.newArray(count)
  if (counts.length > 1) {
    const refs = arr.refs
    for (let i = 0; i < refs.length; i++) {
      refs[i] = newMultiDimensionalArray(counts.slice(1), arrClass.componentClass)
    }
  }
  return arr
}
