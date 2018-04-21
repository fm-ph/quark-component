import { Component } from '../../src'

export function createComponent (tpl = '') {
  class RootComponent extends Component {
    get template () {
      return tpl
    }
  }

  return RootComponent
}

export function createInstanciateComponent (tpl = '', el = '#root', components = {}) {
  const ComponentClass = createComponent(tpl)

  return new ComponentClass({
    el,
    components
  })
}
