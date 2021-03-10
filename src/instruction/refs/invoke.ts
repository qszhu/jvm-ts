import { BytecodeReader, Index16Instruction, initClass, Instruction, invokeMethod } from '..'
import Class, { InterfaceMethodRefConstant, MethodRefConstant } from '../../class'
import Obj from '../../class/Obj'
import { jsString } from '../../class/StringPool'
import Frame, { OperandStack } from '../../thread/Frame'

export class InvokeStatic extends Index16Instruction {
  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const methodRef = (cp.getConstant(this._index) as MethodRefConstant).data
    const resolvedMethod = methodRef.resolvedMethod

    // must be static
    if (!resolvedMethod.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const klass = resolvedMethod.class
    if (!klass.hasInitStarted) {
      frame.revertNextPc()
      initClass(frame.thread, klass)
      return
    }

    invokeMethod(frame, resolvedMethod)
  }
}

export class InvokeSpecial extends Index16Instruction {
  execute(frame: Frame): void {
    const currentClass = frame.method.class
    const cp = currentClass.constantPool
    const methodRef = (cp.getConstant(this._index) as MethodRefConstant).data
    const resolvedClass = methodRef.resolvedClass
    const resolvedMethod = methodRef.resolvedMethod

    // constructor must on class
    if (resolvedMethod.name === '<init>' && resolvedMethod.class !== resolvedClass)
      throw new Error('java.lang.NoSuchMethodError')

    // must not be static
    if (resolvedMethod.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    // "this" should not be null
    const ref = frame.operandStack.getRefFromTop(resolvedMethod.argSlotCount - 1) as Obj // "this" ref
    if (!ref) throw new Error('java.lang.NullPointerException')

    if (
      resolvedMethod.isProtected &&
      resolvedMethod.class.isSuperClassOf(currentClass) &&
      resolvedMethod.class.packageName !== currentClass.packageName &&
      ref.class !== currentClass &&
      !ref.class.isSubClassOf(currentClass)
    )
      throw new Error('java.lang.IllegalAccessError')

    let methodToBeInvoked = resolvedMethod
    // lookup non constructor method in super class
    if (
      currentClass.isSuper &&
      resolvedClass.isSuperClassOf(currentClass) &&
      resolvedMethod.name !== '<init>'
    ) {
      methodToBeInvoked = Class.lookupMethodInClass(
        currentClass.superClass,
        methodRef.name,
        methodRef.descriptor
      )
    }
    if (!methodToBeInvoked || methodToBeInvoked.isAbstract)
      throw new Error('java.lang.AbstractMethodError')

    invokeMethod(frame, methodToBeInvoked)
  }
}

function println(stack: OperandStack, descriptor: string) {
  switch (descriptor) {
    case '(Z)V':
      console.log(stack.popInt() !== 0)
      break
    case '(C)V':
      console.log(stack.popInt())
      break
    case '(B)V':
      console.log(stack.popInt())
      break
    case '(S)V':
      console.log(stack.popInt())
      break
    case '(I)V':
      console.log(stack.popInt())
      break
    case '(F)V':
      console.log(stack.popFloat())
      break
    case '(J)V':
      console.log(stack.popLong())
      break
    case '(D)V':
      console.log(stack.popDouble())
      break
    case '(Ljava/lang/String;)V':
      const jStr = stack.popRef()
      const str = jsString(jStr)
      console.log(str)
      break
    default:
      throw new Error(`println: ${descriptor}`)
  }
  stack.popRef()
}

export class InvokeVirtual extends Index16Instruction {
  execute(frame: Frame): void {
    const currentClass = frame.method.class
    const cp = currentClass.constantPool
    const methodRef = (cp.getConstant(this._index) as MethodRefConstant).data
    const resolvedMethod = methodRef.resolvedMethod

    if (resolvedMethod.isStatic) throw new Error('java.lang.IncompatibleClassChangeError')

    const ref = frame.operandStack.getRefFromTop(resolvedMethod.argSlotCount - 1) as Obj
    if (!ref) {
      if (methodRef.name === 'println') {
        println(frame.operandStack, methodRef.descriptor)
        return
      }
      throw new Error('java.lang.NullPointerException')
    }

    if (
      resolvedMethod.isProtected &&
      resolvedMethod.class.isSuperClassOf(currentClass) &&
      resolvedMethod.class.packageName !== currentClass.packageName &&
      ref.class !== currentClass &&
      !ref.class.isSubClassOf(currentClass)
    )
      throw new Error('java.lang.IllegalAccessError')

    const methodToBeInvoked = Class.lookupMethodInClass(
      ref.class,
      methodRef.name,
      methodRef.descriptor
    )
    if (!methodToBeInvoked || methodToBeInvoked.isAbstract)
      throw new Error('java.lang.AbstractMethodError')

    invokeMethod(frame, methodToBeInvoked)
  }
}

export class InvokeInterface implements Instruction {
  constructor(private _index?: number) {}

  fetchOperands(reader: BytecodeReader): void {
    this._index = reader.readUint16()
    reader.readUint8()
    reader.readUint8()
  }

  execute(frame: Frame): void {
    const cp = frame.method.class.constantPool
    const methodRef = (cp.getConstant(this._index) as InterfaceMethodRefConstant).data
    const resolvedMethod = methodRef.resolvedInterfaceMethod
    if (resolvedMethod.isStatic || resolvedMethod.isPrivate)
      throw new Error('java.lang.IncompatibleClassChangeError')

    const ref = frame.operandStack.getRefFromTop(resolvedMethod.argSlotCount - 1) as Obj
    if (!ref) throw new Error('java.lang.NullPointerException')

    if (!ref.class.implements(methodRef.resolvedClass))
      throw new Error('java.lang.IncompatibleClassChangeError')

    const methodToBeInvoked = Class.lookupMethodInClass(
      ref.class,
      methodRef.name,
      methodRef.descriptor
    )
    if (!methodToBeInvoked || methodToBeInvoked.isAbstract)
      throw new Error('java.lang.AbstractMethodError')

    if (!methodToBeInvoked.isPublic) throw new Error('java.lang.IllegalAccessError')

    invokeMethod(frame, methodToBeInvoked)
  }
}
