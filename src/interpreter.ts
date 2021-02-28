import MemberInfo from './classFile/MemberInfo'
import { BytecodeReader } from './instruction'
import { newInstruction } from './instruction/factory'
import { Thread } from './thread'

export function interpret(methodInfo: MemberInfo): void {
  const codeAttr = methodInfo.codeAttribute
  const maxLocals = codeAttr.maxLocals
  const maxStack = codeAttr.maxStack
  const byteCode = codeAttr.code
  const thread = new Thread()
  const frame = thread.newFrame(maxLocals, maxStack)
  thread.pushFrame(frame)
  try {
    loop(thread, byteCode)
  } catch (e) {
    console.log('LocalVars:', frame.localVars)
    console.log('OperandStack:', frame.operandStack)
    console.log(e)
  }
}

function loop(thread: Thread, bytecode: Buffer): void {
  const frame = thread.popFrame()
  const reader = new BytecodeReader()
  while (true) {
    const pc = (thread.pc = frame.nextPc)

    reader.reset(bytecode, pc)

    const opcode = reader.readUint8()
    const inst = newInstruction(opcode)
    inst.fetchOperands(reader)
    frame.nextPc = reader.pc

    console.log(`pc: ${pc} inst: ${inst.constructor.name}`)
    inst.execute(frame)
  }
}
