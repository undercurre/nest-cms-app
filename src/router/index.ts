import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '../views/ProductView.vue'
import DietView from '../views/DietView.vue'
import GuideView from '../views/GuideView.vue'
import GuideDetail from '../views/GuideDetail.vue'
import DietDetail from '../views/DietDetail.vue'
import AIView from '../views/AIView.vue'
import SaleApp from '../views/SaleApp.vue'
import StatisticsView from '../views/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory('web/cms/markH5/'),
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
      component: ProductView,
    },
    {
      path: '/guide/:id',
      name: 'guide',
      component: GuideView,
    },
    {
      path: '/guide/detail/:id',
      name: 'guideDetail',
      component: GuideDetail,
    },
    {
      path: '/diet/:id',
      name: 'diet',
      component: DietView,
    },
    {
      path: '/diet/detail/:id',
      name: 'dietDetail',
      component: DietDetail,
    },
    {
      path: '/ai',
      name: 'ai',
      component: AIView,
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
      component: SaleApp,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
    },
  ],
})

export default router
