
import createSegmentMatcher from './create-segment-matcher'
import { tail, compact, zipWith, every } from './utils-collection'


export default function createPathMatcher(path, paramTypes = {}) {

  const isSplat = path.startsWith('*')
  const isAbsolute = path.startsWith('/')
  const segments = (isAbsolute ? tail(path) : path).split('/')
  const { length } = compact(segments)

  const matchers = segments.map(segment => {

    const ParamType = segment.startsWith(':')
      ? paramTypes[tail(segment)]
      : undefined

    return createSegmentMatcher(segment, ParamType)
  })

  const specificity = matchers.map(m => m.specificity).join('')

  const paramKeys = matchers.reduce((keys, { type, key }) =>
    type === 'dynamic' ? keys.concat(key) : keys
  , [])

  const matches = segments => isMatch(matchers, segments)

  const getRouteParams = params => filterParams(params, paramKeys)

  return {
    length, isSplat, matchers, isAbsolute, specificity, matches, getRouteParams
  }
}


const isMatch = (matchers, segments) =>

  matchers.length <= segments.length &&

  every(zipWith(matchers, segments, (matcher, segment) =>
    matcher.matches(segment)
  ))


const filterParams = (params, paramKeys) =>

  paramKeys.reduce((own, param) =>

    ({ [param]: params[param], ...own }), {})
