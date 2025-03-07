<template>
  <div class="login">
    <el-form
      class="login-form"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRule"
      auto-complete="on"
      label-position="left"
    >
      <div class="login-title">
        <h1 class="title1">教师综合服务管理平台</h1>
        <h2 class="title2">(临沂实验中学临港校区)</h2>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <i class="iconfont">&#xe611;</i>
        </span>
        <el-input
          v-model="loginForm.account"
          name="account"
          type="text"
          tabindex="1"
          auto-complete="on"
          placeholder="账号"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont">&#xe60e;</i>
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          name="password"
          auto-complete="on"
          tabindex="2"
          show-password
          placeholder="密码"
        />
      </el-form-item>
      <div class="role"> 
          <el-radio v-model="loginForm.role" label="1" class="white-radio">管理员</el-radio>
          <el-radio v-model="loginForm.role" label="2" class="white-radio" >班主任</el-radio>
          <el-radio v-model="loginForm.role" label="3" class="white-radio" >教师</el-radio>
          <el-radio v-model="loginForm.role" label="4" class="white-radio" >学生</el-radio>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        class="login-btn"
        @click="_Login"
        >登 录</el-button
      >
    </el-form>
    <div style="position:absolute;bottom:0;width:100%;height:30px;">
      <div style="margin:0 auto;width:500px;text-align:center;display:flex;">
        <div style="margin-left:15px"> <a href="https://beian.miit.gov.cn" style="color:white;text-decoration:none">鲁ICP备20015200号-1</a></div>
        <div style="margin-left:40px;display:flex;">
          <img src="../../assets/备案图标.png" alt="备案">
          <a style="color:white;text-decoration:none;margin-left:3px" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37131202371616">鲁公网安备 37131202371616号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminLogin } from "@/api/api";
import { setLocalStorage } from "@/utils/local-storage";


export default {
  data() {
    const verifyPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error("密码长度应大于8位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        password: "",
        role:'1'
      },
      
      loginRule: {
        account: [
          {
            required: true,
            message: "账号不允许为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不允许为空",
            trigger: "blur",
          },
          { validator: verifyPassword, trigger: "blur" },
        ]
      },
      passwordType: "password",
      loading: false,
    };
  },
  methods: {
    _Login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid && !this.loading) {
          adminLogin(this.loginForm)
            .then((res) => {
              console.log(res)
              if (res.data.status == "200") {
                this.loading = true;
                document.cookie= `Id=${res.data.id}`;
                console.log('要跳了嘛')
                setLocalStorage({
                  Authorization: res.data.token,
                  account: res.data.account
                });
                this.$router.push({ path: "/" });
              }
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #2c3a4b;
$light_gray: #eee;
$cursor: #fff;

.login {
  .el-input {
    height: 46px;
    width: 85%;
    display: inline-block;
    font-size: 15px;
    input {
      height: 48px;
      background: transparent;
      border: none;
      padding: 12px 5px 12px 5px;
      color: $light_gray;

      // 改变历史密码选中的样式
      &:-webkit-autofill {
        -webkit-text-fill-color: $light_gray !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scope>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 540px;
    max-width: 100%;
    padding: 100px 30px 0;
    margin: 0 auto;
    overflow: hidden;
    .role{
      display: flex;
      justify-content: space-around;
      color: #fff;
    }
  }
  .login-btn {
    margin-top: 30px;
    width: 100%;
    font-size: 16px;
  }
  .svg-container {
    padding: 5px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .login-title {

    .title1 {
      font-size: 52px;
      color: $light_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
    .title2 {
      font-size: 35px;
      color: $light_gray;
      margin: 0px auto 60px auto;
      text-align: center;
      font-weight: bold;
    }
   
  }
   // 设置 el-radio 文字颜色为白色
  .white-radio .el-radio__label {
    color: white;
    font-size: 18px;
  }
}
</style>
