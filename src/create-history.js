
import { extract } from './utils-url'

export default function createHistory(window, { useHash = false } = {}) {

  const { history, location } = window

  const useHistory = !!history && !useHash
  const eventType = useHistory ? 'popstate' : 'hashchange'

  const subscribers = []

  const listener = () => {

    const location = getLocation()

    subscribers.forEach(hook => hook(location))
  }

  const watch = () => window.addEventListener(eventType, listener)

  const ignore = () => window.removeEventListener(eventType, listener)

  const listen = hook => {

    subscribers.length || watch()

    const index = subscribers.push(hook) - 1

    return () => {

      const hook = subscribers.splice(index, 1)[0]

      subscribers.length || ignore()

      return hook
    }
  }

  const push = (url, { notify = true } = {}) => {

    if (useHistory) {

      history.pushState({}, null, url)
    }
    else {

      ignore()
      location.hash = url
      watch()
    }

    notify && listener()
  }

  const replace = (url, { notify = true } = {}) => {

    if (useHistory) {

      history.replaceState({}, null, url)
    }
    else {

      const { origin, pathname, search } = location
      const href = `${origin}${pathname}${search}#${url}`

      ignore()
      location.replace(href)
      watch()
    }

    notify && listener()
  }

  const getLocation = () => {

    const { pathname, search, hash } = location
    const url = useHistory ? pathname + search + hash : hash.slice(1) || '/'

    return extract(decodeURIComponent(url))
  }

  return { push, listen, replace, getLocation }
}
