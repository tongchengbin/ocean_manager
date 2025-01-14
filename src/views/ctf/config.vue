<template>
  <div class="main">
    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">赛事配置</p>
      </div>
      <div class="p-4">
        <el-form class="config-form" label-width="120px">
          <el-form-item label="容器时长(秒)" class="mb-4">
            <el-input-number 
              v-model="ctf_timeout"
              :min="60"
              :max="3600"
              :step="60"
              class="w-[200px]"
            />
          </el-form-item>
          <el-form-item label="题目仓库" class="mb-4">
            <el-input 
              v-model="ctf_repository"
              placeholder="请输入题目仓库地址"
              class="w-[400px]"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setConfig">保存配置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/utils/http";

export default {
  name: "ctf",
  data() {
    return {
      ctf_repository: '',
      ctf_timeout: 180
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      http.get('/api/admin/config').then(res => {
        this.ctf_timeout = res.data.ctf_timeout || 180
        this.ctf_repository = res.data.ctf_repository
      })
    },
    setConfig() {
      const data = {
        ctf_timeout: this.ctf_timeout,
        ctf_repository: this.ctf_repository
      }
      http.post('/api/admin/config', data).then(() => {
        this.$message({
          type: "success",
          message: "配置保存成功",
          duration: 2000
        })
        this.getConfig()
      })
    }
  }
}
</script>

<style lang="scss">
.config-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
  
  :deep(.el-input-number) {
    width: 200px;
  }
}
</style>
