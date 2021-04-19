import ClassFile from '../../classFile/ClassFile'
import ClassPath from '../../classPath/ClassPath'
import { JL_CLASS } from '../names'
import PrimitiveTypes from '../PrimitiveTypes'
import ArrayClass from './ArrayClass'
import BaseClass from './BaseClass'
import Class from './Class'
import ClassLinker from './ClassLinker'
import PrimitiveClass from './PrimitiveClass'

export default class ClassLoader {
  private _classMap: Map<string, BaseClass> = new Map()

  constructor(private _classPath: ClassPath, private _verbose: boolean) {
    this.loadBasicClasses()
    this.loadPrimitiveClasses()
  }

  private assignClassObject(klass: BaseClass) {
    const jlClassClass = this._classMap.get(JL_CLASS)
    klass.jClass = jlClassClass.newObject()
    klass.jClass.extra = klass
  }

  private loadBasicClasses() {
    this.loadClass(JL_CLASS)
    for (const klass of this._classMap.values()) {
      if (!klass.jClass) this.assignClassObject(klass)
    }
  }

  private loadPrimitiveClasses() {
    for (const primitiveType of PrimitiveTypes.names) {
      this.loadPrimitiveClass(primitiveType)
    }
  }

  private loadPrimitiveClass(className: string) {
    const jClass = this._classMap.get(JL_CLASS).newObject()
    const klass = new PrimitiveClass(className, this, jClass)
    this._classMap.set(className, klass)
  }

  loadClass(name: string): BaseClass {
    if (this._classMap.has(name)) return this._classMap.get(name)

    const klass = name.startsWith('[') ? this.loadArrayClass(name) : this.loadNonArrayClass(name)

    if (this._classMap.has(JL_CLASS)) this.assignClassObject(klass)

    return klass
  }

  private loadArrayClass(name: string): ArrayClass {
    const klass = new ArrayClass(name, this)

    this._classMap.set(name, klass)
    return klass
  }

  private loadNonArrayClass(name: string): Class {
    const { data, entry } = this._classPath.readClass(name)
    const cf = new ClassFile(data)
    const klass = new Class(cf, this)
    new ClassLinker(klass).link()

    if (this._verbose) {
      console.log(`[Loaded ${name} from ${entry}]`)
    }

    this._classMap.set(klass.name, klass)
    return klass
  }
}
