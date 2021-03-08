import { BytecodeReader, Index16Instruction, Instruction } from '..'
import Class, { ClassConstant } from '../../class'
import ClassLoader from '../../class/ClassLoader'
import Frame from '../../thread/Frame'

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
