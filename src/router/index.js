import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import Layout from '@/layout'

export const constantRoutes = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true, auth: false},
  {path: '/init',name:"init", component: () => import('@/views/system/init'), hidden: true, auth: false},
  {path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true, auth: false},
  {path: '/404', component: () => import('@/views/errorPage/404'), hidden: true, auth: false},
  {path: '/401', component: () => import('@/views/errorPage/401'), hidden: true, auth: false},
  {path: '/403', component: () => import('@/views/errorPage/403'), hidden: true, auth: false},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: {title: '主页', icon: 'dashboard', noCache: true, auth: true}
    }
    ]
  }


]
export const asyncRoutes = [
  {
    path: '/account',
    component: Layout,
    name: 'account',
    noCache: true,
    meta: {
      auth: true,
      title: '用户管理',
      icon: '用户管理',
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/account/user/'),
        name: 'user',
        meta: {title: '用户管理', icon: '管理员', auth: true}
      },
    ]
  },
  {
    path: '/profile',
    component: Layout,
    meta: {title: "个人中心",icon: 'system',noCache:true},
    hidden:true,
    children: [{
      path: 'index',
      component: () => import('../views/profile/index'),
      name: '个人中心',
      meta: {title: '个人中心', icon: '管理员', noCache: true}
    }]
  },

  {
    path:'/docker',
    component: Layout,
    meta:{'title':'虚拟化',icon: 'docker_1',auth: true},
    children: [
      {
        path: 'dockerHost',
        component: () => import('../views/docker/host'),
        name: 'now',
        auth: true,
        meta: {'title': '虚拟化主机', icon: 'docker_1', auth: true},
      },
      {
        path: 'compose',
        component: () => import('../views/docker/compose_db'),
        name: 'now',
        auth: true,
        meta: {'title': 'ComposeDB', icon: 'docker_1', auth: true},
      },
      {
        path: 'dockerHostDetail',
        component: () => import('../views/docker/hostDetail'),
        name: 'dockerHostDetail',
        auth: true,
        hidden: true,
        meta: {'title': '容器主机详情', icon: 'host', auth: true},
      },
      {
        path: 'image',
        component: () => import('../views/docker/images'),
        name: 'dockerImages',
        auth: true,
        hidden: true,
        meta: {'title': 'Image', icon: 'icon' },
      },
      {
        path: 'container',
        component: () => import('../views/docker/container'),
        name: 'dockerContainer',
        auth: true,
        hidden: true,
        meta: {'title': '实例容器', icon: 'container'},
      },
      {
        path: 'image/detail',
        component: () => import('../views/docker/imageDetail'),
        name: 'dockerImagesDetail',
        auth: true,
        hidden: true,
        meta: {'title': '镜像详情', icon: 'icon' },
      },
      {
        path: 'image/add',
        component: () => import('../views/docker/addImage'),
        name: 'dockerImagesAdd',
        auth: true,
        hidden: true,
        meta: {'title': '添加镜像', icon: 'icon' },
      },

    ],
  },
  {
    path: '/ctf',
    component: Layout,
    meta: {'title': 'CTF赛事', icon: '赛事 ', auth: true},
    children: [
      {
        path: 'question',
        component: () => import('../views/ctf/question'),
        name: 'question',
        auth: true,
        meta: {'title': '赛事题库', icon: 'component', auth: true},
      },
      {
        path: 'answer',
        component: () => import('../views/ctf/answer'),
        name: 'answer',
        auth: true,
        meta: {'title': '答题记录', icon: 'record', auth: true},
      },
      {
        path: 'container',
        component: () => import('../views/ctf/container'),
        name: 'container',
        auth: true,
        meta: {'title': '赛事容器', icon: 'container', auth: true},
      },
      {
        path: 'config',
        component: () => import('../views/ctf/config'),
        name: 'ctfConfig',
        auth: true,
        meta: {'title': '赛事配置', icon: 'container', auth: true},
      },
      // {
      //   path: 'hostList',
      //   component: () => import('../views/ctf/HostList'),
      //   name: 'hostList',
      //   auth: true,
      //   meta: {'title': '宿主机', icon: 'container', auth: true},
      // },
      // {
      //   path: 'dockerQuestion',
      //   component: () => import('../views/ctf/DockerQuestion'),
      //   name: 'container',
      //   auth: true,
      //   meta: {'title': '动态镜像', icon: 'container', auth: true},
      // },

    ]
  },
  {
    path: '/notice',
    component: Layout,
    meta: {title: "公告提醒",icon: 'system',noCache:true},
    children: [{
      path: 'index',
      component: () => import('../views/notice/index'),
      name: '公告提醒',
      meta: {title: '公告提醒', icon: '管理员', noCache: true}
    }]
  },
  {
    path: '/system',
    component: Layout,
    meta: {title: "系统设置",icon: 'system',noCache:true,roles: [1,2]},
    children: [
      {
        path: 'role',
        component: () => import('../views/system/role'),
        name: '角色管理',
        meta: {title: '角色管理', icon: '', noCache: true}
      },
      {
      path: 'admin',
      component: () => import('../views/system/admins'),
      name: '系统管理员',
      meta: {title: '管理员列表', icon: '', noCache: true}
    }]
  },
  {
    path: '/ops',
    component: Layout,
    meta: {title: "运维",icon: 'system',noCache:true},
    children: [
      {
        path: 'sysInfo',
        component: () => import('../views/ops/sysInfo'),
        name: 'sysInfo',
        meta: {title: '系统设置', icon: 'table', noCache: true}
      },
      {
        path: 'operator',
        component: () => import('../views/ops/operator'),
        name: 'operator',
        meta: {title: '审计日志', icon: 'table', noCache: true}
      },
      // {
      // path: 'logs',
      // component: () => import('../views/ops/logs'),
      // name: 'logs',
      // meta: {title: '日志', icon: 'table', noCache: true}
    // }
    ]
  }

]
const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
