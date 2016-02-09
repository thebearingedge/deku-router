
import createSegmentMatcher from './create-segment-matcher'


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

  const matched = []
  let i = 0

  while (i < matchers.length && matchers.length <= unmatched.length) {

    let param
    const matcher = matchers[i]

    if (matcher.type === 'root') return {}

    if (matcher.type === 'splat') {

      const path = unmatched.splice(0).join('/')

      param = matcher.toParam(path)
    }
    else {

      param = matcher.toParam(unmatched[i])
    }

    if (param) {

      matched.push(param)

      i++
    }
    else break
  }

  if (matched.length < matchers.length) return null

  unmatched.splice(0, matchers.length)

  return Object.assign(...matched)
}


const createPath = (matchers, params) =>

  matchers.map(m => m.toSegment(params)).join('/')
