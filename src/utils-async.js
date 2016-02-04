
export const findAsyncResult = (fns, ...args) => {

  const next = i => new Promise((resolve, reject) => {

    if (!fns[i]) return resolve()

    invokeAsync(fns[i], ...args)
      .then(result => resolve(result || next(i + 1)))
      .catch(reject)
  })

  return next(0)
}


export const mapAsync = (collection, callback) =>

  Promise.all(collection.map(item => invokeAsync(callback, item)))


export const invokeAsync = (fn, ...args) =>

  new Promise((resolve, reject) => {

    let result

    try {

      result = fn(...args, (err, result) => {

        if (err) reject(err)
        else resolve(result)
      })
    }
    catch (err) {

      reject(err)
    }

    if (typeof result !== 'undefined') resolve(result)
  })
