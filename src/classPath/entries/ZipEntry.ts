import fs from 'fs'
import path from 'path'
import util from 'util'

import JSZip from 'jszip'

import Entry from './Entry'
import { ClassNotFoundError } from '../errors'

export default class ZipEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  async readClass(className: string): Promise<Buffer> {
    const data = await util.promisify(fs.readFile)(this._absPath)
    const zip = await JSZip.loadAsync(data)
    for (const fn of Object.keys(zip.files)) {
      if (fn !== className) continue
      return zip.file(fn).async('nodebuffer')
    }
    throw new ClassNotFoundError()
  }

  toString(): string {
    return this._absPath
  }
}
