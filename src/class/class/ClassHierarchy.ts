import Class from './Class'

export default class ClassHierarchy {
  constructor(private _class: Class) {}

  isAccessibleTo(other: Class): boolean {
    return this._class.isPublic || this._class.packageName === other.packageName
  }

  isAssignableFrom(other: Class): boolean {
    const [s, t] = [other, this._class]
    if (s === t) return true
    if (!s.isArray) {
      if (!s.isInterface) return t.isInterface ? s.implements(t) : s.isSubClassOf(t)
      else return t.isInterface ? t.isSuperInterfaceOf(s) : t.isJlObject
    } else {
      if (!t.isArray) return t.isInterface ? t.isJlCloneable || t.isJioSerializable : t.isJlObject
      else {
        const [sc, tc] = [s.componentClass, t.componentClass]
        return sc === tc || tc.isAssignableFrom(sc)
      }
    }
  }

  isSubClassOf(other: Class): boolean {
    for (let c = this._class.superClass; c; c = c.superClass) {
      if (c === other) return true
    }
    return false
  }

  isSuperClassOf(other: Class): boolean {
    return other.isSubClassOf(this._class)
  }

  isSubInterfaceOf(iface: Class): boolean {
    for (const superInterface of this._class.interfaces) {
      if (superInterface === iface || superInterface.isSubInterfaceOf(iface)) return true
    }
    return false
  }

  isSuperInterfaceOf(iface: Class): boolean {
    return iface.isSubInterfaceOf(this._class)
  }

  implements(iface: Class): boolean {
    for (let c = this._class; c; c = c.superClass) {
      for (const i of c.interfaces) {
        if (i === iface || i.isSubInterfaceOf(iface)) return true
      }
    }
    return false
  }
}
