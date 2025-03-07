"use strict";

// 后台管理系统路由引入
import adminLogin from "./admin/login.js";
import adminGradeAnalyze from "./admin/grade-analyze.js";


export default (app) => {

  //后台管理系统 (第二个参数都是路由中间件)

  app.use("/admin", adminLogin);
  app.use("/admin", adminGradeAnalyze);

};
