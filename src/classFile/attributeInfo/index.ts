import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import CodeAttribute from './CodeAttribute'
import ConstantValueAttribute from './ConstantValueAttribute'
import DeprecatedAttribute from './DeprecatedAttribute'
import ExceptionsAttribute from './ExceptionAttribute'
import LineNumberTableAttribute from './LineNumberTableAttribute'
import LocalVariableTableAttribute from './LocalVariableTableAttribute'
import SourceFileAttribute from './SourceFileAttribute'
import SyntheticAttribute from './SyntheticAttribute'
import UnparsedAttribute from './UnparsedAttribute'

export type AttributeInfo =
  | CodeAttribute
  | ConstantValueAttribute
  | DeprecatedAttribute
  | ExceptionsAttribute
  | LineNumberTableAttribute
  | LocalVariableTableAttribute
  | SourceFileAttribute
  | SyntheticAttribute

enum AttributeType {
  Code = 'Code',
  ConstantValue = 'ConstantValue',
  Deprecated = 'Deprecated',
  Exceptions = 'Exceptions',
  LineNumberTable = 'LineNumberTable',
  LocalVariableTable = 'LocalVariableTable',
  SourceFile = 'SourceFile',
  Synthetic = 'Synthetic',
}

function readAttribute(reader: ClassReader, cp: ConstantPool): AttributeInfo {
  const attrNameIdx = reader.readU2()
  const attrName = cp.getUtf8(attrNameIdx)
  const attrLen = reader.readU4()
  return createAttribute(attrName, attrLen, reader, cp)
}

export function readAttributes(reader: ClassReader, cp: ConstantPool): AttributeInfo[] {
  const len = reader.readU2()
  return new Array(len).fill(null).map(() => readAttribute(reader, cp))
}

function createAttribute(attrName: string, attrLen: number, reader: ClassReader, cp: ConstantPool) {
  switch (attrName) {
    case AttributeType.Code:
      return CodeAttribute.fromReader(reader, cp)
    case AttributeType.ConstantValue:
      return ConstantValueAttribute.fromReader(reader)
    case AttributeType.Deprecated:
      return new DeprecatedAttribute()
    case AttributeType.Exceptions:
      return ExceptionsAttribute.fromReader(reader)
    case AttributeType.LineNumberTable:
      return LineNumberTableAttribute.fromReader(reader)
    case AttributeType.LocalVariableTable:
      return LocalVariableTableAttribute.fromReader(reader)
    case AttributeType.SourceFile:
      return SourceFileAttribute.fromReader(reader, cp)
    case AttributeType.Synthetic:
      return new SyntheticAttribute()
    default:
      return UnparsedAttribute.fromReader(attrName, attrLen, reader)
  }
}
