import * as Class from './java/lang/Class'
import * as Double from './java/lang/Double'
import * as Float from './java/lang/Float'
import * as Obj from './java/lang/Object'
import * as String from './java/lang/String'
import * as System from './java/lang/System'
import * as Throwable from './java/lang/Throwable'
import * as Vm from './sun/misc/Vm'

export function init(): void {
  Class.init()
  Double.init()
  Float.init()
  Obj.init()
  String.init()
  System.init()
  Throwable.init()
  Vm.init()
}