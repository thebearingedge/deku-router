
import EventEmitter from 'events'
import { spy } from 'sinon'

export default function createWindow() {

  const window = new EventEmitter()

  Object.assign(window, {
    history: {
      pushState: spy((state, title, url) => {
        window.location.replace(url)
      }),
      replaceState: spy((state, title, url) => {
        window.location.replace(url)
      })
    },
    addEventListener() {
      window.addListener(...arguments)
    },
    removeEventListener() {
      window.removeListener(...arguments)
    },
    dispatchEvent({ type }) {
      window.emit(type)
    }
  })

  spy(window, 'addEventListener')
  spy(window, 'removeEventListener')

  return window
}
