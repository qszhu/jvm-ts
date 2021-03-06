import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class AConstNull extends NoOperandsInstruction {
  execute(frame: Frame): void {
    frame.operandStack.pushRef(null)
  }

  toString(): string {
    return 'push null'
  }
}
