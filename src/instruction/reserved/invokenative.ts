import { NoOperandsInstruction } from '..'
import { findNativeMethod } from '../../native/registry'
import Frame from '../../thread/Frame'

import * as jl from '../../native/java/lang'

jl.init()

export class InvokeNative extends NoOperandsInstruction {
  execute(frame: Frame): void {
    const {
      method: {
        class: { name: className },
        name: methodName,
        descriptor: methodDescriptor,
      },
    } = frame
    const nativeMethod = findNativeMethod(className, methodName, methodDescriptor)
    if (!nativeMethod) {
      const methodInfo = `${className}.${methodName}${methodDescriptor}`
      throw new Error(`java.lang.UnsatisfiedLinkError: ${methodInfo}`)
    }
    nativeMethod(frame)
  }
}
