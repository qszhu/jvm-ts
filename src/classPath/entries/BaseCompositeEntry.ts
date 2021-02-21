import Entry from './Entry'
import { ClassNotFoundError, ClassNotFoundErrorMsg } from '../errors'
import { PATH_LIST_SEP } from '../consts'

export default abstract class BaseCompositeEntry implements Entry {
  constructor(private _entries: Entry[]) {}

  readClass(className: string): { data: Buffer, entry: Entry } {
    for (const entry of this._entries) {
      try {
        const res = entry.readClass(className)
        return res
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
