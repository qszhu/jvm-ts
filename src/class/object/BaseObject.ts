import Class from '../Class'

class HashCodeGenerator {
  private static _id: number = new Date().getTime() % 2 ** 32

  static next(): number {
    return HashCodeGenerator._id++
  }
}

export default abstract class BaseObject {
  protected _extra: unknown
  protected _hashCode: number

  constructor(protected _class: Class) {
    this._hashCode = HashCodeGenerator.next()
  }

  abstract clone(): BaseObject

  get class(): Class {
    return this._class
  }

  get extra(): unknown {
    return this._extra
  }

  set extra(e: unknown) {
    this._extra = e
  }

  isInstanceOf(other: Class): boolean {
    return other.isAssignableFrom(this._class)
  }

  hashCode(): number {
    return this._hashCode
  }

  toString(): string {
    return `object: ${this._class.toString()}`
    /*
    return `(
class: ${this._class.toString()}
data:
${this._data.toString()}
extra:
${this._extra ? this._extra : '' })
`
*/
  }
}
