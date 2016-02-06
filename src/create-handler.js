
import { batchActions } from 'redux-batched-actions'
import { routeChange } from './utils-redux'
import createRoute from './create-route'
import createRouteElement from './create-route-element'
import matchLocation from './match-location'
import createTransition from './create-transition'

const createHandler = (root, location = '/') => {

  const routes = createRoute()(root)
  const rootState = { ...matchLocation(routes, location), transition: null }

  return (location, store, done) => {

    const fromState = Object.assign({}, rootState)

    createTransition(fromState, location, store, { serving: true })
      .then(({ toState, redirects, actions }) => {

        const { location, route, params } = toState
        const { query } = location

        const redirect = redirects.length ? location.url : null

        if (redirect) return done(null, redirect, null)

        store.dispatch(batchActions([routeChange(location), ...actions]))

        const Element = createRouteElement(route, params, query)

        done(null, redirect, Element)
      })
      .catch(done)
  }
}

export default createHandler
