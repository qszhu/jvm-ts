import Frame from '../../thread/Frame'
import BytecodeReader from '../BytecodeReader'

export default interface Instruction {
  fetchOperands(reader: BytecodeReader): void
  execute(frame: Frame): void
}
