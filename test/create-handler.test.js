
import { expect } from 'chai'
import { h } from 'deku'
import { enableBatching } from 'redux-batched-actions'
import { createStore, combineReducers } from 'redux'
import routes from './fixtures/handler-routes'
import createHandler from '../src/create-handler'
import { routeReducer } from '../src/utils-redux'

describe('createHandler(routes, location = "/"', () => {

  let match, store

  beforeEach(() => {

    match = createHandler(routes)

    const location = routeReducer('/')

    store = createStore(enableBatching(combineReducers({ location })))
  })

  it('serves a matched element', done => {

    match('/', store, (err, redirect, Element) => {
      if (err) return done(err)
      expect(redirect).to.be.null
      expect(Element).to.be.oke
      done()
    })
  })

  it('server a redirect url', done => {

    match('/redirects', store, (err, redirect, Element) => {
      if (err) return done(err)
      expect(redirect).to.equal('/')
      expect(Element).to.be.null
      done()
    })
  })

})
