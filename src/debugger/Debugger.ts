import prompt from 'prompt'
import BaseClass from '../class/class/BaseClass'
import InstanceObject from '../class/object/InstanceObject'
import Instruction from '../instruction/base/Instruction'
import Frame from '../thread/Frame'
import Breakpoints, { emptyBreakPoint, stepBreakpoint } from './breakpoint/Breakpoints'
import MethodBreakpoint from './breakpoint/MethodBreakpoint'
import PcBreakpoint from './breakpoint/PcBreakpoint'

function logFrame(frame: Frame, inst: Instruction): void {
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

function printString(obj: any) {
  // const codes = obj._data[0]._data._data[0].ref._data
  const codes = obj._data._data[0].ref._data
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

function printClass(klass: BaseClass) {
  console.log(`${klass.name}
Static vars:
${klass.staticVars.toString()}
Fields:
${klass.fields.map((f) => f.toString()).join('\n')}
`)
}

function printFields(obj: InstanceObject) {
  console.log(obj.fields.toString())
}

export default class Debugger {
  private _userBreakpoints = new Breakpoints()
  private _debuggerBreakpoint = stepBreakpoint

  constructor() {
    prompt.start()
  }

  async debug(frame: Frame, inst: Instruction): Promise<void> {
    logFrame(frame, inst)

    if (this._debuggerBreakpoint.shouldBreak(frame) || this._userBreakpoints.shouldBreak(frame)) {
      this._debuggerBreakpoint = stepBreakpoint
      let debugCmd
      let continueDebugging = false
      do {
        debugCmd = (await prompt.get(['>']))['>'] as string
        try {
          continueDebugging = this.execDebugCmd(debugCmd, frame)
        } catch (e) {
          console.error(e)
          continueDebugging = true
        }
      } while (continueDebugging)
    }
  }

  execDebugCmd(cmd: string, frame: Frame): boolean {
    let continueDebugging = false
    if (!cmd) return continueDebugging

    continueDebugging = true

    const [fun, arg, arg1] = cmd.split(' ')
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
        printClass(
          frame.operandStack.getRefFromTop(frame.operandStack.size - 1 - Number(arg1)).class
        )
      } else if (arg === 'var') {
        printClass(frame.localVars.getRef(Number(arg1)).class)
      }
    } else if (fun === 'fields') {
      if (arg === 'stack') {
        printFields(
          frame.operandStack.getRefFromTop(
            frame.operandStack.size - 1 - Number(arg1)
          ) as InstanceObject
        )
      } else if (arg === 'var') {
        printFields(frame.localVars.getRef(Number(arg1)) as InstanceObject)
      }
    } else if (fun === 'const') {
      printConst(frame.method.class.constantPool.getConstant(Number(arg)))
    } else if (fun === 'statics') {
      printStatics(frame)
    } else if (fun === 'step') {
      if (arg === 'over') {
        this._debuggerBreakpoint = new MethodBreakpoint(frame.method)
      }
      continueDebugging = false
    } else if (fun === 'bp') {
      this._userBreakpoints.add(new PcBreakpoint(frame.method, Number(arg)))
    } else if (fun === 'run') {
      this._debuggerBreakpoint = emptyBreakPoint
      continueDebugging = false
    }

    return continueDebugging
  }
}
