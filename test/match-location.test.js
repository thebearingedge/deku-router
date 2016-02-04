
import { expect } from 'chai'
import Route from '../src/component-route'
import createRoute from '../src/create-route'
import matchLocation from '../src/match-location'
import { h } from 'deku'

describe('matchLocation(routes, location)', () => {

  let routes

  before(() => {

    const paramTypes = { qux: Number, garply: Number }

    routes = createRoute()(
      <Route path='/'>
        <Route path='foo'>
          <Route path='bar'/>
        </Route>
        <Route path='baz'>
          <Route path=':qux' paramTypes={ paramTypes }>
            <Route path='quux'>
              <Route path='corge'/>
            </Route>
            <Route path='*notFound'/>
          </Route>
        </Route>
        <Route path='grault/:garply' paramTypes={ paramTypes }>
          <Route>
            <Route path='waldo'/>
            <Route path='/fred'/>
          </Route>
        </Route>
      </Route>
    )
  })

  it('matches "/"', () => {
    const url = '/'
    const { route, params, location } = matchLocation(routes, url)
    expect(route).to.have.property('path', '/')
    expect(params).to.deep.equal({})
    expect(location).to.deep.equal({
      url,
      pathname: url,
      search: '',
      hash: '',
      query: {}
    })
  })

  it('matches "/foo?plugh=xyzzy"', () => {
    const url = '/foo?plugh=xyzzy'
    const { route, params, location } = matchLocation(routes, url)
    expect(route).to.have.property('path', 'foo')
    expect(params).to.deep.equal({})
    expect(location).to.deep.equal({
      url,
      pathname: '/foo',
      search: '?plugh=xyzzy',
      hash: '',
      query: { plugh: 'xyzzy' }
    })
  })

  it('matches "/baz/:qux"', () => {
    const url = '/baz/42'
    const { route, params, location } = matchLocation(routes, url)
    expect(route).to.have.property('path', ':qux')
    expect(params).to.deep.equal({ qux: 42 })
    expect(location).to.deep.equal({
      url,
      pathname: url,
      search: '',
      hash: '',
      query: {}
    })
  })

  it('matches "/baz/:qux/grault"', () => {
    const url = '/baz/42/grault'
    const { route, params, location } = matchLocation(routes, url)
    expect(route).to.have.property('path', '*notFound')
    expect(params).to.deep.equal({ qux: 42, notFound: 'grault' })
    expect(location).to.deep.equal({
      url,
      pathname: url,
      search: '',
      hash: '',
      query: {}
    })
  })

  it('matches "/baz/:qux/quux/grault"', () => {
    const { route, params } = matchLocation(routes, '/baz/42/quux/grault')
    expect(route).to.have.property('path', '*notFound')
    expect(params).to.deep.equal({ qux: 42, notFound: 'quux/grault' })
  })

  it('returns null for "/quux"', () => {
    const { route, params } = matchLocation(routes, '/quux')
    expect(route).to.be.null
    expect(params).to.be.null
  })

  it('returns null for /foo/garply', () => {
    const { route, params } = matchLocation(routes, '/foo/garply')
    expect(route).to.be.null
    expect(params).to.be.null
  })

  it('matches complex routes', () => {
    const { route, params } = matchLocation(routes, '/grault/86')
    expect(route).to.have.property('path', 'grault/:garply')
    expect(params).to.deep.equal({ garply: 86 })
  })

  it('matches absolute routes', () => {
    const { route, params } = matchLocation(routes, '/fred')
    expect(route).to.have.property('path', '/fred')
    expect(params).to.deep.equal({})
  })

  it('matches nested absolute routes', () => {
    const { route, params } = matchLocation(routes, '/grault/86/fred')
    expect(route).to.have.property('path', '/fred')
    expect(params).to.deep.equal({ garply: 86 })
  })

  it('matches wrapped routes', () => {
    const { route, params } = matchLocation(routes, '/grault/86/waldo')
    expect(route).to.have.property('path', 'waldo')
    expect(params).to.deep.equal({ garply: 86 })
  })

})
