import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '../views/ProductView.vue'
import DietView from '../views/DietView.vue'
import GuideView from '../views/GuideView.vue'

const router = createRouter({
  history: createWebHistory('web/cms/markH5/'),
  routes: [
    {
      path: '/',
      redirect: '/about',
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
      path: '/diet/:id',
      name: 'diet',
      component: DietView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
