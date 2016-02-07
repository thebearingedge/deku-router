
import { batchActions } from 'redux-batched-actions'
import { routeChange } from './utils-redux'
import createRoute from './create-route'
import createRouteElement from './create-route-element'
import matchLocation from './match-location'
import createTransition from './create-transition'

const createHandler = root => {

  const routes = createRoute()(root)
  const rootState = { ...matchLocation(routes, '/'), transition: null }

  return (location, store, done) => {

    const fromState = Object.assign({}, rootState)

    createTransition(fromState, location, store, { serving: true })
      .then(({ toState, redirects, actions }) => {

        const { location, route, params } = toState
        const { query } = location

        if (redirects.length) {

          return done(null, location.url, null)
        }

        store.dispatch(batchActions([routeChange(location), ...actions]))

        const Element = createRouteElement(route, params, query)

        done(null, null, Element)
      })
      .catch(done)
  }
}

export default createHandler
