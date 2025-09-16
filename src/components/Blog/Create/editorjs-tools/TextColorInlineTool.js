export default class TextColorInlineTool {
  static get isInline() { return true }
  static get title() { return 'Text color' }
  static get sanitize() { return { span: { style: true }, font: { color: true } } }
  static get isReadOnlySupported() { return true }

  constructor({ api, config, readOnly }) {
    this.api = api
    this.readOnly = !!readOnly
    this.button = null
    this.colors = (config && config.colors) || ['#111827','#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#000000','#ffffff']
    this.range = null
  }

  render() {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.classList.add(this.api.styles.inlineToolButton)
    btn.innerHTML = '<span style="font-weight:600;">A</span>'
    if (this.readOnly) btn.disabled = true
    this.button = btn
    return btn
  }

  surround(range) {
    if (this.readOnly || !range) return
    this.range = range.cloneRange()
    this.openPalette(this.button, (color) => {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(this.range)
      document.execCommand('foreColor', false, color)
    })
  }

  checkState() {}

  openPalette(anchor, onPick) {
    if (this.readOnly) return
    const dd = document.createElement('div')
    Object.assign(dd.style, {
      display: 'flex', gap: '6px', padding: '8px', flexWrap: 'wrap',
      background: '#fff', border: '1px solid #eee', borderRadius: '6px',
      boxShadow: '0 4px 20px rgba(0,0,0,.08)', position: 'absolute', zIndex: 1000
    })
    this.colors.forEach(c => {
      const sw = document.createElement('button')
      Object.assign(sw.style, { width: '18px', height: '18px', borderRadius: '4px', border: '1px solid #ddd', background: c })
      sw.type = 'button'
      sw.title = c
      sw.addEventListener('click', () => { onPick(c); dd.remove() })
      dd.appendChild(sw)
    })
    const rect = anchor.getBoundingClientRect()
    dd.style.left = rect.left + 'px'
    dd.style.top = (rect.bottom + 6) + 'px'
    document.body.appendChild(dd)
    const close = (ev) => { if (!dd.contains(ev.target) && ev.target !== anchor) { dd.remove(); document.removeEventListener('mousedown', close) } }
    setTimeout(() => document.addEventListener('mousedown', close), 0)
  }
}