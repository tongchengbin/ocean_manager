<template>
  <el-dialog
    :modelValue="open"
    :title="formData.id ? '编辑资源' : '添加资源'"
    @close="cancel"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form 
      :model="formData" 
      :rules="rules"
      ref="formRef" 
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="资源名称" prop="name" required>
        <el-input 
          v-model="formData.name" 
          placeholder="请输入资源名称"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="加载类型" prop="docker_type" required>
        <el-select 
          v-model="formData.docker_type" 
          placeholder="请选择加载类型"
          style="width: 100%"
        >
          <el-option
            v-for="op in docker_type_list"
            :label="op.label"
            :key="op.id"
            :value="op.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="镜像名称" prop="image" required>
        <el-input 
          v-model="formData.image" 
          placeholder="例如: nginx:latest 或 tongchengbin/easy_web"
          clearable
        >
          <template #prepend>
            <el-icon><Box /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input 
          type="textarea" 
          v-model="formData.description" 
          :rows="5"
          placeholder="请输入资源描述信息"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">
          {{ loading ? '提交中...' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue';
import { http } from "@/utils/http";
import { ElMessage } from "element-plus";
import { Box } from '@element-plus/icons-vue';

export default {
  name: "resourceForm",
  components: {
    Box
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const formRef = ref(null);
    const loading = ref(false);
    
    const docker_type_list = ref([
      { label: "远程镜像", id: 1 },
      { label: "本地镜像", id: 2 },
    ]);
    
    const formData = reactive({
      id: null,
      name: '',
      docker_type: null,
      image: null,
      description: null,
      resource_type: 'CTF', // CTF 资源类型
    });

    // 表单验证规则
    const rules = {
      name: [
        { required: true, message: "请输入资源名称", trigger: "blur" },
        { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
      ],
      docker_type: [
        { required: true, message: "请选择加载类型", trigger: "change" },
      ],
      image: [
        { required: true, message: "请输入镜像名称", trigger: "blur" },
        { 
          pattern: /^[a-zA-Z0-9\/_\-.:]+$/,
          message: "镜像名称格式不正确",
          trigger: "blur"
        },
      ],
      description: [
        { min: 0, max: 200, message: "描述不能超过 200 个字符", trigger: "blur" },
      ],
    };

    // 重置表单 - 必须在 watch 之前定义
    const resetForm = () => {
      formData.id = null;
      formData.name = '';
      formData.docker_type = null;
      formData.image = null;
      formData.description = null;
      formData.resource_type = 'CTF'; // 保持资源类型
      
      // 清除验证
      if (formRef.value) {
        formRef.value.clearValidate();
      }
    };

    // 监听数据变化
    watch(
      () => props.data,
      (newData) => {
        if (newData && Object.keys(newData).length > 0) {
          formData.id = newData.id;
          formData.docker_type = newData.docker_type;
          formData.image = newData.image;
          formData.description = newData.description;
          formData.name = newData.name;
          formData.resource_type = newData.resource_type || 'CTF';
        } else {
          // 重置表单
          resetForm();
        }
      },
      { immediate: true, deep: true }
    );

    // 取消操作
    const cancel = () => {
      resetForm();
      emit("action", false);
    };

    // 提交表单
    const submit = async () => {
      if (!formRef.value) return;
      
      try {
        // 验证表单
        await formRef.value.validate();
        
        loading.value = true;
        
        if (formData.id) {
          // 编辑
          await http.put(`/api/admin/docker/resource/${formData.id}`, formData);
          ElMessage({
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        } else {
          // 新增
          await http.post("/api/admin/docker/resource", formData);
          ElMessage({
            message: "添加成功",
            type: "success",
            duration: 2000
          });
        }
        
        resetForm();
        emit("action", true);
      } catch (error) {
        // 表单验证失败
        if (error === 'cancel') {
          return;
        }
        // HTTP 请求错误已经在拦截器中处理并显示了,这里不需要再显示
        // 只记录错误日志用于调试
        console.error('提交失败:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // 初始化操作
    });

    return {
      formRef,
      loading,
      docker_type_list,
      formData,
      rules,
      cancel,
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__prepend) {
  padding: 0 10px;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}
</style>
