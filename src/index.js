import Twig from 'twig'
import { isElement } from 'quark-utils/dom'
import { isObject, isArray } from 'quark-utils/common'

import { walk, startsWith } from './utils'

const logStyles = 'background: #000000; color: #FFFFFF; padding: 3px 5px;'

/**
 * Component class.
 *
 * @class
 *
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 *
 * @author Patrick Heng & Fabien Motte
 *         <hengpatrick.pro@gmail.com / contact@fabienmotte.com>
 *
 * @example
 * const rootComponent = new Component({ el: '#root' })
 */
class Component {
  /**
   * Creates an instance of Component.
   * @constructor
   *
   * @param {Object} [options={}] Options.
   * @param {String|HTMLElement} [options.el=null] DOM element to mount
   *                                               on the instance.
   * It can be a CSS selector string or an existing HTMLElement.
   * @param {String} [options.name='anonymous'] Component name.
   * @param {Object} [options.components={}] Components tree.
   */
  constructor ({ el = null, name = 'anonymous', components = {} } = {}) {
    /**
     * DOM element the instance is mounted on.
     * @type {String|HTMLElement}
     */
    this.$el = (typeof el === 'string') ? document.querySelector(el) : el

    if (el !== null && !isElement(this.$el)) {
      console.error('Cannot select a valid $el HTMLElement')
      return
    }

    /**
     * Component name.
     * @type {String}
     */
    this.$name = name

    /**
     * Component tree.
     * @type {Object.<String, Component>}
     * @private
     */
    this._components = components

    /**
     * Parent instance.
     * @type {Component}
     */
    this.$parent = null

    /**
     * Root instance.
     * @type {Component}
     */
    this.$root = null

    /**
     * DOM elements registered.
     * @type {Object.<String, HTMLElement>}
     */
    this.$els = {}

    /**
     * Child components instances registered.
     * @type {Object.<String, Component>}
     */
    this.$refs = {}

    /**
     * Props component registered.
     * @type {Object.<String, string>}
     */
    this.$props = {}

    /**
     * Child components instances.
     * @type {Component[]}
     * @private
     */
    this._instances = []

    /**
     * Flag to check if the component have parent or not.
     * @type {Boolean}
     * @private
     */
    this._isRoot = true

    // Mount if root component, $el and template are present
    if (this._isRoot && this.$el && this.template) {
      this.$mount(this.$el)
    } else if (this._isRoot && this.$el) { // Otherwise, render only
      this._render()
      this._callHook('mounted', this)
    }
  }

  /**
   * Init hook.
   * Called synchronously after the instance has been initialized.
   * @abstract
   */
  init () {}

  /**
   * Mounted hook.
   * Called synchronously after the component compiled template
   * is inserted in the DOM.
   * @abstract
   */
  mounted () {}

  /**
   * Before destroy hook.
   * Called synchronously before the component has been destroyed.
   * @abstract
   */
  beforeDestroy () {}

  /**
   * Destroyed hook.
   * Called synchronously after the component has been destroyed.
   * @abstract
   */
  destroyed () {}

  /**
   * Data used to compile the template.
   * @abstract
   *
   * @returns {Object.<String, any>} Data.
   */
  data () {
    return {}
  }

  /**
   * Mount a pre-rendered component.
   *
   * @param {String|HTMLElement} el Element.
   */
  $preRenderMount (el) {
    el = (typeof el === 'string') ? document.querySelector(el) : el

    if (!isElement(el)) {
      console.error('$preRenderMount() : Cannot select a valid $el HTMLElement')
      return
    }

    this.$el = el
    this._preRender()

    return this
  }

  /**
   * Mount a component.
   *
   * @param {String|HTMLElement|null} el Element.
   * @param {String} type Mount type.
   */
  $mount (el = null, type) {
    el = (typeof el === 'string') ? document.querySelector(el) : el

    this.$el = this._renderTemplate(el, this, {}, type)
    if (!this.$el) {
      return
    }

    this._render()

    this._callHook('mounted', this)

    return this
  }

  /**
   * Destroy a component.
   */
  $destroy () {
    this._callHook('beforeDestroy', this)

    for (let i = 0, l = this._instances.length; i < l; i++) {
      this._instances[i].$destroy()
    }

    if (this.$el !== null) {
      this.$el.parentNode.removeChild(this.$el)
    }

    this.$el = null
    this.$name = null
    this.$parent = null
    this.$root = null
    this.$els = {}
    this.$refs = {}
    this._components = {}
    this._instances = []

    this.destroyed()
  }

  /**
   * Log component debug informations.
   */
  $debug () {
    console.group(`%cDebug component '${this.$name}'`, logStyles)

    console.log('%cAttributes', 'font-weight: bold')

    console.log('$el', this.$el)
    console.log('$els', this.$els)
    console.log('$refs', this.$refs)
    console.log('$props', this.$props)
    console.log('$parent', this.$parent)
    console.log('$root', this.$root)

    console.log('')
    console.log('%cTree', 'font-weight: bold')

    const componentsTree = this._getComponentTree()

    for (let i = 0, l = componentsTree.length; i < l; i++) {
      const space = Array(i * 2).join(' ')
      const arrow = i ? '➔ ' : ''
      const component = componentsTree[i]
      const styles = (i === l - 1) ? 'font-weight: bold' : ''
      console.log('%c' + space + arrow + component, styles)
    }

    console.groupEnd(`Debug component '${this.$name}'`)
  }

  /**
   * Bind methods to the scope component.
   *
   * @param {Array} [methods=[]] Methods to bind.
   */
  $scope (methods = []) {
    for (let i = 0, l = methods.length; i < l; i++) {
      const method = methods[i]

      if (typeof this[method] === 'undefined') {
        console.error(`$scope : Cannot bind method '${method}' on ` +
          `'${this.$name}' component instance`)
        return
      }

      this[method] = this[method].bind(this)
    }
  }

  /**
   * Next tick.
   *
   * @param {Function} [callback=() => {}] Callback
   */
  $nextTick (callback = () => {}) {
    window.requestAnimationFrame(callback)
  }

  /**
   * Pre-render a component.
   * @private
   */
  _preRender () {
    this._callHook('init', this)
    this.$root = this._getRootInstance(this)

    this._parseSubComponents(true)

    this._parseEls(this.$el, this)
    this._parseRefs(this.$el, this)
    this._parseProps(this.$el, this)

    this._callHook('mounted', this)

    this.$el.removeAttribute('data-prerendered')
  }

  /**
   * Render a component.
   * @private
   */
  _render () {
    if (this._isRoot) {
      this._callHook('init', this)
      this.$root = this
    }

    this._parseSubComponents(false)

    if (this._isRoot) {
      this._parseEls(this.$el, this)
      this._parseRefs(this.$el, this)
      this._parseProps(this.$el, this)
    }
  }

  /**
   * Get the root component instance of a component instance.
   * @private
   *
   * @param {Component} componentInstance Component instance.
   *
   * @returns {Component} Root instance.
   */
  _getRootInstance (componentInstance) {
    if (componentInstance.$parent === null) {
      return componentInstance
    }

    let rootInstance = componentInstance.$parent

    while (rootInstance.$parent !== null) {
      rootInstance = rootInstance.$parent
    }

    return rootInstance
  }

  _getComponentTree () {
    const tree = [this.$name]
    let parentInstance = this.$parent

    if (parentInstance === null) {
      return tree
    }

    while (parentInstance !== null) {
      tree.push(parentInstance.$name)
      parentInstance = parentInstance.$parent
    }

    return tree.reverse()
  }

  /**
   * Walk a DOM node and call the given callback.
   * @private
   *
   * @param {HTMLElement} node HTMLElement Node.
   * @param {Function} cb Callback function.
   */
  _walkNode (node, cb) {
    if (!isElement(node)) {
      console.error('Node argument must be a HTMLElement')
      return
    }

    walk(node, node => {
      if (node.nodeType === window.Node.ELEMENT_NODE) {
        return cb(node)
      }
    })
  }

  /**
   * Check if a node has a given attribute name.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {String} attribute Attribute name.
   *
   * @returns {Boolean} True if attribute exists on the node, else otherwise.
   */
  _hasAttribute (node, attribute) {
    return (
      typeof node.getAttribute === 'function' &&
      node.getAttribute(attribute)
    )
  }

  /**
   * Get node attribute.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {String} attribute Attribute name.
   *
   * @returns {String} Attribute value.
   */
  _getAttribute (node, attribute) {
    const value = node.getAttribute(attribute)
    node.removeAttribute(attribute)

    return value
  }

  /**
   * Parse sub components.
   * @private
   *
   * @param {Boolean} [prerendered=false] Pre-rendered component.
   */
  _parseSubComponents (prerendered = false) {
    if (isElement(this.$el)) {
      this._walkNode(this.$el, node => {
        const attrName = (prerendered) ? 'data-prerendered' : 'data-component'
        if (this._hasAttribute(node, attrName) && this.$el !== node) {
          this._parseSubComponent(node, prerendered)
        }
      })
    }
  }

  /**
   * Parse a sub component.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {Boolean} prerendered Pre-rendered component.
   */
  _parseSubComponent (node, prerendered) {
    if (!isElement(node)) {
      console.error('Node argument must be a HTMLElement')
      return
    }

    const attrName = (prerendered) ? 'data-prerendered' : 'data-component'
    const componentName = this._getAttribute(node, attrName)

    // Constructor
    const componentConstructor = this.components[componentName]

    if (typeof componentConstructor === 'undefined') {
      console.error(`Cannot instanciate a component that does not exist ` +
        `: '${componentName}'`)
      return
    }

    // Instance
    const componentInstance = new componentConstructor() // eslint-disable-line
    this._instances.push(componentInstance)

    componentInstance.$name = componentName
    componentInstance.$parent = this
    componentInstance.$root = this._getRootInstance(componentInstance)
    componentInstance._isRoot = false

    this._callHook('init', componentInstance)

    // Node to be replaced if template is found
    let newNode = node

    if (prerendered) {
      componentInstance.$el = node

      // Elements
      this._parseEls(node, componentInstance)

      // References
      this._parseRefs(node, componentInstance)

      // Props
      this._parseProps(node, componentInstance)

      componentInstance._parseSubComponents(true)
    } else {
      // Props
      const props = this._parseProps(node, componentInstance)

      // Template rendering and props injection
      if (componentInstance.template !== null) {
        newNode = this._renderTemplate(node, componentInstance, props)
      }

      componentInstance.$el = newNode

      // Elements
      this._parseEls(newNode, componentInstance)

      // References
      this._parseRefs(node, componentInstance)

      // Render component tree before mounted
      componentInstance._render()
    }

    this._callHook('mounted', componentInstance)
  }

  /**
   * Render component template.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {Component} componentInstance Component instance.
   * @param {Object} [data={}] Optional data.
   * @param {String} type DOM append type.
   *
   * @returns {HTMLElement} Rendered DOM node.
   */
  _renderTemplate (node, componentInstance, data = {}, type) {
    if (!isObject(componentInstance.data())) {
      console.error('data() method must return an object')
      return
    }

    if (componentInstance.template === null) {
      console.error(`No template to render for component : ` +
        `'${componentInstance.$name}'`)
      return
    }

    const componentData = {
      ...data,
      ...componentInstance.data()
    }

    const template = Twig.twig({ data: componentInstance.template })
    const html = template.render(componentData)

    return this._renderDOM(node, html, type)
  }

  /**
   * Render DOM.
   * @private
   *
   * @param {HTMLElement} [node=null] HTMLElement node.
   * @param {String} [html=''] HTML to render.
   * @param {String} [type='replace'] Render type.
   *
   * @returns {HTMLElement} New node.
   */
  _renderDOM (node = null, html = '', type = 'replace') {
    if (!node) {
      node = document.createElement('div')
      type = 'append'
    }

    node.insertAdjacentHTML('afterbegin', html)
    const newNode = node.firstElementChild

    if (!isElement(newNode)) {
      console.error('Cannot render to DOM new node')
      return
    }

    if (type === 'append') {
      node.appendChild(newNode)
    } else if (type === 'replace') {
      if (node && node.parentNode) {
        node.parentNode.replaceChild(newNode, node)
      } else {
        console.warn('No parent node found to replace child')
      }
    } else {
      console.error('Invalid render type')
      return
    }

    return newNode
  }

  /**
   * Parse component elements.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {Component} componentInstance Component instance.
   */
  _parseEls (node, componentInstance) {
    this._walkNode(node, node => {
      if (node.getAttribute('data-prerendered') !== null) {
        return true
      }

      if (this._hasAttribute(node, 'data-el')) {
        const elName = this._getAttribute(node, 'data-el')

        if (typeof componentInstance.$els[elName] === 'undefined') {
          componentInstance.$els[elName] = node
        } else if (!isArray(componentInstance.$els[elName])) {
          componentInstance.$els[elName] = [
            componentInstance.$els[elName], node
          ]
        } else {
          componentInstance.$els[elName].push(node)
        }
      }
    })
  }

  /**
   * Parse component references.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {Component} componentInstance Component instance.
   */
  _parseRefs (node, componentInstance) {
    if (this._hasAttribute(node, 'data-ref')) {
      const refName = this._getAttribute(node, 'data-ref')

      if (typeof componentInstance.$parent.$refs[refName] !== 'undefined') {
        console.error(`A 'data-ref' already exists with the name ` +
          `'${refName}' in '${componentInstance.$parent.$name}' component`)
        return
      }

      componentInstance.$parent.$refs[refName] = componentInstance
    }
  }

  /**
   * Parse component properties.
   * @private
   *
   * @param {HTMLElement} node HTMLElement node.
   * @param {Component} componentInstance Component instance.
   *
   * @returns {Object} Parsed properties.
   */
  _parseProps (node, componentInstance) {
    const attributesBlacklist = [
      'data-component', 'data-prerendered',
      'data-ref', 'data-el'
    ]
    const attributes = node.attributes
    const props = {}

    for (let i = 0, l = attributes.length; i < l; i++) {
      const attributeName = attributes[i].nodeName
      const attributeValue = attributes[i].nodeValue

      if (
        attributesBlacklist.indexOf(attributeName) === -1 &&
        startsWith(attributeName, 'data-')
      ) {
        props[attributeName.replace('data-', '')] = attributeValue
      }
    }

    componentInstance.$props = props

    return props
  }

  /**
   * Find a component instance by name.
   * @private
   *
   * @param {String} componentName Component name.
   *
   * @returns {Component|null} Component instance or null
   *                           if instance is not found.
   */
  _findInstance (componentName) {
    for (let i = 0, l = this._instances.length; i < l; i++) {
      const instance = this._instances[i]

      if (instance.$name === componentName) {
        return instance
      }
    }

    return null
  }

  /**
   * Call a hook.
   * @private
   *
   * @param {String} hookName Hook name.
   * @param {Component} context Context.
   */
  _callHook (hookName, context) {
    try {
      context[hookName]()
    } catch (e) {
      this._logError(e)
    }
  }

  /**
   * Log an error.
   * @private
   *
   * @param {String} msg Message.
   */
  _logError (msg) {
    if (typeof this.errorHandler === 'function') {
      this.errorHandler(msg)
    } else {
      console.error(msg)
    }
  }

  /**
   * Template getter.
   * @type {Object}
   * @readonly
   * @abstract
   */
  get template () {
    return null
  }

  /**
   * Components getter.
   * @type {Object.<String, Component>}
   * @readonly
   * @abstract
   */
  get components () {
    return this._components
  }
}

export default {
  Component,
  Twig
}
