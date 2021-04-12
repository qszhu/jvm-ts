import ConstantClassInfo from '../../classFile/constantInfo/ConstantClassInfo'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import SymRef from './SymRef'

export default class ClassRef extends SymRef {
  constructor(cp: RuntimeConstantPool, classInfo: ConstantClassInfo) {
    super(cp)
    this._className = classInfo.name
  }

  toString(): string {
    return `ClassRef: ${this._className}`
  }
}
