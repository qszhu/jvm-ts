import Class from '../../../class/class/Class'
import { JL_THROWABLE } from '../../../class/names'
import BaseObject from '../../../class/object/BaseObject'
import Frame from '../../../thread/Frame'
import Thread from '../../../thread/Thread'
import { register } from '../../registry'

function distanceToObject(klass: Class): number {
  let distance = 0
  for (let c = klass.superClass; c; c = c.superClass) {
    distance++
  }
  return distance
}

export class StackTraceElement {
  constructor(
    private _fileName: string,
    private _className: string,
    private _methodName: string,
    private _lineNumber: number
  ) {}

  toString(): string {
    return `${this._className}.${this._methodName}(${this._fileName}:${this._lineNumber})`
  }

  static createStackTraceElements(tObj: BaseObject, thread: Thread): StackTraceElement[] {
    const skip = distanceToObject(tObj.class) + 2
    const frames = thread.frames.slice(skip)
    return frames.map((f: Frame) => StackTraceElement.createStackTraceElement(f))
  }

  static createStackTraceElement(frame: Frame): StackTraceElement {
    const method = frame.method
    const klass = method.class
    return new StackTraceElement(
      klass.sourceFile,
      klass.javaName,
      method.name,
      method.getLineNumber(frame.nextPc - 1)
    )
  }
}

export function init(): void {
  register(JL_THROWABLE, 'fillInStackTrace', `(I)L${JL_THROWABLE};`, fillInStackTrace)
}

function fillInStackTrace(frame: Frame) {
  const thiz = frame.localVars.getRef(0)
  frame.operandStack.pushRef(thiz)
  const stes = StackTraceElement.createStackTraceElements(thiz, frame.thread)
  thiz.extra = stes
}
