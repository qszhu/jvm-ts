import ArrayClass from './ArrayClass'
import BaseClass from './BaseClass'

export default class ClassHierarchy {
  constructor(private _class: BaseClass) {}

  isAccessibleTo(other: BaseClass): boolean {
    return this._class.isPublic || this._class.packageName === other.packageName
  }

  isAssignableFrom(other: BaseClass): boolean {
    const [s, t] = [other, this._class]
    if (s === t) return true
    if (!(s instanceof ArrayClass)) {
      if (!s.isInterface) return t.isInterface ? s.implements(t) : s.isSubClassOf(t)
      else return t.isInterface ? t.isSuperInterfaceOf(s) : t.isJlObject
    } else {
      if (!(t instanceof ArrayClass))
        return t.isInterface ? t.isJlCloneable || t.isJioSerializable : t.isJlObject
      else {
        const [sc, tc] = [s.componentClass, t.componentClass]
        return sc === tc || tc.isAssignableFrom(sc)
      }
    }
  }

  isSubClassOf(other: BaseClass): boolean {
    for (let c = this._class.superClass; c; c = c.superClass) {
      if (c === other) return true
    }
    return false
  }

  isSuperClassOf(other: BaseClass): boolean {
    return other.isSubClassOf(this._class)
  }

  isSubInterfaceOf(iface: BaseClass): boolean {
    for (const superInterface of this._class.interfaces) {
      if (superInterface === iface || superInterface.isSubInterfaceOf(iface)) return true
    }
    return false
  }

  isSuperInterfaceOf(iface: BaseClass): boolean {
    return iface.isSubInterfaceOf(this._class)
  }

  implements(iface: BaseClass): boolean {
    for (let c = this._class; c; c = c.superClass) {
      for (const i of c.interfaces) {
        if (i === iface || i.isSubInterfaceOf(iface)) return true
      }
    }
    return false
  }
}
