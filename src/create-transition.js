
import matchLocation from './match-location'
import { compact, flatMap } from './utils-collection'
import { invokeAsync } from './utils-async'

const createTransition = (fromState, location, context, redirects = []) =>

  new Promise((resolve, reject) => {

    const routes = fromState.route.root
    const toState = matchLocation(routes, location)
    const { url } = toState.location

    if (redirects.includes(url)) {

      const loop = redirects.concat(url).join(' -> ')

      throw new Error(`redirect loop detected: ${loop}`)
    }


    const redirectTo = location => {

      redirects.push(url)

      resolve(createTransition(fromState, location, context, redirects))
    }

    const transitioning = fromState.transition = {
      toState,
      redirects,
      get isCancelled() { return fromState.transition !== this }
    }

    const toBranch = [...toState.route.branch]

    const stateHooks = compact(flatMap(toBranch, route => {

      const { component, components } = route

      if (!components) return component.loadState

      return Object.keys(components).map(key => components[key].loadState)
    }))

    const transition = { fromState, toState, context, redirectTo }

    Promise
      .all(stateHooks.map(hook => invokeAsync(hook, transition)))
      .then(actions => resolve({ ...transitioning, actions }))
      .catch(reject)
  })

export default createTransition
