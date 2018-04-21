import { Component } from '../src'

// Utils
import { setup } from './utils/jest'
import { createComponent, createInstanciateComponent } from './utils/component'

// Templates
import rootTpl from './templates/common/root.html'
import childTpl from './templates/common/child.html'

setup()

describe('template getter', () => {
  it('checks that template getter is null by default', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent.template).toBeNull()
  })

  it('checks that template getter is valid', () => {
    const rootComponent = createInstanciateComponent(rootTpl)
    expect(rootComponent.template).toBe(rootTpl)
  })
})

describe('components getter', () => {
  it('checks that components getter is an empty object by default', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent.components).toMatchObject({})
  })

  it('checks that components getter is valid', () => {
    const ChildComponent = createComponent(childTpl)
    const rootComponent = new Component({ el: '#root', components: { child: ChildComponent } })
    expect(rootComponent.components).toMatchObject({ child: ChildComponent })
  })
})
