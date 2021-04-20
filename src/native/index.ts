import * as Class from './java/lang/Class'
import * as Double from './java/lang/Double'
import * as Float from './java/lang/Float'
import * as Obj from './java/lang/Object'
import * as String from './java/lang/String'
import * as System from './java/lang/System'
import * as Throwable from './java/lang/Throwable'
import Registry from './Registry'
import * as Vm from './sun/misc/Vm'

export function init(): Registry {
  const registry = new Registry()

  Class.init(registry)
  Double.init(registry)
  Float.init(registry)
  Obj.init(registry)
  String.init(registry)
  System.init(registry)
  Throwable.init(registry)

  Vm.init(registry)

  return registry
}
