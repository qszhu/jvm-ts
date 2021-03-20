import Class from "../../../class";
import { jsString, jString } from "../../../class/StringPool";
import Frame from "../../../thread/Frame";
import { register } from "../../registry";

const jlClass = 'java/lang/Class'

export function init(): void {
	register(jlClass, "getPrimitiveClass", "(Ljava/lang/String;)Ljava/lang/Class;", getPrimitiveClass)
	register(jlClass, "getName0", "()Ljava/lang/String;", getName0)
	register(jlClass, "desiredAssertionStatus0", "(Ljava/lang/Class;)Z", desiredAssertionStatus0)
}

function getPrimitiveClass(frame: Frame) {
  const nameObj = frame.localVars.getRef(0)
  const name = jsString(nameObj)
  const loader = frame.method.class.loader
  const klass = loader.loadClass(name).jClass
  frame.operandStack.pushRef(klass)
}

function getName0(frame: Frame) {
  const thiz = frame.localVars.getThis()
  const klass = thiz.extra as Class
  const name = klass.javaName
  const nameObj = jString(klass.loader, name)
  frame.operandStack.pushRef(nameObj)
}

function desiredAssertionStatus0(frame: Frame) {
  frame.operandStack.pushBoolean(false)
}
