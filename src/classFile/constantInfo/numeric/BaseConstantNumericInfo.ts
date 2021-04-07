export default abstract class BaseConstantNumericInfo<T> {
  constructor(private _val: T) {}

  get val(): T {
    return this._val
  }
}
