const Layout = () => import("@/layout/index.vue");
export default {
  path: "/ctf",
  name: "ctf",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "IF-icon-tag",
    title: "CTF",
    rank: 0
  },
  children: [{
    path: '/ctf/question',
    component: () => import('@/views/ctf/question.vue'),
    name: 'question',
    meta: {'title': '赛事题库', icon: 'component'},
  },
    {
      path: '/ctf/answer',
      component: () => import('@/views/ctf/answer.vue'),
      name: 'answer',
      meta: {'title': '答题记录', icon: 'record'},
    },
    {
      path: '/ctf/container',
      component: () => import('@/views/ctf/container.vue'),
      name: 'container',
      meta: {'title': '赛事容器', icon: 'container',},
    },
    {
      path: '/ctf/resource',
      component: () => import('@/views/ctf/resources.vue'),
      name: 'ctf_resource',
      meta: {'title': '环境资源', icon: 'resource',},
    },
    {
      path: '/ctf/config',
      component: () => import('@/views/ctf/config.vue'),
      name: 'ctfConfig',
      meta: {'title': '赛事配置', icon: 'container'},
    }
  ]
} satisfies RouteConfigsTable;
