import Class from '../class'
import Method from '../class/ClassMember/Method'
import BaseObject from '../class/object/BaseObject'
import Frame from '../thread/Frame'
import Thread from '../thread/Thread'

export class BytecodeReader {
  private _pc = 0

  constructor(private _code?: Buffer) {}

  get pc(): number {
    return this._pc
  }

  reset(code: Buffer, pc: number): void {
    this._code = code
    this._pc = pc
  }

  readUint8(): number {
    return this._code.readUInt8(this._pc++)
  }

  readInt8(): number {
    return this._code.readInt8(this._pc++)
  }

  readUint16(): number {
    const res = this._code.readUInt16BE(this._pc)
    this._pc += 2
    return res
  }

  readInt16(): number {
    const res = this._code.readInt16BE(this._pc)
    this._pc += 2
    return res
  }

  readInt32(): number {
    const res = this._code.readInt32BE(this._pc)
    this._pc += 4
    return res
  }

  readInt32List(n: number): number[] {
    const res = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      res[i] = this.readInt32()
    }
    return res
  }

  skipPadding(): void {
    while (this._pc % 4 !== 0) this.readUint8()
  }
}

export interface Instruction {
  fetchOperands(reader: BytecodeReader): void
  execute(frame: Frame): void
}

export abstract class NoOperandsInstruction implements Instruction {
  fetchOperands(): void {
    return
  }

  abstract execute(frame: Frame): void
}

export abstract class BranchInstruction implements Instruction {
  constructor(protected _offset?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._offset = reader.readInt16()
  }

  protected branch(frame: Frame): void {
    const pc = frame.thread.pc
    frame.nextPc = pc + this._offset
  }

  abstract execute(frame: Frame): void
}

export abstract class Index8Instruction implements Instruction {
  constructor(protected _index?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._index = reader.readUint8()
  }

  abstract execute(frame: Frame): void
}

export abstract class Index16Instruction implements Instruction {
  constructor(protected _index?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._index = reader.readUint16()
  }

  abstract execute(frame: Frame): void
}

export function invokeMethod(invokerFrame: Frame, method: Method): void {
  const thread = invokerFrame.thread
  const newFrame = thread.newFrame(method)
  thread.pushFrame(newFrame)

  const argSlotCount = method.argSlotCount
  if (argSlotCount > 0) {
    for (let i = argSlotCount - 1; i >= 0; i--) {
      const slot = invokerFrame.operandStack.popSlot()
      newFrame.localVars.setSlot(i, slot)
    }
  }
}

export function initClass(thread: Thread, klass: Class): void {
  klass.startInit()
  scheduleClinit(thread, klass)
  initSuperClass(thread, klass)
}

function scheduleClinit(thread: Thread, klass: Class): void {
  const clinit = klass.clinitMethod
  if (clinit && clinit.class === klass) {
    const newFrame = thread.newFrame(clinit)
    thread.pushFrame(newFrame)
  }
}

function initSuperClass(thread: Thread, klass: Class): void {
  if (!klass.isInterface) {
    const superClass = klass.superClass
    if (superClass && !superClass.hasInitStarted) {
      initClass(thread, superClass)
    }
  }
}

export function checkNotNil(ref: BaseObject): void {
  if (!ref) throw new Error('java.lang.NullPointerException')
}

export function checkIndex(arrLen: number, idx: number): void {
  if (idx < 0 || idx >= arrLen) throw new Error('ArrayIndexOutOfBoundsException')
}
