
import { extract } from './utils-url'
import { drop, take } from './utils-collection'


const matchLocation = (root, location) => {

  location instanceof Object || (location = extract(location))

  if (location.pathname === '/' && root.path === '/') {

    return { route: root, params: {}, location }
  }

  const notFound = { route: null, params: null, location }

  const matching = location.pathname.split('/').slice(1)

  let { route, matched } = matchRoute(root, matching)

  if (!route) return notFound

  if (matched.length < matching.length) {

    route = findSplat(route)

    if (!route) return notFound
  }


  return { route, location }
}


const matchRoute = ({ children }, segments, found = { matched: [] }) => {

  const route = [...children]
    .sort((a, b) => a.specificity < b.specificity)
    .find(({ path, matches }) => !path || matches(segments))

  if (!route) return found

  const unmatched = drop(route.length, segments)

  if (!unmatched.length) {

    return {
      route,
      matched: found.matched.concat(segments)
    }
  }

  return matchRoute(route, unmatched, {
    route,
    matched: found.matched.concat(take(route.length, segments))
  })
}


const findSplat = ({ parent }) =>

  parent
    ? parent.children.find(({ isSplat }) => isSplat) || findSplat(parent)
    : null


export default matchLocation
