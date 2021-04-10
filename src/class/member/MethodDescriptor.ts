class MethodDescriptor {
  private _parameterTypes: string[]
  private _returnType: string

  constructor() {
    this._parameterTypes = []
    this._returnType = ''
  }

  addParameterType(t: string) {
    this._parameterTypes.push(t)
  }

  get parameterTypes() {
    return this._parameterTypes.slice()
  }

  setReturnType(t: string) {
    this._returnType = t
  }

  get returnType() {
    return this._returnType
  }
}

export default class MethodDescriptorParser {
  private _raw: string
  private _offset: number
  private _parsed: MethodDescriptor

  static parseMethodDescriptor(descriptor: string): MethodDescriptor {
    const parser = new MethodDescriptorParser()
    return parser.parse(descriptor)
  }

  private parse(descriptor: string) {
    this._raw = descriptor
    this._offset = 0
    this._parsed = new MethodDescriptor()
    this.startParams()
    this.parseParamTypes()
    this.endParams()
    this.parseReturnType()
    this.finish()
    return this._parsed
  }

  private causePanic() {
    throw new Error(`BAD descriptor: ${this._raw}`)
  }

  private readUint8() {
    const b = this._raw[this._offset++]
    return b
  }

  private unreadUint8() {
    this._offset--
  }

  private startParams() {
    if (this.readUint8() !== '(') this.causePanic()
  }

  private endParams() {
    if (this.readUint8() !== ')') this.causePanic()
  }

  private finish() {
    if (this._offset !== this._raw.length) this.causePanic()
  }

  private parseParamTypes() {
    while (true) {
      const t = this.parseFieldType()
      if (t !== '') this._parsed.addParameterType(t)
      else break
    }
  }

  private parseReturnType() {
    if (this.readUint8() === 'V') {
      this._parsed.setReturnType('V')
      return
    }

    this.unreadUint8()

    const t = this.parseFieldType()
    if (t !== '') {
      this._parsed.setReturnType(t)
      return
    }

    this.causePanic()
  }

  private parseFieldType() {
    const t = this.readUint8()
    if (['B', 'C', 'D', 'F', 'I', 'J', 'S', 'Z'].includes(t)) return t
    if (t === 'L') return this.parseObjectType()
    if (t === '[') return this.parseArrayType()
    this.unreadUint8()
    return ''
  }

  private parseObjectType() {
    const unread = this._raw.slice(this._offset)
    const semicolonIndex = unread.indexOf(';')
    if (semicolonIndex === -1) this.causePanic()

    const objStart = this._offset - 1
    const objEnd = this._offset + semicolonIndex + 1
    this._offset = objEnd
    const descriptor = this._raw.slice(objStart, objEnd)
    return descriptor
  }

  private parseArrayType() {
    const arrStart = this._offset - 1
    this.parseFieldType()
    const arrEnd = this._offset
    const descriptor = this._raw.slice(arrStart, arrEnd)
    return descriptor
  }
}
