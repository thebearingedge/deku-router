
import { expect } from 'chai'
import { h } from 'deku'
import { enableBatching } from 'redux-batched-actions'
import { createStore, combineReducers } from 'redux'
import routes from './fixtures/handler-routes'
import createHandler from '../src/create-handler'
import { routeReducer } from '../src/utils-redux'

describe('createHandler(routes, location = "/"', () => {

  let match, store

  before(() => match = createHandler(routes))

  beforeEach(() => {

    const location = routeReducer('/')

    store = createStore(enableBatching(combineReducers({ location })))
  })

  it('serves a matched element', done => {

    match('/', store, (err, redirect, Element) => {
      if (err) return done(err)
      expect(redirect).to.be.null
      expect(Element).not.to.be.null
      expect(Element).to.have.property('type', '#thunk')
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
