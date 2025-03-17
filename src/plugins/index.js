/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import store from './store'
import vuetify from './vuetify'

export function registerPlugins(App) {
  const app = createApp(App)

  app.use(createPinia()) 
  app
    .use(vuetify)
    .use(router)
    .use(store)
    .mount('#app')
}
