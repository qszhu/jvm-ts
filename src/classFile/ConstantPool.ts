import ClassReader from './ClassReader'
import { ConstantInfo } from './constantInfo'
import ConstantClassInfo from './constantInfo/ConstantClassInfo'
import ConstantDoubleInfo from './constantInfo/numeric/ConstantDoubleInfo'
import ConstantInfoFactory from './constantInfo/ConstantInfoFactory'
import ConstantLongInfo from './constantInfo/numeric/ConstantLongInfo'
import ConstantNameAndTypeInfo from './constantInfo/ConstantNameAndTypeInfo'
import ConstantUtf8Info from './constantInfo/ConstantUtf8Info'
import { u2 } from './types'

export default class ConstantPool {
  private _infos: ConstantInfo[]

  static readFrom(reader: ClassReader): ConstantPool {
    const res = new ConstantPool()

    const cpCount = reader.readU2()
    const infos = new Array(cpCount).fill(null)
    let i = 1
    while (i < cpCount) {
      const info = ConstantInfoFactory.readConstantInfo(reader, res)
      infos[i++] = info
      if (info instanceof ConstantLongInfo || info instanceof ConstantDoubleInfo) i++
    }
    res._infos = infos

    return res
  }

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

  toString(): string {
    return this._infos.map((info, idx) => `{${idx}}: ${info ? info.toString() : info}`).join('\n')
  }
}
