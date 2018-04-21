/**
 * Starts with.
 *
 * @param {String} str String.
 * @param {String} prefix Prefix.
 *
 * @returns {Boolean} True if given string starts with given prefix,
 *                    else otherwise.
 */
export const startsWith = (str, prefix) => str.indexOf(prefix) === 0

/**
 * Walk a DOM node and call the given callback.
 *
 * @param {HTMLElement} node HTMLElement node.
 * @param {Function} cb Callback function.
 */
export function walk (nodes, cb) {
  const slice = Array.prototype.slice

  if (!('length' in nodes)) {
    nodes = [nodes]
  }

  nodes = slice.call(nodes)

  while (nodes.length) {
    let node = nodes.shift()
    let ret = cb(node)

    if (ret) {
      continue
    }

    if (node.childNodes && node.childNodes.length) {
      nodes = slice.call(node.childNodes).concat(nodes)
    }
  }
}
