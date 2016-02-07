
import { extract } from './utils-url'

export const ROUTE_CHANGE = '@@deku-router/ROUTE_CHANGE'


export const routeChange = location =>

  ({ type: ROUTE_CHANGE, payload: location })


export const routeReducer = history => {

  const location = history instanceof Object
    ? history.getLocation()
    : extract(history)

  return (state = location, { type, payload }) =>

    type === ROUTE_CHANGE ? payload : state
}


export default routeReducer
