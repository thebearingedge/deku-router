
import { h } from 'deku'


export default function createRouteElement(route, params = {}, query = {}) {

  const { branch, index } = route
  const routes = [...branch]

  if (index) routes.push(index)

  const { component } = routes.shift()
  const routerProps = { params, query, routeParams: {} }
  const element = h(component, routerProps)

  routes.reduce((elements, { path, getRouteParams, component, components }) => {

    const routeParams = path ? getRouteParams(params) : {}
    const props = { ...routerProps, routeParams }

    return components
      ? mapElementsToProps(elements, props, components)
      : nestElement(elements, props, component)
  }, [element])

  return element
}


const mapElementsToProps = (parents, props, components) =>

  Object.keys(components).map(key => {

    const element = h(components[key], props)

    parents.forEach(parent => { parent.props[key] = element })

    return element
  })


const nestElement = (parents, props, component) => {

  const element = h(component, props)

  parents.forEach(parent => parent.children.push(element))

  return [element]
}
