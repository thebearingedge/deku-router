
import { h } from 'deku'

export let Parent = ({ props, children }) =>
  <div>parent { children }{ props.Sidebar || '' }{ props.Main || '' }</div>

export let Home = ({ children }) =>
  <div>home { children }</div>

export let Child = ({ props, children }) =>
  <div>child { children }{ props.query.qux || '' }</div>

export let Sibling = ({ props, children }) =>
  <div>sibling { children }{ props.params.corge || '' }</div>

export let Grandchild = ({ props, children }) =>
  <div>grandchild { children }{ props.routeParams.baz || '' }</div>

export let Main = ({ children }) =>
  <div>main { children }</div>

export let Sidebar = ({ children }) =>
  <div>sidebar { children }</div>
