import { Component } from '../src'

// Utils
import { setup } from './utils/jest'
import { createComponent, createInstanciateComponent } from './utils/component'

// Templates
import rootTpl from './templates/common/root.html'
import rootElTpl from './templates/instance-attributes/el.html'
import rootElsTpl from './templates/instance-attributes/els.html'
import rootRefTpl from './templates/instance-attributes/ref.html'
import rootRefsTpl from './templates/instance-attributes/refs.html'
import rootPropTpl from './templates/instance-attributes/prop.html'
import rootPropsTpl from './templates/instance-attributes/props.html'
import childTpl from './templates/common/child.html'

setup()

describe('common attributes', () => {
  it('mounts component with empty string $name by default', () => {
    const rootComponent = new Component()
    expect(rootComponent.$name).toBe('anonymous')
  })

  it('mounts component with null $parent by default', () => {
    const rootComponent = new Component()
    expect(rootComponent.$parent).toBeNull()
  })

  it('checks component $root to be equal to itself', () => {
    const rootComponent = new Component()
    expect(rootComponent.$root).toBe(rootComponent)
  })

  it('checks component $root to be equal to itself', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent.$root).toBe(rootComponent)
  })
})

describe('$el attribute', () => {
  it('mounts component with $el string selector', () => {
    const rootComponent = new Component({ el: '#root' })
    expect(rootComponent.$el.outerHTML).toMatchSnapshot()
  })

  it('mounts component with $el HTMLElement', () => {
    const componentEl = document.querySelector('#root')
    const rootComponent = new Component({ el: componentEl })
    expect(rootComponent.$el.outerHTML).toMatchSnapshot()
  })

  it('mounts component with $el string selector and getter template', () => {
    const rootComponent = createInstanciateComponent(rootTpl)
    expect(rootComponent.$el.outerHTML).toMatchSnapshot()
  })

  it('throws an error when component is mounted with a bad $el string selector', () => {
    const mockCallback = jest.fn()
    console.error = mockCallback

    const rootComponent = new Component({ el: '#badID' }) // eslint-disable-line
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback.mock.calls[0][0]).toContain('Cannot select a valid $el HTMLElement')
  })
})

describe('$els attribute', () => {
  it('checks component $els to have one element', () => {
    const rootComponent = createInstanciateComponent(rootElTpl)
    expect(Object.keys(rootComponent.$els)).toHaveLength(1)
    expect(rootComponent.$els.example).toBe(rootComponent.$el.querySelector('.example'))
  })

  it('checks component $els to have multiple elements', () => {
    const rootComponent = createInstanciateComponent(rootElsTpl)
    expect(Object.keys(rootComponent.$els)).toHaveLength(2)
    expect(rootComponent.$els.example1).toBe(rootComponent.$el.querySelector('.example1'))
    expect(rootComponent.$els.example2).toBe(rootComponent.$el.querySelector('.example2'))
  })
})

describe('$refs attribute', () => {
  it('checks component $refs to have one reference', () => {
    const childComponent = createComponent(childTpl)
    const rootComponent = createInstanciateComponent(rootRefTpl, '#root', { child: childComponent })
    expect(Object.keys(rootComponent.$refs)).toHaveLength(1)
    expect(rootComponent.$refs.child).toBe(rootComponent._findInstance('child'))
  })

  it('checks component $refs to have multiple references', () => {
    const childComponent1 = createComponent(childTpl)
    const childComponent2 = createComponent(childTpl)
    const rootComponent = createInstanciateComponent(rootRefsTpl, '#root', { child1: childComponent1, child2: childComponent2 })
    expect(Object.keys(rootComponent.$refs)).toHaveLength(2)
    expect(rootComponent.$refs.child1).toBe(rootComponent._findInstance('child1'))
    expect(rootComponent.$refs.child2).toBe(rootComponent._findInstance('child2'))
  })
})

describe('$props attribute', () => {
  it('checks component $props to have one property', () => {
    const childComponent = createComponent(childTpl)
    const rootComponent = createInstanciateComponent(rootPropTpl, '#root', { child: childComponent })
    expect(Object.keys(rootComponent._findInstance('child').$props)).toHaveLength(1)
    expect(rootComponent._findInstance('child').$props).toHaveProperty('color', 'blue')
  })

  it('checks component $props to have multiple properties', () => {
    const childComponent = createComponent(childTpl)
    const rootComponent = createInstanciateComponent(rootPropsTpl, '#root', { child: childComponent })
    expect(Object.keys(rootComponent._findInstance('child').$props)).toHaveLength(2)
    expect(rootComponent._findInstance('child').$props).toHaveProperty('color', 'blue')
    expect(rootComponent._findInstance('child').$props).toHaveProperty('size', 'big')
  })
})
