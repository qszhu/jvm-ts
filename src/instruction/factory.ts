import { Instruction } from '.'
import { IAnd, LAnd } from './bits/and'
import { IOr, LOr } from './bits/or'
import { IShl, IShr, IUShr, LShl, LShr, LUShr } from './bits/shift'
import { IXor, LXor } from './bits/xor'
import { D2F, D2I, D2L } from './casts/d2x'
import { F2D, F2I, F2L } from './casts/f2x'
import { I2B, I2C, I2D, I2F, I2L, I2S } from './casts/i2x'
import { L2D, L2F, L2I } from './casts/l2x'
import { DCmpG, DCmpL } from './cmps/dcmp'
import { FCmpG, FCmpL } from './cmps/fcmp'
import { LCmp } from './cmps/lcmp'
import { AConstNull } from './constants/aconst'
import { DConst0, DConst1 } from './constants/dconst'
import { FConst0, FConst1, FConst2 } from './constants/fconst'
import { IConst0, IConst1, IConst2, IConst3, IConst4, IConst5, IConstM1 } from './constants/iconst'
import { BiPush, SiPush } from './constants/ipush'
import { LConst0, LConst1 } from './constants/lconst'
import { Ldc, Ldc2W, LdcW } from './constants/ldc'
import { Goto, GotoW } from './controls/goto'
import { IfEq, IfGE, IfGT, IfLE, IfLT, IfNE } from './controls/if'
import { IfACmpEq, IfACmpNE, IfNonNull, IfNull } from './controls/if_acmp'
import { IfICmpEq, IfICmpGE, IfICmpGT, IfICmpLE, IfICmpLT, IfICmpNE } from './controls/if_icmp'
import { AReturn, DReturn, FReturn, IReturn, LReturn, Return } from './controls/return'
import { LookupSwitch, TableSwitch } from './controls/switch'
import { ALoad, ALoad0, ALoad1, ALoad2, ALoad3 } from './loads/aload'
import { DLoad, DLoad0, DLoad1, DLoad2, DLoad3 } from './loads/dload'
import { FLoad, FLoad0, FLoad1, FLoad2, FLoad3 } from './loads/fload'
import { ILoad, ILoad0, ILoad1, ILoad2, ILoad3 } from './loads/iload'
import { LLoad, LLoad0, LLoad1, LLoad2, LLoad3 } from './loads/lload'
import { AALoad, BALoad, CALoad, DALoad, FALoad, IALoad, LALoad, SALoad } from './loads/xaload'
import { DAdd, FAdd, IAdd, LAdd } from './maths/add'
import { DDiv, FDiv, IDiv, LDiv } from './maths/div'
import { IInc } from './maths/inc'
import { DMul, FMul, IMul, LMul } from './maths/mul'
import { DNeg, FNeg, INeg, LNeg } from './maths/neg'
import { DRem, FRem, IRem, LRem } from './maths/rem'
import { DSub, FSub, ISub, LSub } from './maths/sub'
import { Nop } from './nop'
import { ANewArray, ArrayLength, MultiANewArray, NewArray } from './refs/array'
import { AThrow } from './refs/athrow'
import { GetField, PutField } from './refs/field'
import { CheckCast, InstanceOf } from './refs/instance'
import { InvokeInterface, InvokeSpecial, InvokeStatic, InvokeVirtual } from './refs/invoke'
import { New } from './refs/new'
import { GetStatic, PutStatic } from './refs/static'
import { InvokeNative } from './reserved/invokenative'
import { Dup, Dup2, Dup2X1, Dup2X2, DupX1, DupX2 } from './stacks/dup'
import { Pop, Pop2 } from './stacks/pop'
import { Swap } from './stacks/swap'
import { AStore, AStore0, AStore1, AStore2, AStore3 } from './stores/astore'
import { DStore, DStore0, DStore1, DStore2, DStore3 } from './stores/dstore'
import { FStore, FStore0, FStore1, FStore2, FStore3 } from './stores/fstore'
import { IStore, IStore0, IStore1, IStore2, IStore3 } from './stores/istore'
import { LStore, LStore0, LStore1, LStore2, LStore3 } from './stores/lstore'
import {
  AAStore,
  BAStore,
  CAStore,
  DAStore,
  FAStore,
  IAStore,
  LAStore,
  SAStore,
} from './stores/xastore'
import { Wide } from './wide'

// put in here in a separate file to break circular dependency
export function newInstruction(opcode: number): Instruction {
  switch (opcode) {
    case 0x00:
      return new Nop()
    case 0x01:
      return new AConstNull()
    case 0x02:
      return new IConstM1()
    case 0x03:
      return new IConst0()
    case 0x04:
      return new IConst1()
    case 0x05:
      return new IConst2()
    case 0x06:
      return new IConst3()
    case 0x07:
      return new IConst4()
    case 0x08:
      return new IConst5()
    case 0x09:
      return new LConst0()
    case 0x0a:
      return new LConst1()
    case 0x0b:
      return new FConst0()
    case 0x0c:
      return new FConst1()
    case 0x0d:
      return new FConst2()
    case 0x0e:
      return new DConst0()
    case 0x0f:
      return new DConst1()
    case 0x10:
      return new BiPush()
    case 0x11:
      return new SiPush()
    case 0x12:
      return new Ldc()
    case 0x13:
      return new LdcW()
    case 0x14:
      return new Ldc2W()
    case 0x15:
      return new ILoad()
    case 0x16:
      return new LLoad()
    case 0x17:
      return new FLoad()
    case 0x18:
      return new DLoad()
    case 0x19:
      return new ALoad()
    case 0x1a:
      return new ILoad0()
    case 0x1b:
      return new ILoad1()
    case 0x1c:
      return new ILoad2()
    case 0x1d:
      return new ILoad3()
    case 0x1e:
      return new LLoad0()
    case 0x1f:
      return new LLoad1()
    case 0x20:
      return new LLoad2()
    case 0x21:
      return new LLoad3()
    case 0x22:
      return new FLoad0()
    case 0x23:
      return new FLoad1()
    case 0x24:
      return new FLoad2()
    case 0x25:
      return new FLoad3()
    case 0x26:
      return new DLoad0()
    case 0x27:
      return new DLoad1()
    case 0x28:
      return new DLoad2()
    case 0x29:
      return new DLoad3()
    case 0x2a:
      return new ALoad0()
    case 0x2b:
      return new ALoad1()
    case 0x2c:
      return new ALoad2()
    case 0x2d:
      return new ALoad3()
    case 0x2e:
      return new IALoad()
    case 0x2f:
      return new LALoad()
    case 0x30:
      return new FALoad()
    case 0x31:
      return new DALoad()
    case 0x32:
      return new AALoad()
    case 0x33:
      return new BALoad()
    case 0x34:
      return new CALoad()
    case 0x35:
      return new SALoad()
    case 0x36:
      return new IStore()
    case 0x37:
      return new LStore()
    case 0x38:
      return new FStore()
    case 0x39:
      return new DStore()
    case 0x3a:
      return new AStore()
    case 0x3b:
      return new IStore0()
    case 0x3c:
      return new IStore1()
    case 0x3d:
      return new IStore2()
    case 0x3e:
      return new IStore3()
    case 0x3f:
      return new LStore0()
    case 0x40:
      return new LStore1()
    case 0x41:
      return new LStore2()
    case 0x42:
      return new LStore3()
    case 0x43:
      return new FStore0()
    case 0x44:
      return new FStore1()
    case 0x45:
      return new FStore2()
    case 0x46:
      return new FStore3()
    case 0x47:
      return new DStore0()
    case 0x48:
      return new DStore1()
    case 0x49:
      return new DStore2()
    case 0x4a:
      return new DStore3()
    case 0x4b:
      return new AStore0()
    case 0x4c:
      return new AStore1()
    case 0x4d:
      return new AStore2()
    case 0x4e:
      return new AStore3()
    case 0x4f:
      return new IAStore()
    case 0x50:
      return new LAStore()
    case 0x51:
      return new FAStore()
    case 0x52:
      return new DAStore()
    case 0x53:
      return new AAStore()
    case 0x54:
      return new BAStore()
    case 0x55:
      return new CAStore()
    case 0x56:
      return new SAStore()
    case 0x57:
      return new Pop()
    case 0x58:
      return new Pop2()
    case 0x59:
      return new Dup()
    case 0x5a:
      return new DupX1()
    case 0x5b:
      return new DupX2()
    case 0x5c:
      return new Dup2()
    case 0x5d:
      return new Dup2X1()
    case 0x5e:
      return new Dup2X2()
    case 0x5f:
      return new Swap()
    case 0x60:
      return new IAdd()
    case 0x61:
      return new LAdd()
    case 0x62:
      return new FAdd()
    case 0x63:
      return new DAdd()
    case 0x64:
      return new ISub()
    case 0x65:
      return new LSub()
    case 0x66:
      return new FSub()
    case 0x67:
      return new DSub()
    case 0x68:
      return new IMul()
    case 0x69:
      return new LMul()
    case 0x6a:
      return new FMul()
    case 0x6b:
      return new DMul()
    case 0x6c:
      return new IDiv()
    case 0x6d:
      return new LDiv()
    case 0x6e:
      return new FDiv()
    case 0x6f:
      return new DDiv()
    case 0x70:
      return new IRem()
    case 0x71:
      return new LRem()
    case 0x72:
      return new FRem()
    case 0x73:
      return new DRem()
    case 0x74:
      return new INeg()
    case 0x75:
      return new LNeg()
    case 0x76:
      return new FNeg()
    case 0x77:
      return new DNeg()
    case 0x78:
      return new IShl()
    case 0x79:
      return new LShl()
    case 0x7a:
      return new IShr()
    case 0x7b:
      return new LShr()
    case 0x7c:
      return new IUShr()
    case 0x7d:
      return new LUShr()
    case 0x7e:
      return new IAnd()
    case 0x7f:
      return new LAnd()
    case 0x80:
      return new IOr()
    case 0x81:
      return new LOr()
    case 0x82:
      return new IXor()
    case 0x83:
      return new LXor()
    case 0x84:
      return new IInc()
    case 0x85:
      return new I2L()
    case 0x86:
      return new I2F()
    case 0x87:
      return new I2D()
    case 0x88:
      return new L2I()
    case 0x89:
      return new L2F()
    case 0x8a:
      return new L2D()
    case 0x8b:
      return new F2I()
    case 0x8c:
      return new F2L()
    case 0x8d:
      return new F2D()
    case 0x8e:
      return new D2I()
    case 0x8f:
      return new D2L()
    case 0x90:
      return new D2F()
    case 0x91:
      return new I2B()
    case 0x92:
      return new I2C()
    case 0x93:
      return new I2S()
    case 0x94:
      return new LCmp()
    case 0x95:
      return new FCmpL()
    case 0x96:
      return new FCmpG()
    case 0x97:
      return new DCmpL()
    case 0x98:
      return new DCmpG()
    case 0x99:
      return new IfEq()
    case 0x9a:
      return new IfNE()
    case 0x9b:
      return new IfLT()
    case 0x9c:
      return new IfGE()
    case 0x9d:
      return new IfGT()
    case 0x9e:
      return new IfLE()
    case 0x9f:
      return new IfICmpEq()
    case 0xa0:
      return new IfICmpNE()
    case 0xa1:
      return new IfICmpLT()
    case 0xa2:
      return new IfICmpGE()
    case 0xa3:
      return new IfICmpGT()
    case 0xa4:
      return new IfICmpLE()
    case 0xa5:
      return new IfACmpEq()
    case 0xa6:
      return new IfACmpNE()
    case 0xa7:
      return new Goto()
    // 0xa8: JSR
    // 0xa9: RET
    case 0xaa:
      return new TableSwitch()
    case 0xab:
      return new LookupSwitch()
    case 0xac:
      return new IReturn()
    case 0xad:
      return new LReturn()
    case 0xae:
      return new FReturn()
    case 0xaf:
      return new DReturn()
    case 0xb0:
      return new AReturn()
    case 0xb1:
      return new Return()
    case 0xb2:
      return new GetStatic()
    case 0xb3:
      return new PutStatic()
    case 0xb4:
      return new GetField()
    case 0xb5:
      return new PutField()
    case 0xb6:
      return new InvokeVirtual()
    case 0xb7:
      return new InvokeSpecial()
    case 0xb8:
      return new InvokeStatic()
    case 0xb9:
      return new InvokeInterface()
    // 0xba: InvokeDynamic
    case 0xbb:
      return new New()
    case 0xbc:
      return new NewArray()
    case 0xbd:
      return new ANewArray()
    case 0xbe:
      return new ArrayLength()
    case 0xbf:
      return new AThrow()
    case 0xc0:
      return new CheckCast()
    case 0xc1:
      return new InstanceOf()
    // 0xc2: MonitorEnter
    // 0xc3: MonitorExit
    case 0xc4:
      return new Wide()
    case 0xc5:
      return new MultiANewArray()
    case 0xc6:
      return new IfNull()
    case 0xc7:
      return new IfNonNull()
    case 0xc8:
      return new GotoW()
    // 0xc9: JSRW
    // 0xca: Breakpoint
    case 0xfe:
      return new InvokeNative()
    // 0xff: ImpDep2
    default:
      throw new Error(`Unsupported opcode: 0x${opcode.toString(16)}`)
  }
}
