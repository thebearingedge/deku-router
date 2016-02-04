
import { h } from 'deku'
import { isFunction } from './utils-object'

const createRouteElement = (router, route, params = {}, query = {}) => {

  const { branch, index } = route

  const routes = [...branch]

  if (index) routes.push(index)

  const { component } = routes.shift()
  const routerProps = { router, params, query, routeParams: {} }
  const element = h(component, routerProps)

  routes.reduce((targets, { getOwnParams, component, components }) => {

    const routeParams = isFunction(getOwnParams) ? getOwnParams(params) : {}

    const props = { ...routerProps, routeParams }

    return components
      ? mapComponentsToProps(targets, props, components)
      : nestComponent(targets, props, component)
  }, [element])

  return element
}


const mapComponentsToProps = (targets, props, components) =>

  Object.keys(components).map(key => {

    const element = h(components[key], props)

    targets.forEach(el => el.props[key] = element)

    return element
  })


const nestComponent = (targets, props, component) => {

  const element = h(component, props)

  targets.forEach(target => target.children.push(element))

  return [element]
}


export default createRouteElement
