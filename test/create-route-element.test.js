
import { document } from 'global'
import { expect } from 'chai'
import { h, createApp } from 'deku'
import Index from '../src/component-index'
import Route from '../src/component-route'
import createRoute from '../src/create-route'
import createRouteElement from '../src/create-route-element'
import * as components from './fixtures/components'

const { Parent, Home, Child, Sibling, Grandchild, Main, Sidebar } = components

describe('createRouteElement(route)', () => {

  const router = {}

  let sandbox, render, parent, child, sibling, grandchild, foo, bar, baz

  before(() => {
    sandbox = document.createElement('div')
    render = createApp(sandbox)
    parent = createRoute()(
      <Route path='/' component={ Parent }>
        <Index component={ Home }/>
        <Route path='child' component={ Child }>
          <Route component={ Home }>
            <Route path='grandchild' component={ Grandchild }/>
            <Route path=':baz' component={ Grandchild }/>
          </Route>
        </Route>
        <Route path='sibling' component={ Sibling }/>
        <Route path='foo' components={{ Sidebar, Main }}>
          <Route path='bar' component={ Grandchild }/>
        </Route>
      </Route>
    )
    child = parent.children[0]
    sibling = parent.children[1]
    grandchild = child.children[0].children[0]
    baz = child.children[0].children[1]
    foo = parent.children[2]
    bar = foo.children[0]
  })

  it('renders itself', () => {
    render(createRouteElement(parent))
    expect(sandbox.textContent).to.equal('parent home ')
  })

  it('renders its parent containing itself', () => {
    render(createRouteElement(child))
    expect(sandbox.textContent).to.equal('parent child ')
    render(createRouteElement(sibling))
    expect(sandbox.textContent).to.equal('parent sibling ')
  })

  it('renders its grandparent, parent, wrapper, and itself', () => {
    render(createRouteElement(grandchild))
    expect(sandbox.textContent).to.equal('parent child home grandchild ')
  })

  it('renders multiple components', () => {
    render(createRouteElement(foo))
    expect(sandbox.textContent).to.equal('parent sidebar main ')
  })

  it('nests named components', () => {
    render(createRouteElement(bar))
    expect(sandbox.textContent)
      .to.equal('parent sidebar grandchild main grandchild ')
  })

  it('renders param props', () => {
    render(createRouteElement(sibling, { corge: 'grault' }))
    expect(sandbox.textContent).to.equal('parent sibling grault')
  })

  it('renders its ownParam props', () => {
    render(createRouteElement(baz, { baz: 42 }))
    expect(sandbox.textContent)
      .to.equal('parent child home grandchild 42')
  })

  it('renders query props', () => {
    render(createRouteElement(child, {}, { qux: 'quux' }))
    expect(sandbox.textContent)
      .to.equal('parent child quux')
  })

})
