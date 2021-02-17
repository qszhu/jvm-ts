import { BranchInstruction, BytecodeReader, Instruction } from '.'
import Frame from '../thread/Frame'
import { ILoad } from './loads'
import { IInc } from './maths'

export class Wide implements Instruction {
  constructor(private _inst: Instruction) {}

  fetchOperands(reader: BytecodeReader): void {
    const opcode = reader.readUint8()
    switch (opcode) {
      case 0x15: // iload
        this._inst = new ILoad(reader.readUint16())
        break
      case 0x16: // lload
        break
      case 0x17: // fload
        break
      case 0x18: // dload
        break
      case 0x19: // aload
        break
      case 0x36: // istore
        break
      case 0x37: // lstore
        break
      case 0x38: // fstore
        break
      case 0x39: // dstore
        break
      case 0x3a: // astore
        break
      case 0x84: // iinc
        this._inst = new IInc(reader.readUint16(), reader.readUint16())
        break
      case 0xa9: // ret
        throw new Error('Unsupported opcode: 0xa9')
    }
  }

  execute(frame: Frame): void {
    this._inst.execute(frame)
  }
}
