import ClassLoader from './ClassLoader'
import Obj from './Obj'

const internedStrings = new Map<string, Obj>()

export function jString(loader: ClassLoader, str: string): Obj {
  if (internedStrings.has(str)) return internedStrings.get(str)

  const chars = stringToUtf16(str)
  const jChars = new Obj(loader.loadClass('[C'), chars)
  const jStr = loader.loadClass('java/lang/String').newObject()
  jStr.setRefVar('value', '[C', jChars)

  internedStrings.set(str, jStr)
  return jStr
}

export function jsString(jStr: Obj): string {
  const charArr = jStr.getRefVar('value', '[C')
  return utf16ToString(charArr.chars)
}

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

export function internString(jStr: Obj): Obj {
  const jsStr = jsString(jStr)
  if (internedStrings.has(jsStr)) {
    return internedStrings.get(jsStr)
  }
  internedStrings.set(jsStr, jStr)
  return jStr
}
