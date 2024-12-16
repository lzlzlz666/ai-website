import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'chat',
        component: () => import('../views/chat/index.vue'),
        meta: {
          title: 'AI 助手'
        }
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/HistoryView.vue'),
        meta: {
          title: '历史记录'
        }
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: {
          title: '个人设置'
        }
      },
      {
        path: '/comments',
        name: 'comments',
        component: () => import('../views/CommentsView.vue'),
        meta: {
          title: '留言板'
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '404'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - 轻享AI`
  
  // 检查是否需要登录
  const isAuthenticated = localStorage.getItem('token')
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router