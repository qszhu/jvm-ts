import ClassReader from './ClassReader'
import { ConstantInfo, readConstantInfo } from './constantInfo'
import { u2 } from './types'
import ConstantNameAndTypeInfo from './constantInfo/ConstantNameAndTypeInfo'
import ConstantClassInfo from './constantInfo/ConstantClassInfo'
import ConstantUtf8Info from './constantInfo/ConstantUtf8Info'
import ConstantLongInfo from './constantInfo/ConstantLongInfo'
import ConstantDoubleInfo from './constantInfo/ConstantDoubleInfo'

export default class ConstantPool {
  constructor(private _infos?: ConstantInfo[]) {}

  get size(): number {
    return this._infos.length
  }

  getConstantInfo(idx: u2): ConstantInfo {
    const res = this._infos[idx]
    if (res) return res
    throw new Error('Invalid constant pool index')
  }

  getNameAndType(idx: u2): [string, string] {
    const ntInfo = this.getConstantInfo(idx) as ConstantNameAndTypeInfo
    const name = this.getUtf8(ntInfo.nameIndex)
    const type = this.getUtf8(ntInfo.descriptorIndex)
    return [name, type]
  }

  getClassName(idx: u2): string {
    const classInfo = this.getConstantInfo(idx) as ConstantClassInfo
    // return this.getUtf8(classInfo.nameIndex)
    return classInfo.name
  }

  getUtf8(idx: u2): string {
    const utf8Info = this.getConstantInfo(idx) as ConstantUtf8Info
    return utf8Info.str
  }

  readFrom(reader: ClassReader): void {
    const cpCount = reader.readU2()
    const res = new Array(cpCount).fill(null)
    let i = 1
    while (i < cpCount) {
      const info = readConstantInfo(reader, this)
      res[i++] = info
      if (info instanceof ConstantLongInfo || info instanceof ConstantDoubleInfo) i++
    }
    this._infos = res
  }

  toString(): string {
    return this._infos.map((info, idx) => `{${idx}}: ${info ? info.toString() : info}`).join('\n')
  }
}
