import ConstantClassInfo from './ConstantClassInfo'
import ConstantInvokeDynamicInfo from './ConstantInvokeDynamicInfo'
import ConstantMethodHandleInfo from './ConstantMethodHandleInfo'
import ConstantMethodTypeInfo from './ConstantMethodTypeInfo'
import ConstantNameAndTypeInfo from './ConstantNameAndTypeInfo'
import ConstantStringInfo from './ConstantStringInfo'
import ConstantUtf8Info from './ConstantUtf8Info'
import ConstantFieldRefInfo from './memberRef/ConstantFieldRefInfo'
import ConstantInterfaceMethodRefInfo from './memberRef/ConstantInterfaceMethodRefInfo'
import ConstantMethodRefInfo from './memberRef/ConstantMethodRefInfo'
import ConstantDoubleInfo from './numeric/ConstantDoubleInfo'
import ConstantFloatInfo from './numeric/ConstantFloatInfo'
import ConstantIntegerInfo from './numeric/ConstantIntegerInfo'
import ConstantLongInfo from './numeric/ConstantLongInfo'

export type ConstantInfo =
  | ConstantClassInfo
  | ConstantInvokeDynamicInfo
  | ConstantMethodHandleInfo
  | ConstantMethodTypeInfo
  | ConstantNameAndTypeInfo
  | ConstantStringInfo
  | ConstantUtf8Info
  | ConstantFieldRefInfo
  | ConstantInterfaceMethodRefInfo
  | ConstantMethodRefInfo
  | ConstantDoubleInfo
  | ConstantFloatInfo
  | ConstantIntegerInfo
  | ConstantLongInfo
