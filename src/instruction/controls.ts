import { BranchInstruction, BytecodeReader } from '.'
import Frame from '../thread/Frame'

export class IfEq extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val === 0) this.branch(frame)
  }
}

export class IfNE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val !== 0) this.branch(frame)
  }
}

export class IfLT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val < 0) this.branch(frame)
  }
}

export class IfLE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val <= 0) this.branch(frame)
  }
}

export class IfGT extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val > 0) this.branch(frame)
  }
}

export class IfGE extends BranchInstruction {
  execute(frame: Frame): void {
    const val = frame.operandStack.popInt()
    if (val >= 0) this.branch(frame)
  }
}

export class IfICmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 === v2) this.branch(frame)
  }
}

export class IfICmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 !== v2) this.branch(frame)
  }
}

export class IfICmpLT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 < v2) this.branch(frame)
  }
}

export class IfICmpLE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 <= v2) this.branch(frame)
  }
}

export class IfICmpGT extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 > v2) this.branch(frame)
  }
}

export class IfICmpGE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const v2 = stack.popInt()
    const v1 = stack.popInt()
    if (v1 >= v2) this.branch(frame)
  }
}

export class IfACmpEq extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 === ref2) this.branch(frame)
  }
}

export class IfACmpNE extends BranchInstruction {
  execute(frame: Frame): void {
    const stack = frame.operandStack
    const ref2 = stack.popRef()
    const ref1 = stack.popRef()
    if (ref1 !== ref2) this.branch(frame)
  }
}

export class Goto extends BranchInstruction {
  execute(frame: Frame): void {
    this.branch(frame)
  }
}

export class TableSwitch extends BranchInstruction {
  private _defaultOffset: number
  private _low: number
  private _high: number
  private _jumpOffsets: number[]

  fetchOperands(reader: BytecodeReader): void {
    reader.skipPadding()
    this._defaultOffset = reader.readInt32()
    this._low = reader.readInt32()
    this._high = reader.readInt32()
    const offsetsCount = this._high - this._low + 1
    this._jumpOffsets = reader.readInt32List(offsetsCount)
  }

  execute(frame: Frame): void {
    const idx = frame.operandStack.popInt()
    this._offset =
      idx >= this._low && idx <= this._high
        ? this._jumpOffsets[idx - this._low]
        : this._defaultOffset
    this.branch(frame)
  }
}

export class LookupSwitch extends BranchInstruction {
  private _defaultOffset: number
  private _pairsCount: number
  private _matchOffsets: number[]

  fetchOperands(reader: BytecodeReader): void {
    reader.skipPadding()
    this._defaultOffset = reader.readInt32()
    this._pairsCount = reader.readInt32()
    this._matchOffsets = reader.readInt32List(this._pairsCount * 2)
  }

  execute(frame: Frame): void {
    const key = frame.operandStack.popInt()
    for (let i = 0; i < this._pairsCount; i += 2) {
      if (this._matchOffsets[i] === key) {
        this._offset = this._matchOffsets[i + 1]
        this.branch(frame)
        return
      }
    }
    this._offset = this._defaultOffset
    this.branch(frame)
  }
}
