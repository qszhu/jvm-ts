import Frame from '../../thread/Frame'
import BytecodeReader from '../BytecodeReader'
import Instruction from './Instruction'

export default abstract class Index8Instruction implements Instruction {
  constructor(protected _index?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._index = reader.readUint8()
  }

  abstract execute(frame: Frame): void
}
