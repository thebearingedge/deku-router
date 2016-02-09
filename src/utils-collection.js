
export const take = (count, array) => array.slice(0, count)


export const head = array => array[0]


export const tail = array => array.slice(1)


export const end = array => array.length - 1


export const last = array => array[end(array)]


export const init = array => take(end(array), array)


export const compact = array => array.filter(Boolean)


export const flatMap = (array, cb) => [].concat(...array.map(cb))


export const takeWhile = (array, test) =>

  test(head(array))
    ? [head(array), ...takeWhile(tail(array), test)]
    : []


export const takeRightWhile = (array, test) =>

  test(last(array))
    ? [...takeRightWhile(init(array), test), last(array)]
    : []
