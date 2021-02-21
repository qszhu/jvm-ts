export default interface Entry {
  readClass(className: string): { data: Buffer, entry: Entry }
  toString(): string
}
