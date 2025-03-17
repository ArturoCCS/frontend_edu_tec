/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import router from '@/router'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vuetify from './vuetify'

export function registerPlugins(App) {
  const app = createApp(App)

  app.use(createPinia()) 
  app
    .use(vuetify)
    .use(MotionPlugin)
    .use(router)
    .mount('#app')
}
