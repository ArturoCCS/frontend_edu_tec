import { useSoundStore } from '@/stores/soundStore'

export const sfx = {
  mounted(el, binding) {
    const sfxType = binding.arg

    if (!sfxType) {
      console.warn('Directiva v-sfx usada sin especificar un sonido (ej: v-sfx:confirm)')
      return
    }

    const eventType = binding.modifiers.hover ? 'mouseenter' : 'click'

    const handler = () => {
      const soundStore = useSoundStore()

      if (soundStore.SFX && typeof soundStore.SFX[sfxType] === 'function') {
        soundStore.SFX[sfxType]()
      } else {
        console.warn(`SFX tipo "${sfxType}" no encontrado en soundStore.`)
      }
    }

    el._sfxHandler = handler

    el.addEventListener(eventType, el._sfxHandler)
  },

  unmounted(el, binding) {
    const eventType = binding.modifiers.hover ? 'mouseenter' : 'click'

    if (el._sfxHandler) {
      el.removeEventListener(eventType, el._sfxHandler)
      delete el._sfxHandler
    }
  }
}