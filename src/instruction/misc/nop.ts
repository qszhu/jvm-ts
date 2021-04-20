import Frame from '../../thread/Frame'
import NoOperandsInstruction from '../base/NoOperandsInstruction'

export class Nop extends NoOperandsInstruction {
  execute(frame: Frame): void {
    return
  }
}
