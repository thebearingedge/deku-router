
export const take = (count = 0, xs) => xs.slice(0, count)


export const takeRight = (count = 0, xs) => xs.slice(-count || xs.length)


export const head = ([ h ]) => h


export const drop = (count = 0, xs) => xs.slice(count)


export const dropRight = (count = 0, xs) => take(xs.length - count, xs)


export const tail = xs => drop(1, xs)


export const end = ({ length }) => length - 1


export const last = xs => xs[end(xs)]


export const init = xs => take(end(xs), xs)


export const compact = xs => xs.filter(Boolean)


export const flatMap = (xs, f) => [].concat(...xs.map(f))


export const takeWhile = (xs, f = Boolean) =>

  xs.length && f(head(xs)) ? [head(xs), ...takeWhile(tail(xs), f)] : []


export const takeRightWhile = (xs, f = Boolean) =>

  xs.length && f(last(xs)) ? [...takeRightWhile(init(xs), f), last(xs)] : []


export const zipWith = (xs, ys, f) => xs.map((_, i) => f(xs[i], ys[i]))


export const every = (xs, f = Boolean) => xs.every(f)
