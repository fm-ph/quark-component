import { appendHtml, clearHtmlBody } from './dom'
import rootTpl from '../templates/common/root.html'

export function setup () {
  beforeEach(() => {
    appendHtml(document.body, rootTpl)
  })

  afterEach(() => {
    clearHtmlBody()
  })
}
