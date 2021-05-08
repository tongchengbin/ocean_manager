<template>
  <el-form size="mini">
    <el-form-item label="当前密码">
      <el-input v-model.trim="oldPass" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="pass" />
    </el-form-item>
    <el-form-item label="确认新密码">
      <el-input v-model.trim="pass2" />
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import request from "@/utils/request";

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data(){
    return {
      oldPass:"",
      pass:"",
      pass2:""
    }
  },
  created() {
    console.log("rest",this.user)
  },
  methods: {
    submit() {
      if(!this.pass || this.pass!==this.pass2){
        this.$message.error({message:"请确认两次密码是否一致!"})
        return
      }

      let data={
        old_pass:this.oldPass,
        pass:this.pass,
      }
      request.post('/api/admin/rest_pass',data).then(res=>{
        this.$message.success("密码修改成功")
        this.oldPass = this.pass = this.pass2 = ''
      }).catch(err=>{

      })
    }
  }
}
</script>
