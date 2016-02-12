
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
const Page = ({ props, children }) =>
  <div>page { children }{ props.Sidebar || null }{ props.Main || null }</div>
const About = {
  render({ context }) {
    return <div>{ context.about }</div>
  },
  loadState(transition, done) {
    const { url } = transition.toState.location
    const type = 'ABOUT_LOADED'
    const about = `you have loaded "About" at ${url}`
    done(null, { type, about })
  }
}
const Sidebar = {
  render({ context }) {
    return <ul>{ context.sidebarItems.map(item => <li>{ item } </li>) }</ul>
  },
  loadState() {
    const type = 'ITEMS_LOADED'
    const items = ['foo', 'bar', 'baz']
    return Promise.resolve({ type, items })
  }
}
const Main = {
  render({ context }) {
    return <p>{ context.mainContent }</p>
  },
  loadState() {
    const type = 'CONTENT_LOADED'
    const content = 'lorem ipsum'
    return Promise.resolve({ type, content })
  }
}
const Redirects = {
  render() { throw new Error('Redirects component should not render') },
  loadState(transition) { transition.redirectTo('/page') }
}
const RedirectsAgain = {
  render() { throw new Error('RedirectsAgain component should not render') },
  loadState({ redirectTo }) { redirectTo('/redirects') }
}
const LoopTo = {
  render() { throw new Error('LoopTo component should not render') },
  loadState({ redirectTo }) { redirectTo('/loop-from') }
}
const LoopFrom = {
  render() { throw new Error('LoopFrom component should not render') },
  loadState({ redirectTo }) { redirectTo('/loop-to') }
}

const routes = (
  <Route path='/' component={ App }>
    <Index component={ Home }/>
    <Route path='page' component={ Page }>
      <Route path='about' component={ About }/>
      <Route path='master-detail' components={{ Sidebar, Main }}/>
      <Route path='redirects-again' component={ RedirectsAgain }/>
    </Route>
    <Route path='redirects' component={ Redirects }/>
    <Route path='loop-to' component={ LoopTo }/>
    <Route path='loop-from' component={ LoopFrom }/>
  </Route>
)

describe('createRouter(routes, history, store)', () => {

  let window, node, render, history, store, Router

  beforeEach(() => {

    window = createWindow()
    window.location = mockLocation('example.com')

    history = createHistory(window)

    const location = routeReducer(history)
    const about = (state = '', { type, about }) =>
      type === 'ABOUT_LOADED' ? about : state
    const sidebarItems = (state = [], { type, items }) =>
      type === 'ITEMS_LOADED' ? items : state
    const mainContent = (state = '', { type, content }) =>
      type === 'CONTENT_LOADED' ? content : state
    const reducers = enableBatching(combineReducers({
      location,
      about,
      sidebarItems,
      mainContent
    }))

    store = createStore(reducers)

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

  it('throws when no route is found', done => {

    Router
      .transitionTo('/whargarble')
      .then(() => done(new Error('/whargarble should not be found')))
      .catch(err => {
        expect(err)
          .to.be.an.instanceOf(Error)
          .and.have.property('message', 'Route not found for /whargarble')
        done()
      })
  })

  it('redirects to another route', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.pushState).to.have.been.calledOnce
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, '/page')
      done()
    })

    Router.transitionTo('/redirects').catch(done)
  })

  it('redirects to another route and replaces the navigation entry', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.replaceState).to.have.been.calledTwice
      expect(window.history.replaceState)
        .to.have.been.calledWithExactly({}, null, '/page')
      done()
    })

    window.history.replaceState({}, null, '/redirects')
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

  it('handles multiple redirects', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page ')
      expect(window.history.pushState).to.have.been.calledOnce
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, '/page')
      done()
    })

    Router.transitionTo('/page/redirects-again').catch(done)
  })

  it('loads state for sibling components', done => {

    store.subscribe(() => {
      expect(node.textContent).to.equal('app page foo bar baz lorem ipsum')
      expect(window.history.pushState).to.have.been.calledOnce
      expect(window.history.pushState)
        .to.have.been.calledWithExactly({}, null, '/page/master-detail')
      done()
    })

    Router.transitionTo('/page/master-detail').catch(done)
  })

})
