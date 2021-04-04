import { NoOperandsInstruction } from '..'
import * as jl from '../../native'
import { findNativeMethod } from '../../native/registry'
import Frame from '../../thread/Frame'

jl.init()

export class InvokeNative extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const method = frame.method
    const className = method.class.name
    const methodName = method.name
    const methodDescriptor = method.descriptor
    const nativeMethod = findNativeMethod(className, methodName, methodDescriptor)
    if (!nativeMethod) {
      const methodInfo = `${className}.${methodName}${methodDescriptor}`
      throw new Error(`java.lang.UnsatisfiedLinkError: ${methodInfo}`)
    }
    nativeMethod(frame)
  }

  toString(): string {
    return 'invoke native method'
  }
}
