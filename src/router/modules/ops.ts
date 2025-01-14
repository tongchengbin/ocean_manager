const Layout = () => import("@/layout/index.vue");
export default {
  path: '/ops',
  component: Layout,
  meta: {title: "运维",icon: 'tdesign:system-setting'},
  children: [
    {
      path: '/ops/sys',
      component: () => import('@/views/ops/sysinfo.vue'),
      name: 'ops_sys',
      meta: {title: '系统设置',roles: ["超级管理员","运维管理员"],}
    },
    {
      path: '/ops/operator',
      component: () => import('@/views/ops/operator.vue'),
      name: 'ops_operator',
      meta: {title: '审计日志' }
    }]
} satisfies RouteConfigsTable;
