import { codeToString } from '../../classViewer'
import AttributesHolder from '../AttributesHolder'
import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import { u2 } from '../types'
import AttributeInfo from './AttributeInfo'
import AttributeInfoFactory from './AttributeInfoFactory'
import ExceptionTableEntry from './tableEntry/ExceptionTableEntry'

export default class CodeAttribute extends AttributesHolder {
  static fromReader(reader: ClassReader, cp: ConstantPool): CodeAttribute {
    const maxStack = reader.readU2()
    const maxLocals = reader.readU2()
    const codeLen = reader.readU4()
    const code = reader.readBytes(codeLen)
    const exceptionTable = ExceptionTableEntry.listFromReader(reader)
    const attributes = AttributeInfoFactory.readAttributes(reader, cp)
    return new CodeAttribute(maxStack, maxLocals, code, exceptionTable, attributes)
  }

  constructor(
    private _maxStack: u2,
    private _maxLocals: u2,
    private _code: Buffer,
    private _exceptionTable: ExceptionTableEntry[],
    attributes: AttributeInfo[]
  ) {
    super(attributes)
  }

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
