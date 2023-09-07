<template>
    <el-row align="middle"  type="flex" style="height: 100vh;background-color: #f3f3f3" justify="center" >
      <el-col >
        <div style="width: 600px;padding-bottom: 80px;margin: auto">
          <div class="title-container">
            <h3 class="title">
              <svg-icon style="font-size: 40px" class="title-logo" icon-class="logo"></svg-icon>
              <span class="title-txt">Ocean CTF</span></h3>
          </div>
          <div class="form" style="text-align: center">
            <el-form label-width="120px" label-position="left" >
              <el-form-item label="username">
                <el-input v-model="form.username" ></el-input>
              </el-form-item>
              <el-form-item label="password">
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item label="password">
                <el-input type="password" v-model="form.confirm_password"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: left;padding: 10px" v-if="errorMsg">
                <i class="el-icon-error" style="color: #F56C6C"></i><span style="font-weight: normal;font-size: 12px">{{errorMsg}}</span>
            </div>
            <el-button @click="submit" type="primary" size="middle" class="btn" >添加</el-button>
          </div>
        </div>

      </el-col>

    </el-row>


</template>

<script>
import request from "@/utils/request";

export default {
  name: "init",
  data(){
    return {
      errorMsg:null,
      form:{
        username:'',
        password:'',
        confirm_password:''
      }
    }
  },
  methods:{
    submit(){
      if(this.form.confirm_password!==this.form.password){
        this.errorMsg = "两次密码不一致、请重新输入！"
        return
      }
      request.post('/api/system/init',this.form).then(res=>{
        this.$router.push({name:'login'})
      }).catch(err=>{
        this.$router.push({name:'login'})
      })
    }
  }
}
</script>

<style scoped>
.title-container{
  font-size: 20px;
  margin-top: -100px;
  text-align: center;
}
.form{
  border-radius: 10px;
  padding: 40px;
  background-color: #ffffff;
  font-weight: bolder;
}
body {

  background: #f3f3f3;
  color: #333 !important;
}
.btn{
  padding: 8px 16px;
}
</style>


