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

export default class AccesstFlags {
  constructor(private _flags: number = AccessFlag.PUBLIC) {}

  private hasSet(f: AccessFlag): boolean {
    return Boolean(this._flags & f)
  }

  get isPublic(): boolean {
    return this.hasSet(AccessFlag.PUBLIC)
  }

  get isPrivate(): boolean {
    return this.hasSet(AccessFlag.PRIVATE)
  }

  get isProtected(): boolean {
    return this.hasSet(AccessFlag.PROTECTED)
  }

  get isStatic(): boolean {
    return this.hasSet(AccessFlag.STATIC)
  }

  get isFinal(): boolean {
    return this.hasSet(AccessFlag.FINAL)
  }

  get isSuper(): boolean {
    return this.hasSet(AccessFlag.SUPER)
  }

  get isSynchronized(): boolean {
    return this.hasSet(AccessFlag.SYNCHRONIZED)
  }

  get isVolatile(): boolean {
    return this.hasSet(AccessFlag.VOLATILE)
  }

  get isBridge(): boolean {
    return this.hasSet(AccessFlag.BRIDGE)
  }

  get isTransient(): boolean {
    return this.hasSet(AccessFlag.TRANSIENT)
  }

  get isVarargs(): boolean {
    return this.hasSet(AccessFlag.VARARGS)
  }

  get isNative(): boolean {
    return this.hasSet(AccessFlag.NATIVE)
  }

  get isInterface(): boolean {
    return this.hasSet(AccessFlag.INTERFACE)
  }

  get isAbstract(): boolean {
    return this.hasSet(AccessFlag.ABSTRACT)
  }

  get isStrict(): boolean {
    return this.hasSet(AccessFlag.STRICT)
  }

  get isSynthetic(): boolean {
    return this.hasSet(AccessFlag.SYNTHETIC)
  }

  get isAnnotation(): boolean {
    return this.hasSet(AccessFlag.ANNOTATION)
  }

  get isEnum(): boolean {
    return this.hasSet(AccessFlag.ENUM)
  }

  toString(): string {
    const res: string[] = []
    if (this.isPublic) res.push('public')
    if (this.isPrivate) res.push('private')
    if (this.isProtected) res.push('protected')
    if (this.isStatic) res.push('static')
    if (this.isFinal) res.push('final')
    if (this.isSuper) res.push('super')
    if (this.isSynchronized) res.push('synchronized')
    if (this.isVolatile) res.push('volatile')
    if (this.isBridge) res.push('bridge')
    if (this.isTransient) res.push('transient')
    if (this.isVarargs) res.push('varargs')
    if (this.isNative) res.push('native')
    if (this.isInterface) res.push('interface')
    if (this.isAbstract) res.push('abstract')
    if (this.isStrict) res.push('strict')
    if (this.isSynthetic) res.push('synthetic')
    if (this.isAnnotation) res.push('annotation')
    if (this.isEnum) res.push('enum')
    return `${this._flags}(${res.join(',')})`
  }
}
