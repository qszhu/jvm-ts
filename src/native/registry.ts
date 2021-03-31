import Frame from '../thread/Frame'

type NativeMethod = (frame: Frame) => void

const registry = new Map<string, NativeMethod>()

const methodKey = (className: string, methodName: string, methodDescriptor: string) =>
  `${className}~${methodName}~${methodDescriptor}`

export function register(
  className: string,
  methodName: string,
  methodDescriptor: string,
  method: NativeMethod
): void {
  const key = methodKey(className, methodName, methodDescriptor)
  registry.set(key, method)
}

const emptyNativeMethod: NativeMethod = (): void => {
  return
}

export function findNativeMethod(
  className: string,
  methodName: string,
  methodDescriptor: string
): NativeMethod {
  const key = methodKey(className, methodName, methodDescriptor)
  if (registry.has(key)) return registry.get(key)

  if (methodName === 'registerNatives' && methodDescriptor === '()V') return emptyNativeMethod
}
