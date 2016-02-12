
import { expect } from 'chai'
import * as utils from '../src/utils-collection'

const { compact, take, takeRight, takeWhile, takeRightWhile, zipWith } = utils
const { drop, dropRight, every } = utils

describe('utils-collection', () => {

  describe('compact(collection)', () => {

    it('omits falsy values from collection', () => {
      const fn = () => {}
      const obj = {}
      const collection = ['foo', null, fn, undefined, false, obj]
      const result = compact(collection)
      expect(result).to.deep.equal(['foo', fn, obj])
    })

  })

  describe('every(array, test)', () => {

    it('checks if test holds for all elements', () => {
      const all = every([1, 2, 3], el => el > 0)
      expect(all).to.be.true
    })

  })

  describe('take(count, array)', () => {

    it('takes from the front of the array', () => {
      const array = [1, 2, 3]
      const taken = take(2, array)
      expect(taken).to.deep.equal([1, 2])
    })

    it('takes none of the array', () => {
      const array = [1, 2, 3]
      const taken = take(undefined, array)
      expect(taken).to.deep.equal([])
    })

  })

  describe('takeRight(count, array)', () => {

    it('takes from the end of the array', () => {
      const array = [1, 2, 3]
      const taken = takeRight(2, array)
      expect(taken).to.deep.equal([2, 3])
    })

    it('takes none of the array', () => {
      const array = [1, 2, 3]
      const taken = takeRight(undefined, array)
      expect(taken).to.deep.equal([])
    })

  })

  describe('drop(count, collection)', () => {

    it('drops from the front of the array', () => {
      const array = [1, 2, 3]
      const taken = drop(2, array)
      expect(taken).to.deep.equal([3])
    })

    it('drops none of the array', () => {
      const array = [1, 2, 3]
      const taken = drop(undefined, array)
      expect(taken).to.deep.equal([1, 2, 3])
    })

  })

  describe('dropRight(count, collection)', () => {

    it('drops from the end of the array', () => {
      const array = [1, 2, 3]
      const taken = dropRight(2, array)
      expect(taken).to.deep.equal([1])
    })

    it('drops none of the array', () => {
      const array = [1, 2, 3]
      const taken = dropRight(undefined, array)
      expect(taken).to.deep.equal([1, 2, 3])
    })

  })

  describe('takeWhile(collection, test)', () => {

    it('takes while test is truthy', () => {
      const collection = [-1, 0, 1, 2]
      const taken = takeWhile(collection, item => item <= 1)
      expect(taken).to.deep.equal([-1, 0, 1])
    })

    it('takes while element is truthy', () => {
      const collection = [2, 1, 0, -1]
      const taken = takeWhile(collection)
      expect(taken).to.deep.equal([2, 1])
    })

    it('returns an empty array', () => {
      const collection = []
      const taken = takeWhile(collection, item => !!item)
      expect(taken).to.deep.equal([])
    })

  })

  describe('takeRightWhile(collection, test)', () => {

    it('takes from end of collection while test is truthy', () => {
      const collection = [0, 1, 2, 3]
      const taken = takeRightWhile(collection, item => item > 0)
      expect(taken).to.deep.equal([1, 2, 3])
    })

    it('takes while element is truthy', () => {
      const collection = [-1, 0, 1, 2]
      const taken = takeRightWhile(collection)
      expect(taken).to.deep.equal([1, 2])
    })

    it('returns an empty array', () => {
      const collection = []
      const taken = takeRightWhile(collection, item => !!item)
      expect(taken).to.deep.equal([])
    })

  })


  describe('zipWith(xs, ys, callback)', () => {

    it('combines arrays via callback', () => {
      const xs = [42, false, '0']
      const ys = [String, val => !val, val => +val]
      const zipped = zipWith(xs, ys, (x, y) => y(x))
      expect(zipped).to.deep.equal(['42', true, 0])
    })

  })

})
