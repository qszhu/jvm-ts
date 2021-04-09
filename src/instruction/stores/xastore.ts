import { checkIndex, checkNotNil, NoOperandsInstruction } from '..'
import ArrayObject from '../../class/object/ArrayObject'
import Frame from '../../thread/Frame'

export class AAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref = stack.popRef()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const refs = arrRef.refs
    checkIndex(refs.length, idx)
    refs[idx] = ref
  }

  toString(): string {
    return `set a[b] = obj c`
  }
}

export class BAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const bytes = arrRef.bytes
    checkIndex(bytes.length, idx)
    bytes[idx] = val
  }

  toString(): string {
    return `set a[b] = byte c`
  }
}

export class CAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const chars = arrRef.chars
    checkIndex(chars.length, idx)
    chars[idx] = val
  }

  toString(): string {
    return `set a[b] = char c`
  }
}

export class DAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popDouble()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const doubles = arrRef.doubles
    checkIndex(doubles.length, idx)
    doubles[idx] = val
  }

  toString(): string {
    return `set a[b] = double c`
  }
}

export class FAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popFloat()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const floats = arrRef.floats
    checkIndex(floats.length, idx)
    floats[idx] = val
  }

  toString(): string {
    return `set a[b] = float c`
  }
}

export class IAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const ints = arrRef.ints
    checkIndex(ints.length, idx)
    ints[idx] = val
  }

  toString(): string {
    return `set a[b] = int c`
  }
}

export class LAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popLong()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const longs = arrRef.longs
    checkIndex(longs.length, idx)
    longs[idx] = val
  }

  toString(): string {
    return `set a[b] = long c`
  }
}

export class SAStore extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const val = stack.popInt()
    const idx = stack.popInt()
    const arrRef = stack.popRef() as ArrayObject
    checkNotNil(arrRef)
    const shorts = arrRef.shorts
    checkIndex(shorts.length, idx)
    shorts[idx] = val
  }

  toString(): string {
    return `set a[b] = short c`
  }
}
