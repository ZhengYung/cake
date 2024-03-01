import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Front
    {
      path: '/',
      name: 'home',
      component: () => import('../views/front/AboutView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/front/AboutView.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/front/NewsView.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/front/ProductsView.vue')
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/front/ProductDetailView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/front/FAQView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/front/ContactView.vue')
    },
    {
      path: '/memberinfo/:tabs',
      name: 'memberinfo',
      component: () => import('../views/front/MemberInfoView.vue')
    },
    //Admin
  ]
})

export default router