
import { extract } from './utils-url'


export default function createHistory(window, { useHash = false } = {}) {

  const { history, location } = window

  const useHistory = !!history && !useHash
  const eventType = useHistory ? 'popstate' : 'hashchange'
  const subscribers = []


  const broadcast = _ =>

    subscribers.forEach(subscriber => subscriber(getLocation()))


  const watch = _ => window.addEventListener(eventType, broadcast)


  const ignore = _ => window.removeEventListener(eventType, broadcast)


  const listen = subscriber => {

    subscribers.length || watch()

    const index = subscribers.push(subscriber) - 1

    return _ => {

      const [ subscriber ] = subscribers.splice(index, 1)

      subscribers.length || ignore()

      return subscriber
    }
  }


  const push = (url, { notify = true } = {}) => {

    if (useHistory) history.pushState({}, null, url)
    else (ignore() || ((location.hash = url) && watch()))

    notify && broadcast()
  }


  const replace = (url, { notify = true } = {}) => {

    if (useHistory) history.replaceState({}, null, url)
    else {

      const { origin, pathname, search } = location
      const href = `${origin}${pathname}${search}#${url}`

      ignore() || location.replace(href) || watch()
    }

    notify && broadcast()
  }


  const getLocation = _ => {

    const { pathname, search, hash } = location
    const url = useHistory ? pathname + search + hash : hash.slice(1) || '/'

    return extract(decodeURIComponent(url))
  }


  return { push, listen, replace, getLocation }
}
