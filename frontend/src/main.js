/* eslint no-unused-vars: "off" */

import './assets/main.css'

import {createPinia } from 'pinia';
import { createApp, onRenderTracked, render } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(router).use(createPinia());
app.mount('#app')
