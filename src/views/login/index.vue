<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" :model="loginForm">
      <div class="title-container">
        <h3 class="title">
          <svg-icon class="title-logo" icon-class="logo"></svg-icon>
          <span class="title-txt">Ocean CTF</span></h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          name="password"
          :type="passwordType"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
/*      <div style="color: #fff;margin-bottom: 10px">测试账号：test ：test</div>*/
        <el-button
          type="primary"
          style="width:100%;margin-bottom:30px;"
          :loading="loading"
          @click.native.prevent="handleLogin">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { setToken } from '@/utils/auth'
import request from "@/utils/request";
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.check()
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    check(){
      request.get("/api/system/check").then(res=>{
        if(!res.data.init){
          this.$message({
            type:"info",
            message:"即将跳转初始化"
          })
          this.$router.push({name:"init"})
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.loading = true;
      let data ={
        "username":this.loginForm.username,
        "password":this.loginForm.password
      }
      login(data).then(res=>{
        setToken(res.token)
        this.$message({message:"登录成功",type:"success"})
        this.$router.push({ path: '/' })
      }).catch(_=>{
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      margin-bottom: 22px!important;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      @media screen and (max-width: 480px) {
        width: 100%;
      }
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0 auto 40px auto;
        text-align: center;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
  .title .title-logo{
    font-size: 40px;
  }
  .title .title-txt{
    font-size: 26px;
  }
</style>
<style>
.login-container{
  background-image: url("../../assets/a1.jpg");
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
}
</style>
