
import createSegmentMatcher from './create-segment-matcher'
import { compact, zipWith } from './utils-collection'


export default function createPathMatcher(path = '', paramTypes = {}) {

  const splitPath = path.split('/')
  const isAbsolute = path.startsWith('/')
  const segments = isAbsolute ? splitPath.slice(1) : splitPath

  const ownParams = []

  const matchers = segments.map(segment => {

    let ParamType

    if (segment.startsWith(':')) {

      const param = segment.slice(1)

      ownParams.push(param)
      ParamType = paramTypes[param]
    }

    return createSegmentMatcher(segment, ParamType)
  })

  const isSplat = path.startsWith('*')
  const specificity = matchers.map(m => m.specificity).join('')
  const toParams = unmatched => createParams(matchers, unmatched)
  const toPath = params => createPath(matchers, params)
  const getOwnParams = params => filterParams(params, ownParams)

  return { isAbsolute, isSplat, specificity, toParams, toPath, getOwnParams }
}


const filterParams = (params, ownParams) =>

  ownParams.reduce((own, param) =>

    ({ [param]: params[param], ...own }), {})


const createParams = (matchers, unmatched) => {

  const matched = compact(zipWith(matchers, unmatched, (matcher, segment) =>

    matcher.type === 'splat'
      ? matcher.toParam(unmatched.splice(0).join('/'))
      : matcher.toParam(segment)
  ))

  if (matched.length < matchers.length) return null

  unmatched.splice(0, matchers.length)

  return Object.assign(...matched)
}


const createPath = (matchers, params) =>

  matchers.map(m => m.toSegment(params)).join('/')
