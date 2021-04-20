import Frame from '../../thread/Frame'
import Instruction from './Instruction'

export default abstract class NoOperandsInstruction implements Instruction {
  fetchOperands(): void {
    return
  }

  abstract execute(frame: Frame): void
}
