import { route } from 'quasar/wrappers'
import useAuthUser from 'src/composables/UseAuthUser'
import { isAuthenticated } from 'src/store/auth/getters'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory, routerKey } from 'vue-router'
import routes from './routes'
import UseAuthUser from 'src/composables/UseAuthUser'


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

  Router.beforeEach ((to, next) =>{
    const { isLoggedIn } = UseAuthUser
    console.log(to)
    if (
      !isLoggedIn &&
      to.meta.requiresAuth
    ){
      return { name: 'login' }
    }
  })
  return Router
})
