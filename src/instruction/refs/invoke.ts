import { Index16Instruction } from '..'
import { MethodRefConstant } from '../../class'
import Frame from '../../thread/Frame'

export class InvokeSpecial extends Index16Instruction {
  execute(frame: Frame): void {
    frame.operandStack.popRef()
  }
}

export class InvokeVirtual extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const methodRef = (cp.getConstant(this._index) as MethodRefConstant).data
    if (methodRef.name === 'println') {
      const stack = frame.operandStack
      switch (methodRef.descriptor) {
        case '(Z)V':
          console.log(stack.popInt() !== 0)
          break
        case '(C)V':
        case '(B)V':
        case '(S)V':
        case '(I)V':
          console.log(stack.popInt())
          break
        case '(J)V':
          console.log(stack.popLong())
          break
        case '(F)V':
          console.log(stack.popFloat())
          break
        case '(D)V':
          console.log(stack.popDouble())
          break
        default:
          throw new Error(`println: ${methodRef.descriptor}`)
      }
      stack.popRef()
    }
  }
}
