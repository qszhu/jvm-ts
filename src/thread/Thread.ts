import Method from '../class/member/Method'
import Frame from './Frame'
import Stack from './Stack'

export default class Thread {
  private _pc: number
  private _stack: Stack<Frame>

  constructor() {
    this._pc = 0
    this._stack = new Stack(1024)
  }

  get pc(): number {
    return this._pc
  }

  set pc(pc: number) {
    this._pc = pc
  }

  newFrame(method: Method): Frame {
    return new Frame(this, method)
  }

  pushFrame(frame: Frame): void {
    this._stack.push(frame)
  }

  popFrame(): Frame {
    return this._stack.pop()
  }

  clearStack(): void {
    this._stack.clear()
  }

  get currentFrame(): Frame {
    return this._stack.peek()
  }

  get topFrame(): Frame {
    return this._stack.peek()
  }

  get isStackEmpty(): boolean {
    return this._stack.isEmpty
  }

  get frames(): Frame[] {
    return this._stack.data.reverse()
  }
}
