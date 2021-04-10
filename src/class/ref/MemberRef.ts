import BaseConstantMemberRefInfo from '../../classFile/constantInfo/memberRef/BaseConstantMemberRefInfo'
import RuntimeConstantPool from '../RuntimeContantPool'
import SymRef from './SymRef'

export default abstract class MemberRef extends SymRef {
  protected _name: string
  protected _descriptor: string

  constructor(cp: RuntimeConstantPool, refInfo: BaseConstantMemberRefInfo) {
    super(cp)
    this._className = refInfo.className
    ;[this._name, this._descriptor] = refInfo.nameAndDescriptor
  }

  get name(): string {
    return this._name
  }

  get descriptor(): string {
    return this._descriptor
  }
}
