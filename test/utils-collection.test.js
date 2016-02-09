
import { expect } from 'chai'
import { compact, takeWhile, takeRightWhile } from '../src/utils-collection'

describe.only('utils-collection', () => {

  describe('compact(collection)', () => {

    it('omits falsy values from collection', () => {
      const fn = () => {}
      const obj = {}
      const collection = ['foo', null, fn, undefined, false, obj]
      const result = compact(collection)
      expect(result).to.deep.equal(['foo', fn, obj])
    })

  })

  describe('takeWhile(collection, test)', () => {

    it('takes until test is false', () => {
      const collection = [-1, 0, 1, 2]
      const taken = takeWhile(collection, item => item <= 1)
      expect(taken).to.deep.equal([-1, 0, 1])
    })

    it('returns an empty array', () => {
      const collection = []
      const taken = takeWhile(collection, item => !!item)
      expect(taken).to.deep.equal([])
    })

  })

  describe('takeRightWhile(collection, test)', () => {

    it('takes from end of collection until test is false', () => {
      const collection = [0, 1, 2, 3]
      const taken = takeRightWhile(collection, item => item > 0)
      expect(taken).to.deep.equal([1, 2, 3])
    })

    it('returns an empty array', () => {
      const collection = []
      const taken = takeRightWhile(collection, item => !!item)
      expect(taken).to.deep.equal([])
    })

  })

})
