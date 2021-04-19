import Field from '../member/Field'
import Method from '../member/Method'
import BaseClass from './BaseClass'

export default class ClassReflection {
  constructor(private _class: BaseClass) {}

  static lookupMethodInClass(klass: BaseClass, name: string, descriptor: string): Method {
    for (let c = klass; c; c = c.superClass) {
      for (const method of c.methods) {
        if (method.name === name && method.descriptor === descriptor) return method
      }
    }
  }

  static lookupMethodInInterfaces(ifaces: BaseClass[], name: string, descriptor: string): Method {
    for (const iface of ifaces) {
      for (const method of iface.methods) {
        if (method.name === name && method.descriptor === descriptor) return method
      }

      const method = ClassReflection.lookupMethodInInterfaces(iface.interfaces, name, descriptor)
      if (method) return method
    }
  }

  lookupMethod(name: string, descriptor: string): Method {
    let method = ClassReflection.lookupMethodInClass(this._class, name, descriptor)
    if (!method) {
      method = ClassReflection.lookupMethodInInterfaces(this._class.interfaces, name, descriptor)
    }
    return method
  }

  lookupInterfaceMethod(name: string, descriptor: string): Method {
    for (const method of this._class.methods) {
      if (method.name === name && method.descriptor === descriptor) return method
    }

    return ClassReflection.lookupMethodInInterfaces(this._class.interfaces, name, descriptor)
  }

  lookupField(name: string, descriptor: string): Field {
    for (const field of this._class.fields) {
      if (field.name === name && field.descriptor === descriptor) return field
    }

    for (const iface of this._class.interfaces) {
      const field = iface.lookupField(name, descriptor)
      if (field) return field
    }

    if (this._class.superClass) return this._class.superClass.lookupField(name, descriptor)
  }

  private getMethod(name: string, descriptor: string, isStatic: boolean): Method {
    for (let c = this._class; c; c = c.superClass) {
      for (const method of c.methods) {
        if (
          method.name === name &&
          method.descriptor === descriptor &&
          method.isStatic === isStatic
        )
          return method
      }
    }
  }

  getStaticMethod(name: string, descriptor: string): Method {
    return this.getMethod(name, descriptor, true)
  }

  getInstanceMethod(name: string, descriptor: string): Method {
    return this.getMethod(name, descriptor, false)
  }

  private getField(name: string, descriptor: string, isStatic: boolean): Field {
    for (let c = this._class; c; c = c.superClass) {
      for (const field of c.fields) {
        if (field.name === name && field.descriptor === descriptor && field.isStatic === isStatic)
          return field
      }
    }
  }

  getStaticField(name: string, descriptor: string): Field {
    return this.getField(name, descriptor, true)
  }

  getInstanceField(name: string, descriptor: string): Field {
    return this.getField(name, descriptor, false)
  }
}
