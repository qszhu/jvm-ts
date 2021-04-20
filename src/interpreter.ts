import Debugger from './debugger/Debugger'
import Instruction from './instruction/base/Instruction'
import BytecodeReader from './instruction/BytecodeReader'
import InstructionFactory from './instruction/InstructionFactory'
import Frame from './thread/Frame'
import Thread from './thread/Thread'

export default class Interpreter {
  private _debugger: Debugger

  constructor(private _thread: Thread, private _logInst = false, debug = false) {
    if (debug) this._debugger = new Debugger()
  }

  async interpret(): Promise<void> {
    try {
      await this.loop()
    } catch (e) {
      this.catchErr()
      throw e
    }
  }

  catchErr(): void {
    logFrames(this._thread)
  }

  async loop(): Promise<void> {
    const reader = new BytecodeReader()
    while (true) {
      const frame = this._thread.currentFrame
      const pc = (this._thread.pc = frame.nextPc)

      reader.reset(frame.method.code, pc)

      const opcode = reader.readUint8()
      const inst = InstructionFactory.getInstruction(opcode)
      inst.fetchOperands(reader)
      frame.nextPc = reader.pc

      if (this._logInst) {
        logInstruction(frame, inst)
      }

      if (this._debugger) {
        await this._debugger.debug(frame, inst)
      }

      inst.execute(frame)

      if (this._thread.isStackEmpty) break
    }
  }
}

function logFrames(thread: Thread) {
  while (!thread.isStackEmpty) {
    const frame = thread.popFrame()
    const method = frame.method
    const className = method.class.name
    const lineNum = method.getLineNumber(frame.nextPc)
    console.log(
      `>> line: ${lineNum} pc:${frame.nextPc} ${className} ${method.name} ${method.descriptor}`
    )
  }
}

function logInstruction(frame: Frame, inst: Instruction) {
  const method = frame.method
  const className = method.class.name
  const methodName = method.name
  const pc = frame.thread.pc
  console.log(`${className}.${methodName} #${pc} ${inst.constructor.name}: ${inst.toString()}`)
}
