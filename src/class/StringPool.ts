import ClassLoader from './ClassLoader'
import ArrayObject from './object/ArrayObject'
import BaseObject from './object/BaseObject'
import InstanceObject from './object/InstanceObject'

function stringToUtf16(str: string): number[] {
  const res = new Array(str.length).fill(0)
  for (let i = 0; i < str.length; i++) {
    res[i] = str.charCodeAt(i)
  }
  return res
}

function utf16ToString(s: number[]): string {
  return String.fromCharCode(...s)
}

export default class StringPool {
  private static _internedStrings = new Map<string, InstanceObject>()

  static jString(loader: ClassLoader, str: string): BaseObject {
    if (StringPool._internedStrings.has(str)) return StringPool._internedStrings.get(str)

    const chars = stringToUtf16(str)
    const jChars = new ArrayObject(loader.loadClass('[C'), chars)
    const jStr = loader.loadClass('java/lang/String').newObject()
    jStr.setRefVar('value', '[C', jChars)

    StringPool._internedStrings.set(str, jStr)
    return jStr
  }

  static jsString(jStr: InstanceObject): string {
    const charArr = jStr.getRefVar('value', '[C') as ArrayObject
    return utf16ToString(charArr.chars)
  }

  static intern(jStr: InstanceObject): InstanceObject {
    const jsStr = StringPool.jsString(jStr)
    if (StringPool._internedStrings.has(jsStr)) {
      return StringPool._internedStrings.get(jsStr)
    }
    StringPool._internedStrings.set(jsStr, jStr)
    return jStr
  }
}
