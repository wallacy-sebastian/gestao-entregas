import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import './assets/transitions.css'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
if (mediaQuery.matches) document.documentElement.classList.add('dark')
mediaQuery.addEventListener('change', (e) =>
  document.documentElement.classList.toggle('dark', e.matches),
)

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
