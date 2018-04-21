import { Component } from 'quark-component'

import ExampleComponent from './components/example/example'

class Root extends Component {
  init () {

  }

  mounted () {

  }

  get template () {
    return require('./root.twig')
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const root = new Root({ // eslint-disable-line
    name: 'root',
    el: '#root',
    components: {
      'example': ExampleComponent
    }
  })
})
