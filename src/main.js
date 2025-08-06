import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/style.scss'

const app = createApp(App)

app.config.globalProperties.$filters = {

  truncate (text, stop, clamp) {
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
  },
  displayAmount (number, format = "en") {
    if (!isNaN(number)) {
      let formatter = new Intl.NumberFormat(format, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formatter.format(number);
    } else {
      return 0;
    }
  }
}
const layoutComponents = import.meta.glob('@/layouts/*.vue', { eager: true });

Object.entries(layoutComponents).forEach(([path, definition]) => {
  const componentName = path.split('/').pop().replace(/\.\w+$/, '')
  app.component(componentName, definition.default)
})

const formComponents = import.meta.glob('@/components/forms/*.vue', { eager: true });

Object.entries(formComponents).forEach(([path, definition]) => {
  const componentName = path.split('/').pop().replace(/\.\w+$/, '')
  app.component(componentName, definition.default)
})


app.use(router);
app.mount('#app')