
import { extract } from './utils-url'

export default function createHistory(window, { useHash = false } = {}) {

  const { history, location } = window

  const useHistory = !!history && !useHash
  const eventType = useHistory ? 'popstate' : 'hashchange'

  let listener

  const watch = () => window.addEventListener(eventType, listener)

  const ignore = () => window.removeEventListener(eventType, listener)

  const listen = hook => {

    listener = () => hook(getLocation())
    watch()
  }

  const push = url => {
    if (useHistory) history.pushState({}, null, url)
    else {

      ignore()
      location.hash = url
      watch()
    }
  }

  const replace = url => {
    if (useHistory) history.replaceState({}, null, url)
    else {

      const { origin, pathname, search } = location
      const href = `${origin}${pathname}${search}#${url}`

      ignore()
      location.replace(href)
      watch()
    }
  }

  const getLocation = () => {

    const { pathname, search, hash } = location
    const url = useHistory ? pathname + search + hash : hash.slice(1) || '/'

    return extract(decodeURIComponent(url))
  }

  return { push, listen, replace, getLocation }
}
