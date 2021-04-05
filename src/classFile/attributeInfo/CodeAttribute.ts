import { AttributeInfo, readAttributes } from '.'
import { codeToString } from '../../classViewer'
import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'
import LineNumberTableAttribute from './LineNumberTableAttribute'

export class ExceptionTableEntry {
  constructor(
    private _startPc: u2,
    private _endPc: u2,
    private _handlerPc: u2,
    private _catchType: u2
  ) {}

  get startPc(): u2 {
    return this._startPc
  }

  get endPc(): u2 {
    return this._endPc
  }

  get handlerPc(): u2 {
    return this._handlerPc
  }

  get catchType(): u2 {
    return this._catchType
  }

  static fromReader(reader: ClassReader): ExceptionTableEntry {
    return new ExceptionTableEntry(
      reader.readU2(),
      reader.readU2(),
      reader.readU2(),
      reader.readU2()
    )
  }

  static listFromReader(reader: ClassReader): ExceptionTableEntry[] {
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

  get exceptionTable(): ExceptionTableEntry[] {
    return this._exceptionTable
  }

  get lineNumberTableAttribute(): LineNumberTableAttribute {
    for (const attr of this._attributes) {
      if (attr instanceof LineNumberTableAttribute) return attr
    }
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
    return `
max stack: ${this.maxStack}
max locals: ${this.maxLocals}
code:
${codeToString(this.code)}
exception table:
${this._exceptionTable.map((e) => e.toString()).join('\n')}
attributes:
${this._attributes.map((a) => a.toString()).join('\n')}
`
  }
}
