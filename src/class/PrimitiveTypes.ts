export default class PrimitiveTypes {
  private static _types = new Map<string, string>([
    ['void', 'V'],
    ['boolean', 'Z'],
    ['byte', 'B'],
    ['short', 'S'],
    ['int', 'I'],
    ['long', 'J'],
    ['char', 'C'],
    ['float', 'F'],
    ['double', 'D'],
  ])

  static get names(): string[] {
    return [...PrimitiveTypes._types.keys()]
  }

  static has(name: string): boolean {
    return PrimitiveTypes._types.has(name)
  }

  static getDescriptor(name: string): string {
    return PrimitiveTypes._types.get(name)
  }
}
