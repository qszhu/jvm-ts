import Frame from '../thread/Frame'

type NativeMethod = (frame: Frame) => void

const methodKey = (className: string, methodName: string, methodDescriptor: string) =>
  `${className}~${methodName}~${methodDescriptor}`

const emptyNativeMethod: NativeMethod = (): void => {
  return
}

export default class Registry {
  private _registry: Map<string, NativeMethod> = new Map()

  register(
    className: string,
    methodName: string,
    methodDescriptor: string,
    method: NativeMethod
  ): void {
    const key = methodKey(className, methodName, methodDescriptor)
    this._registry.set(key, method)
  }

  findNativeMethod(className: string, methodName: string, methodDescriptor: string): NativeMethod {
    const key = methodKey(className, methodName, methodDescriptor)
    if (this._registry.has(key)) return this._registry.get(key)

    if (methodName === 'registerNatives' && methodDescriptor === '()V') return emptyNativeMethod
  }
}
