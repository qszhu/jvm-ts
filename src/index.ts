#!/usr/bin/env node
import yargs from 'yargs'

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 [--options] class [args...]')
  .alias('cp', 'classpath')
  .nargs('cp', 1)
  .describe('cp', 'classpath')
  .nargs('Xjre', 1)
  .describe('Xjre', 'path to jre')
  .help('?')
  .alias('?', 'help')
  .demandCommand(1).argv

console.log(argv)

import ClassPath from './classPath'
import ClassFile from './classFile'

async function main() {
  const cp = new ClassPath(argv.Xjre as string, argv.cp as string)
  console.log(cp.toString())

  let className: string = argv._[0] as string
  className = className.replace(/\./g, '/')
  console.log(className)

  const data = await cp.readClass(className)
  const cf = new ClassFile(data)

  console.log(`version: ${cf.majorVersion}.${cf.minorVersion}`)
  console.log(`constants count: ${cf.constantPool.size}`)
  console.log(`access flags: 0x${cf.accessFlags.toString(16)}`)
  console.log(`this class: ${cf.className}`)
  console.log(`super class: ${cf.superClassName}`)
  console.log(`interfaces: ${cf.interfaceNames}`)
  console.log(`fields count: ${cf.fields.length}`)
  for (const f of cf.fields) {
    console.log(`  ${f.name}`)
  }
  console.log(`methods count: ${cf.methods.length}`)
  for (const m of cf.methods) {
    console.log(`  ${m.name}`)
  }
}

if (require.main === module) {
  main().catch(console.error)
}
