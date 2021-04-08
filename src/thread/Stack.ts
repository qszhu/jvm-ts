export default class Stack<T> {
  private _data: T[] = []

  constructor(private _maxSize: number) {}

  get isEmpty(): boolean {
    return this._data.length === 0
  }

  get data(): T[] {
    return this._data.slice()
  }

  push(e: T): void {
    if (this._data.length >= this._maxSize) throw new Error('java.lang.StackOverflowError')
    this._data.push(e)
  }

  pop(): T {
    if (this.isEmpty) throw new Error('stack is empty')
    return this._data.pop()
  }

  peek(): T {
    if (this.isEmpty) throw new Error('stack is empty')
    return this._data[this._data.length - 1]
  }

  clear(): void {
    this._data = []
  }
}
