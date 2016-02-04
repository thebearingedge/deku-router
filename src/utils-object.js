
export const equalForKeys = (a = {}, b = {}) =>

  Object.keys(a).every(key => a[key] === b[key])


export const isFunction = val => typeof val === 'function'
