import Vue from "vue";
import VueRouter from "vue-router";
import { getLocalStorage } from "@/utils/local-storage";

import Home from "../views/home";
import Login from "../views/login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { login: true },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },

  {
    path: "/dashboard",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("../views/dashboard"),
      },
    // 多班对比
      {
        path: "/grade-analyze/many-class",
        name: "ManyClass",
        component: () => import("../views/analyze/many-class.vue"),
        meta: {
          Cname: "成绩分析",
          cname: "多班多学科对比",
        },
      },
      {
        path: "/grade-analyze/many-school",
        name: "ManySchool",
        component: () => import("../views/analyze/many-school.vue"),
        meta: {
          Cname: "成绩分析",
          cname: "多校多学科对比",
        },
      },
        // 密码修改
        {
          path: "/reset",
          name: "Reset",
          component: () => import("../views/system/reset.vue"),
        },
        // 管理员注册
        {
          path: "/register",
          name: "Register",
          component: () => import("../views/system/register.vue"),
        },
   

    //   /**
    //    * 微医-医疗支撑- 图书管理
    //    */
    //   {
    //     path: "/weiyi/managebook",
    //     name: "weiyiBookList",
    //     component: () => import("../views/books/manageBook.vue"),
    //     meta: {
    //       Cname: "微医-图书管理",
    //       cname: "图书管理",
    //     },
    //   },
    //   {
    //     path: "/weiyi/userintegral",
    //     name: "weiyiUserIntegral",
    //     component: () => import("../views/books/userIntegral.vue"),
    //     meta: {
    //       Cname: "微医-图书管理",
    //       cname: "用户积分",
    //     },
    //   },
    //   /**
    //    *  音视频通话，支持文本，语音，视频，白板
    //    */ {
    //     path: "/chat/singlechat",
    //     name: "chatSingleChat",
    //     component: () => import("../views/chat/single"),
    //     meta: {
    //       Cname: "聊天",
    //       cname: "单聊·音视频聊天",
    //     },
    //   },
    //   // 问题管理
    //     {
    //       path: "/question/manage",
    //       name: "questionManage",
    //       component: () => import("../views/questions/questionList.vue"),
    //       meta: {
    //         Cname: "教招学习",
    //         cname: "问题管理"
    //       },
    //     },
    //   // 问题管理
    //      {
    //       path: "/question/practice",
    //       name: "questionPractice",
    //       component: () => import("../views/questions/questionPractice.vue"),
    //       meta: {
    //         Cname: "教招学习",
    //         cname: "问题练习"
    //       },
    //     },
    ],
  },
];

const router = new VueRouter({
  mode: "hash", //上线打包改为history
  routes,
});
// 路由前置守卫
router.beforeEach((to, from, next) => {
  const { Authorization } = getLocalStorage("Authorization");
  // 回来注释
  // const { account } = getLocalStorage("account");
  // if(account !== 'fujinting') return

  //如果没有token，并且不是登录页,跳转到登录页
  if (!Authorization) {
    if (!to.meta.login) {
      next({ name: "login" });
      return;
    }
  }
  next();
});

export default router;
