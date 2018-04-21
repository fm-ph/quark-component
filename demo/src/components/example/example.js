import { Component } from 'quark-component'

import SubExampleComponent from '../sub-example/sub-example'

class Example extends Component {
  init () {

  }

  mounted () {

  }

  data () {
    return {
      example: 'Example'
    }
  }

  get components () {
    return {
      'sub-example': SubExampleComponent
    }
  }

  get template () {
    return require('./example.twig')
  }
}

export default Example
