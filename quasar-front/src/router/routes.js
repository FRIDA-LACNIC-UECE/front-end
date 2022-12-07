const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue')}
    ]
  },
  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Databases.vue') },
      { path: 'databases', component: () => import('pages/Databases.vue') },
      { path: 'token', component: () => import('pages/Token.vue')},
      { path: 'anonymization', component: () => import ('pages/Anonymization.vue')},
      { path: 'anonymizationconfig', name:'anonymizationConfig', component: () => import('pages/anonymizationConfig.vue')},
      //{ path: 'anonymizationconfig/:id', name: 'anony', component: () => import('pages/anonymizationConfig.vue')}
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Users.vue') },
      { path: 'new', component: () => import('pages/addUser.vue') }
    ]
  },
  // {
  //   path: '/anonymization',
  //   component: () => import('layouts/ClientLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/BeforeAnon.vue') },
  //     {
  //       path: 'before',
  //       children: [
  //         { path: '', component: () => import('pages/BeforeAnon.vue') },
  //       ]
  //     },
  //     {
  //       path: 'after',
  //       children: [
  //         { path: '', component: () => import('pages/AfterAnon.vue') },
  //       ]
  //     }
  //   ]
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
