export default class InfoPanel {
  constructor(root) {
    this.root = root
    this.kind = root.querySelector('[data-kind]')
    this.title = root.querySelector('[data-title]')
    this.summary = root.querySelector('[data-summary]')
    this.points = root.querySelector('[data-points]')
    this.image = root.querySelector('[data-image]')
    this.link = root.querySelector('[data-link]')
    root.querySelector('[data-close]').addEventListener('click', () => this.hide())
    root.addEventListener('click', (event) => { if (event.target === root) this.hide() })
  }

  get isOpen() {
    return !this.root.hidden
  }

  show(content) {
    this.kind.textContent = content.kind ?? ''
    this.title.textContent = content.title
    this.summary.textContent = content.summary
    this.points.replaceChildren(...content.points.map((point) => Object.assign(document.createElement('li'), { textContent: point })))
    this.image.hidden = !content.image
    if (content.image) this.image.src = content.image
    this.link.hidden = !content.link
    if (content.link) Object.assign(this.link, { href: content.link.url, textContent: content.link.label })
    this.root.hidden = false
  }

  hide() {
    this.root.hidden = true
  }
}
