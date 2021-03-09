import { checkIndex, checkNotNil, NoOperandsInstruction } from '..'
import Obj from '../../class/Obj'
import Frame from '../../thread/Frame'

export class AAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popRef()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const refs = arrRef.refs
    checkIndex(refs.length, idx)
    refs[idx] = val
  }
}

export class BAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const bytes = arrRef.bytes
    checkIndex(bytes.length, idx)
    bytes[idx] = val
  }
}

export class CAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const chars = arrRef.chars
    checkIndex(chars.length, idx)
    chars[idx] = val
  }
}

export class DAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popDouble()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const doubles = arrRef.doubles
    checkIndex(doubles.length, idx)
    doubles[idx] = val
  }
}

export class FAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popFloat()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const floats = arrRef.floats
    checkIndex(floats.length, idx)
    floats[idx] = val
  }
}

export class IAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const ints = arrRef.ints
    checkIndex(ints.length, idx)
    ints[idx] = val
  }
}

export class LAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popLong()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const longs = arrRef.longs
    checkIndex(longs.length, idx)
    longs[idx] = val
  }
}

export class SAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as Obj
    checkNotNil(arrRef)
    const shorts = arrRef.shorts
    checkIndex(shorts.length, idx)
    shorts[idx] = val
  }
}
