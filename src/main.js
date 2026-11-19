import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initStores } from './stores'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
initStores()
app.use(router)
app.mount('#app')
