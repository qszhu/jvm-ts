enum AccessFlag {
  PUBLIC = 0x0001,
  PRIVATE = 0x0002,
  PROTECTED = 0x0004,
  STATIC = 0x0008,
  FINAL = 0x0010,
  SUPER = 0x0020,
  SYNCHRONIZED = 0x0020,
  VOLATILE = 0x0040,
  BRIDGE = 0x0040,
  TRANSIENT = 0x0080,
  VARARGS = 0x0080,
  NATIVE = 0x0100,
  INTERFACE = 0x0200,
  ABSTRACT = 0x0400,
  STRICT = 0x0800,
  SYNTHETIC = 0x1000,
  ANNOTATION = 0x2000,
  ENUM = 0x4000,
}

export function accessFlagsToString(flags: number): string {
  const res: string[] = []
  if (flags & AccessFlag.PUBLIC) res.push('public')
  if (flags & AccessFlag.PRIVATE) res.push('private')
  if (flags & AccessFlag.PROTECTED) res.push('protected')
  if (flags & AccessFlag.STATIC) res.push('static')
  if (flags & AccessFlag.FINAL) res.push('final')
  if (flags & AccessFlag.SUPER) res.push('super')
  if (flags & AccessFlag.SYNCHRONIZED) res.push('synchronized')
  if (flags & AccessFlag.VOLATILE) res.push('volatile')
  if (flags & AccessFlag.BRIDGE) res.push('bridge')
  if (flags & AccessFlag.TRANSIENT) res.push('transient')
  if (flags & AccessFlag.VARARGS) res.push('varargs')
  if (flags & AccessFlag.NATIVE) res.push('native')
  if (flags & AccessFlag.INTERFACE) res.push('interface')
  if (flags & AccessFlag.ABSTRACT) res.push('abstract')
  if (flags & AccessFlag.STRICT) res.push('strict')
  if (flags & AccessFlag.SYNTHETIC) res.push('synthetic')
  if (flags & AccessFlag.ANNOTATION) res.push('annotation')
  if (flags & AccessFlag.ENUM) res.push('enum')
  return `${flags}(${res.join(',')})`

}
export default AccessFlag
