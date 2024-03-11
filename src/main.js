// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/base.css'
const app = createApp(App)

registerPlugins(app)

app.mount('#app')