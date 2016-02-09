
import matchLocation from './match-location'
import { compact, flatMap } from './utils-collection'
import { invokeAsync } from './utils-async'


const createTransition = (fromState, location, store, { redirects = [], serving = false } = {}) =>

  new Promise((resolve, reject) => {

    const routes = fromState.route.root
    const toState = matchLocation(routes, location)
    const { url } = toState.location

    const transition = fromState.transition = {
      toState,
      redirects,
      get isCancelled() { return fromState.transition !== this }
    }

    if (redirects.includes(url)) {

      const loop = redirects.concat(url).join(' -> ')

      return reject(new Error(`redirect loop detected: ${loop}`))
    }


    const redirectTo = location => {

      redirects.push(url)

      if (serving) {

        const toState = matchLocation(routes, location)

        fromState.transition = null

        return resolve({ ...transition, toState })
      }

      resolve(createTransition(fromState, location, store, { redirects }))
    }


    const toBranch = [...toState.route.branch]


    const stateHooks = compact(flatMap(toBranch, ({ component, components }) =>

      components
        ? Object.keys(components).map(key => components[key].loadState)
        : component.loadState
    ))

    const context = store.getState()
    const { dispatch } = store

    const trx = { fromState, toState, context, dispatch, redirectTo }

    Promise
      .all(stateHooks.map(hook => invokeAsync(hook, trx)))
      .then(actions => resolve({ ...transition, actions }))
      .catch(reject)
  })

export default createTransition
