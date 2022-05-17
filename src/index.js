import 'bulma'
import 'bulma-switch'
import 'jquery'

import { createApp } from 'vue'

// import the root component App from a single-file component.
import App from './App.vue'

// create app and mount
const app = createApp(App)
app.mount('#app')
