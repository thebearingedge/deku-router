
import { parse, stringify } from 'query-string'


export const extract = url => {

  if (typeof url !== 'string') return {}

  url = normalizeUrl(url)

  let pathname
  let query = {}
  let hash = ''
  let search = ''

  const [ pathnameWithHash, searchAndHash ] = url.split('?')

  if (searchAndHash) {

    const [ querystring, fragment ] = searchAndHash.split('#')

    Object.assign(query, parse(querystring))

    pathname = pathnameWithHash
    search = '?' + querystring
    hash = normalizeHash(fragment)
  }
  else {

    const [ pathnameOnly, fragment ] = pathnameWithHash.split('#')

    pathname = pathnameOnly
    hash = normalizeHash(fragment)
  }

  return { url, pathname, query, search, hash }
}


export const combine = ({ pathname, query, hash }) => {

  let url = normalizeUrl(pathname)

  const search = stringify(query)

  if (search) url += '?' + search

  return url + (normalizeHash(hash) || '')
}

export const normalizeUrl = url => {

  if (url === '/') return url

  url = url.startsWith('/')
    ? url
    : '/' + url

  return url.endsWith('/')
    ? url.slice(0, url.length - 1)
    : url
}

const normalizeHash = fragment =>

  fragment
    ? fragment.startsWith('#')
      ? fragment
      : '#' + fragment
        : ''
