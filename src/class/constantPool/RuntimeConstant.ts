import ClassRef from '../ref/ClassRef'
import FieldRef from '../ref/FieldRef'
import InterfaceMethodRef from '../ref/InterfaceMethodRef'
import MethodRef from '../ref/MethodRef'
import SymRef from '../ref/SymRef'

abstract class Constant<T> {
  constructor(private _data: T) {}

  get data(): T {
    return this._data
  }

  toString(): string {
    return this._data.toString()
  }
}

export class IntegerConstant extends Constant<number> {}

export class FloatConstant extends Constant<number> {}

export class LongConstant extends Constant<bigint> {}

export class DoubleConstant extends Constant<number> {}

export class StringConstant extends Constant<string> {}

export class ClassConstant extends Constant<ClassRef> {}

export class FieldRefConstant extends Constant<FieldRef> {}

export class MethodRefConstant extends Constant<MethodRef> {}

export class InterfaceMethodRefConstant extends Constant<InterfaceMethodRef> {}

type RuntimeConstant = Constant<number | bigint | string | SymRef>

export default RuntimeConstant
