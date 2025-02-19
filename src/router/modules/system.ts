const Layout = () => import("@/layout/index.vue");
export default {
  path: '/system',
  component: Layout,
  meta: {title: "系统设置",icon: 'dashicons:admin-generic'},
  children: [
    {
      path: '/system/admin',
      component: () => import('@/views/system/admins.vue'),
      name: 'system_admin',
      meta: {title: '管理员列表', icon: '',roles: ["超级管理员"],}
    },
    {
      path: '/system/notifications',
      component: () => import('@/views/system/notifications.vue'),
      name: 'systemNotifications',
      meta: {title: '通知管理', icon: 'ri:notification-4-line'}
    },
    {
      path: '/profile',
      component: Layout,
      meta: {title: "个人中心",showLink:false},
      children: [{
        path: '/profile/index',
        component: () => import('@/views/profile/index.vue'),
        name: 'profile',
        meta: {title: '个人中心', icon: '管理员'}
      }]
    }
  ]
} satisfies RouteConfigsTable;
