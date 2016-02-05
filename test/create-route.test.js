
import { expect } from 'chai'
import { h } from 'deku'
import * as components from './fixtures/components'
import Route from '../src/component-route'
import Index from '../src/component-index'
import createRoute from '../src/create-route'

const { Parent, Child, Sibling, Grandchild } = components

describe('createRoute(parent = null)(<Route/>)', () => {

  it('creates a route', () => {

    const parent = createRoute()(<Route path='/' component={ Parent }/>)

    expect(parent).to.have.property('path', '/')
    expect(parent).to.have.property('parent', null)
    expect(parent).to.have.property('component', Parent)
    expect(parent).to.have.property('children').that.deep.equals([])
  })

  it('throws if the root route is an Index route', () => {

    const createIndex = () => createRoute()(<Index component={ Parent }/>)

    expect(createIndex).to.throw(Error, '<Index/> routes must have a parent')
  })

  it('throws if an Index route has children', () => {

    const createIndexChildren = () => createRoute()(
      <Route path='/' component={ Parent }>
        <Index component={ Child }>
          <Route path='grandchild' component={ Grandchild }/>
        </Index>
      </Route>
    )

    expect(createIndexChildren)
      .to.throw(Error, '<Index/> routes cannot have children')
  })

  it('creates a route with children', () => {

    const parent = createRoute()(
      <Route path='/' component={ Parent }>
        <Route path='child' component={ Child }/>
        <Route path='sibling' component={ Sibling }/>
      </Route>
    )
    const [ child, sibling ] = parent.children

    expect(child).to.have.property('path', 'child')
    expect(child).to.have.property('parent', parent)
    expect(child).to.have.property('component', Child)
    expect(child).to.have.property('children').that.deep.equals([])

    expect(sibling).to.have.property('path', 'sibling')
    expect(sibling).to.have.property('parent', parent)
    expect(sibling).to.have.property('component', Sibling)
    expect(sibling).to.have.property('children').that.deep.equals([])
  })

  it('creates a route with nested children', () => {

    const parent = createRoute()(
      <Route path='/' component={ Parent }>
        <Route path='child' component={ Child }>
          <Route path='grandchild' component={ Grandchild }/>
        </Route>
        <Route path='sibling' component={ Sibling }/>
      </Route>
    )
    const [ child ] = parent.children
    const [ grandchild ] = child.children

    expect(grandchild).to.have.property('path', 'grandchild')
    expect(grandchild).to.have.property('parent', child)
    expect(grandchild).to.have.property('component', Grandchild)
    expect(grandchild).to.have.property('children').that.deep.equals([])
  })

  it('creates a route with an Index', () => {

    const parent = createRoute()(
      <Route path='/' component={ Parent }>
        <Index component={ Child }/>
      </Route>
    )
    const { index } = parent
    expect(index).to.have.property('parent', parent)
    expect(index).to.have.property('component', Child)
  })

})

