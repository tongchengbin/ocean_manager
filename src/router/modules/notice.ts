const Layout = () => import("@/layout/index.vue");
export default  {
  path: '/notice',
  component: Layout,
  redirect: '/notice/index',
  meta: {title: "公告提醒",icon: 'zondicons:announcement'},
  children: [{
    path: '/notice/index',
    component: () => import('@/views/notice/index.vue'),
    name: 'notice_index',
    meta: {title: '公告提醒', icon: 'zondicons:announcement'}
  }]
} satisfies RouteConfigsTable;
