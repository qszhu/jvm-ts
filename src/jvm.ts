import ClassLoader from './class/class/ClassLoader'
import ArrayObject from './class/object/ArrayObject'
import StringPool from './class/StringPool'
import ClassPath from './classPath/ClassPath'
import { initClass } from './instruction/utils'
import Interpreter from './Interpreter'
import Thread from './thread/Thread'

export default class Jvm {
  private _verboseInstFlag: boolean
  private _debugFlag: boolean

  constructor(private _argv: any, private _classLoader: ClassLoader, private _mainThread: Thread) {}

  static newJvm(argv: any): Jvm {
    const cp = new ClassPath(argv.Xjre as string, argv.cp as string)

    const verboseClassFlag = argv['verbose:class'] as boolean
    const verboseInstFlag = argv['verbose:inst'] as boolean
    const debugFlag = argv['debug'] as boolean

    const classLoader = new ClassLoader(cp, verboseClassFlag)
    const jvm = new Jvm(argv, classLoader, new Thread())
    jvm._verboseInstFlag = verboseInstFlag
    jvm._debugFlag = debugFlag
    return jvm
  }

  start(): void {
    // this.initVm()
    this.execMain()
  }

  private initVm() {
    const vmClass = this._classLoader.loadClass('sun/misc/VM')
    initClass(this._mainThread, vmClass)

    const interpreter = new Interpreter(this._mainThread, this._verboseInstFlag, this._debugFlag)
    interpreter.interpret()
  }

  private execMain() {
    const className = (this._argv._[0] as string).replace(/\./g, '/')
    const mainClass = this._classLoader.loadClass(className)
    const mainMethod = mainClass.mainMethod
    if (!mainMethod) {
      console.error(`Main method not found in class ${this._argv._[0]}`)
      return
    }

    const argsArr = this.createArgsArray()
    const frame = this._mainThread.newFrame(mainMethod)
    frame.localVars.setRef(0, argsArr)

    this._mainThread.pushFrame(frame)
    const interpreter = new Interpreter(this._mainThread, this._verboseInstFlag, this._debugFlag)
    interpreter.interpret()
  }

  private createArgsArray(): ArrayObject {
    const args = (this._argv._ as string[]).slice(1)
    const stringClass = this._classLoader.loadClass('java/lang/String')
    const argsArr = stringClass.arrayClass.newArray(args.length)
    const jArgs = argsArr.refs
    for (const [i, arg] of args.entries()) {
      jArgs[i] = StringPool.jString(this._classLoader, `${arg}`)
    }
    return argsArr
  }
}
