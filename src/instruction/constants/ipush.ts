import { Instruction, BytecodeReader } from '..'
import Frame from '../../thread/Frame'

export class BiPush implements Instruction {
  constructor(private _val?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._val = reader.readInt8()
  }

  execute(frame: Frame): void {
    frame.operandStack.pushInt(this._val)
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
}
