
import { extract } from './utils-url'
import * as utils from './utils-collection'

const { tail, take, takeRight, drop, dropRight, flatMap, zipWith } = utils


export default function matchLocation(root, location) {

  location instanceof Object || (location = extract(location))

  if (location.pathname === '/' && root.path === '/') {

    return { route: root, params: {}, location }
  }

  const notFound = { route: null, params: null, location }
  const segments = tail(location.pathname.split('/'))

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
  const { matched } = found

  if (!unmatched.length) {

    matched.push(...segments)

    return { route, matched }
  }

  matched.push(...take(route.length, segments))

  return matchRoute(route, unmatched, { route, matched })
}


const matchSplat = ({ parent, length }, matched, unmatched) => {

  if (!parent) return { splat: null }

  unmatched.unshift(...takeRight(length, matched))

  const rematched = dropRight(length, matched)
  const splat = parent.children.find(route => route.isSplat)

  if (splat) {

    rematched.push(unmatched.join('/'))

    return { splat, rematched }
  }

  return matchSplat(parent, rematched, unmatched)
}


const createParams = ({ branch }, matched) => {

  const withPath = branch.filter(({ path, isRoot }) => path && !isRoot)
  const matchers = flatMap(withPath, ({ matchers }) => matchers)

  return Object.assign(...zipWith(matchers, matched, ({ toParam }, segment) =>
    toParam(segment)
  ))
}
