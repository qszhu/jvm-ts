import Frame from '../../thread/Frame'
import Instruction from '../base/Instruction'
import BytecodeReader from '../BytecodeReader'

export class BiPush implements Instruction {
  constructor(private _val?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._val = reader.readInt8()
  }

  execute(frame: Frame): void {
    frame.operandStack.pushInt(this._val)
  }

  toString(): string {
    return `push int ${this._val}`
  }
}

export class SiPush implements Instruction {
  constructor(private _val?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._val = reader.readInt16()
  }

  execute(frame: Frame): void {
    frame.operandStack.pushInt(this._val)
  }

  toString(): string {
    return `push int ${this._val}`
  }
}
