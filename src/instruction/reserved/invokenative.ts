import { NoOperandsInstruction } from '..'
import { findNativeMethod } from '../../native/registry'
import Frame from '../../thread/Frame'

import * as jl from '../../native/java/lang'

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
