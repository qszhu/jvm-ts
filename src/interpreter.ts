import prompt from 'prompt'
import Breakpoints, { emptyBreakPoint, MethodBreakpoint, PcBreakPoint, stepBreakpoint } from './Breakpoint'
import Class from './class'
import ClassLoader from './class/ClassLoader'
import Method from './class/ClassMember/Method'
import Obj from './class/Obj'
import { jString } from './class/StringPool'
import { BytecodeReader, Instruction } from './instruction'
import { newInstruction } from './instruction/factory'
import { Thread } from './thread'
import Frame from './thread/Frame'

export async function interpret(
  method: Method,
  logInst: boolean,
  args: string[],
  debug = false
): Promise<void> {
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

const userBreakpoints = new Breakpoints()
let debuggerBreakpoint = stepBreakpoint

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

    if (logInst) {
      logInstruction(frame, inst)
    }

    if (debug) {
      logFrame(frame, inst)

      if (debuggerBreakpoint.shouldBreak(frame) || userBreakpoints.shouldBreak(frame)) {
        debuggerBreakpoint = stepBreakpoint
        let debugCmd
        let continueDebugging = false
        do {
          debugCmd = (await prompt.get(['>']))['>'] as string
          try {
            continueDebugging = execDebugCmd(debugCmd, frame)
          } catch (e) {
            console.error(e)
            continueDebugging = true
          }
        } while (continueDebugging)
      }
    }

    inst.execute(frame)

    if (thread.isStackEmpty) break
  }
}

function printString(obj: any) {
  const codes = obj._data[0]._data._data[0].ref._data
  console.log(String.fromCharCode(...codes))
}

function printConst(c: any) {
  console.log(c.toString())
}

function printStatics(frame: Frame) {
  const klass = frame.method.class
  console.log(klass.name)
  console.log(frame.method.class.staticVars.toString())
}

function printClass(klass: Class) {
  console.log(`${klass.name}
Static vars:
${klass.staticVars.toString()}
Fields:
${klass.fields.map(f => f.toString()).join('\n')}
`)
}

function printFields(obj: Obj) {
  console.log(obj.fields.toString())
}

function execDebugCmd(cmd: string, frame: Frame): boolean {
  let continueDebugging = false
  if (!cmd) return continueDebugging

  continueDebugging = true

  const [fun, arg, arg1, arg2] = cmd.split(' ')
  if (fun === 'string') {
    if (arg === 'stack') {
      printString(frame.operandStack.getRefFromTop(frame.operandStack.size - 1 - Number(arg1)))
    } else if (arg === 'statics') {
      printString(frame.method.class.staticVars.getRef(Number(arg)))
    } else {
      printString(frame.localVars.getRef(Number(arg)))
    }
  } else if (fun === 'class') {
    if (arg === 'stack') {
      printClass(frame.operandStack.getRefFromTop(frame.operandStack.size - 1 - Number(arg1)).class)
    } else if (arg === 'var') {
      printClass(frame.localVars.getRef(Number(arg1)).class)
    }
  } else if (fun === 'fields') {
    if (arg === 'stack') {
      printFields(frame.operandStack.getRefFromTop(frame.operandStack.size - 1 - Number(arg1)))
    } else if (arg === 'var') {
      printFields(frame.localVars.getRef(Number(arg1)))
    }
  } else if (fun === 'const') {
    printConst(frame.method.class.constantPool.getConstant(Number(arg)))
  } else if (fun === 'statics') {
    printStatics(frame)
  } else if (fun === 'step') {
    if (arg === 'over') {
      debuggerBreakpoint = new MethodBreakpoint(frame.method)
    }
    continueDebugging = false
  } else if (fun === 'bp') {
    userBreakpoints.add(new PcBreakPoint(frame.method, Number(arg)))
  } else if (fun === 'run') {
    debuggerBreakpoint = emptyBreakPoint
    continueDebugging = false
  }

  return continueDebugging
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
  console.log(`${className}.${methodName} #${pc} ${inst.constructor.name}: ${inst.toString()}`)
}

function logFrame(frame: Frame, inst: Instruction) {
  const method = frame.method
  const className = method.class.name
  const methodName = method.name
  const pc = frame.thread.pc
  console.log('================================================================================')
  console.log(frame.toString())
  console.log(
    `next inst: ${className}.${methodName} #${pc} ${inst.constructor.name}: ${inst.toString()}`
  )
  console.log('================================================================================')
}
