
import { tail } from './utils-collection'

export default function createSegmentMatcher(segment, ParamType = String) {

  let type, key, specificity

  if (segment.startsWith('*')) {
    key = tail(segment)
    type = 'splat'
    specificity = '2'
  }
  else if (segment.startsWith(':')) {
    key = tail(segment)
    type = 'dynamic'
    specificity = '3'
  }
  else if (segment === '') {
    key = ''
    type = 'root'
    specificity = '1'
  }
  else {
    key = segment
    type = 'exact'
    specificity = '4'
  }

  return {
    key,
    type,
    specificity,
    matches: segment => isMatch(segment, type, key),
    toParam: segment => createParam(segment, type, key, ParamType),
    toSegment: params => createSegment(params, type, key)
  }
}


const isMatch = (segment, type, key) =>

  type === 'dynamic' ||
  type === 'splat' ||
  segment === key


const createParam = (segment, type, key, ParamType) => {

  switch (type) {
    case 'dynamic':
      return { [key]: ParamType(segment) }
    case 'splat':
      return { [key]: segment }
    default:
      return {}
  }
}


const createSegment = (params, type, key) => {

  switch (type) {
    case 'dynamic':
      return encodeURIComponent(params[key])
    case 'splat':
      return ''
    default:
      return key
  }
}
