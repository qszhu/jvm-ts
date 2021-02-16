import { NoOperandsInstruction } from '.'
import Frame from '../thread/Frame'

export class Nop extends NoOperandsInstruction {
  execute(frame: Frame): void {
    return
  }
}
