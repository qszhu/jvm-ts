#!/usr/bin/env node
import yargs from 'yargs'

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 [--options] class [args...]')

  .alias('cp', 'classpath')
  .nargs('cp', 1)
  .describe('cp', 'classpath')

  .nargs('Xjre', 1)
  .describe('Xjre', 'path to jre')

  .alias('verbose', 'verbose:class')
  .describe('verbose:class', 'enable verbose output')
  .describe('verbose:inst', 'enable verbose output')

  .help('?')
  .alias('?', 'help')

  .demandCommand(1).argv

console.log(argv)

import ClassPath from './classPath'
import ClassLoader from './class/ClassLoader'
import { interpret } from './interpreter'

async function main() {
  const cp = new ClassPath(argv.Xjre as string, argv.cp as string)
  console.log(cp.toString())

  const verboseClass = argv['verbose:class'] as boolean
  const verboseInst = argv['verbose:inst'] as boolean

  const classLoader = new ClassLoader(cp, verboseClass)

  let className: string = argv._[0] as string
  className = className.replace(/\./g, '/')
  console.log(className)

  const mainClass = classLoader.loadClass(className)
  const mainMethod = mainClass.mainMethod

  if (mainMethod) interpret(mainMethod, verboseInst)
  else console.error('Main method not found in class', argv._[0])
}

if (require.main === module) {
  main().catch(console.error)
}
