// import "@/utils/sso";
import { getConfig } from "@/config";
import NProgress from "@/utils/progress";
import { sessionKey, type DataInfo } from "@/utils/auth";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import {
  Router,
  createRouter,
  RouteRecordRaw,
  RouteComponent
} from "vue-router";
import {
  ascending,
  getTopMenu,
  initRouter,
  isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import { buildHierarchyTree } from "@/utils/tree";
import { isUrl, openLink, storageSession, isAllEmpty } from "@pureadmin/utils";



/** 原始静态路由（未做任何处理） */
const routes = [];
const Layout = () => import("@/layout/index.vue");

export const remainingRouter: Array<RouteConfigsTable> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
]

export const asyncRouterMap: RouteConfigsTable[] = [
  {
    path: "/error",
    redirect: "/error/403",
    meta: {
      icon: "informationLine",
      title: "异常页面",
      showLink: false,
      rank: 9
    },
    children: [
      {
        path: "/error/403",
        name: "403",
        component: () => import("@/views/error/403.vue"),
        meta: {
          title: "403"
        }
      },
      {
        path: "/error/404",
        name: "404",
        component: () => import("@/views/error/404.vue"),
        meta: {
          title: "404"
        }
      },
      {
        path: "/error/500",
        name: "500",
        component: () => import("@/views/error/500.vue"),
        meta: {
          title: "500"
        }
      }
    ]
  },
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/dashboard",
    meta: {
      icon: "uiw:dashboard",
      title: "首页",
      rank: 0,
    },
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "首页",
          showLink: true,
          roles: ["超级管理员","运维管理员","审计员","访客"],
        }
      }
    ]
  },
  {
    path: "/account",
    name: "account",
    component: Layout,
    redirect: "/account/list",
    meta: {
      icon: "homeFilled",
      title: "用户管理",
      rank: 0
    },
    children: [
      {
        path: "/account/list",
        name: "account_list",
        component: () => import("@/views/account/user.vue"),
        meta: {
          title: "用户列表",
          roles: ["超级管理员","运维管理员","审计员","访客"],
        }
      }
    ]
  },
  {
    path:"/ctf",
    name: "ctf",
    component:Layout,
    redirect:"/ctf/question",
    meta:{
      icon: "IF-icon-tag",
      title:"CTF",
      rank:0
    },
    children:[
      {
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
      },
    ]

  },
  {
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
  },
  {
    path:'/docker',
    name: 'docker',
    component: Layout,
    meta:{
      title:'虚拟化管理',
      icon: 'teenyicons:docker-outline'
    },
    children: [
      // {
      //   path: '/docker/host',
      //   name: 'now',
      //   component: () => import('@/views/docker/host.vue'),
      //   meta: {'title': '容器管理', icon: 'docker_1'},
      // },
      {
        path: '/docker/dockerHostDetail',
        component: () => import('@/views/docker/hostDetail.vue'),
        name: 'dockerHostDetail',
        meta: {'title': '容器主机详情', icon: 'host'},
      },
      {
        path: '/docker/image',
        component: () => import('@/views/docker/images.vue'),
        name: 'docker_image',
        meta: {'title': '镜像列表', icon: 'icon' ,showLink:false},
      },
      {
        path: '/docker/container',
        component: () => import('@/views/docker/container.vue'),
        name: 'docker.container',
        meta: {'title': '实例容器', icon: 'container', showLink:false,          roles: ["超级管理员","运维管理员"],},
      },
      {
        path: '/docker/imageDetail',
        component: () => import('@/views/docker/imageDetail.vue'),
        name: 'dockerImagesDetail',
        meta: {'title': '镜像详情', icon: 'icon' ,showLink:false,roles: ["超级管理员","运维管理员"],},
      },
      {
        path: '/docker/imageAdd',
        component: () => import('@/views/docker/addImage.vue'),
        name: 'docker_image_add',
        meta: {'title': '添加镜像', icon: 'icon' ,showLink:false,roles: ["超级管理员","运维管理员"],},
      },
      {
        path: '/docker/resource',
        component: () => import('@/views/docker/resource.vue'),
        name: 'docker_resource',
        meta: {'title': '资源中心', icon: 'docker_1'},
      },

    ],
  },
  {
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
        name: 'ops.operator',
        meta: {title: '审计日志' }
      }]
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
  },
  {
    path: '/system',
    component: Layout,
    meta: {title: "系统设置",icon: 'dashicons:admin-generic'},
    children: [
      {
        path: '/system/admin',
        component: () => import('@/views/system/admins.vue'),
        name: '系统管理员',
        meta: {title: '管理员列表', icon: '',roles: ["超级管理员"],}
      }]
  },

  {
    path: '/notice',
    component: Layout,
    meta: {title: "公告提醒",icon: 'zondicons:announcement'},
    children: [{
      path: '/notice/index',
      component: () => import('@/views/notice/index.vue'),
      name: 'notice_index',
      meta: {title: '公告提醒', icon: 'zondicons:announcement'}
    }]
  },
]

for(let i = 0; i < asyncRouterMap.length; i++) {
    routes.push(asyncRouterMap[i])
}

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(
  routes.flat(Infinity)
).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(
          buildHierarchyTree(ascending(routes.flat(Infinity)))
        )
      );
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

/** 路由白名单 */
const whiteList = ["/login"];

const { VITE_HIDE_HOME } = import.meta.env;

router.beforeEach((to: ToRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to);
    }
  }
  const userInfo = storageSession().getItem<DataInfo<number>>(sessionKey);
  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title) document.title = `${item.meta.title} | ${Title}`;
      else document.title = item.meta.title as string;
    });
  }
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
  }
  if (userInfo) {
    // 无权限跳转403页面
    if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
      next({ path: "/error/403" });
    }
    // 开启隐藏首页后在浏览器地址栏手动输入首页welcome路由则跳转到404页面
    if (VITE_HIDE_HOME === "true" && to.fullPath === "/welcome") {
      next({ path: "/error/404" });
    }
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        toCorrectRoute();
      }
    } else {
      // 刷新
      if (
        usePermissionStoreHook().wholeMenus.length === 0 &&
        to.path !== "/login"
      ) {
        initRouter().then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const { path } = to;
            const route = findRouteByPath(
              path,
              router.options.routes[0].children
            );
            getTopMenu(true);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                // 此处为动态顶级路由（目录）
                const { path, name, meta } = route.children[0];
                useMultiTagsStoreHook().handleTags("push", {
                  path,
                  name,
                  meta
                });
              } else {
                const { path, name, meta } = route;
                useMultiTagsStoreHook().handleTags("push", {
                  path,
                  name,
                  meta
                });
              }
            }
          }
          // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
          if (isAllEmpty(to.name)) router.push(to.fullPath);
        });
      }
      toCorrectRoute();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
