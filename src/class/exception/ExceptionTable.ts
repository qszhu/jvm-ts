import ExceptionTableEntry from '../../classFile/attributeInfo/tableEntry/ExceptionTableEntry'
import Class from '../Class'
import { ClassConstant } from '../constantPool/RuntimeConstant'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import ClassRef from '../ref/ClassRef'
import ExceptionHandler from './ExceptionHandler'

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
