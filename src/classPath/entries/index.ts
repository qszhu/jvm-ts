import Entry from './Entry'
import { PATH_LIST_SEP } from '../consts'
import CompositeEntry from './CompositeEntry'
import WildcardEntry from './WildcardEntry'
import ZipEntry from './ZipEntry'
import DirEntry from './DirEntry'

export function newEntry(pathStr: string): Entry {
  if (pathStr.includes(PATH_LIST_SEP)) return new CompositeEntry(pathStr)
  if (pathStr.endsWith('*')) return new WildcardEntry(pathStr)
  if (pathStr.toLowerCase().endsWith('.jar') || pathStr.toLowerCase().endsWith('.zip'))
    return new ZipEntry(pathStr)
  return new DirEntry(pathStr)
}
