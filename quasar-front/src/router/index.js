import { route } from 'quasar/wrappers'
import useAuthUser from 'src/composables/UseAuthUser'
import { isAuthenticated } from 'src/store/auth/getters'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory, routerKey } from 'vue-router'
import routes from './routes'
import UseAuthUser from 'src/composables/UseAuthUser'
import { nextTick } from 'vue'


export default route(function (/* { store, ssrContext } */) {

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      if (window.localStorage.getItem('localToken')) {
        next();
      } else {
        next({ name: "login" });
      }
    }else{
      next()
    }
  });
  return Router
})
