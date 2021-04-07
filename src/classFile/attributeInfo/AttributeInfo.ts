import CodeAttribute from './CodeAttribute'
import ConstantValueAttribute from './ConstantValueAttribute'
import DeprecatedAttribute from './DeprecatedAttribute'
import ExceptionsAttribute from './ExceptionAttribute'
import LineNumberTableAttribute from './LineNumberTableAttribute'
import LocalVariableTableAttribute from './LocalVariableTableAttribute'
import SourceFileAttribute from './SourceFileAttribute'
import SyntheticAttribute from './SyntheticAttribute'

type AttributeInfo =
  | CodeAttribute
  | ConstantValueAttribute
  | DeprecatedAttribute
  | ExceptionsAttribute
  | LineNumberTableAttribute
  | LocalVariableTableAttribute
  | SourceFileAttribute
  | SyntheticAttribute

export default AttributeInfo
