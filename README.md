deku-router
---
```js
import { window, document } from 'global'
import { h, createApp } from 'deku'
import { createStore, combineReducers } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import { createRouter, createHistory, Route, Index, routeReducer } from 'deku-router'

const Main = {
  render: ({ children, context }) =>
    <div>
      <h1>Hello App!</h1>
      <h2>{ context.message }</h2>
      <div>{ children }</div>
    </div>,
  loadState: () =>
    fetch('api/message')
      .then(res => res.text())
      .then(text => ({ type: 'MESSAGE_LOADED', text }))
}

const Landing = ({ context }) => 
  <p>Welcome to { context.location.url }</p>

const history = createHistory(window)

const location = routeReducer(history)
const message = (state = '', { type, text }) =>
  type === 'MESSAGE_LOADED' ? text : state

const reducers = enableBatching(combineReducers({ message, location }))

const store = createStore(reducers, window.SERVER_STATE)

const routes = (
  <Route path='/' component={ Main }>
    <Index component={ Landing }/>
  </Route>
)

const node = document.querySelector('#app')
const render = createApp(node, store.dispatch)

const App = createRouter(routes, history, store)
const setState = () => render(<App/>, store.getState())

store.subscribe(setState)

setState()
    
```
