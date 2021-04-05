import Class, { ClassConstant, ClassRef, RuntimeConstantPool } from '.'
import { ExceptionTableEntry } from '../classFile/attributeInfo/CodeAttribute'

class ExceptionHandler {
  constructor(
    private _startPc: number,
    private _endPc: number,
    private _handlerPc: number,
    private _catchType: ClassRef
  ) {}

  get startPc(): number {
    return this._startPc
  }

  get endPc(): number {
    return this._endPc
  }

  get handlerPc(): number {
    return this._handlerPc
  }

  get catchType(): ClassRef {
    return this._catchType
  }
}

function getCatchType(idx: number, cp: RuntimeConstantPool): ClassRef {
  if (idx === 0) return null
  return (cp.getConstant(idx) as ClassConstant).data
}

export default class ExceptionTable {
  private _exceptionHandlers: ExceptionHandler[]

  constructor(entries: ExceptionTableEntry[], cp: RuntimeConstantPool) {
    this._exceptionHandlers = entries.map(
      (e) => new ExceptionHandler(e.startPc, e.endPc, e.handlerPc, getCatchType(e.catchType, cp))
    )
  }

  findExceptionHandler(exClass: Class, pc: number): ExceptionHandler {
    for (const handler of this._exceptionHandlers) {
      if (!(pc >= handler.startPc && pc < handler.endPc)) continue

      if (!handler.catchType) return handler

      const catchClass = handler.catchType.resolvedClass
      if (catchClass === exClass || catchClass.isSubClassOf(exClass)) return handler
    }
  }
}
