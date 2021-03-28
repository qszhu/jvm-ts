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
    const methodInfo = `${className}.${methodName}${methodDescriptor}`
    console.log('native method', methodInfo)
    if (!nativeMethod) {
      throw new Error(`java.lang.UnsatisfiedLinkError: ${methodInfo}`)
    }
    nativeMethod(frame)
  }

  toString(): string {
    return 'invoke native method'
  }
}
