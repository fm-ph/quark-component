export function appendHtml (el, str) {
  const div = document.createElement('div')
  div.innerHTML = str

  el.appendChild(div.children[0])

  return el.children[0]
}

export function clearHtmlBody () {
  document.body.innerHTML = ''
}
