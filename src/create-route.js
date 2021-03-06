
import Index from './component-index'
import createPathMatcher from './create-path-matcher'


const createRoute = (parent = null) => ({ props, children, component }) => {

  const route = { parent, children: [], ...props }

  route.root = parent ? parent.root : route
  route.isRoot = route.root === route
  route.branch = parent ? [...parent.branch, route] : [route]

  if (component === Index) {

    if (!parent) throw new Error('<Index/> routes must have a parent')

    parent.index = route

    if (children.length) throw new Error('<Index/> routes cannot have children')
  }
  else {

    const { path, paramTypes } = props

    if (path) {

      Object.assign(route, createPathMatcher(path, paramTypes))

      if (route.isAbsolute && !route.isRoot) {

        route.root.children.push(route)
      }
    }

    const childRoutes = children
      .map(createRoute(route))
      .filter(child => child !== route.index)

    route.children.push(...childRoutes)
  }

  return route
}


export default createRoute
