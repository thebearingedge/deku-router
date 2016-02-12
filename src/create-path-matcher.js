
import createSegmentMatcher from './create-segment-matcher'
import { tail, compact, zipWith, every } from './utils-collection'


export default function createPathMatcher(path, paramTypes = {}) {

  const splitPath = path.split('/')
  const isAbsolute = path.startsWith('/')
  const segments = isAbsolute ? tail(splitPath) : splitPath

  const matchers = segments.map(segment => {

    const ParamType = segment.startsWith(':')
      ? paramTypes[tail(segment)]
      : undefined

    return createSegmentMatcher(segment, ParamType)
  })

  const paramKeys = matchers.reduce((keys, { type, key }) =>
    type === 'dynamic' ? keys.concat(key) : keys
  , [])

  return {
    matches: segments => isMatch(matchers, segments),
    matchers,
    length: compact(segments).length,
    isAbsolute,
    isSplat: path.startsWith('*'),
    specificity: matchers.map(m => m.specificity).join(''),
    getOwnParams: params => filterParams(params, paramKeys)
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
