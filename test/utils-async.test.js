
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { invokeAsync, mapAsync } from '../src/utils-async'

chai.use(chaiAsPromised)

describe('mapAsync(collection, callback)', () => {

  it('transforms collection asynchronously', () => {

    const getFoo = () => Promise.resolve('foo')
    const getBar = done => done(null, 'bar')

    const result = mapAsync([getFoo, getBar], (item, done) => item(done))

    return expect(result).to.eventually.deep.equal(['foo', 'bar'])
  })

})

describe('invokeAsync', () => {

  it('rejects when callback returns an error', () => {

    const cb = done => done(new Error('Oops'))

    return expect(invokeAsync(cb)).to.eventually.be.rejectedWith(Error, 'Oops')
  })

  it('rejects when callback throws an error', () => {

    const cb = () => {
      throw new Error('Oops')
    }

    return expect(invokeAsync(cb)).to.eventually.be.rejectedWith(Error, 'Oops')
  })
})
