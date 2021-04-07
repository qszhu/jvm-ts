import AdmZip from 'adm-zip'
import path from 'path'
import { ClassNotFoundError } from '../errors'
import Entry from './Entry'

export default class ZipEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  readClass(className: string): { data: Buffer; entry: Entry } {
    const zip = new AdmZip(this._absPath)
    for (const entry of zip.getEntries()) {
      if (entry.entryName !== className) continue
      const data = entry.getData()
      return { data, entry: this }
    }
    throw new ClassNotFoundError()
  }

  toString(): string {
    return this._absPath
  }
}
