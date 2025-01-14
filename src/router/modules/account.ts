const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/account",
  name: "Account",
  component: Layout,
  redirect: "/account/list",
  meta: {
    icon: "homeFilled",
    title: "首页",
  },
  children: [
    {
      path: "/account/list",
      name: "account_list",
      component: () => import("@/views/account/user.vue"),
      meta: {
        title: "用户列表"
      }
    }
  ]
} satisfies RouteConfigsTable;
