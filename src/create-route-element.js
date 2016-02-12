
import { h } from 'deku'
import { isFunction } from './utils-object'


const createRouteElement = (route, params = {}, query = {}) => {

  const { branch, index } = route
  const routes = [...branch]

  if (index) routes.push(index)

  const { component } = routes.shift()
  const routerProps = { params, query, routeParams: {} }
  const element = h(component, routerProps)

  routes.reduce((targets, { getOwnParams, component, components }) => {

    const routeParams = isFunction(getOwnParams) ? getOwnParams(params) : {}
    const props = { ...routerProps, routeParams }

    return components
      ? mapElementsToProps(targets, props, components)
      : nestElement(targets, props, component)
  }, [element])

  return element
}


const mapElementsToProps = (targets, props, components) =>

  Object.keys(components).map(key => {

    const element = h(components[key], props)

    targets.forEach(el => el.props[key] = element)

    return element
  })


const nestElement = (targets, props, component) => {

  const element = h(component, props)

  targets.forEach(target => target.children.push(element))

  return [element]
}


export default createRouteElement
