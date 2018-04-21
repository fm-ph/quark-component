import { Component } from 'quark-component'

class SubExample extends Component {
  init () {

  }

  mounted () {
    this.$debug()
  }

  get template () {
    return require('./sub-example.twig')
  }
}

export default SubExample
