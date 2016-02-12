
import { expect } from 'chai'
import createPathMatcher from '../src/create-path-matcher'

describe('createPathMatcher(path, paramTypes)', () => {

  it('matches dynamic paths', () => {
    const matcher = createPathMatcher('foo/:bar')
    expect(matcher).to.have.property('specificity', '43')
    expect(matcher.toParams(['foo', 'baz'])).to.deep.equal({ bar: 'baz' })
    expect(matcher.toPath({ bar: 'baz' })).to.deep.equal(['foo', 'baz'])
  })

  it('matches typed dynamic paths', () => {
    const matcher = createPathMatcher('foo/:bar', { bar: Number })
    expect(matcher.toParams(['foo', '1', 'baz'])).to.deep.equal({ bar: 1 })
  })

  it('matches specific paths', () => {
    const matcher = createPathMatcher('foo/bar')
    expect(matcher).to.have.property('specificity', '44')
    expect(matcher.toParams(['foo', 'bar'])).to.deep.equal({})
    expect(matcher.toPath({})).to.deep.equal(['foo', 'bar'])
  })

  it('matches splat paths', () => {
    const matcher = createPathMatcher('*notFound')
    expect(matcher).to.have.property('specificity', '2')
    expect(matcher.toParams(['foo', 'bar']))
      .to.deep.equal({ notFound: 'foo/bar' })
  })

})
