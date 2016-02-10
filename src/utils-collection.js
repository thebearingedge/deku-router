
export const take = (count = 0, xs) => xs.slice(0, count)


export const head = xs => xs[0]


export const drop = (count = 0, xs) => xs.slice(count)


export const tail = xs => xs.slice(1)


export const end = xs => xs.length - 1


export const last = xs => xs[end(xs)]


export const init = xs => take(end(xs), xs)


export const compact = xs => xs.filter(Boolean)


export const flatMap = (xs, cb) => [].concat(...xs.map(cb))


export const takeWhile = (xs, test = Boolean) =>

  test(head(xs))
    ? [head(xs), ...takeWhile(tail(xs), test)]
    : []


export const takeRightWhile = (xs, test = Boolean) =>

  test(last(xs))
    ? [...takeRightWhile(init(xs), test), last(xs)]
    : []


export const zipWith = (xs, ys, cb) => xs.map((_, i) => cb(xs[i], ys[i]))


export const every = (xs, cb = Boolean) => xs.every(cb)
