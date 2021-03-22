import { NoOperandsInstruction } from '..'
import Frame from '../../thread/Frame'

export class AConstNull extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushRef(null)
  }

  toString(): string {
    return 'push null'
  }
}
