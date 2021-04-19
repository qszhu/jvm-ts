import AccessFlags from '../AccessFlags'
import BaseObject from '../object/BaseObject'
import BaseClass from './BaseClass'
import ClassLoader from './ClassLoader'

export default class PrimitiveClass extends BaseClass {
  constructor(className: string, loader: ClassLoader, jClass: BaseObject) {
    super()
    this._accessFlags = new AccessFlags()
    this._name = className
    this._loader = loader
    this._initStarted = true

    this._jClass = jClass
    this._jClass.extra = this
  }
}
