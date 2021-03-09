import { checkIndex, checkNotNil, NoOperandsInstruction } from '..'
import Obj from '../../class/Obj'
import Frame from '../../thread/Frame'

export class AALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const refs = (arrRef as Obj).refs
    checkIndex(refs.length, idx)
    stack.pushRef(refs[idx])
  }
}

export class BALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const bytes = (arrRef as Obj).bytes
    checkIndex(bytes.length, idx)
    stack.pushInt(bytes[idx])
  }
}

export class CALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const chars = (arrRef as Obj).chars
    checkIndex(chars.length, idx)
    stack.pushInt(chars[idx])
  }
}

export class DALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const doubles = (arrRef as Obj).doubles
    checkIndex(doubles.length, idx)
    stack.pushDouble(doubles[idx])
  }
}

export class FALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const floats = (arrRef as Obj).floats
    checkIndex(floats.length, idx)
    stack.pushFloat(floats[idx])
  }
}

export class IALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const ints = (arrRef as Obj).ints
    checkIndex(ints.length, idx)
    stack.pushInt(ints[idx])
  }
}

export class LALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const longs = (arrRef as Obj).longs
    checkIndex(longs.length, idx)
    stack.pushLong(longs[idx])
  }
}

export class SALoad extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const idx = stack.popInt()
    const arrRef = stack.popRef()
    checkNotNil(arrRef)
    const shorts = (arrRef as Obj).shorts
    checkIndex(shorts.length, idx)
    stack.pushInt(shorts[idx])
  }
}