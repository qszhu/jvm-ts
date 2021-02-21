import fs from 'fs'
import path from 'path'

import Entry from './Entry'

export default class DirEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  readClass(className: string): { data: Buffer; entry: Entry } {
    const fn = path.join(this._absPath, className)
    const data = fs.readFileSync(fn)
    return { data, entry: this }
  }

  toString(): string {
    return this._absPath
  }
}
