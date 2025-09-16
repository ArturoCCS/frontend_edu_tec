export default class UnderlineInlineTool {
  static get isInline() { return true }
  static get title() { return 'Underline' }
  static get shortcut() { return 'CMD+U' }
  static get sanitize() { return { u: {} } }
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
    button.innerHTML = '<span style="text-decoration: underline;">U</span>'
    if (this.readOnly) button.disabled = true
    this.button = button
    return button
  }
  surround(range) { if (!this.readOnly && range) document.execCommand('underline') }
  checkState() {
    const active = document.queryCommandState('underline')
    this.button?.classList.toggle(this.api.styles.inlineToolButtonActive, active)
  }
}