
import createWindow from './fixtures/create-window'
import mockLocation from 'mock-location'
import chai, { expect } from 'chai'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai'

import createHistory from '../src/create-history'

chai.use(sinonChai)

describe('createHistory(window, options)', () => {

  let window

  beforeEach(() => window = createWindow())

  it('falls back to using location.hash', () => {

    delete window.history

    window.location = mockLocation('example.com/#/foo?bar=baz#qux')

    const history = createHistory(window)

    history.listen(() => {})

    expect(window.addEventListener).to.have.been.calledWith('hashchange')
    expect(history.getLocation()).to.deep.equal({
      url: '/foo?bar=baz#qux',
      pathname: '/foo',
      query: { bar: 'baz' },
      search: '?bar=baz',
      hash: '#qux'
    })
  })

  describe('using location.hash', () => {

    let history

    beforeEach(() => {

      window.location = mockLocation('example.com/#/foo?bar=baz#qux')

      history = createHistory(window, { useHash: true })
    })

    it('creates a location object from the location hash', () => {

      const location = history.getLocation()

      expect(location).to.deep.equal({
        url: '/foo?bar=baz#qux',
        pathname: '/foo',
        query: { bar: 'baz' },
        search: '?bar=baz',
        hash: '#qux'
      })
    })

    it('listens to hashchange events', () => {
      const handler = spy()

      history.listen(handler)

      expect(window.addEventListener).to.have.been.calledWith('hashchange')

      window.dispatchEvent({ type: 'hashchange' })

      expect(handler).to.have.been.calledWithExactly({
        url: '/foo?bar=baz#qux',
        pathname: '/foo',
        query: { bar: 'baz' },
        search: '?bar=baz',
        hash: '#qux'
      })
    })

    it('pushes hash changes', () => {

      const url = '/qux?quux=corge#grault'

      history.listen(() => {})
      history.push(url)

      expect(window.addEventListener).to.have.been.calledTwice
      expect(window.removeEventListener).to.have.been.calledOnce
      expect(window.location.hash).to.equal('#' + url)
      expect(history.getLocation()).to.deep.equal({
        url,
        pathname: '/qux',
        query: { quux: 'corge' },
        search: '?quux=corge',
        hash: '#grault'
      })
    })

    it('replaces window.location', () => {

      const url = '/qux?quux=corge#grault'

      spy(window.location, 'replace')

      history.listen(() => {})
      history.replace(url)

      expect(window.addEventListener).to.have.been.calledTwice
      expect(window.removeEventListener).to.have.been.calledOnce
      expect(window.location.replace).to.have.been.calledOnce
      expect(window.location.hash).to.equal('#' + url)
      expect(history.getLocation()).to.deep.equal({
        url,
        pathname: '/qux',
        query: { quux: 'corge' },
        search: '?quux=corge',
        hash: '#grault'
      })
    })

  })

  describe('using window.history', () => {

    let history

    beforeEach(() => {

      window.location = mockLocation('example.com/foo?bar=baz#qux')

      history = createHistory(window)
    })

    it('creates a location object from window.location', () => {

      const location = history.getLocation()

      expect(location).to.deep.equal({
        url: '/foo?bar=baz#qux',
        pathname: '/foo',
        query: { bar: 'baz' },
        search: '?bar=baz',
        hash: '#qux'
      })
    })

    it('listens to popstate events', () => {
      const handler = spy()

      history.listen(handler)

      expect(window.addEventListener).to.have.been.calledWith('popstate')

      window.dispatchEvent({ type: 'popstate' })

      expect(handler).to.have.been.calledWithExactly({
        url: '/foo?bar=baz#qux',
        pathname: '/foo',
        query: { bar: 'baz' },
        search: '?bar=baz',
        hash: '#qux'
      })
    })

    it('pushes a new history state', () => {

      const url = '/qux?quux=corge#grault'

      history.listen(() => {})
      history.push(url)

      expect(window.addEventListener).to.have.been.calledOnce
      expect(window.removeEventListener).not.to.have.been.called
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, url)
      expect(history.getLocation()).to.deep.equal({
        url,
        pathname: '/qux',
        query: { quux: 'corge' },
        search: '?quux=corge',
        hash: '#grault'
      })
    })

    it('replaces the current history state', () => {

      const url = '/qux?quux=corge#grault'

      history.listen(() => {})
      history.replace(url)

      expect(window.addEventListener).to.have.been.calledOnce
      expect(window.removeEventListener).not.to.have.been.called
      expect(window.history.replaceState)
        .to.have.been.calledWithExactly({}, null, url)
      expect(history.getLocation()).to.deep.equal({
        url,
        pathname: '/qux',
        query: { quux: 'corge' },
        search: '?quux=corge',
        hash: '#grault'
      })
    })

  })

})
