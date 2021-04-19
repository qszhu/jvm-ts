import AccessFlags from '../AccessFlags'
import { JIO_SERIALIZABLE, JL_CLONEABLE, JL_OBJECT } from '../names'
import ArrayObject from '../object/ArrayObject'
import BaseObject from '../object/BaseObject'
import PrimitiveTypes from '../PrimitiveTypes'
import BaseClass from './BaseClass'
import ClassLoader from './ClassLoader'

function getComponentClassName(name: string): string {
  if (name.startsWith('[')) {
    const componentTypeDescriptor = name.substring(1)
    return toClassName(componentTypeDescriptor)
  }
  throw new Error(`Not array: ${name}`)
}

function toClassName(descriptor: string): string {
  if (descriptor.startsWith('[')) return descriptor
  if (descriptor.startsWith('L')) return descriptor.substring(1, descriptor.length - 1)
  for (const className of PrimitiveTypes.names) {
    if (PrimitiveTypes.getDescriptor(className) === descriptor) return className
  }
  throw new Error(`Invalid descriptor: ${descriptor}`)
}

export default class ArrayClass extends BaseClass {
  constructor(name: string, loader: ClassLoader) {
    super()
    this._accessFlags = new AccessFlags()
    this._name = name
    this._loader = loader
    this._initStarted = true

    this._superClass = loader.loadClass(JL_OBJECT)
    this._interfaces = [loader.loadClass(JL_CLONEABLE), loader.loadClass(JIO_SERIALIZABLE)]
  }

  newArray(count: number): ArrayObject {
    switch (this.name) {
      case '[Z':
      case '[B':
      case '[C':
      case '[S':
      case '[I':
      case '[F':
      case '[D':
        return new ArrayObject(this, new Array<number>(count).fill(0))
      case '[J':
        return new ArrayObject(this, new Array<bigint>(count).fill(BigInt(0)))
      default:
        return new ArrayObject(this, new Array<BaseObject>(count).fill(null))
    }
  }

  get componentClass(): BaseClass {
    const componentClassName = getComponentClassName(this._name)
    return this._loader.loadClass(componentClassName)
  }
}
