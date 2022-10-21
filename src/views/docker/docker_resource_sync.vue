<template>
<el-dialog width="600px" :visible.sync="open" title="资源同步">
  <el-form >
    <el-alert
              title="如果github地址无法访问请自行配置代理或克隆文件至其他站点!"
              type="info"
              :closable="false">
    </el-alert>
    <el-form-item required label="同步地址">
        <el-input size="mini" v-model="form.url"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" >
    <el-button size="mini" @click="$emit('close',false)">取消</el-button>
    <el-button size="mini" type="primary" @click="submit">{{ form.id ?'更新':'提交'}}</el-button>
  </div>
</el-dialog>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "docker_resource_sync",
  props:{
    open:Boolean
  },
  data(){
    return {
      form:{
        url:"https://raw.githubusercontent.com/tongchengbin/ctfdb/main/resources.yaml",
      },
    }
  },
  methods:{
    submit(){
      request.post('/api/admin/docker/resource/sync',this.form).then(res=>{
        this.$message({
          message:"同步成功",
          type:"success"
        })
        this.$emit("close")
      }).catch(err=>{

      })
    }
  }
}
</script>

<style scoped>

</style>
