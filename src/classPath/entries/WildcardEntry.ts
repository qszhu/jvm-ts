import glob from 'glob'

import BaseCompositeEntry from './BaseCompositeEntry'
import { newEntry } from '.'

export default class WildcardEntry extends BaseCompositeEntry {
  constructor(pathStr: string) {
    const entries = glob.sync(`${pathStr}.jar`, { nocase: true }).map(newEntry)
    super(entries)
  }
}
