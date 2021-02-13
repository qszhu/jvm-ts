export const ClassNotFoundErrorMsg = 'Class not found'

export class ClassNotFoundError extends Error {
  constructor() {
    super(ClassNotFoundErrorMsg)
  }
}

export const JavaRuntimeNotFoundErrorMsg = 'Java runtime not found'

export class JavaRuntimeNotFoundError extends Error {
  constructor() {
    super(JavaRuntimeNotFoundErrorMsg)
  }
}
