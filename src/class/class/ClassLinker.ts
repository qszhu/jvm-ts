import Slots from '../../thread/Slots'
import Field from '../member/Field'
import Class from './Class'

export default class ClassLinker {
  constructor(private _class: Class) {}

  link(): void {
    this.verify()
    this.prepare()
  }

  private verify(): void {
    //
  }

  private prepare(): void {
    this.calcInstanceFieldSlotIds()
    this.calcStaticFieldSlotIds()
    this.allocAndInitStaticVars()
  }

  private calcInstanceFieldSlotIds(): void {
    let slotId = 0

    if (this._class.superClass) slotId = this._class.superClass.instanceSlotCount

    for (const field of this._class.fields) {
      if (field.isStatic) continue

      field.slotId = slotId++

      if (field.isLongOrDouble) slotId++
    }

    this._class.instanceSlotCount = slotId
  }

  private calcStaticFieldSlotIds(): void {
    let slotId = 0

    for (const field of this._class.fields) {
      if (!field.isStatic) continue

      field.slotId = slotId++

      if (field.isLongOrDouble) slotId++
    }
    this._class.staticSlotCount = slotId
  }

  private allocAndInitStaticVars() {
    this._class.staticVars = new Slots(this._class.staticSlotCount)
    for (const field of this._class.fields) {
      if (field.isStatic && field.isFinal) {
        this.initStaticFinalVar(field)
      }
    }
  }

  private initStaticFinalVar(field: Field) {
    const cpIdx = field.constValueIndex
    if (!cpIdx) return

    const cp = this._class.constantPool

    const sVars = this._class.staticVars
    const slotId = field.slotId
    switch (field.descriptor) {
      case 'Z':
      case 'B':
      case 'C':
      case 'S':
      case 'I':
        sVars.setInt(slotId, cp.getInt(cpIdx))
        break
      case 'J':
        sVars.setLong(slotId, cp.getLong(cpIdx))
        break
      case 'F':
        sVars.setFloat(slotId, cp.getFloat(cpIdx))
        break
      case 'D':
        sVars.setDouble(slotId, cp.getDouble(cpIdx))
        break
      case 'Ljava/lang/String;':
        sVars.setRef(slotId, cp.getString(cpIdx))
        break
    }
  }
}
