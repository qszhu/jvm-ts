import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import ConstantUtf8Info from './ConstantUtf8Info'
import ConstantIntegerInfo from './ConstantIntegerInfo'
import ConstantFloatInfo from './ConstantFloatInfo'
import ConstantLongInfo from './ConstantLongInfo'
import ConstantDoubleInfo from './ConstantDoubleInfo'
import ConstantClassInfo from './ConstantClassInfo'
import ConstantStringInfo from './ConstantStringInfo'
import ConstantFieldRefInfo from './ConstantFieldRefInfo'
import ConstantMethodRefInfo from './ConstantMethodRefInfo'
import ConstantInterfaceMethodRefInfo from './ConstantInterfaceMethodRefInfo'
import ConstantNameAndTypeInfo from './ConstantNameAndTypeInfo'
import ConstantMethodHandleInfo from './ConstantMethodHandleInfo'
import ConstantMethodTypeInfo from './ConstantMethodTypeInfo'
import ConstantInvokeDynamicInfo from './ConstantInvokeDynamicInfo'

export type ConstantInfo =
  | ConstantUtf8Info
  | ConstantIntegerInfo
  | ConstantFloatInfo
  | ConstantLongInfo
  | ConstantDoubleInfo
  | ConstantClassInfo
  | ConstantStringInfo
  | ConstantFieldRefInfo
  | ConstantMethodRefInfo
  | ConstantInterfaceMethodRefInfo
  | ConstantNameAndTypeInfo
  | ConstantMethodHandleInfo
  | ConstantMethodTypeInfo
  | ConstantInvokeDynamicInfo

enum ConstantType {
  Utf8 = 1,
  Integer = 3,
  Float = 4,
  Long = 5,
  Double = 6,
  Class = 7,
  String = 8,
  FieldRef = 9,
  MethodRef = 10,
  InterfaceMethodRef = 11,
  NameAndType = 12,
  MethodHandle = 15,
  MethodType = 16,
  InvokeDynamic = 18,
}

export function readConstantInfo(reader: ClassReader, cp: ConstantPool): ConstantInfo {
  const tag = reader.readU1()

  switch (tag) {
    case ConstantType.Utf8:
      return ConstantUtf8Info.fromReader(reader)
    case ConstantType.Integer:
      return ConstantIntegerInfo.fromReader(reader)
    case ConstantType.Float:
      return ConstantFloatInfo.fromReader(reader)
    case ConstantType.Long:
      return ConstantLongInfo.fromReader(reader)
    case ConstantType.Double:
      return ConstantDoubleInfo.fromReader(reader)
    case ConstantType.Class:
      return ConstantClassInfo.fromReader(reader, cp)
    case ConstantType.String:
      return ConstantStringInfo.fromReader(reader, cp)
    case ConstantType.FieldRef:
      return ConstantFieldRefInfo.fromReader(reader, cp)
    case ConstantType.MethodRef:
      return ConstantMethodRefInfo.fromReader(reader, cp)
    case ConstantType.InterfaceMethodRef:
      return ConstantInterfaceMethodRefInfo.fromReader(reader, cp)
    case ConstantType.NameAndType:
      return ConstantNameAndTypeInfo.fromReader(reader)
    case ConstantType.MethodHandle:
      return ConstantMethodHandleInfo.fromReader(reader)
    case ConstantType.MethodType:
      return ConstantMethodTypeInfo.fromReader(reader)
    case ConstantType.InvokeDynamic:
      return ConstantInvokeDynamicInfo.fromReader(reader)
    default:
      throw new Error(`java.lang.ClassFormatError: constant pool tag ${tag}`)
  }
}
