import request from "../utils/request";

// 登录
const login = "/admin/login";
export function adminLogin(data) {
  return request({
    url: login,
    method: "post",
    data: data,
  });
}



// 获取学生分数
const grades = "/admin/analyze/getGradeList";
export function getGradeList(query) {
  return request({
    url: grades,
    method: "get",
    params: query,
  });
}

// 进行成绩分析
const analyzeParams = "/admin/analyze/postAnalyzeParams";
export function adminAnalyzeParams(data) {
  return request({
    url: analyzeParams,
    method: "post",
    data: data,
  });
}

// 获取教师数据
const teacherList = "/admin/analyze/getTeacherList";
export function getTeacherList(query) {
  return request({
    url: teacherList,
    method: "get",
    params: query,
  });
}



// 后台管理，密码重置
const reset = "/admin/reset";
export function adminReset(data) {
  return request({
    url: reset,
    method: "put",
    data: data,
  });
}
// 后台管理，注册管理员

const register = "/admin/register";
export function adminRegister(data) {
  return request({
    url: register,
    method: "post",
    data: data,
  });
}
