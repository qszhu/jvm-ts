import fs from 'fs'
import path from 'path'
import util from 'util'

import Entry from './Entry'

export default class DirEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  async readClass(className: string): Promise<Buffer> {
    const fn = path.join(this._absPath, className)
    return util.promisify(fs.readFile)(fn)
  }

  toString(): string {
    return this._absPath
  }
}
