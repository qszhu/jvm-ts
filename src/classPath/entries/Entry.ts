export default interface Entry {
  readClass(className: string): Promise<Buffer>
  toString(): string
}
