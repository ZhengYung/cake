import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Front
    {
      path: '/',
      name: 'front',
      component: () => import('../views/front/Layout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/front/HomeView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/front/AboutView.vue')
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('../views/front/NewsView.vue')
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/front/ProductsView.vue')
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('../views/front/ProductDetailView.vue')
        },
        {
          path: 'faq',
          name: 'faq',
          component: () => import('../views/front/FAQView.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('../views/front/ContactView.vue')
        },
        {
          path: 'memberinfo/:tabs',
          name: 'memberinfo',
          component: () => import('../views/front/MemberInfoView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/front/Register.vue')
        }
      ]
    },
    //Admin
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/Layout.vue'),
      children: [
        {
          path: 'salesOverview',
          name: '',
          component: () => import('../views/admin/SalesOverview.vue'),
        },
        //品牌故事
        {
          path: 'story',
          name: '',
          component: () => import('../views/admin/story/List.vue'),
        },
        {
          path: 'story/add',
          name: '',
          component: () => import('../views/admin/story/Add.vue'),
        },
        {
          path: 'story/edit/:Id',
          name: '',
          component: () => import('../views/admin/story/Edit.vue'),
        },
        //消息管理
        {
          path: 'newsLayer',
          name: '',
          component: () => import('../views/admin/news/layer/List.vue'),
        },
        {
          path: 'news',
          name: '',
          component: () => import('../views/admin/news/List.vue'),
        },
        {
          path: 'news/add',
          name: '',
          component: () => import('../views/admin/news/Add.vue'),
        },
        {
          path: 'news/edit/:Id',
          name: '',
          component: () => import('../views/admin/news/Edit.vue'),
        },
        //產品管理
        {
          path: 'productLayer',
          name: '',
          component: () => import('../views/admin/product/layer/List.vue'),
        },
        {
          path: 'product',
          name: '',
          component: () => import('../views/admin/product/List.vue'),
        },
        {
          path: 'product/add',
          name: '',
          component: () => import('../views/admin/product/Add.vue'),
        },
        {
          path: 'product/edit/:Id',
          name: '',
          component: () => import('../views/admin/product/Edit.vue'),
        },
        {
          path: 'product-flavor',
          name: '',
          component: () => import('../views/admin/product/flavor/List.vue'),
        },
        {
          path: 'product-flavor/add',
          name: '',
          component: () => import('../views/admin/product/flavor/Add.vue'),
        },
        {
          path: 'product-flavor/edit/:Id',
          name: '',
          component: () => import('../views/admin/product/flavor/Edit.vue'),
        },
        //購物須知
        {
          path: 'faqLayer',
          name: '',
          component: () => import('../views/admin/faq/layer/List.vue'),
        },
        {
          path: 'faq',
          name: '',
          component: () => import('../views/admin/faq/List.vue'),
        },
        {
          path: 'faq/add',
          name: '',
          component: () => import('../views/admin/faq/Add.vue'),
        },
        {
          path: 'faq/edit/:Id',
          name: '',
          component: () => import('../views/admin/faq/Edit.vue'),
        },
        //訂單管理
        {
          path: 'order',
          name: '',
          component: () => import('../views/admin/order/List.vue'),
        },
        {
          path: 'order/add',
          name: '',
          component: () => import('../views/admin/order/Add.vue'),
        },
        {
          path: 'order/edit',
          name: '',
          component: () => import('../views/admin/order/Edit.vue'),
        },
        //會員管理
        {
          path: 'memberLevel',
          name: '',
          component: () => import('../views/admin/member/level/List.vue'),
        },
        {
          path: 'memberLevel/add',
          name: '',
          component: () => import('../views/admin/member/level/Add.vue'),
        },
        {
          path: 'memberLevel/edit',
          name: '',
          component: () => import('../views/admin/member/level/Edit.vue'),
        },
        {
          path: 'member',
          name: '',
          component: () => import('../views/admin/member/List.vue'),
        },
        {
          path: 'member/add',
          name: '',
          component: () => import('../views/admin/member/Add.vue'),
        },
        {
          path: 'member/edit',
          name: '',
          component: () => import('../views/admin/member/Edit.vue'),
        },
        {
          path: 'memberAnalyze',
          name: '',
          component: () => import('../views/admin/member/Analyze.vue'),
        },
        //管理者
        {
          path: 'adminLevel',
          name: '',
          component: () => import('../views/admin/admin/level/List.vue'),
        },
        {
          path: 'adminLevel/add',
          name: '',
          component: () => import('../views/admin/admin/level/Add.vue'),
        },
        {
          path: 'adminLevel/edit',
          name: '',
          component: () => import('../views/admin/admin/level/Edit.vue'),
        },
        {
          path: 'admin',
          name: '',
          component: () => import('../views/admin/admin/List.vue'),
        },
        {
          path: 'admin/add',
          name: '',
          component: () => import('../views/admin/admin/Add.vue'),
        },
        {
          path: 'admin/edit',
          name: '',
          component: () => import('../views/admin/admin/Edit.vue'),
        },
      ]
    }
  ]
})

export default router
