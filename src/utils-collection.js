
export const take = (count = 0, xs) => xs.slice(0, count)


export const takeRight = (count = 0, xs) => xs.slice(-count || xs.length)


export const head = xs => xs[0]


export const drop = (count = 0, xs) => xs.slice(count)


export const dropRight = (count = 0, xs) => take(xs.length - count, xs)


export const tail = xs => drop(1, xs)


export const end = xs => xs.length - 1


export const last = xs => xs[end(xs)]


export const init = xs => take(end(xs), xs)


export const compact = xs => xs.filter(Boolean)


export const flatMap = (xs, cb) => [].concat(...xs.map(cb))


export const takeWhile = (xs, cb = Boolean) =>

  xs.length && cb(head(xs)) ? [head(xs), ...takeWhile(tail(xs), cb)] : []


export const takeRightWhile = (xs, cb = Boolean) =>

  xs.length && cb(last(xs)) ? [...takeRightWhile(init(xs), cb), last(xs)] : []


export const zipWith = (xs, ys, cb) => xs.map((_, i) => cb(xs[i], ys[i]))


export const every = (xs, cb = Boolean) => xs.every(cb)
