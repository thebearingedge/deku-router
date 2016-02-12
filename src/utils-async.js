
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

    if (result !== undefined || fn.length <= args.length) resolve(result)
  })
