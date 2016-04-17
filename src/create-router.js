
import { batchActions } from 'redux-batched-actions'
import { routeChange } from './utils-redux'
import createRoute from './create-route'
import matchLocation from './match-location'
import createTransition from './create-transition'
import createRouteElement from './create-route-element'


export default function createRouter(root, history, store) {

  const routes = createRoute()(root)
  const { getState, dispatch } = store
  const { location } = getState()


  let state = { ...matchLocation(routes, location), transition: null }


  history.listen(location => transitionTo(location, { navigating: true }))


  const render = _ => {

    const { route, params, location } = state
    const { query } = location

    return createRouteElement(route, params, query)
  }


  const transitionTo = (location, { navigating = false } = {}) =>

    createTransition(state, location, store)
      .then(({ toState, redirects, actions }) => {

        state = { ...toState, transition: null }

        const { location } = state
        const { url } = location
        const notify = false

        if (navigating && redirects.length) {

          history.replace(url, { notify })
        }

        if (!navigating) history.push(url, { notify })

        dispatch(batchActions([routeChange(location), ...actions]))
      })


  return { render, transitionTo }
}
