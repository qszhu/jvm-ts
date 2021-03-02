import { BytecodeReader, Instruction } from '.'
import Frame from '../thread/Frame'
import { ALoad } from './loads/aload'
import { DLoad } from './loads/dload'
import { FLoad } from './loads/fload'
import { ILoad } from './loads/iload'
import { LLoad } from './loads/lload'
import { AStore } from './stores/astore'
import { DStore } from './stores/dstore'
import { FStore } from './stores/fstore'
import { IStore } from './stores/istore'
import { LStore } from './stores/lstore'
import { IInc } from './maths/inc'

export class Wide implements Instruction {
  constructor(private _inst?: Instruction) {}

  fetchOperands(reader: BytecodeReader): void {
    const opcode = reader.readUint8()
    switch (opcode) {
      case 0x15: // iload
        this._inst = new ILoad(reader.readUint16())
        break
      case 0x16: // lload
        this._inst = new LLoad(reader.readUint16())
        break
      case 0x17: // fload
        this._inst = new FLoad(reader.readUint16())
        break
      case 0x18: // dload
        this._inst = new DLoad(reader.readUint16())
        break
      case 0x19: // aload
        this._inst = new ALoad(reader.readUint16())
        break
      case 0x36: // istore
        this._inst = new IStore(reader.readUint16())
        break
      case 0x37: // lstore
        this._inst = new LStore(reader.readUint16())
        break
      case 0x38: // fstore
        this._inst = new FStore(reader.readUint16())
        break
      case 0x39: // dstore
        this._inst = new DStore(reader.readUint16())
        break
      case 0x3a: // astore
        this._inst = new AStore(reader.readUint16())
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
