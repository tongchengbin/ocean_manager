const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/dashboard",
  meta: {
    icon: "ep:home-filled",
    title: "首页",
    rank: 0,
    roles: ["超级管理员"]
  },
  children: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        roles: ["超级管理员"],
        title: "首页",
        showLink: VITE_HIDE_HOME !== "true"
      }
    }
  ]
} satisfies RouteConfigsTable;
