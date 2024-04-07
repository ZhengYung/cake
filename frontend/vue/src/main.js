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
import axios from 'axios';
import VueAxios from 'vue-axios';
const app = createApp(App)

registerPlugins(app)

// Axios Plugin
// 設定 axios 的 baseURL
axios.defaults.baseURL = "http://192.168.100.2:3000";
app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

app.mount('#app')