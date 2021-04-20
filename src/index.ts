#!/usr/bin/env node
import yargs from 'yargs'
import Jvm from './Jvm'

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

  .alias('d', 'debug')

  .help('?')
  .alias('?', 'help')

  .demandCommand(1).argv

async function main() {
  Jvm.newJvm(argv).start()
}

if (require.main === module) {
  main().catch(console.error)
}
