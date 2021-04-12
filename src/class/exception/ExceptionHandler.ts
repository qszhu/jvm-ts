import ClassRef from '../ref/ClassRef'

export default class ExceptionHandler {
  constructor(
    private _startPc: number,
    private _endPc: number,
    private _handlerPc: number,
    private _catchType: ClassRef
  ) {}

  get startPc(): number {
    return this._startPc
  }

  get endPc(): number {
    return this._endPc
  }

  get handlerPc(): number {
    return this._handlerPc
  }

  get catchType(): ClassRef {
    return this._catchType
  }
}
