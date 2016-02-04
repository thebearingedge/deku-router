
export let equalForKeys = (a = {}, b = {}) =>

  Object.keys(a).every(key => a[key] === b[key])


export let isFunction = val => typeof val === 'function'
