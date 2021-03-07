import Class from '.'
import ClassPath from '../classPath'

export default class ClassLoader {
  private _classpath: ClassPath
  private _classMap: Map<string, Class>
  private _verbose: boolean

  constructor(classPath: ClassPath, verbose: boolean) {
    this._classpath = classPath
    this._classMap = new Map()
    this._verbose = verbose
  }

  loadClass(name: string): Class {
    if (this._classMap.has(name)) return this._classMap.get(name)
    return this.loadNonArrayClass(name)
  }

  loadNonArrayClass(name: string): Class {
    const { data, entry } = this.readClass(name)
    const cls = this.defineClass(data)
    cls.link()
    if (this._verbose) {
      console.log(`[Loaded ${name} from ${entry}]`)
    }
    return cls
  }

  private readClass(name: string) {
    return this._classpath.readClass(name)
  }

  private defineClass(data: Buffer) {
    const cls = Class.parse(data)
    cls.loader = this
    cls.resolveSuperClass()
    cls.resolveInterfaces()
    this._classMap.set(cls.name, cls)
    return cls
  }
}
