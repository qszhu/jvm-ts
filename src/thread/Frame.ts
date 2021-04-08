import Method from '../class/ClassMember/Method'
import OperandStack from './OperandStack'
import Slots from './Slots'
import Thread from './Thread'

export default class Frame {
  private _localVars: Slots
  private _operandStack: OperandStack
  private _nextPc = 0

  constructor(private _thread: Thread, private _method: Method) {
    this._localVars = new Slots(this._method.maxLocals)
    this._operandStack = new OperandStack(this._method.maxStack)
  }

  get localVars(): Slots {
    return this._localVars
  }

  get operandStack(): OperandStack {
    return this._operandStack
  }

  get thread(): Thread {
    return this._thread
  }

  get method(): Method {
    return this._method
  }

  get nextPc(): number {
    return this._nextPc
  }

  set nextPc(pc: number) {
    this._nextPc = pc
  }

  revertNextPc(): void {
    this._nextPc = this._thread.pc
  }

  toString(): string {
    return `
Frame:

Method: ${this.method.class.name}.${this.method.name}${this.method.descriptor}

Local vars:
${this._localVars.toString()}

Operand stack:
${this._operandStack.toString()}
`
  }
}
