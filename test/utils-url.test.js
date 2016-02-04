
import { expect } from 'chai'
import { combine, extract } from '../src/utils-url'

describe('combine({ path, query, hash })', () => {

  it('combines a path only', () => {
    const url = combine({ pathname: '/foo' })
    expect(url).to.equal('/foo')
  })

  it('combines a path and query', () => {
    const url = combine({ pathname: '/', query: { bar: 'baz' } })
    expect(url).to.equal('/?bar=baz')
  })

  it('combines a path and hash', () => {
    const url = combine({ pathname: '/', hash: '#foo' })
    expect(url).to.equal('/#foo')
  })

  it('combines a path, query, and hash', () => {
    const url = combine({ pathname: '/foo', query: { bar: 'baz' }, hash: 'qux' })
    expect(url).to.equal('/foo?bar=baz#qux')
  })

})

describe('extract(url)', () => {

  it('returns an empty object from non-string values', () => {
    const result = extract(null)
    expect(result).to.deep.equal({})
  })

  it('omits trailing slashes', () => {
    const result = extract('/foo/')
    expect(result).to.have.property('url', '/foo')
    expect(result).to.have.property('pathname', '/foo')
  })

  it('prepends a missing slash', () => {
    const result = extract('foo')
    expect(result).to.have.property('url', '/foo')
    expect(result).to.have.property('pathname', '/foo')
  })

  it('returns an object with #url, #pathname, #query, and #hash', () => {
    const url = '/'
    const result = extract(url)
    expect(result).to.have.property('url', url)
    expect(result).to.have.property('pathname', '/')
    expect(result).to.have.property('query').that.deep.equals({})
    expect(result).to.have.property('hash', '')
  })

  it('returns an object with #url, #pathname, #query, and #hash', () => {
    const url = '/foo'
    const result = extract(url)
    expect(result).to.have.property('url', url)
    expect(result).to.have.property('pathname', '/foo')
    expect(result).to.have.property('query').that.deep.equals({})
    expect(result).to.have.property('hash', '')
  })

  it('returns an object with #url, #pathname, #query, and #hash', () => {
    const url = '/foo?bar=baz'
    const result = extract(url)
    expect(result).to.have.property('url', url)
    expect(result).to.have.property('pathname', '/foo')
    expect(result).to.have.property('query').that.deep.equals({ bar: 'baz' })
    expect(result).to.have.property('hash', '')
  })

  it('returns an object with #url, #pathname, #query, and #hash', () => {
    const url = '/foo?bar=baz#qux'
    const result = extract(url)
    expect(result).to.have.property('url', url)
    expect(result).to.have.property('pathname', '/foo')
    expect(result).to.have.property('query').that.deep.equals({ bar: 'baz' })
    expect(result).to.have.property('hash', '#qux')
  })

})
