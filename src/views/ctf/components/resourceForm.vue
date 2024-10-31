<template>
  <el-dialog
    :modelValue="open"
    :title="formData.id ? '编辑资源' : '添加资源'"
    center
    @close="cancel"
    width="40%"
  >
    <el-form :model="formData" ref="form" label-width="80px" >
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="加载类型" prop="docker_type" required>
        <el-select v-model="formData.docker_type">
          <el-option
            v-for="op in docker_type_list"
            :label="op.label"
            :key="op.id"
            :value="op.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="镜像名称" prop="image">
        <el-input v-model="formData.image"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description" :rows="5"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {onMounted, reactive, ref, watch} from 'vue';
import {http} from "@/utils/http";
import "mavon-editor/dist/css/index.css";
import {ElMessage} from "element-plus";

export default {
  name: "resourceForm",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
  },
  setup(props, {emit}) {
    const docker_type_list = ref([
      {label: "远程镜像", id: 1},
      {label: "本地镜像", id: 2},
    ]);
    const formData = reactive({
      id: null,
      name: '',
      docker_type: null,
      image: null,
      description: null,
    });

    watch(
      () => props.data,
      (newData) => {
        if (newData) {
          formData.id = newData.id;
          formData.docker_type = newData.docker_type;
          formData.image = newData.image;
          formData.description = newData.description;
          formData.name = newData.name;
        }
      },
      {immediate: true, deep: true}
    );

    const rules = {
      name: [
        {required: true, message: "请输入名称", trigger: "blur"},
        {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"},
      ],
      docker_type: [
        {required: true, message: "请选择加载类型", trigger: "change"},
      ],
      description: [
        {required: true, message: "请填写描述信息", trigger: "blur"},
        {min: 3, max: 200, message: "长度在 3 到 200 个字符", trigger: "blur"},
      ],
    };

    const cancel = () => {
      emit("action", false);
    };

    const submit = async () => {
      if (formData.id) {
        await http.put(`/api/admin/docker/resource/${formData.id}`, formData);
        emit("action", true);
        // 使用 ElMessage 而不是 this.$message
        ElMessage({message: "提交成功", type: "success"});
      }else{
        await http.post("/api/admin/docker/resource", formData);
        emit("action", true);
        // 使用 ElMessage 而不是 this.$message
        ElMessage({message: "提交成功", type: "success"});
      }
    };

    onMounted(() => {
      // 如果需要加载选项等可以在这里调用
    });

    return {
      docker_type_list,
      formData,
      rules,
      cancel,
      submit,
    };
  },
};
</script>

