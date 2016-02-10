
export default function createSegmentMatcher(segment, ParamType = String) {

  let type, key, specificity

  if (segment.startsWith('*')) {
    type = 'splat'
    key = segment.slice(1)
    specificity = '2'
  }
  else if (segment.startsWith(':')) {
    type = 'dynamic'
    key = segment.slice(1)
    specificity = '3'
  }
  else if (segment === '') {
    type = 'root'
    key = ''
    specificity = '1'
  }
  else {
    type = 'exact'
    key = segment
    specificity = '4'
  }

  return {
    type,
    specificity,
    matches: segment => isMatch(segment, type, key),
    toParam: segment => createParam(segment, type, key, ParamType),
    toSegment: params => createSegment(params, type, key)
  }
}


const isMatch = (segment, type, key) => {

  switch (type) {
    case 'dynamic':
      return true
    case 'splat':
      return true
    default:
      return segment === key
  }
}


const createParam = (segment, type, key, ParamType) => {

  switch (type) {
    case 'dynamic':
      return { [key]: ParamType(segment) }
    case 'splat':
      return { [key]: segment }
    default:
      return key === segment ? {} : null
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
