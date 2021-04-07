import AttributesHolder from '../AttributesHolder'
import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import AttributeInfo from './AttributeInfo'
import AttributeType from './AttributeType'
import CodeAttribute from './CodeAttribute'
import ConstantValueAttribute from './ConstantValueAttribute'
import DeprecatedAttribute from './DeprecatedAttribute'
import ExceptionsAttribute from './ExceptionAttribute'
import LineNumberTableAttribute from './LineNumberTableAttribute'
import LocalVariableTableAttribute from './LocalVariableTableAttribute'
import SourceFileAttribute from './SourceFileAttribute'
import SyntheticAttribute from './SyntheticAttribute'
import UnparsedAttribute from './UnparsedAttribute'

export default class AttributeInfoFactory {
  static readAttributes(reader: ClassReader, cp: ConstantPool): AttributeInfo[] {
    const len = reader.readU2()
    return new Array(len).fill(null).map(() => AttributeInfoFactory.readAttribute(reader, cp))
  }

  private static readAttribute(reader: ClassReader, cp: ConstantPool): AttributeInfo {
    const attrNameIdx = reader.readU2()
    const attrName = cp.getUtf8(attrNameIdx)
    const attrLen = reader.readU4()
    return AttributeInfoFactory.createAttribute(attrName, attrLen, reader, cp)
  }

  private static createAttribute(
    attrName: string,
    attrLen: number,
    reader: ClassReader,
    cp: ConstantPool
  ) {
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

  static getCodeAttribute(holder: AttributesHolder): CodeAttribute {
    return holder.findAttribute((attr) => attr instanceof CodeAttribute) as CodeAttribute
  }

  static getConstantValueAttribute(holder: AttributesHolder): ConstantValueAttribute {
    return holder.findAttribute(
      (attr) => attr instanceof ConstantValueAttribute
    ) as ConstantValueAttribute
  }

  static getLineNumberTableAttribute(holder: AttributesHolder): LineNumberTableAttribute {
    return holder.findAttribute(
      (attr) => attr instanceof LineNumberTableAttribute
    ) as LineNumberTableAttribute
  }

  static getSourceFileAttribute(holder: AttributesHolder): SourceFileAttribute {
    return holder.findAttribute(
      (attr) => attr instanceof SourceFileAttribute
    ) as SourceFileAttribute
  }
}
