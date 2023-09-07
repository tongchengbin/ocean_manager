<template>
  <el-dialog v-if="show" :before-close="cancel" :show-close="true" :title="form.id? '编辑资源':'添加资源'" :visible.sync="show"
             center destroy-on-close :close-on-click-modal="false"
             @close="cancel" width="40%">
    <el-form :model="form" ref="form" class="form" label-width="80px" :rules="rules">
      <el-form-item label="资源名称" docker_type_list>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="加载类型" required>
        <el-select  v-model="form.docker_type">
          <el-option v-for="op in docker_type_list" :label="op.label" :key="op.id" :value="op.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="镜像名称">
        <el-input v-model="form.image"></el-input>
      </el-form-item>
      <el-form-item label="描述">
<!--        <el-input v-model="form.description"></el-input>-->
        <div id="my-markdown" class="markdown-body">
          <mavon-editor v-model="form.description"/>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button  @click="cancel">取 消</el-button>
    <el-button  type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>

</template>

<script>
import {http} from "@/utils/http";
import  {mavonEditor}  from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


export default {
  components:{
    mavonEditor
  },
  name: "addQuestion",
  props: {
    show: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      docker_type_list:[
        {
          label: "远程镜像",
          id: 1
        }
      ],
      resource_list:[],
      hostOption: [],
      imageOption: [],
      capture: null,
      fileChange: false,
      options: [],
      attachment:[], // 临时附件对象
      form: {
        attachment: [],
        docker_type: null,
        image: null,
        name: null,
        description: null,
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择类别', trigger: 'blur'},
        ],
        desc: [
          {required: true, message: '请填写描述信息', trigger: 'blur'},
          {min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur'}
        ],
        flag:[
          {required: true, message: '请输入flag', trigger: 'blur'},
          {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'}

        ],
      },

    }
  },
  created() {
    this.getOptions()
    this.getResourceList()
  },
  methods: {
    getOptions() {
      http.get('/api/admin/ctf/question/type').then(res => {
        this.options = res.data;
      })
    },
    getResourceList(){
      http.get('/api/admin/docker/resource',{"page_size":99999,"status":1}).then(res=>{
        this.resource_list = res.data
      })
    },
    getDockerHost() {
      http.get('/api/admin/docker/host', {'page_size': 999}).then(res => {
        this.hostOption = res.data;
      })
    },
    cancel() {
      this.$emit('action', false)
    },
    submit() {
      if(this.form.id){

      }else{
        http.post(`/api/admin/vuln`,this.form).then(res=>{
          this.$emit('action', true)
          this.$message({message:"提交成功",type:"success"})
        })
      }
    },
  },

}

</script>

<style lang="scss" scoped>
.form {
  margin: auto;
}

.block-input :deep(.el-form-item__content) {
  width: 100% !important;
}

.block-input {
  width: 100% !important;

  input {
    width: 100%;
  }
}

.file-item {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-top: 5px;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
}

.file-item a {
  color: #606266;
  display: block;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color .3s;
  white-space: nowrap;
}

.file-item i {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  cursor: pointer;
  opacity: 1;
  color: #409eff;
}

.file-item:hover {
  background-color: #f5f7fa;
}
</style>

