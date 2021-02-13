import path from 'path'
import fs from 'fs'

import Entry from './entries/Entry'
import WildcardEntry from './entries/WildcardEntry'
import { newEntry } from './entries'
import { ClassNotFoundErrorMsg, JavaRuntimeNotFoundError } from './errors'
import { PATH_LIST_SEP } from './consts'

function getJreDir(Xjre: string): string {
  let jreDir = Xjre
  if (jreDir && fs.existsSync(jreDir)) return jreDir

  jreDir = path.join('.', 'jre')
  if (fs.existsSync(jreDir)) return jreDir

  const javaHome = process.env['JAVA_HOME']
  if (javaHome && fs.existsSync(javaHome)) return path.join(javaHome, 'jre')

  throw new JavaRuntimeNotFoundError()
}

export default class ClassPath {
  private _bootClassPath: Entry
  private _extClassPath: Entry
  private _userClassPath: Entry

  constructor(Xjre?: string, cp = '.') {
    const jreDir = getJreDir(Xjre)

    const jreLibDir = path.join(jreDir, 'lib', '*')
    this._bootClassPath = new WildcardEntry(jreLibDir)

    const jreExtDir = path.join(jreDir, 'lib', 'ext', '*')
    this._extClassPath = new WildcardEntry(jreExtDir)

    this._userClassPath = newEntry(cp)
  }

  async readClass(className: string): Promise<Buffer> {
    if (className.includes('.')) className = className.replace(/\./g, '/')
    className = `${className}.class`

    try {
      const res = await this._bootClassPath.readClass(className)
      return res
    } catch (e) {
      if (e.message !== ClassNotFoundErrorMsg) throw e
    }

    try {
      const res = this._extClassPath.readClass(className)
      return res
    } catch (e) {
      if (e.message !== ClassNotFoundErrorMsg) throw e
    }

    const res = this._userClassPath.readClass(className)
    return res
  }

  toString(): string {
    return [
      this._bootClassPath.toString(),
      this._extClassPath.toString(),
      this._userClassPath.toString(),
    ].join(PATH_LIST_SEP)
  }
}
