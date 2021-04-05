import Method from '../class/ClassMember/Method'
import Frame from './Frame'

class Stack<T> {
  private _data: T[] = []

  constructor(private _maxSize: number) {}

  push(e: T): void {
    if (this._data.length >= this._maxSize) throw new Error('java.lang.StackOverflowError')
    this._data.push(e)
  }

  pop(): T {
    if (this._data.length === 0) throw new Error('stack is empty')
    return this._data.pop()
  }

  peek(): T {
    if (this._data.length === 0) throw new Error('stack is empty')
    return this._data[this._data.length - 1]
  }

  clear(): void {
    while (!this.isEmpty) this.pop()
  }

  get isEmpty(): boolean {
    return this._data.length === 0
  }
}

export class Thread {
  constructor(private _pc = 0, private _stack?: Stack<Frame>) {
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
    if (!this._stack.isEmpty) {
      frame.lower = this._stack.peek()
    }
    this._stack.push(frame)
  }

  popFrame(): Frame {
    const frame = this._stack.pop()
    frame.lower = void 0
    return frame
  }

  currentFrame(): Frame {
    return this._stack.peek()
  }

  clearStack(): void {
    this._stack.clear()
  }

  get topFrame(): Frame {
    return this._stack.peek()
  }

  get isStackEmpty(): boolean {
    return this._stack.isEmpty
  }

  get frames(): Frame[] {
    const res: Frame[] = []
    for (let frame = this._stack.peek(); frame; frame = frame.lower) {
      res.push(frame)
    }
    return res
  }
}
