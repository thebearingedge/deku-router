
import { extract } from './utils-url'

const matchLocation = (routes, location) => {

  if (typeof location !== 'object') {

    location = extract(location)
  }


  let route = routes

  if (location.pathname === '/' && route.path === '/') {

    return { route, params: {}, location }
  }

  const unmatched = location.pathname.split('/').slice(1)
  const matches = [{}]

  let children = [...route.children]

  while (unmatched.length && children.length) {

    let params

    children.sort((a, b) => a.specificity > b.specificity)

    for (let i = 0; i < children.length; i++) {

      const child = children[i]

      params = child.toParams && child.toParams(unmatched)

      if (!params) continue

      matches.push(params)

      route = child
      children = [...route.children]

      break
    }

    if (!params) break
  }


  if (unmatched.length) {

    while (route.parent) {

      const params = matches.pop()

      if (route.path) {

        const path = route.toPath(params)

        unmatched.unshift(path)
      }

      route = route.parent
      children = route.children

      const splat = children.find(route => route.isSplat)

      if (!splat) continue

      route = splat

      matches.push(route.toParams(unmatched))

      break
    }
  }

  if (unmatched.length) return { route: null, params: null, location }

  return { location, route, params: Object.assign(...matches) }
}

export default matchLocation
