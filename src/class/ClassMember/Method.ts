import ClassMember from '.'
import Class from '..'
import LineNumberTableAttribute from '../../classFile/attributeInfo/LineNumberTableAttribute'
import MemberInfo from '../../classFile/MemberInfo'
import AccessFlag from '../AccessFlag'
import ExceptionTable from '../ExceptionTable'
import MethodDescriptorParser from './MethodDescriptor'

function newByteCodes(...bytes: number[]): Buffer {
  return Buffer.from(bytes)
}

export default class Method extends ClassMember {
  private _maxStack: number
  private _maxLocals: number
  private _code: Buffer
  private _exceptionTable: ExceptionTable
  private _lineNumberTable: LineNumberTableAttribute
  private _argSlotCount = 0

  toString(): string {
    return `Method: ${this.name}${this.descriptor}`
  }

  constructor(klass: Class, method: MemberInfo) {
    super(klass, method)
    if (method.codeAttribute) {
      const codeAttr = method.codeAttribute
      this._maxStack = codeAttr.maxStack
      this._maxLocals = codeAttr.maxLocals
      this._code = codeAttr.code
      this._lineNumberTable = codeAttr.lineNumberTableAttribute
      this._exceptionTable = new ExceptionTable(codeAttr.exceptionTable, klass.constantPool)
    }
    const md = MethodDescriptorParser.parseMethodDescriptor(this._descriptor)
    this.calcArgSlotCount(md.parameterTypes)
    if (this.isNative) {
      this.injectCodeAttribute(md.returnType)
    }
  }

  private calcArgSlotCount(paramTypes: string[]) {
    for (const paramType of paramTypes) {
      this._argSlotCount++
      if (paramType === 'J' || paramType === 'D') this._argSlotCount++
    }
    if (!this.isStatic) this._argSlotCount++
  }

  private injectCodeAttribute(returnType: string) {
    this._maxStack = 4
    this._maxLocals = this._argSlotCount
    switch (returnType[0]) {
      case 'V':
        this._code = newByteCodes(0xfe, 0xb1) // return
        break
      case 'L':
      case '[':
        this._code = newByteCodes(0xfe, 0xb0) // areturn
        break
      case 'D':
        this._code = newByteCodes(0xfe, 0xaf) // dreturn
        break
      case 'F':
        this._code = newByteCodes(0xfe, 0xae) // freturn
        break
      case 'J':
        this._code = newByteCodes(0xfe, 0xad) // lreturn
        break
      default:
        this._code = newByteCodes(0xfe, 0xac) // ireturn
        break
    }
  }

  static newMethods(klass: Class, methods: MemberInfo[]): Method[] {
    return methods.map((m) => new Method(klass, m))
  }

  get isSynchronized(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNCHRONIZED)
  }

  get isBridge(): boolean {
    return this.hasAccessFlag(AccessFlag.BRIDGE)
  }

  get isVarArgs(): boolean {
    return this.hasAccessFlag(AccessFlag.VARARGS)
  }

  get isNative(): boolean {
    return this.hasAccessFlag(AccessFlag.NATIVE)
  }

  get isAbstract(): boolean {
    return this.hasAccessFlag(AccessFlag.ABSTRACT)
  }

  get isStrict(): boolean {
    return this.hasAccessFlag(AccessFlag.STRICT)
  }

  get isSynthetic(): boolean {
    return this.hasAccessFlag(AccessFlag.SYNTHETIC)
  }

  get maxLocals(): number {
    return this._maxLocals
  }

  get maxStack(): number {
    return this._maxStack
  }

  get code(): Buffer {
    return this._code
  }

  get argSlotCount(): number {
    return this._argSlotCount
  }

  findExceptionHandler(exClass: Class, pc: number): number {
    const handler = this._exceptionTable.findExceptionHandler(exClass, pc)
    if (handler) return handler.handlerPc
    return -1
  }

  getLineNumber(pc: number): number {
    if (this.isNative) return -2
    if (!this._lineNumberTable) return -1
    return this._lineNumberTable.getLineNumber(pc)
  }
}
