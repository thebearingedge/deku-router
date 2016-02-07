
import { h } from 'deku'
import Route from '../../src/component-route'
import Index from '../../src/component-index'

const App = ({ context }) => <div>app { context.location.url }</div>
const Home = () => <div>home</div>
const Redirects = {
  loadState: ({ redirectTo }) => redirectTo('/')
}

const routes = (
  <Route path='/' component={ App }>
    <Index component={ Home }/>
    <Route path='redirects' component={ Redirects }/>
  </Route>
)

export default routes
