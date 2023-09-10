<template>
  <el-dialog  :before-close="cancel" :show-close="true" :title="form.id? '编辑题目':'添加题目'" v-model="visible"
             width="40%">
    <el-form :model="form" ref="form" class="form" label-width="80px" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-select v-model="form.type">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="block-input" label="是否激活">
        <el-switch v-model="form.active"></el-switch>
      </el-form-item>
      <el-form-item class="block-input" label="动态Flag">
        <el-switch v-model="form.active_flag" @change="changeActiveFlag"></el-switch>
      </el-form-item>
      <el-form-item required v-if="form.active_flag" class="block-input" label="环境" prop="resource_id">
        <el-select v-model="form.resource_id" clearable>
          <el-option
            v-for="item in resource_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else class="block-input" label="Flag" prop="flag">
        <el-row>
          <el-col :span="20">
            <el-input v-model="form.flag"></el-input>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" type="textarea"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="积分" required>
            <el-input v-model="form.score" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件">
        <input id="inputFile" ref="inputer" style="display: none" type="file" @change="handleFile" />
        <el-button type="primary" @click="handleFileClick">上传</el-button>
        <div style="width: 300px;">
          <div v-for="(item,index) in attachment" class="file-item">
            <a :href="item.filename" target="_blank">{{ item.filename }}</a>
            <i class="el-icon-close" @click="removeFile(index)"></i>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
    <el-button  @click="cancel">取 消</el-button>
    <el-button  type="primary" @click="submit">确 定</el-button>
  </template>
  </el-dialog>

</template>

<script>
import {http} from "@/utils/http";


export default {
  name: "addQuestion",
  props: {
    show: Boolean,
    data:Object
  },

  data() {
    return {
      visible:false,
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
  watch: {
    show(newVal) {
      this.visible = newVal
    },
    data:{
      handler(newVal){
        if(newVal){
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
          if(this.data.attachment && this.data.attachment.length>0){
            this.attachment = this.form.attachment
          }
        }
      },
      deep:true
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
      // 处理附件
      this.form.attachment =[]
      for(let i=0;i<this.attachment.length;i++){
        this.form.attachment.push(this.attachment[i].uuid)
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            http.put(`/api/admin/ctf/question/${this.form.id}`, this.form).then(_ => {
              this.$emit('action', true)
              this.$message({message:"提交成功",type:"success"})
            }).catch(_ => {

            })

          } else {
            http.post('/api/admin/ctf/question', this.form).then(_ => {
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
      http.post('/api/admin/ctf/upload', formData).then(res => {
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
