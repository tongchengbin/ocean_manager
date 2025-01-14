<template>
  <div class="main">
    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">系统配置</p>
      </div>
      <div class="p-4">
        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="140px"
          class="config-form"
        >
          <el-form-item 
            label="出口IP" 
            prop="ip"
            class="mb-4"
          >
            <el-input 
              v-model="form.ip"
              placeholder="请输入出口IP"
              class="w-[400px]"
            />
          </el-form-item>
          <el-form-item 
            label="Docker API" 
            prop="docker_api"
            class="mb-4"
          >
            <el-input 
              v-model="form.docker_api"
              placeholder="请输入Docker API地址"
              class="w-[400px]"
            />
          </el-form-item>
          <el-form-item 
            label="开放端口范围" 
            prop="port_range"
            class="mb-4"
          >
            <el-input 
              v-model="form.port_range"
              placeholder="请输入开放端口范围"
              class="w-[400px]"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSubmit"
            >
              保存配置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import { ElMessage } from "element-plus";

export default {
  name: "sysInfo",
  data() {
    return {
      form: {
        port_range: null,
        ip: null,
        docker_api: null
      },
      rules: {
        ip: [
          { required: true, message: '请输入出口IP', trigger: 'blur' }
        ],
        docker_api: [
          { required: true, message: '请输入Docker API地址', trigger: 'blur' }
        ],
        port_range: [
          { required: true, message: '请输入开放端口范围', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      try {
        const res = await http.get('/api/admin/config')
        this.form = {
          ip: res.data.ip,
          docker_api: res.data.docker_api,
          port_range: res.data.port_range
        }
      } catch (error) {
        ElMessage.error(error.message || '获取配置失败')
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        
        await http.post("/api/admin/config", this.form)
        ElMessage({
          type: 'success',
          message: '保存成功',
          duration: 2000
        })
        this.getConfig()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '保存失败')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.config-form {
  max-width: 800px;
  margin: 0 auto;
  
  .el-form-item {
    margin-bottom: 22px;
  }
}
</style>
