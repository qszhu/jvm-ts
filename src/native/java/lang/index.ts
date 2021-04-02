import * as Class from './Class'
import * as Double from './Double'
import * as Float from './Float'
import * as Obj from './Object'
import * as String from './String'
import * as System from './System'

export function init(): void {
  Class.init()
  Double.init()
  Float.init()
  Obj.init()
  String.init()
  System.init()
}
