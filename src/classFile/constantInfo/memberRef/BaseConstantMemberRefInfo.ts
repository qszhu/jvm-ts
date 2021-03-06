import ConstantPool from '../../ConstantPool'
import { u2 } from '../../types'

export default abstract class BaseContantMemberRefInfo {
  constructor(private _cp: ConstantPool, protected _classIdx?: u2, protected _nameTypeIdx?: u2) {}

  get className(): string {
    return this._cp.getClassName(this._classIdx)
  }

  get nameAndDescriptor(): [string, string] {
    return this._cp.getNameAndType(this._nameTypeIdx)
  }
}
