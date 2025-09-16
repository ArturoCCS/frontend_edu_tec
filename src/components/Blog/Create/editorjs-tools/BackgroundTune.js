const ICON = `
<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
  <rect x="2" y="2" width="6" height="6" fill="currentColor" opacity="0.85"/>
  <rect x="12" y="2" width="6" height="6" fill="currentColor" opacity="0.35"/>
  <rect x="2" y="12" width="6" height="6" fill="currentColor" opacity="0.35"/>
  <rect x="12" y="12" width="6" height="6" fill="currentColor" opacity="0.85"/>
</svg>
`;

export default class BackgroundTune {
  static get isTune() { return true }
  static get isReadOnlySupported() { return true }

  constructor({ api, data, config, block, readOnly }) {
    this.api = api;
    this.block = block;
    this.readOnly = !!readOnly;

    this.colors = (config && config.colors) || ['transparent','#ffffff','#fef3c7','#e0f2fe','#dcfce7','#fee2e2','#eef2ff'];
    this.defaultColor = (config && config.defaultColor) ?? 'transparent';
    this.applyDefault = Boolean(config && config.applyDefault);

    const hasSaved = data && typeof data.color !== 'undefined';
    this.data = { color: hasSaved ? data.color : this.defaultColor };
    this._isNew = !hasSaved;

    this.button = null;
    this.popover = null;
  }

  createPopoverItem({ label, icon, onClick }) {
    if (this.api?.ui?.createButton) {
      return this.api.ui.createButton({ label, icon, onClick });
    }
    const item = document.createElement('div');
    item.className = 'ce-popover-item';
    item.dataset.itemName = 'background';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'ce-popover-item__icon';
    iconWrap.innerHTML = icon;

    const title = document.createElement('div');
    title.className = 'ce-popover-item__title';
    title.textContent = label;

    item.appendChild(iconWrap);
    item.appendChild(title);
    item.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onClick?.(e) });
    return item;
  }

  render() {
    const label = this.api?.i18n?.t ? this.api.i18n.t('Background') : 'Background';

    const btn = this.createPopoverItem({
      label,
      icon: ICON,
      onClick: () => {
        if (this.readOnly) return;
        if (this.popover) this.closePopover();
        else this.openPalette(btn);
      }
    });

    this.button = btn;
    this.updateActiveState();
    if (this.readOnly) {
      btn.setAttribute('aria-disabled', 'true');
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.6';
    }
    return btn;
  }

  renderActions() {
    if (this._isNew && this.applyDefault && this.data.color && this.data.color !== 'transparent') {
      this.apply();
    } else if (!this._isNew && this.data.color) {
      this.apply();
    }
  }

  openPalette(anchor) {
    if (this.readOnly) return;
    this.closePopover();

    const dd = document.createElement('div');
    dd.className = 'bg-tune__popover';
    dd.setAttribute('role', 'menu');

    this.colors.forEach((c) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'bg-tune__swatch';
      sw.style.background = c;
      sw.title = c;
      sw.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.data.color = c;
        this.apply();
        this.updateActiveState();
        this.closePopover();
      });
      dd.appendChild(sw);
    });

    const rect = anchor.getBoundingClientRect();
    Object.assign(dd.style, {
      position: 'fixed',
      left: Math.round(rect.left) + 'px',
      top: Math.round(rect.bottom + 6) + 'px'
    });

    document.body.appendChild(dd);
    this.popover = dd;

    this._outside = (ev) => { if (!dd.contains(ev.target) && ev.target !== anchor) this.closePopover(); };
    this._onScroll = () => this.closePopover();
    setTimeout(() => {
      document.addEventListener('mousedown', this._outside);
      window.addEventListener('scroll', this._onScroll, true);
      window.addEventListener('resize', this._onScroll, true);
    }, 0);
  }

  closePopover() {
    if (this.popover && this.popover.parentNode) this.popover.parentNode.removeChild(this.popover);
    this.popover = null;
    if (this._outside) document.removeEventListener('mousedown', this._outside);
    if (this._onScroll) {
      window.removeEventListener('scroll', this._onScroll, true);
      window.removeEventListener('resize', this._onScroll, true);
    }
    this._outside = null;
    this._onScroll = null;
  }

  updateActiveState() {
    if (!this.button) return;
    const active = this.data.color && this.data.color !== 'transparent';
    this.button.classList.toggle('ce-popover-item--active', !!active);
    this.button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  apply() {
    const holder = this.block && this.block.holder;
    if (holder) holder.style.background = this.data.color || 'transparent';
  }

  save() {
    return { color: this.data.color };
  }
}