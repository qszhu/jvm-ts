import glob from 'glob'
import BaseCompositeEntry from './BaseCompositeEntry'
import EntryFactory from './EntryFactory'

export default class WildcardEntry extends BaseCompositeEntry {
  constructor(pathStr: string) {
    const entries = glob.sync(`${pathStr}.jar`, { nocase: true }).map(EntryFactory.newEntry)
    super(entries)
  }
}
