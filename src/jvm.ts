import ClassLoader from './class/ClassLoader'
import Obj from './class/Obj'
import { jString } from './class/StringPool'
import ClassPath from './classPath'
import { initClass } from './instruction'
import { interpret } from './interpreter'
import { Thread } from './thread'

export default class Jvm {
  private _verboseInstFlag: boolean
  private _debugFlag: boolean

  constructor(private _argv: any, private _classLoader: ClassLoader, private _mainThread: Thread) {}

  static newJvm(argv: any): Jvm {
    const cp = new ClassPath(argv.Xjre as string, argv.cp as string)

    const verboseClassFlag = argv['verbose:class'] as boolean
    const verboseInstFlag = argv['verbose:inst'] as boolean
    const debugFlag = argv['debug'] as boolean

    const classLoader = ClassLoader.newClassLoader(cp, verboseClassFlag)
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

    interpret(this._mainThread, this._verboseInstFlag, this._debugFlag)
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
    interpret(this._mainThread, this._verboseInstFlag, this._debugFlag)
  }

  private createArgsArray(): Obj {
    const args = (this._argv._ as string[]).slice(1)
    const stringClass = this._classLoader.loadClass('java/lang/String')
    const argsArr = stringClass.arrayClass.newArray(args.length)
    const jArgs = argsArr.refs
    for (const [i, arg] of args.entries()) {
      jArgs[i] = jString(this._classLoader, `${arg}`)
    }
    return argsArr
  }
}