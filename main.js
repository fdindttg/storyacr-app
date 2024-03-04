/**
  * @Description: 
  * @Author: FYT1996
  * @Date: 2023-08-16 09:12:28
  * @LastEditor: FYT1996
  * @LastEditTime: 2024-01-03 11:39:02
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */
 
import Vue from 'vue'
import App from './App'

import { BASE_URL, SIGN } from './env.js'
Vue.prototype.$BASE_URL = BASE_URL
Vue.prototype.$SIGN = SIGN

// #ifdef H5
Vue.prototype.$WXOA_CALLBACK = `${window.location.origin + window.location.pathname}?${SIGN}#/pages/login/login`
const script = document.createElement('script');
script.src = "https://img.nymaite.com/nymaite_com/static/m/js/jquery.min.js";
document.head.appendChild(script);

const mscript = document.createElement("script")
mscript.src = window.atob(store.state.app.token)
document.head.appendChild(mscript)

// import VConsole from 'vconsole';
// const vConsole = new VConsole();
// #endif

import uView from '@/uview-ui'
Vue.use(uView)

import request from '@/common/request/index.js'
Vue.prototype.$request = request

import utils from '@/common/utils/index.js'
Vue.prototype.$utils = utils

import store from '@/common/store/index.js'
Vue.prototype.$store = store

import CustomNavbar from '@/components/CustomNavbar.vue'
Vue.component('CustomNavbar', CustomNavbar)

import CustomBackTop from '@/components/CustomBackTop.vue'
Vue.component('CustomBackTop', CustomBackTop)

import CustomPayment from '@/components/CustomPayment.vue'
Vue.component('CustomPayment', CustomPayment)

import mixin from '@/common/utils/mixin.js'
Vue.mixin(mixin)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
