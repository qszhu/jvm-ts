import BaseCompositeEntry from './BaseCompositeEntry'
import { PATH_LIST_SEP } from '../consts'
import { newEntry } from '.'

export default class CompositeEntry extends BaseCompositeEntry {
  constructor(pathStr: string) {
    const entries = pathStr.split(PATH_LIST_SEP).map(newEntry)
    super(entries)
  }
}
