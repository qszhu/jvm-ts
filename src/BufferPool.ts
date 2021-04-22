export default class BufferPool {
  public static buffer = Buffer.alloc(1024 * 1024)
  private static _idx = 0

  static alloc(size: number): number {
    if (BufferPool._idx + size >= BufferPool.buffer.length) {
      BufferPool._idx = 0
    }
    const res = BufferPool._idx
    BufferPool._idx += size
    return res
  }
}
