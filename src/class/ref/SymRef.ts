import Class from '../Class'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'

export default abstract class SymRef {
  protected _cp: RuntimeConstantPool
  protected _className: string
  protected _class: Class

  constructor(cp: RuntimeConstantPool) {
    this._cp = cp
  }

  get resolvedClass(): Class {
    if (!this._class) this.resolveClassRef()
    return this._class
  }

  private resolveClassRef(): void {
    const d = this._cp.class
    const c = d.loader.loadClass(this._className)
    if (!c.isAccessibleTo(d)) throw new Error('java.lang.IllegalAccessError')
    this._class = c
  }
}