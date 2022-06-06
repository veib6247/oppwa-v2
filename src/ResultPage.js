import 'bulma'
import 'bulma-switch'
import { createApp } from 'vue'

// import the root component App from a single-file component.
import ResultPage from './ResultPage.vue'

// create app and mount
const app = createApp(ResultPage)
app.mount('#app')
