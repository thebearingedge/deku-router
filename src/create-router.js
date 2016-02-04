
import { batchActions } from 'redux-batched-actions'
import { routeChange } from './utils-redux'
import createRoute from './create-route'
import matchLocation from './match-location'
import createTransition from './create-transition'
import createRouteElement from './create-route-element'

export default function createRouter(root, history, { getState, dispatch }) {

  history.listen(location => transitionTo(location, { navigating: true }))

  const Router = {}
  const routes = createRoute()(root)
  const location = getState().location


  const state = { ...matchLocation(routes, location), transition: null }


  const render = () => {

    const { route, params, location } = state
    const { query } = location

    return createRouteElement(Router, route, params, query)
  }


  const transitionTo = (location, { navigating = false } = {}) => {

    return createTransition(state, location, getState())
      .then(({ toState, redirects, actions }) => {

        Object.assign(state, toState, { transition: null })

        const { location } = toState
        const { url } = location

        if (navigating && redirects.length) {

          history.replace(url)
        }

        if (!navigating) history.push(url)

        dispatch(batchActions([routeChange(location), ...actions]))
      })
  }


  return Object.assign(Router, { state, render, transitionTo })
}
