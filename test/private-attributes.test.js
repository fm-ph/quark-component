import { Component } from '../src'

// Utils
import { setup } from './utils/jest'

setup()

describe('common attributes', () => {
  it('checks that _components is an empty object by default', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent._components).toMatchObject({})
  })

  it('checks that _instances is an empty array by default', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent._instances).toHaveLength(0)
  })

  it('checks that _isRoot is true by default', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent._isRoot).toBeTruthy()
  })
})
