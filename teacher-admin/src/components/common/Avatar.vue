<template>
    <el-dropdown>
      <span style="font-size:16px;font-weight:bold;cursor: pointer;">{{getName()}}  </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
 
</template>

<script>

import { removeLocalStorage, getLocalStorage } from '@/utils/local-storage.js'


export default {
    data(){
      return {
        role:''
      }
    },
    created() {
        this.role = window.localStorage.getItem("role");
    },
    methods:{
        exit(){
          removeLocalStorage('Authorization')
          removeLocalStorage('role');
          this.$router.push({name:'login'})
          
        },
        // 修改密码
        resetPassword(){
           this.$router.push({name:'resetpwd'})
        },
        // 个人中心
        forgetPassword(){
           this.$router.push({name:'forgetpwd'})

        },
        getName(){
          return getLocalStorage("account").account
        }
        
    }
};
</script>

<style>

</style>