import { PATH_LIST_SEP } from '../consts'
import CompositeEntry from './CompositeEntry'
import DirEntry from './DirEntry'
import Entry from './Entry'
import WildcardEntry from './WildcardEntry'
import ZipEntry from './ZipEntry'

export default class EntryFactory {
  static newEntry(pathStr: string): Entry {
    if (pathStr.includes(PATH_LIST_SEP)) return new CompositeEntry(pathStr)
    if (pathStr.endsWith('*')) return new WildcardEntry(pathStr)
    if (pathStr.toLowerCase().endsWith('.jar') || pathStr.toLowerCase().endsWith('.zip'))
      return new ZipEntry(pathStr)
    return new DirEntry(pathStr)
  }
}
