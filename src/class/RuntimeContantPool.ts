import ConstantClassInfo from '../classFile/constantInfo/ConstantClassInfo'
import ConstantStringInfo from '../classFile/constantInfo/ConstantStringInfo'
import ConstantFieldRefInfo from '../classFile/constantInfo/memberRef/ConstantFieldRefInfo'
import ConstantInterfaceMethodRefInfo from '../classFile/constantInfo/memberRef/ConstantInterfaceMethodRefInfo'
import ConstantMethodRefInfo from '../classFile/constantInfo/memberRef/ConstantMethodRefInfo'
import ConstantDoubleInfo from '../classFile/constantInfo/numeric/ConstantDoubleInfo'
import ConstantFloatInfo from '../classFile/constantInfo/numeric/ConstantFloatInfo'
import ConstantIntegerInfo from '../classFile/constantInfo/numeric/ConstantIntegerInfo'
import ConstantLongInfo from '../classFile/constantInfo/numeric/ConstantLongInfo'
import ConstantPool from '../classFile/ConstantPool'
import Class from './Class'
import ClassRef from './ref/ClassRef'
import FieldRef from './ref/FieldRef'
import InterfaceMethodRef from './ref/InterfaceMethodRef'
import MethodRef from './ref/MethodRef'
import RuntimeConstant, {
  ClassConstant,
  DoubleConstant,
  FieldRefConstant,
  FloatConstant,
  IntegerConstant,
  InterfaceMethodRefConstant,
  LongConstant,
  MethodRefConstant,
  StringConstant,
} from './RuntimeConstant'

export default class RuntimeConstantPool {
  private _class: Class
  private _consts: RuntimeConstant[]

  constructor(klass: Class, cp: ConstantPool) {
    this._class = klass
    this._consts = new Array(cp.size).fill(null)
    for (let i = 1; i < this._consts.length; i++) {
      const cpInfo = cp.getConstantInfo(i)
      if (cpInfo instanceof ConstantIntegerInfo) this._consts[i] = new IntegerConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantFloatInfo) this._consts[i] = new FloatConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantLongInfo) this._consts[i++] = new LongConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantDoubleInfo)
        this._consts[i++] = new DoubleConstant(cpInfo.val)
      else if (cpInfo instanceof ConstantStringInfo)
        this._consts[i] = new StringConstant(cpInfo.string)
      else if (cpInfo instanceof ConstantClassInfo)
        this._consts[i] = new ClassConstant(new ClassRef(this, cpInfo))
      else if (cpInfo instanceof ConstantFieldRefInfo)
        this._consts[i] = new FieldRefConstant(new FieldRef(this, cpInfo))
      else if (cpInfo instanceof ConstantMethodRefInfo)
        this._consts[i] = new MethodRefConstant(new MethodRef(this, cpInfo))
      else if (cpInfo instanceof ConstantInterfaceMethodRefInfo)
        this._consts[i] = new InterfaceMethodRefConstant(new InterfaceMethodRef(this, cpInfo))
    }
  }

  get class(): Class {
    return this._class
  }

  getConstant(idx: number): RuntimeConstant {
    const res = this._consts[idx]
    if (res) return res
    throw new Error(`No constants at index ${idx}`)
  }

  toString(): string {
    return this._consts.map((c, i) => `{${i}}: ${c}`).join('\n')
  }
}
