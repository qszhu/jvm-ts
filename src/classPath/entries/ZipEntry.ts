import AdmZip from 'adm-zip'
import path from 'path'
import { ClassNotFoundError } from '../errors'
import Entry from './Entry'

export default class ZipEntry implements Entry {
  private _absPath: string
  private _cache: Map<string, Buffer>

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
    this._cache = new Map()
  }

  readClass(className: string): { data: Buffer; entry: Entry } {
    if (this._cache.has(className)) {
      return { data: this._cache.get(className), entry: this }
    }

    const zip = new AdmZip(this._absPath)
    for (const entry of zip.getEntries()) {
      if (entry.entryName !== className) continue
      const data = entry.getData()
      this._cache.set(className, data)
      return { data, entry: this }
    }

    throw new ClassNotFoundError()
  }

  toString(): string {
    return this._absPath
  }
}
