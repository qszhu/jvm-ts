import ClassLoader from './class/ClassLoader'
import Method from './class/ClassMember/Method'
import Obj from './class/Obj'
import { jString } from './class/StringPool'
import { BytecodeReader, Instruction } from './instruction'
import { newInstruction } from './instruction/factory'
import { Thread } from './thread'
import Frame from './thread/Frame'
import prompt from 'prompt'

export async function interpret(method: Method, logInst: boolean, args: string[], debug = false): Promise<void> {
  prompt.start()
  const thread = new Thread()
  const frame = thread.newFrame(method)
  thread.pushFrame(frame)
  try {
    const jArgs = createArgsArray(method.class.loader, args)
    frame.localVars.setRef(0, jArgs)
    await loop(thread, logInst, debug)
  } catch (e) {
    catchErr(thread)
    throw e
  }
}

function createArgsArray(loader: ClassLoader, args: string[]): Obj {
  const stringClass = loader.loadClass('java/lang/String')
  const argsArr = stringClass.arrayClass.newArray(args.length)
  const jArgs = argsArr.refs
  for (const [i, arg] of args.entries()) {
    jArgs[i] = jString(loader, arg)
  }
  return argsArr
}

async function loop(thread: Thread, logInst: boolean, debug: boolean): Promise<void> {
  const reader = new BytecodeReader()
  while (true) {
    const frame = thread.currentFrame()
    const pc = (thread.pc = frame.nextPc)

    reader.reset(frame.method.code, pc)

    const opcode = reader.readUint8()
    const inst = newInstruction(opcode)
    inst.fetchOperands(reader)
    frame.nextPc = reader.pc

    if (logInst || debug) {
      logInstruction(frame, inst)
    }

    inst.execute(frame)

    if (thread.isStackEmpty) break

    if (debug) {
      await prompt.get(['>'])
    }
  }
}

function catchErr(thread: Thread) {
  logFrames(thread)
}

function logFrames(thread: Thread) {
  while (!thread.isStackEmpty) {
    const frame = thread.popFrame()
    const method = frame.method
    const className = method.class.name
    console.log(`>> pc:${frame.nextPc} ${className} ${method.name} ${method.descriptor}`)
  }
}

function logInstruction(frame: Frame, inst: Instruction) {
  const method = frame.method
  const className = method.class.name
  const methodName = method.name
  const pc = frame.thread.pc
  console.log(frame.toString())
  console.log(`${className}.${methodName} #${pc} ${inst.constructor.name}`)
}
