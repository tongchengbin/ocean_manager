<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">系统配置</div>
      <el-row>
        <el-col span="12">
          <div style="padding: 20px">
            <el-form simi="mini" inline>
              <el-form-item label="出口IP">
                <el-input v-model="form.ip"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: left;margin-top: 20px">
              <el-button @click="setConfig" type="primary" size="middle" style="padding: 8px 12px">保存</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "sysInfo",
  data() {
    return {
      form: {
        ip: null,
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      request.get('/api/system/config').then(res=>{
        this.form.ip = res.data.ip || "127.0.0.1"
      })
    },
    setConfig() {
      request.post("/api/system/config",this.form).then(res=>{

      })
    }
  }
}
</script>

<style scoped>

</style>
