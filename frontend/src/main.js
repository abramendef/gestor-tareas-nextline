import { createApp } from 'vue'
import App from './App.vue'


import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#000000',
          surface: '#1c1c1e',
          primary: '#0A84FF',
          secondary: '#5E5CE6',
          success: '#32D74B',
          error: '#FF453A',
          warning: '#FF9F0A',
          info: '#64D2FF',
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')
