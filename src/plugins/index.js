// Plugins
import router from '@/router'
import { MotionPlugin } from '@vueuse/motion'
import vuetify from './vuetify'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(MotionPlugin)
    .use(router)
}