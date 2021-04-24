import AdmZip from 'adm-zip'
import path from 'path'
import { ClassNotFoundError } from '../errors'
import Entry from './Entry'

const zipFileCache = new Map<string, any>()
const entriesCache = new Map<string, Set<string>>()

export default class ZipEntry implements Entry {
  private _absPath: string

  constructor(pathStr: string) {
    this._absPath = path.resolve(pathStr)
  }

  readClass(className: string): { data: Buffer; entry: Entry } {
    if (!zipFileCache.has(this._absPath)) {
      const zip = new AdmZip(this._absPath)
      zipFileCache.set(this._absPath, zip)

      const entries = new Set(zip.getEntries().map((e) => e.entryName))
      entriesCache.set(this._absPath, entries)
    }

    const entries = entriesCache.get(this._absPath)
    if (!entries.has(className)) throw new ClassNotFoundError()

    const zip = zipFileCache.get(this._absPath) as AdmZip
    const data = zip.getEntry(className).getData()
    return { data, entry: this }
  }

  toString(): string {
    return this._absPath
  }
}
