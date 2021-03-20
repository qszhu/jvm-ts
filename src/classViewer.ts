import fs from 'fs'
import ClassFile from "./classFile"

async function main() {
  const data = fs.readFileSync('java/jvmgo/book/ch09/GetClassTest.class')
  const classFile = new ClassFile(data)
  console.log(classFile.toString())
}

if (require.main === module) {
  main().catch(console.error)
}
