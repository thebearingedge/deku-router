
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { findAsyncResult, mapAsync } from '../src/utils-async'

chai.use(chaiAsPromised)

describe('mapAsync(collection, callback)', () => {

  it('transforms collection asynchronously', () => {

    const getFoo = () => Promise.resolve('foo')
    const getBar = done => done(null, 'bar')

    const result = mapAsync([getFoo, getBar], (item, done) => item(done))

    return expect(result).to.eventually.deep.equal(['foo', 'bar'])
  })

})
