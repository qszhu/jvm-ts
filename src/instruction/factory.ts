import { Instruction, UnimplementedInstruction } from '.'
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

const INSTRUCTIONS = [
  // 0x00:
  new Nop(),
  // 0x01:
  new AConstNull(),
  // 0x02:
  new IConstM1(),
  // 0x03:
  new IConst0(),
  // 0x04:
  new IConst1(),
  // 0x05:
  new IConst2(),
  // 0x06:
  new IConst3(),
  // 0x07:
  new IConst4(),
  // 0x08:
  new IConst5(),
  // 0x09:
  new LConst0(),
  // 0x0a:
  new LConst1(),
  // 0x0b:
  new FConst0(),
  // 0x0c:
  new FConst1(),
  // 0x0d:
  new FConst2(),
  // 0x0e:
  new DConst0(),
  // 0x0f:
  new DConst1(),
  // 0x10:
  new BiPush(),
  // 0x11:
  new SiPush(),
  // 0x12:
  new Ldc(),
  // 0x13:
  new LdcW(),
  // 0x14:
  new Ldc2W(),
  // 0x15:
  new ILoad(),
  // 0x16:
  new LLoad(),
  // 0x17:
  new FLoad(),
  // 0x18:
  new DLoad(),
  // 0x19:
  new ALoad(),
  // 0x1a:
  new ILoad0(),
  // 0x1b:
  new ILoad1(),
  // 0x1c:
  new ILoad2(),
  // 0x1d:
  new ILoad3(),
  // 0x1e:
  new LLoad0(),
  // 0x1f:
  new LLoad1(),
  // 0x20:
  new LLoad2(),
  // 0x21:
  new LLoad3(),
  // 0x22:
  new FLoad0(),
  // 0x23:
  new FLoad1(),
  // 0x24:
  new FLoad2(),
  // 0x25:
  new FLoad3(),
  // 0x26:
  new DLoad0(),
  // 0x27:
  new DLoad1(),
  // 0x28:
  new DLoad2(),
  // 0x29:
  new DLoad3(),
  // 0x2a:
  new ALoad0(),
  // 0x2b:
  new ALoad1(),
  // 0x2c:
  new ALoad2(),
  // 0x2d:
  new ALoad3(),
  // 0x2e:
  new IALoad(),
  // 0x2f:
  new LALoad(),
  // 0x30:
  new FALoad(),
  // 0x31:
  new DALoad(),
  // 0x32:
  new AALoad(),
  // 0x33:
  new BALoad(),
  // 0x34:
  new CALoad(),
  // 0x35:
  new SALoad(),
  // 0x36:
  new IStore(),
  // 0x37:
  new LStore(),
  // 0x38:
  new FStore(),
  // 0x39:
  new DStore(),
  // 0x3a:
  new AStore(),
  // 0x3b:
  new IStore0(),
  // 0x3c:
  new IStore1(),
  // 0x3d:
  new IStore2(),
  // 0x3e:
  new IStore3(),
  // 0x3f:
  new LStore0(),
  // 0x40:
  new LStore1(),
  // 0x41:
  new LStore2(),
  // 0x42:
  new LStore3(),
  // 0x43:
  new FStore0(),
  // 0x44:
  new FStore1(),
  // 0x45:
  new FStore2(),
  // 0x46:
  new FStore3(),
  // 0x47:
  new DStore0(),
  // 0x48:
  new DStore1(),
  // 0x49:
  new DStore2(),
  // 0x4a:
  new DStore3(),
  // 0x4b:
  new AStore0(),
  // 0x4c:
  new AStore1(),
  // 0x4d:
  new AStore2(),
  // 0x4e:
  new AStore3(),
  // 0x4f:
  new IAStore(),
  // 0x50:
  new LAStore(),
  // 0x51:
  new FAStore(),
  // 0x52:
  new DAStore(),
  // 0x53:
  new AAStore(),
  // 0x54:
  new BAStore(),
  // 0x55:
  new CAStore(),
  // 0x56:
  new SAStore(),
  // 0x57:
  new Pop(),
  // 0x58:
  new Pop2(),
  // 0x59:
  new Dup(),
  // 0x5a:
  new DupX1(),
  // 0x5b:
  new DupX2(),
  // 0x5c:
  new Dup2(),
  // 0x5d:
  new Dup2X1(),
  // 0x5e:
  new Dup2X2(),
  // 0x5f:
  new Swap(),
  // 0x60:
  new IAdd(),
  // 0x61:
  new LAdd(),
  // 0x62:
  new FAdd(),
  // 0x63:
  new DAdd(),
  // 0x64:
  new ISub(),
  // 0x65:
  new LSub(),
  // 0x66:
  new FSub(),
  // 0x67:
  new DSub(),
  // 0x68:
  new IMul(),
  // 0x69:
  new LMul(),
  // 0x6a:
  new FMul(),
  // 0x6b:
  new DMul(),
  // 0x6c:
  new IDiv(),
  // 0x6d:
  new LDiv(),
  // 0x6e:
  new FDiv(),
  // 0x6f:
  new DDiv(),
  // 0x70:
  new IRem(),
  // 0x71:
  new LRem(),
  // 0x72:
  new FRem(),
  // 0x73:
  new DRem(),
  // 0x74:
  new INeg(),
  // 0x75:
  new LNeg(),
  // 0x76:
  new FNeg(),
  // 0x77:
  new DNeg(),
  // 0x78:
  new IShl(),
  // 0x79:
  new LShl(),
  // 0x7a:
  new IShr(),
  // 0x7b:
  new LShr(),
  // 0x7c:
  new IUShr(),
  // 0x7d:
  new LUShr(),
  // 0x7e:
  new IAnd(),
  // 0x7f:
  new LAnd(),
  // 0x80:
  new IOr(),
  // 0x81:
  new LOr(),
  // 0x82:
  new IXor(),
  // 0x83:
  new LXor(),
  // 0x84:
  new IInc(),
  // 0x85:
  new I2L(),
  // 0x86:
  new I2F(),
  // 0x87:
  new I2D(),
  // 0x88:
  new L2I(),
  // 0x89:
  new L2F(),
  // 0x8a:
  new L2D(),
  // 0x8b:
  new F2I(),
  // 0x8c:
  new F2L(),
  // 0x8d:
  new F2D(),
  // 0x8e:
  new D2I(),
  // 0x8f:
  new D2L(),
  // 0x90:
  new D2F(),
  // 0x91:
  new I2B(),
  // 0x92:
  new I2C(),
  // 0x93:
  new I2S(),
  // 0x94:
  new LCmp(),
  // 0x95:
  new FCmpL(),
  // 0x96:
  new FCmpG(),
  // 0x97:
  new DCmpL(),
  // 0x98:
  new DCmpG(),
  // 0x99:
  new IfEq(),
  // 0x9a:
  new IfNE(),
  // 0x9b:
  new IfLT(),
  // 0x9c:
  new IfGE(),
  // 0x9d:
  new IfGT(),
  // 0x9e:
  new IfLE(),
  // 0x9f:
  new IfICmpEq(),
  // 0xa0:
  new IfICmpNE(),
  // 0xa1:
  new IfICmpLT(),
  // 0xa2:
  new IfICmpGE(),
  // 0xa3:
  new IfICmpGT(),
  // 0xa4:
  new IfICmpLE(),
  // 0xa5:
  new IfACmpEq(),
  // 0xa6:
  new IfACmpNE(),
  // 0xa7:
  new Goto(),
  // 0xa8: JSR
  new UnimplementedInstruction(),
  // 0xa9: RET
  new UnimplementedInstruction(),
  // 0xaa:
  new TableSwitch(),
  // 0xab:
  new LookupSwitch(),
  // 0xac:
  new IReturn(),
  // 0xad:
  new LReturn(),
  // 0xae:
  new FReturn(),
  // 0xaf:
  new DReturn(),
  // 0xb0:
  new AReturn(),
  // 0xb1:
  new Return(),
  // 0xb2:
  new GetStatic(),
  // 0xb3:
  new PutStatic(),
  // 0xb4:
  new GetField(),
  // 0xb5:
  new PutField(),
  // 0xb6:
  new InvokeVirtual(),
  // 0xb7:
  new InvokeSpecial(),
  // 0xb8:
  new InvokeStatic(),
  // 0xb9:
  new InvokeInterface(),
  // 0xba: InvokeDynamic
  new UnimplementedInstruction(),
  // 0xbb:
  new New(),
  // 0xbc:
  new NewArray(),
  // 0xbd:
  new ANewArray(),
  // 0xbe:
  new ArrayLength(),
  // 0xbf:
  new AThrow(),
  // 0xc0:
  new CheckCast(),
  // 0xc1:
  new InstanceOf(),
  // 0xc2: MonitorEnter
  new UnimplementedInstruction(),
  // 0xc3: MonitorExit
  new UnimplementedInstruction(),
  // 0xc4:
  new Wide(),
  // 0xc5:
  new MultiANewArray(),
  // 0xc6:
  new IfNull(),
  // 0xc7:
  new IfNonNull(),
  // 0xc8:
  new GotoW(),
  // 0xc9: JSRW
  new UnimplementedInstruction(),
  // 0xca: Breakpoint
  new UnimplementedInstruction(),
]

const ImpDep1 = new InvokeNative()

export function getInstruction(opCode: number): Instruction {
  if (opCode === 0xfe) return ImpDep1
  return INSTRUCTIONS[opCode]
}
