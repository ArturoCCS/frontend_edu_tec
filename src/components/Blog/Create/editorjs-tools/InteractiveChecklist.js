import Checklist from '@editorjs/checklist';

export default class InteractiveChecklist extends Checklist {
  static get toolbox() {
    return {
      title: 'Checklist (lector)',
      icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    };
  }

  render() {
    const inner = super.render();
    const wrap = document.createElement('div');
    wrap.classList.add('checklist-variant');
    wrap.dataset.variant = 'interactive';
    wrap.setAttribute('aria-roledescription', 'Checklist seleccionable por el lector');

    queueMicrotask(() => {
      wrap.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        cb.setAttribute('title', 'Este check puede ser clickeado por el usuario en lectura');
      });
    });

    if (this.api?.readOnly?.isEnabled) {
      wrap.removeAttribute('aria-readonly');
      queueMicrotask(() => {
        wrap.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          cb.disabled = false;
          cb.removeAttribute('aria-disabled');
        });
      });
    }

    wrap.appendChild(inner);
    return wrap;
  }

  save(wrap) {
    const inner = wrap.querySelector('.cdx-checklist') || wrap;
    const data = super.save(inner);
    data.__variant = 'reader-interactive';
    return data;
  }
}