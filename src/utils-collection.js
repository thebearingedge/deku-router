
export const compact = array => array.filter(item => !!item)


export const flatMap = (array, cb) => [].concat(...array.map(cb))


export const takeWhile = (array, test) => {

  const taken = []
  const { length } = array

  if (!length) return taken

  let i = 0

  while (test(array[i])) {

    taken.push(array[i])

    i++
  }

  return taken
}


export const takeRightWhile = (array, test) => {

  const taken = []
  const { length } = array

  if (!length) return taken

  let i = length - 1

  while (i > -1 && test(array[i])) {

    taken.unshift(array[i])

    i--
  }

  return taken
}

