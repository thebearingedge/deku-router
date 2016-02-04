
export const ROUTE_CHANGE = '@@router/ROUTE_CHANGE'


export const routeChange = location =>

  ({ type: ROUTE_CHANGE, payload: location })


export const routeReducer = history =>

  (state = history.getLocation(), { type, payload }) =>

    type === ROUTE_CHANGE ? payload : state
