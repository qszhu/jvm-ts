import fs from 'fs'
import path from 'path'
import { ClassNotFoundError } from '../errors'
import Entry from './Entry'

export default class DirEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  readClass(className: string): { data: Buffer; entry: Entry } {
    try {
      const fn = path.join(this._absPath, className)
      const data = fs.readFileSync(fn)
      return { data, entry: this }
    } catch (e) {
      throw new ClassNotFoundError()
    }
  }

  toString(): string {
    return this._absPath
  }
}
