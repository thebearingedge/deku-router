
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

  it('serves suckas!', done => {

    match('/', store, (err, redirect, Element) => {
      if (err) return done(err)
      expect(err).to.be.null
      done()
    })
  })

})
