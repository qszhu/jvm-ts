import ClassMember from '.'
import Class from '..'
import MemberInfo from '../../classFile/MemberInfo'
import AccessFlag from '../AccessFlag'
import MethodDescriptorParser from './MethodDescriptor'

export default class Method extends ClassMember {
  private _maxStack: number
  private _maxLocals: number
  private _code: Buffer
  private _argSlotCount: number

  constructor(klass: Class, method: MemberInfo) {
    super(klass, method)
    if (method.codeAttribute) {
      const codeAttr = method.codeAttribute
      this._maxStack = codeAttr.maxStack
      this._maxLocals = codeAttr.maxLocals
      this._code = codeAttr.code
    }
    this.calcArgSlotCount()
  }

  private calcArgSlotCount() {
    this._argSlotCount = 0
    const parsedDescriptor = MethodDescriptorParser.parseMethodDescriptor(this._descriptor)
    for (const paramType of parsedDescriptor.parameterTypes) {
      this._argSlotCount++
      if (paramType === 'J' || paramType === 'D') this._argSlotCount++
    }
    if (!this.isStatic) this._argSlotCount++
  }

  static newMethods(klass: Class, methods: MemberInfo[]): Method[] {
    const res = new Array(methods.length).fill(null)
    for (let i = 0; i < res.length; i++) {
      res[i] = new Method(klass, methods[i])
    }
    return res
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
}