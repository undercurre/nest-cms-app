import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(`kitchen/offlinedevice/web/cms/markH5/`),
  routes: [
    {
      path: '/',
      redirect: '/list',
    },
    {
      path: '/list',
      name: 'list',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ListView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/guide/:id',
      name: 'guide',
      component: () => import('../views/GuideView.vue'),
    },
    {
      path: '/guide/detail/:id',
      name: 'guideDetail',
      component: () => import('../views/GuideDetail.vue'),
    },
    {
      path: '/diet/:id',
      name: 'diet',
      component: () => import('../views/DietView.vue'),
    },
    {
      path: '/diet/detail/:id',
      name: 'dietDetail',
      component: () => import('../views/DietDetail.vue'),
    },
    {
      path: '/diet/aiDetail/:id',
      name: 'AiDietDetail',
      component: () => import('../views/AiDietDetail.vue'),
    },
    {
      path: '/qa/:id',
      name: 'qa',
      component: () => import('../views/QaView.vue'),
    },
    {
      path: '/poster/:id',
      name: 'poster',
      component: () => import('../views/PosterView.vue'),
    },
    {
      path: '/ai',
      name: 'ai',
      component: () => import('../views/AIView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sale',
      name: 'sale',
      component: () => import('../views/SaleApp.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
    },
  ],
})

export default router
