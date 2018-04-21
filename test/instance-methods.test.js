import { Component } from '../src'

// Utils
import { setup } from './utils/jest'
// import { createComponent, createInstanciateComponent } from './utils/component'

// Templates
// import rootTpl from './templates/common/root.html'
// import childTpl from './templates/common/child.html'

setup()

describe('common methods', () => {
  it('checks that data() method returns an empty object by default', () => {
    const rootComponent = new Component()
    expect(rootComponent.data()).toMatchObject({})
  })
})
