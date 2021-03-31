import Class from '.'
import ClassPath from '../classPath'

export const primitiveTypes = new Map<string, string>([
  ['void', 'V'],
  ['boolean', 'Z'],
  ['byte', 'B'],
  ['short', 'S'],
  ['int', 'I'],
  ['long', 'J'],
  ['char', 'C'],
  ['float', 'F'],
  ['double', 'D'],
])

export default class ClassLoader {
  private _classpath: ClassPath
  private _classMap: Map<string, Class>
  private _verbose: boolean

  private constructor(classPath: ClassPath, verbose: boolean) {
    this._classpath = classPath
    this._classMap = new Map()
    this._verbose = verbose
  }

  static newClassLoader(cp: ClassPath, verbose: boolean): ClassLoader {
    const loader = new ClassLoader(cp, verbose)
    loader.loadBasicClasses()
    loader.loadPrimitiveClasses()
    return loader
  }

  private loadBasicClasses() {
    const jlClassClass = this.loadClass('java/lang/Class')
    for (const klass of this._classMap.values()) {
      if (!klass.jClass) {
        klass.jClass = jlClassClass.newObject()
        klass.jClass.extra = klass
      }
    }
  }

  private loadPrimitiveClasses() {
    for (const primitiveType of primitiveTypes.keys()) {
      this.loadPrimitiveClass(primitiveType)
    }
  }

  private loadPrimitiveClass(className: string) {
    const jClass = this._classMap.get('java/lang/Class').newObject()
    const klass = Class.newPrimitiveClass(className, this, jClass)
    this._classMap.set(className, klass)
  }

  loadClass(name: string): Class {
    if (this._classMap.has(name)) return this._classMap.get(name)

    const klass = name.startsWith('[') ? this.loadArrayClass(name) : this.loadNonArrayClass(name)

    if (this._classMap.has('java/lang/Class')) {
      const jlClassClass = this._classMap.get('java/lang/Class')
      klass.jClass = jlClassClass.newObject()
      klass.jClass.extra = klass
    }

    return klass
  }

  private loadArrayClass(name: string): Class {
    const klass = Class.newArrayClass(name, this)
    this._classMap.set(name, klass)
    return klass
  }

  private loadNonArrayClass(name: string): Class {
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
