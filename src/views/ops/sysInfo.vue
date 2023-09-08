<template>
  <div class="page-container">
    <div class="widget">
      <div class="tool-bar">系统配置</div>
      <el-row>
        <el-col :span="8">
          <div style="padding: 20px">
            <el-form label-width="120">
              <el-form-item label="出口IP">
                <el-input v-model="form.ip"></el-input>
              </el-form-item>
              <el-form-item label="Docker API">
                <el-input v-model="form.docker_api"></el-input>
              </el-form-item>
              <el-form-item label="开放端口范围">
                <el-input v-model="form.port_range"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: center;margin-top: 20px">
              <el-button @click="setConfig" type="primary" style="padding: 8px 12px">保存</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import {http} from "@/utils/http";

export default {
  name: "sysInfo",
  data() {
    return {
      form: {
        port_range:null,
        ip: null,
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      http.get('/api/admin/config').then(res=>{
        this.form.ip = res.data.ip
        this.form.docker_api = res.data.docker_api
        this.form.port_range = res.data.port_range
      })
    },
    setConfig() {
      http.post("/api/admin/config",this.form).then(res=>{
        this.$message({message:"保存成功",type:"success"})
        this.getConfig()
      })
    }
  }
}
</script>

<style scoped>

</style>
