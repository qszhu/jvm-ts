import { PATH_LIST_SEP } from '../consts'
import BaseCompositeEntry from './BaseCompositeEntry'
import EntryFactory from './EntryFactory'

export default class CompositeEntry extends BaseCompositeEntry {
  constructor(pathStr: string) {
    const entries = pathStr.split(PATH_LIST_SEP).map(EntryFactory.newEntry)
    super(entries)
  }
}
