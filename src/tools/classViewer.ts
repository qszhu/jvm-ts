#!/usr/bin/env node
import fs from 'fs'
import ClassFile from "../classFile/ClassFile"

const bytecodes = [
  'Nop',          'AConstNull',       'IConstM1',       'IConst0',      'IConst1',      'IConst2',        'IConst3',        'IConst4',
  'IConst5',      'LConst0',          'LConst1',        'FConst0',      'FConst1',      'FConst2',        'DConst0',        'DConst1',
  'BiPush',       'SiPush',           'Ldc',            'LdcW',         'Ldc2W',        'ILoad',          'LLoad',          'FLoad',
  'DLoad',        'ALoad',            'ILoad0',         'ILoad1',       'ILoad2',       'ILoad3',         'LLoad0',         'LLoad1',
  'LLoad2',       'LLoad3',           'FLoad0',         'FLoad1',       'FLoad2',       'FLoad3',         'DLoad0',         'DLoad1',
  'DLoad2',       'DLoad3',           'ALoad0',         'ALoad1',       'ALoad2',       'ALoad3',         'IALoad',         'LALoad',
  'FALoad',       'DALoad',           'AALoad',         'BALoad',       'CALoad',       'SALoad',         'IStore',         'LStore',
  'FStore',       'DStore',           'AStore',         'IStore0',      'IStore1',      'IStore2',        'IStore3',        'LStore0',
  'LStore1',      'LStore2',          'LStore3',        'FStore0',      'FStore1',      'FStore2',        'FStore3',        'DStore0',
  'DStore1',      'DStore2',          'DStore3',        'AStore0',      'AStore1',      'AStore2',        'AStore3',        'IAStore',
  'LAStore',      'FAStore',          'DAStore',        'AAStore',      'BAStore',      'CAStore',        'SAStore',        'Pop',
  'Pop2',         'Dup',              'DupX1',          'DupX2',        'Dup2',         'Dup2X1',         'Dup2X2',         'Swap',
  'IAdd',         'LAdd',             'FAdd',           'DAdd',         'ISub',         'LSub',           'FSub',           'DSub',
  'IMul',         'LMul',             'FMul',           'DMul',         'IDiv',         'LDiv',           'FDiv',           'DDiv',
  'IRem',         'LRem',             'FRem',           'DRem',         'INeg',         'LNeg',           'FNeg',           'DNeg',
  'IShl',         'LShl',             'IShr',           'LShr',         'IUShr',        'LUShr',          'IAnd',           'LAnd',
  'IOr',          'LOr',              'IXor',           'LXor',         'IInc',         'I2L',            'I2F',            'I2D',
  'L2I',          'L2F',              'L2D',            'F2I',          'F2L',          'F2D',            'D2I',            'D2L',
  'D2F',          'I2B',              'I2C',            'I2S',          'LCmp',         'FCmpL',          'FCmpG',          'DCmpL',
  'DCmpG',        'IfEq',             'IfNE',           'IfLT',         'IfGE',         'IfGT',           'IfLE',           'IfICmpEq',
  'IfICmpNE',     'IfICmpLT',         'IfICmpGE',       'IfICmpGT',     'IfICmpLE',     'IfACmpEq',       'IfAcmpNE',       'Goto',
  'JSR',          'RET',              'TableSwitch',    'LookupSwitch', 'IReturn',      'LReturn',        'FReturn',        'DReturn',
  'AReturn',      'Return',           'GetStatic',      'PutStatic',    'GetField',     'PutField',       'InvokeVirtual',  'InvokeSpecial',
  'InvokeStatic', 'InvokeInterface',  'InvokeDynamic',  'New',          'NewArray',     'ANewArray',      'ArrayLength',    'AThrow',
  'CheckCast',    'InstanceOf',       'MonitorEnter',   'MonitorExit',  'Wide',         'MultiANewArray', 'IfNull',         'IfNonNull',
  'GotoW',        'JSRW',             'Breakpoint'
]

const instLen = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  1, 2, 1, 2, 2, 1, 1, 1,
  1, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2,
  -1,-1,2, 2, 0, 0, 0, 0,
  0, 0, 2, 2, 2, 2, 2, 2,
  2, 4,-1, 2, 1, 2, 0,-1,
  2, 2,-1,-1, 3, 3, 2, 2,
  2,-1,-1
]

export function codeToString(code: Buffer): string {
  const res: string[] = []
  for (let i = 0; i < code.length; i++) {
    const b = code.readUInt8(i)
    const inst = bytecodes[b]
    res.push(`${i}: ${inst}`)
    if (b === 0xc4) { // wide
      if (code.readUInt8(i + 1) === 0x84) { // iinc
        i += 2
      }
    }
    i += instLen[b]
  }
  return res.join('\n')
}

async function main(fn: string) {
  const data = fs.readFileSync(fn)
  const classFile = new ClassFile(data)
  console.log(classFile.toString())
}

if (require.main === module) {
  if (process.argv.length !== 3) {
    console.log('Usage: classViewer <class file>')
    process.exit(1)
  }
  main(process.argv[2]).catch(console.error)
}
