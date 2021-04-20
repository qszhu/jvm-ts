import Frame from '../../thread/Frame'
import BytecodeReader from '../BytecodeReader'
import Instruction from './Instruction'

export default class UnimplementedInstruction implements Instruction {
  fetchOperands(reader: BytecodeReader): void {
    throw new Error('Method not implemented.')
  }
  execute(frame: Frame): void {
    throw new Error('Method not implemented.')
  }
}
