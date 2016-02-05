
export const ROUTE_CHANGE = '@@deku-router/ROUTE_CHANGE'


export const routeChange = location =>

  ({ type: ROUTE_CHANGE, payload: location })


export const routeReducer = ({ getLocation }) =>

  (state = getLocation(), { type, payload }) =>

    type === ROUTE_CHANGE ? payload : state


export default routeReducer
