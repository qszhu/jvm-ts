import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'
import { AttributeInfo, readAttributes } from '.'

class ExceptionTableEntry {
  constructor(
    private _startPc: u2,
    private _endPc: u2,
    private _handlerPc: u2,
    private _catchType: u2
  ) {}

  static fromReader(reader: ClassReader) {
    return new ExceptionTableEntry(
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2()
    )
  }

  static listFromReader(reader: ClassReader) {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => ExceptionTableEntry.fromReader(reader))
  }
}

export default class CodeAttribute {
  constructor(
    private _cp: ConstantPool,
    private _maxStack: u2,
    private _maxLocals: u2,
    private _code: Buffer,
    private _exceptionTable: ExceptionTableEntry[],
    private _attributes: AttributeInfo[]
  ) {}

  get maxLocals(): u2 {
    return this._maxLocals
  }

  get maxStack(): u2 {
    return this._maxStack
  }

  get code(): Buffer {
    return this._code
  }

  static fromReader(reader: ClassReader, cp: ConstantPool): CodeAttribute {
    const maxStack = reader.readU2()
    const maxLocals = reader.readU2()
    const codeLen = reader.readU4()
    const code = reader.readBytes(codeLen)
    const exceptionTable = ExceptionTableEntry.listFromReader(reader)
    const attributes = readAttributes(reader, cp)
    return new CodeAttribute(cp, maxStack, maxLocals, code, exceptionTable, attributes)
  }

  toString(): string {
    const res: string[] = []
    res.push(`max stack: ${this.maxStack}`)
    res.push(`max locals: ${this.maxLocals}`)
    res.push('code:')
    res.push(this.code.toString('hex'))
    res.push('exception table:')
    for (const entry of this._exceptionTable) {
      res.push(entry.toString())
    }
    res.push('attributes:')
    for (const attr of this._attributes) {
      res.push(attr.toString())
    }
    return res.join('\n')
  }
}
