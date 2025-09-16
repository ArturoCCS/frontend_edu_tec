export default class StrikethroughInlineTool {
  static get isInline() { return true }
  static get title() { return 'Strikethrough' }
  static get shortcut() { return 'CMD+SHIFT+X' }
  static get sanitize() { return { s: {}, strike: {} } }
  static get isReadOnlySupported() { return true }

  constructor({ api, readOnly }) {
    this.api = api
    this.readOnly = !!readOnly
    this.button = null
  }
  render() {
    const button = document.createElement('button')
    button.type = 'button'
    button.classList.add(this.api.styles.inlineToolButton)
    button.innerHTML = '<span style="text-decoration: line-through;">S</span>'
    if (this.readOnly) button.disabled = true
    this.button = button
    return button
  }
  surround(range) { if (!this.readOnly && range) document.execCommand('strikeThrough') }
  checkState() {
    const active = document.queryCommandState('strikeThrough')
    this.button?.classList.toggle(this.api.styles.inlineToolButtonActive, active)
  }
}