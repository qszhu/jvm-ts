import Class from './Class'

export default class ClassHierarchy {
  static isAccessibleTo(self: Class, other: Class): boolean {
    return self.isPublic || self.packageName === other.packageName
  }

  static isAssignableFrom(self: Class, other: Class): boolean {
    const [s, t] = [other, self]
    if (s === t) return true
    if (!s.isArray) {
      if (!s.isInterface)
        return t.isInterface ? ClassHierarchy.implements(s, t) : ClassHierarchy.isSubClassOf(s, t)
      else return t.isInterface ? ClassHierarchy.isSuperInterfaceOf(t, s) : t.isJlObject
    } else {
      if (!t.isArray) return t.isInterface ? t.isJlCloneable || t.isJioSerializable : t.isJlObject
      else {
        const [sc, tc] = [s.componentClass, t.componentClass]
        return sc === tc || ClassHierarchy.isAssignableFrom(tc, sc)
      }
    }
  }

  static isSubClassOf(self: Class, other: Class): boolean {
    for (let c = self.superClass; c; c = c.superClass) {
      if (c === other) return true
    }
    return false
  }

  static isSuperClassOf(self: Class, other: Class): boolean {
    return ClassHierarchy.isSubClassOf(other, self)
  }

  static isSubInterfaceOf(self: Class, iface: Class): boolean {
    for (const superInterface of self.interfaces) {
      if (superInterface === iface || ClassHierarchy.isSubInterfaceOf(superInterface, iface))
        return true
    }
    return false
  }

  static isSuperInterfaceOf(self: Class, iface: Class): boolean {
    return ClassHierarchy.isSubInterfaceOf(iface, self)
  }

  static implements(self: Class, iface: Class): boolean {
    for (let c = self; c; c = c.superClass) {
      for (const i of c.interfaces) {
        if (i === iface || ClassHierarchy.isSubInterfaceOf(i, iface)) return true
      }
    }
    return false
  }
}
