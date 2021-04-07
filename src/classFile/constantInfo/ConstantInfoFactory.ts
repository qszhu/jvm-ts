import ClassReader from '../ClassReader'
import ConstantPool from '../ConstantPool'
import ConstantClassInfo from './ConstantClassInfo'
import ConstantInfo from './ConstantInfo'
import ConstantInvokeDynamicInfo from './ConstantInvokeDynamicInfo'
import ConstantMethodHandleInfo from './ConstantMethodHandleInfo'
import ConstantMethodTypeInfo from './ConstantMethodTypeInfo'
import ConstantNameAndTypeInfo from './ConstantNameAndTypeInfo'
import ConstantStringInfo from './ConstantStringInfo'
import ConstantType from './ConstantType'
import ConstantUtf8Info from './ConstantUtf8Info'
import ConstantFieldRefInfo from './memberRef/ConstantFieldRefInfo'
import ConstantInterfaceMethodRefInfo from './memberRef/ConstantInterfaceMethodRefInfo'
import ConstantMethodRefInfo from './memberRef/ConstantMethodRefInfo'
import ConstantDoubleInfo from './numeric/ConstantDoubleInfo'
import ConstantFloatInfo from './numeric/ConstantFloatInfo'
import ConstantIntegerInfo from './numeric/ConstantIntegerInfo'
import ConstantLongInfo from './numeric/ConstantLongInfo'

export default class ConstantInfoFactory {
  static readConstantInfo(reader: ClassReader, cp: ConstantPool): ConstantInfo {
    const tag = reader.readU1()

    switch (tag) {
      case ConstantType.Class:
        return ConstantClassInfo.fromReader(reader, cp)
      case ConstantType.InvokeDynamic:
        return ConstantInvokeDynamicInfo.fromReader(reader)
      case ConstantType.MethodHandle:
        return ConstantMethodHandleInfo.fromReader(reader)
      case ConstantType.MethodType:
        return ConstantMethodTypeInfo.fromReader(reader)
      case ConstantType.NameAndType:
        return ConstantNameAndTypeInfo.fromReader(reader)
      case ConstantType.String:
        return ConstantStringInfo.fromReader(reader, cp)
      case ConstantType.Utf8:
        return ConstantUtf8Info.fromReader(reader)
      case ConstantType.FieldRef:
        return ConstantFieldRefInfo.fromReader(reader, cp)
      case ConstantType.InterfaceMethodRef:
        return ConstantInterfaceMethodRefInfo.fromReader(reader, cp)
      case ConstantType.MethodRef:
        return ConstantMethodRefInfo.fromReader(reader, cp)
      case ConstantType.Double:
        return ConstantDoubleInfo.fromReader(reader)
      case ConstantType.Float:
        return ConstantFloatInfo.fromReader(reader)
      case ConstantType.Integer:
        return ConstantIntegerInfo.fromReader(reader)
      case ConstantType.Long:
        return ConstantLongInfo.fromReader(reader)
      default:
        throw new Error(`java.lang.ClassFormatError: constant pool tag ${tag}`)
    }
  }
}
