
import { extract } from './utils-url'
import * as utils from './utils-collection'

const { take, takeRight, drop, dropRight, flatMap, zipWith } = utils


const matchLocation = (root, location) => {

  location instanceof Object || (location = extract(location))

  if (location.pathname === '/' && root.path === '/') {

    return { route: root, params: {}, location }
  }

  const notFound = { route: null, params: null, location }
  const segments = drop(1, location.pathname.split('/'))

  let { route, matched } = matchRoute(root, segments)

  if (!route) return notFound

  if (matched.length < segments.length) {

    const unmatched = drop(matched.length, segments)

    const { splat, rematched } = matchSplat(route, matched, unmatched)

    if (!splat) return notFound

    route = splat
    matched = rematched
  }

  const params = createParams(route, matched)

  return { route, params, location }
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


const matchSplat = ({ parent, matchers }, matched, unmatched) => {

  if (!parent) return { splat: null }

  unmatched.unshift(...takeRight(matchers.length, matched))

  const rematched = dropRight(matchers.length, matched)
  const splat = parent.children.find(route => route.isSplat)

  if (splat) {

    rematched.push(unmatched.join('/'))

    return { splat, rematched }
  }

  return matchSplat(parent, rematched, unmatched)
}


const createParams = (route, matched) => {

  const withPath = route.branch.filter(({ path, isRoot }) => path && !isRoot)
  const matchers = flatMap(withPath, ({ matchers }) => matchers)
  const allParams = zipWith(matchers, matched, ({ toParam }, segment) =>
    toParam(segment)
  )

  return Object.assign({}, ...allParams)
}


export default matchLocation
