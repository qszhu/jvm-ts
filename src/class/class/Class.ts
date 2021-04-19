import AttributeInfoFactory from '../../classFile/attributeInfo/AttributeInfoFactory'
import SourceFileAttribute from '../../classFile/attributeInfo/SourceFileAttribute'
import ClassFile from '../../classFile/ClassFile'
import AccessFlags from '../AccessFlags'
import RuntimeConstantPool from '../constantPool/RuntimeContantPool'
import Field from '../member/Field'
import Method from '../member/Method'
import BaseObject from '../object/BaseObject'
import BaseClass from './BaseClass'
import ClassLoader from './ClassLoader'

function getSourceFile(cf: ClassFile): string {
  const sfAttr = AttributeInfoFactory.getSourceFileAttribute(cf)
  if (sfAttr) return (sfAttr as SourceFileAttribute).fileName
  return 'Unknown'
}

export default class Class extends BaseClass {
  constructor(cf: ClassFile, loader: ClassLoader) {
    super()
    this._accessFlags = new AccessFlags(cf.accessFlags)
    this._name = cf.className
    this._loader = loader
    this._initStarted = false

    this._constantPool = new RuntimeConstantPool(this, cf.constantPool)
    this._fields = Field.newFields(this, cf.fields)
    this._methods = Method.newMethods(this, cf.methods)
    this._sourceFile = getSourceFile(cf)

    if (!this.isJlObject) {
      this._superClass = loader.loadClass(cf.superClassName)
    }
    this._interfaces = cf.interfaceNames.map((iface) => loader.loadClass(iface))
  }

  getRefVar(fieldName: string, fieldDescriptor: string): BaseObject {
    const field = this._reflection.getStaticField(fieldName, fieldDescriptor)
    return this._staticVars.getRef(field.slotId)
  }

  setRefVar(fieldName: string, fieldDescriptor: string, ref: BaseObject): void {
    const field = this._reflection.getStaticField(fieldName, fieldDescriptor)
    this._staticVars.setRef(field.slotId, ref)
  }
}
