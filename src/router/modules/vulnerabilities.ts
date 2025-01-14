const Layout = () => import("@/layout/index.vue");
export default {
  path: '/vulnerability',
  component: Layout,
  meta: {'title': '漏洞复现', icon: 'simple-icons:pocketcasts'},
  children: [
    {
      path: '/vuln/resources',
      component: () => import('@/views/vulnerability/resources.vue'),
      name: 'vulnerability_resource',
      meta: {'title': '漏洞资源', icon: 'component'},
    },
    {
      path: '/vulnerability/runner',
      component: () => import('@/views/vulnerability/runner.vue'),
      name: 'vulnerability_runner',
      meta: {'title': '运行时', icon: 'component'},
    },
    {
      path: '/vulnerability/edit_resources',
      component: () => import('@/views/vulnerability/editResources.vue'),
      name: 'vulnerability_edit_resource',
      meta: {'title': '编辑资源', icon: 'component', showLink: false},
    },
    {
      path: '/vulnerability/config',
      component: () => import('@/views/vulnerability/config.vue'),
      name: 'vulnerability_config',
      meta: {'title': '参数配置', icon: 'container'},
    },
  ]
} satisfies RouteConfigsTable;
