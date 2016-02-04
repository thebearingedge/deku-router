
import { expect } from 'chai'
import createSegmentMatcher from '../src/create-segment-matcher'

describe('createSegmentMatcher(path, type)', () => {

  it('creates an "exact" matcher', () => {
    const matcher = createSegmentMatcher('foo')
    expect(matcher).to.have.property('type', 'exact')
    expect(matcher).to.have.property('specificity', '4')
    expect(matcher.toParam('foo')).to.deep.equal({})
    expect(matcher.toSegment({})).to.equal('foo')
    expect(matcher.toParam('bar')).to.equal(null)
  })

  it('creates a "dynamic" matcher', () => {
    const matcher = createSegmentMatcher(':foo')
    expect(matcher).to.have.property('type', 'dynamic')
    expect(matcher).to.have.property('specificity', '3')
    expect(matcher.toParam('bar')).to.deep.equal({ foo: 'bar' })
    expect(matcher.toSegment({ foo: 'bar' })).to.equal('bar')
  })

  it('creats a typed "dynamic" matcher', () => {
    const matcher = createSegmentMatcher(':foo', Number)
    expect(matcher.toParam('1')).to.deep.equal({ foo: 1 })
  })

  it('creates a "splat" matcher', () => {
    const matcher = createSegmentMatcher('*notFound')
    expect(matcher).to.have.property('type', 'splat')
    expect(matcher).to.have.property('specificity', '2')
    expect(matcher.toParam('bar')).to.deep.equal({ notFound: 'bar' })
    expect(matcher.toSegment({})).to.equal('')
  })

})
