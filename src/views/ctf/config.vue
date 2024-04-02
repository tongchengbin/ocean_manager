<template>
<div class="page-container">
  <div class="widget">
    <div class="tool-bar">赛事配置</div>
    <el-row>
      <el-col :span="6">
        <div style="padding: 20px">
          <el-form inline>
            <el-form-item label="容器时长(秒)">
              <el-input-number v-model="ctf_container_seconds"></el-input-number>
            </el-form-item>
          </el-form>
          <div style="text-align: left;margin-top: 20px">
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
name: "ctf",
  data(){
    return {
      ctf_timeout:180
    }
  },
  created() {
    this.getConfig()
  },
  methods:{
    getConfig(){
      http.get('/api/admin/config').then(res=>{
        this.ctf_timeout = res.data.ctf_timeout || 180
      })
    },
    setConfig(){
      let data ={
        ctf_timeout:this.ctf_timeout
      }
      http.post('/api/admin/config',data).then(res=>{
          this.$message({
            type:"success",
            message:"保存成功"
          })
        this.getConfig()
      })
    }

  }
}
</script>

<style scoped>

</style>
