// Utils
import { setup } from './utils/jest'
import { createComponent, createInstanciateComponent } from './utils/component'

// Templates
import rootTpl from './templates/common/root.html'
import rootChildTpl from './templates/common/root-child.html'
import childTpl from './templates/common/child.html'

setup()

describe('init() hook', () => {
  it('checks that init() hook is called', () => {
    const RootComponent = createComponent(rootTpl)
    const mockCallback = jest.fn()
    RootComponent.prototype.init = mockCallback

    const rootComponent = new RootComponent({ el: '#root' }) // eslint-disable-line

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('checks that init() hook is called in child component', () => {
    const RootComponent = createComponent(childTpl)
    const mockCallback = jest.fn()
    RootComponent.prototype.init = mockCallback

    const rootComponent = createInstanciateComponent(rootChildTpl, '#root', { child: RootComponent })  // eslint-disable-line

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})

describe('mounted() hook', () => {
  it('checks that mounted() hook is called', () => {
    const RootComponent = createComponent(rootTpl)
    const mockCallback = jest.fn()
    RootComponent.prototype.mounted = mockCallback

    const rootComponent = new RootComponent({ el: '#root' }) // eslint-disable-line

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('checks that mounted() hook is called in child component', () => {
    const ChildComponent = createComponent(childTpl)
    const mockCallback = jest.fn()
    ChildComponent.prototype.mounted = mockCallback

    const rootComponent = createInstanciateComponent(rootChildTpl, '#root', { child: ChildComponent }) // eslint-disable-line

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('checks that mounted() hook is called after $mount()', () => {
    const RootComponent = createComponent(rootTpl)
    const mockCallback = jest.fn()
    RootComponent.prototype.mounted = mockCallback

    const rootComponent = new RootComponent() // eslint-disable-line
    rootComponent.$mount()

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})

describe('beforeDestroy() and destroyed() hooks', () => {
  it('checks that beforeDestroy() and destroyed() hooks are called after $destroy', () => {
    const RootComponent = createComponent(rootTpl)

    const mockCallbackBeforeDestroy = jest.fn()
    const mockCallbackDestroyed = jest.fn()
    RootComponent.prototype.beforeDestroy = mockCallbackBeforeDestroy
    RootComponent.prototype.destroyed = mockCallbackDestroyed

    const rootComponent = new RootComponent({ el: '#root' }) // eslint-disable-line
    rootComponent.$destroy()

    expect(mockCallbackBeforeDestroy).toHaveBeenCalledTimes(1)
    expect(mockCallbackDestroyed).toHaveBeenCalledTimes(1)
  })
})
