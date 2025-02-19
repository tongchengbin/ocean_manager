const Layout = () => import("@/layout/index.vue");
export default {
  path: '/docker',
  name: 'docker',
  component: Layout,
  meta: {
    title: '虚拟化管理',
    icon: 'teenyicons:docker-outline'
  },
  children: [
    {
      path: '/docker/dockerHostDetail',
      component: () => import('@/views/docker/hostDetail.vue'),
      name: 'dockerHostDetail',
      meta: {'title': '容器主机详情', icon: 'host',roles: ["超级管理员","运维管理员"],},
    },
    {
      path: '/docker/image',
      component: () => import('@/views/docker/images.vue'),
      name: 'docker_image',
      meta: {'title': '镜像列表', icon: 'icon', showLink: false, roles: ["超级管理员", "运维管理员"],},
    },
    {
      path: '/docker/container',
      component: () => import('@/views/docker/container.vue'),
      name: 'docker_container',
      meta: {'title': '实例容器', icon: 'container', showLink: false, roles: ["超级管理员", "运维管理员"],},
    },
    {
      path: '/docker/imageDetail',
      component: () => import('@/views/docker/imageDetail.vue'),
      name: 'dockerImagesDetail',
      meta: {'title': '镜像详情', icon: 'icon', showLink: false, roles: ["超级管理员", "运维管理员"],},
    },
    {
      path: '/docker/imageAdd',
      component: () => import('@/views/docker/addImage.vue'),
      name: 'docker_image_add',
      meta: {'title': '添加镜像', icon: 'icon', showLink: false, roles: ["超级管理员", "运维管理员"],},
    },
    {
      path: '/docker/resource',
      component: () => import('@/views/docker/resource.vue'),
      name: 'docker_resource',
      meta: {'title': '资源中心', icon: 'docker_1', roles: ["超级管理员", "运维管理员"],},
    },

  ],
} satisfies RouteConfigsTable;
