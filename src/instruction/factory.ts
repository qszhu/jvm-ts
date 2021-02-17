import { Instruction } from '.'
import { BiPush, IConst0, IConst1 } from './constants'
import { Goto, IfICmpGT } from './controls'
import { ILoad1, ILoad2 } from './loads'
import { IAdd, IInc } from './maths'
import { IStore1, IStore2 } from './stores'

// put in here in a separate file to break circular dependency
export function newInstruction(opcode: number): Instruction {
  switch (opcode) {
    case 0x03:
      return new IConst0()
    case 0x04:
      return new IConst1()
    case 0x10:
      return new BiPush()
    case 0x1b:
      return new ILoad1()
    case 0x1c:
      return new ILoad2()
    case 0x3c:
      return new IStore1()
    case 0x3d:
      return new IStore2()
    case 0x60:
      return new IAdd()
    case 0x84:
      return new IInc()
    case 0xa3:
      return new IfICmpGT()
    case 0xa7:
      return new Goto()
    default:
      throw new Error(`Unsupported opcode: 0x${opcode.toString(16)}`)
  }
}
