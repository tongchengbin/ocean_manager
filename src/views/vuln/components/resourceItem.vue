<template>
  <el-dialog v-if="show" :before-close="cancel" :show-close="true" :title="form.id? '编辑资源':'添加资源'" :visible.sync="show"
             center destroy-on-close :close-on-click-modal="false"
             @close="cancel" width="40%">
    <el-form :model="form" ref="form" class="form" label-width="80px" size="mini" :rules="rules">
      <el-form-item label="资源名称" docker_type_list>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="加载类型" required>
        <el-select size="mini" v-model="form.docker_type">
          <el-option v-for="op in docker_type_list" :label="op.label" :key="op.id" :value="op.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="镜像名称">
        <el-input v-model="form.image"></el-input>
      </el-form-item>
      <el-form-item label="描述">
<!--        <el-input v-model="form.description"></el-input>-->
        <div id="my-markdown" class="markdown-body">
          <vue-markdown :source="form.desc"></vue-markdown>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="cancel">取 消</el-button>
    <el-button size="mini" type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>

</template>

<script>
import request from "@/api/public";
import VueMarkdown from 'vue-markdown';

export default {
  components:{
    VueMarkdown
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
        resource_id: null,
        name: null,
        flag: null,
        desc: null,
        score: null,
        type: null,
        active: true,
        active_flag: false,
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
    if (this.data.id) {
      this.form.id = this.data.id;
      this.form.name = this.data.name;
      this.form.flag = this.data.flag;
      this.form.desc = this.data.desc;
      this.form.active_flag = this.data.active_flag;
      this.form.type = this.data.type;
      this.form.active = this.data.active;
      this.form.score = this.data.score;
      this.form.resource_id = this.data.resource_id;
      if (this.form.active) {
        this.getDockerHost()
      }
      if(this.data.attachment.length>0){
        this.attachment = this.form.attachment
      }
    }

  },
  methods: {
    getOptions() {
      request.get('/api/admin/ctf/question/type').then(res => {
        this.options = res.data;
      })
    },
    getResourceList(){
      request.get('/api/admin/docker/resource',{"page_size":99999,"status":1}).then(res=>{
        this.resource_list = res.data
      })
    },
    getDockerHost() {
      request.get('/api/admin/docker/host', {'page_size': 999}).then(res => {
        this.hostOption = res.data;
      })
    },
    cancel() {
      this.$emit('action', false)
    },
    submit() {
      // 处理附件
      this.form.attachment =[]
      for(let i=0;i<this.attachment.length;i++){
        this.form.attachment.push(this.attachment[i].uuid)
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            request.put(`/api/admin/ctf/question/${this.form.id}`, this.form).then(_ => {
              this.$emit('action', true)
              this.$message({message:"提交成功",type:"success"})
            }).catch(_ => {

            })

          } else {
            request.post('/api/admin/ctf/question', this.form).then(_ => {
              this.$emit('action', true)
            }).catch(_ => {
            })
          }
        }else{
          console.log("表单验证失败")
        }
      })
    },
    handleFileClick() {
      document.getElementById('inputFile').click()
    },
    changeActiveFlag(e) {
      if (e) {
        this.getDockerHost()
      }

    },
    removeFile(index) {
      this.fileChange = true;
      this.attachment.splice(index, 1)
    },
    handleFile() {
      let inputDOM = this.$refs.inputer;
      let file = inputDOM.files[0];
      let formData = new FormData();
      formData.append("file", file);  //文件上传处理
      request.post('/api/admin/ctf/upload', formData).then(res => {
        this.fileChange = true
        let { uuid,filename } = res
        this.attachment.push({
          uuid:uuid,
          filename: filename
        });
      })
    }
  },

}

</script>

<style lang="scss" scoped>
.form {
  margin: auto;
}

.block-input > > > .el-form-item__content {
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

<style>
@import 'github-markdown-css/github-markdown.css';
.markdown-body {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 40px;
}
</style>
