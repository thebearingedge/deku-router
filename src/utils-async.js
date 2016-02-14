
export const mapAsync = (xs, callback) =>

  Promise.all(xs.map(x => invokeAsync(callback, x)))


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

      return reject(err)
    }

    if (result !== undefined || fn.length <= args.length) resolve(result)
  })
