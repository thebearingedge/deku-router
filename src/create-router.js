
import { batchActions } from 'redux-batched-actions'
import { routeChange } from './utils-redux'
import createRoute from './create-route'
import matchLocation from './match-location'
import createTransition from './create-transition'
import createRouteElement from './create-route-element'

export default function createRouter(root, history, store) {

  const Router = {}
  const routes = createRoute()(root)
  const { getState, dispatch } = store

  const { location } = getState()

  const state = { ...matchLocation(routes, location), transition: null }

  history.listen(location => transitionTo(location, { navigating: true }))

  const render = () => {

    const { route, params, location } = state
    const { query } = location

    return createRouteElement(route, params, query)
  }


  const transitionTo = (location, { navigating = false } = {}) => {

    return createTransition(state, location, store)
      .then(({ toState, redirects, actions }) => {

        Object.assign(state, toState, { transition: null })

        const { location } = toState
        const notify = false

        if (navigating && redirects.length) {

          history.replace(location.url, { notify })
        }

        if (!navigating) history.push(location.url, { notify })

        dispatch(batchActions([routeChange(location), ...actions]))
      })
  }

  return Object.assign(Router, { state, render, transitionTo })
}
