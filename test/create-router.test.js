
import { document } from 'global'
import { h, createApp } from 'deku'
import { createStore, combineReducers } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import mockLocation from 'mock-location'
import createWindow from './fixtures/create-window'
import Route from '../src/component-route'
import Index from '../src/component-index'
import createHistory from '../src/create-history'
import createRouter from '../src/create-router'
import { routeChange, routeReducer } from '../src/utils-redux'


chai.use(sinonChai)

const App = ({ children }) => <div>app { children }</div>
const Home = ({ context }) => <div>home { context.location.url }</div>
const Page = ({ children }) => <div>page { children }</div>
const About = {
  render({ context }) {
    return <div>{ context.about }</div>
  },
  loadState({ toState }) {
    const type = 'LOAD_ABOUT'
    const about = `you have loaded "About" at ${ toState.location.url }`
    return { type, about }
  }
}
const Redirecting = {
  render() { throw new Error('Redirecting component should not render') },
  loadState({ redirectTo }) { return redirectTo('/page') }
}
const LoopTo = {
  render() { throw new Error('LoopTo component should not render') },
  loadState({ redirectTo }) { return redirectTo('/loop-from') }
}
const LoopFrom = {
  render() { throw new Error('LoopFrom component should not render') },
  loadState({ redirectTo }) { return redirectTo('/loop-to') }
}

describe('createRouter(routes, history, store)', () => {

  let window, node, render, history, store, Router

  beforeEach(() => {

    window = createWindow()
    window.location = mockLocation('example.com')

    history = createHistory(window)

    const location = routeReducer(history)
    const about = (state = '', { type, about }) =>
      type === 'LOAD_ABOUT' ? about : state
    const reducers = enableBatching(combineReducers({ location, about }))

    store = createStore(reducers)

    const routes = (
      <Route path='/' component={ App }>
        <Index component={ Home }/>
        <Route path='page' component={ Page }>
          <Route path='about' component={ About }/>
        </Route>
        <Route path='redirecting' component={ Redirecting }/>
        <Route path='loop-to' component={ LoopTo }/>
        <Route path='loop-from' component={ LoopFrom }/>
      </Route>
    )

    Router = createRouter(routes, history, store)

    node = document.createElement('div')
    render = createApp(node)

    store.subscribe(() => {
      render(<Router/>, store.getState())
    })
  })


  it('renders the matched route', () => {

    store.dispatch(routeChange(history.getLocation()))

    expect(node.textContent).to.equal('app home /')
  })

  it('automatically transitions to another route', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      done()
    })

    window.history.replaceState({}, null, '/page')
    window.dispatchEvent({ type: 'popstate' })
  })

  it('manually transitions to another route', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.pushState).to.have.been.calledOnce
      done()
    })

    Router.transitionTo('/page').catch(done)
  })

  it('redirects to another route', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.pushState).to.have.been.calledOnce
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, '/page')
      done()
    })

    Router.transitionTo('/redirecting').catch(done)
  })

  it('redirects to another route and replaces the navigation entry', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.replaceState).to.have.been.calledTwice
      expect(window.history.replaceState)
        .to.have.been.calledWithExactly({}, null, '/page')
      done()
    })

    window.history.replaceState({}, null, '/redirecting')
    window.dispatchEvent({ type: 'popstate' })
  })

  it('loads state from route components', done => {

    store.subscribe(() => {
      expect(node.textContent)
        .to.equal('app page you have loaded "About" at /page/about')
      expect(window.history.pushState).to.have.been.calledOnce
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, '/page/about')
      done()
    })

    Router.transitionTo('/page/about').catch(done)
  })

  it('throws when a redirect loop is detected', () => {

    return expect(Router.transitionTo('/loop-to'))
      .to.eventually.be.rejectedWith(
        Error, 'redirect loop detected: /loop-to -> /loop-from -> /loop-to'
      )
  })

})
