import { PATH_LIST_SEP } from '../consts'
import { ClassNotFoundError, ClassNotFoundErrorMsg } from '../errors'
import Entry from './Entry'

export default abstract class BaseCompositeEntry implements Entry {
  constructor(private _entries: Entry[]) {}

  readClass(className: string): { data: Buffer; entry: Entry } {
    for (const entry of this._entries) {
      try {
        return entry.readClass(className)
      } catch (e) {
        if (e.message !== ClassNotFoundErrorMsg) throw e
      }
    }
    throw new ClassNotFoundError()
  }

  toString(): string {
    return this._entries.map((e) => e.toString()).join(PATH_LIST_SEP)
  }
}
