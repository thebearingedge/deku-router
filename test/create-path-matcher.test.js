
import { expect } from 'chai'
import createPathMatcher from '../src/create-path-matcher'

describe('createPathMatcher(path, paramTypes)', () => {

  it('matches dynamic paths', () => {
    const matcher = createPathMatcher('foo/:bar')
    expect(matcher).to.have.property('specificity', '43')
    expect(matcher.matches(['foo', 'baz'])).to.be.true
  })

  it('matches typed dynamic paths', () => {
    const matcher = createPathMatcher('foo/:bar', { bar: Number })
    expect(matcher.matches(['foo', '1'])).to.be.true
  })

  it('matches specific paths', () => {
    const matcher = createPathMatcher('foo/bar')
    expect(matcher).to.have.property('specificity', '44')
    expect(matcher.matches(['foo', 'bar'])).be.true
  })

  it('matches splat paths', () => {
    const matcher = createPathMatcher('*notFound')
    expect(matcher).to.have.property('specificity', '2')
    expect(matcher.matches(['foo', 'bar'])).to.be.true
  })

})
