
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import { findAsyncResult, mapAsync } from '../src/utils-async'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('findAsyncResult(fns, ...args)', () => {

  it('resolves a truthy return value value', () => {

    const fns = [() => 'foo']

    const found = findAsyncResult(fns)
    return expect(found).to.eventually.equal('foo')
  })

  it('resolves undefined if only one falsy return value', () => {

    const fns = [() => false]

    const found = findAsyncResult(fns)
    return expect(found).to.eventually.be.undefined
  })

  it('resolves undefined if only falsy return values', () => {

    const fns = [() => false, () => null]

    const found = findAsyncResult(fns)
    return expect(found).to.eventually.be.undefined
  })

  it('resolves the first truthy value found', () => {

    const fns = [() => 'foo', () => 'baz']

    const found = findAsyncResult(fns)
    return expect(found).to.eventually.equal('foo')
  })

  it('finds a truthy value', () => {

    const fns = [() => null, () => 'foo']

    const found = findAsyncResult(fns)
    return expect(found).to.eventually.equal('foo')
  })

  it('calls functions with arguments and a callback', () => {

    const fns = [(arg1, arg2, cb) => cb(null, arg1 === arg2)]

    const found = findAsyncResult(fns, 'foo', 'foo')

    return expect(found).to.eventually.be.true
  })

  it('rejects if Promise is rejected', () => {

    const fns = [() => Promise.reject(new Error('Oops'))]

    const found = findAsyncResult(fns)

    return expect(found).to.eventually.be.rejectedWith('Oops')
  })

  it('rejects if callback is called with error', () => {

    const fns = [cb => cb(new Error('Oops'))]

    const found = findAsyncResult(fns)

    return expect(found).to.eventually.be.rejectedWith('Oops')
  })

})

describe('mapAsync(collection, callback)', () => {

  it('transforms collection asynchronously', () => {

    const getFoo = () => Promise.resolve('foo')
    const getBar = done => done(null, 'bar')

    const result = mapAsync([getFoo, getBar], (item, done) => item(done))

    return expect(result).to.eventually.deep.equal(['foo', 'bar'])
  })

})
