import AttributeInfo from './attributeInfo/AttributeInfo'

export default abstract class AttributesHolder {
  constructor(protected _attributes: AttributeInfo[] = []) {}

  findAttribute(pred: (attr: AttributeInfo) => boolean): AttributeInfo {
    return this._attributes.find(pred)
  }
}
