import ArrayClass from '../../class/class/ArrayClass'
import ClassLoader from '../../class/class/ClassLoader'
import ArrayObject from '../../class/object/ArrayObject'
import Frame from '../../thread/Frame'
import OperandStack from '../../thread/OperandStack'
import Index16Instruction from '../base/Index16Instruction'
import Instruction from '../base/Instruction'
import NoOperandsInstruction from '../base/NoOperandsInstruction'
import BytecodeReader from '../BytecodeReader'

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

function getPrimitiveArrayClass(loader: ClassLoader, atype: number): ArrayClass {
  switch (atype) {
    case AType.Boolean:
      return loader.loadClass('[Z') as ArrayClass
    case AType.Byte:
      return loader.loadClass('[B') as ArrayClass
    case AType.Char:
      return loader.loadClass('[C') as ArrayClass
    case AType.Short:
      return loader.loadClass('[S') as ArrayClass
    case AType.Int:
      return loader.loadClass('[I') as ArrayClass
    case AType.Long:
      return loader.loadClass('[J') as ArrayClass
    case AType.Float:
      return loader.loadClass('[F') as ArrayClass
    case AType.Double:
      return loader.loadClass('[D') as ArrayClass
    default:
      throw new Error('Invalid atype')
  }
}

export class NewArray implements Instruction {
  // can use Index8Instruction
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

  toString(): string {
    return `push new ${AType[this._atype]} array size a`
  }
}

export class ANewArray extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const classRef = cp.getClassRef(this._index)
    const componentClass = classRef.resolvedClass

    const stack = frame.operandStack
    const count = stack.popInt()
    if (count < 0) throw new Error('java.lang.NegativeArraySizeException')

    const arrClass = componentClass.arrayClass
    const arr = arrClass.newArray(count)
    stack.pushRef(arr)
  }

  toString(): string {
    return `push new array of type {${this._index}} size a`
  }
}

export class ArrayLength extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const arrRef = stack.popRef() as ArrayObject
    if (!arrRef) throw new Error('java.lang.NullPointerException')
    const arrLen = arrRef.arrayLength
    stack.pushInt(arrLen)
  }

  toString(): string {
    return `push array length of a`
  }
}

export class MultiANewArray implements Instruction {
  constructor(private _index?: number, private _dims?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._index = reader.readUint16()
    this._dims = reader.readUint8()
  }

  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const classRef = cp.getClassRef(this._index)
    const arrClass = classRef.resolvedClass as ArrayClass
    const stack = frame.operandStack
    const counts = popAndCheckCounts(stack, this._dims)
    const arr = newMultiDimensionalArray(counts, arrClass)
    stack.pushRef(arr)
  }

  toString(): string {
    return `push new ${this._dims} dimensional array of type {${this._index}} size a`
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

function newMultiDimensionalArray(counts: number[], arrClass: ArrayClass) {
  const count = counts[0]
  const arr = arrClass.newArray(count)
  if (counts.length > 1) {
    const refs = arr.refs
    for (let i = 0; i < refs.length; i++) {
      refs[i] = newMultiDimensionalArray(counts.slice(1), arrClass.componentClass as ArrayClass)
    }
  }
  return arr
}
