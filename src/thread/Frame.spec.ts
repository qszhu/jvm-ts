import * as chai from 'chai'
import 'mocha'

import Frame from './Frame'

const assert = chai.assert

const eps = 1e-6

describe('frame', async () => {
  let frame: Frame

  beforeEach(async () => {
    frame = new Frame(100, 100)
  })

  describe('local vars', async () => {
    it('should set positive int', async () => {
      const val = 100
      frame.localVars.setInt(0, val)
      assert.equal(frame.localVars.getInt(0), val)
    })

    it('should set negative int', async () => {
      const val = -100
      frame.localVars.setInt(1, val)
      assert.equal(frame.localVars.getInt(1), val)
    })

    it('should set positive long', async () => {
      const val = BigInt(2997924580)
      frame.localVars.setLong(2, val)
      assert.equal(frame.localVars.getLong(2), val)
    })

    it('should set negative long', async () => {
      const val = -BigInt(2997924580)
      frame.localVars.setLong(4, val)
      assert.equal(frame.localVars.getLong(4), val)
    })

    it('should set float', async () => {
      const val = 3.1415926
      frame.localVars.setFloat(6, val)
      assert.approximately(frame.localVars.getFloat(6), val, eps)
    })

    it('should set double', async () => {
      const val = 2.71828182845
      frame.localVars.setDouble(7, val)
      assert.approximately(frame.localVars.getDouble(7), val, eps)
    })

    it('should set ref', async () => {
      const val: any = null
      frame.localVars.setRef(9, val)
      assert.equal(frame.localVars.getRef(9), val)
    })
  })

  describe('operand stack', async () => {
    it('should push int', async () => {
      frame.operandStack.pushInt(100)
      frame.operandStack.pushInt(-100)
      assert.equal(frame.operandStack.popInt(), -100)
      assert.equal(frame.operandStack.popInt(), 100)
    })

    it('should push long', async () => {
      const val = BigInt(2997924580)
      frame.operandStack.pushLong(val)
      frame.operandStack.pushLong(-val)
      assert.equal(frame.operandStack.popLong(), -val)
      assert.equal(frame.operandStack.popLong(), val)
    })

    it('should push float', async () => {
      const val = 3.1415926
      frame.operandStack.pushFloat(val)
      assert.approximately(frame.operandStack.popFloat(), val, eps)
    })

    it('should push double', async () => {
      const val = 2.71828182845
      frame.operandStack.pushDouble(val)
      assert.approximately(frame.operandStack.popDouble(), val, eps)
    })

    it('should push ref', async () => {
      const val: any = null
      frame.operandStack.pushRef(val)
      assert.equal(frame.operandStack.popRef(), val)
    })
  })
})
