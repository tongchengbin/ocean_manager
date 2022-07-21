<template>
  <el-dialog v-if="show" :before-close="cancel" :show-close="true" :title="form.id? '编辑题目':'添加题目'" :visible.sync="show"
             center destroy-on-close :close-on-click-modal="false"
             @close="cancel" width="40%">
    <el-form :model="form" ref="form" class="form" label-width="80px" size="mini" :rules="rules">
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
      <el-form-item v-if="form.active_flag" class="block-input" label="主机" prop="image_id">
        <el-select v-model="form.host_id" clearable @change="handleChangeHost">
          <el-option
            v-for="item in hostOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="form.image_id" clearable filterable>
          <el-option
            v-for="item in imageOption"
            :key="item"
            :label="item"
            :value="item">
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
          <el-form-item label="积分">
            <el-input v-model="form.score" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件">
        <input id="inputFile" ref="inputer" style="display: none" type="file" @change="handleFile"></input>
        <el-button type="primary" @click="handleFileClick">上传</el-button>
        <div style="width: 300px;">
          <div v-for="(item,index) in attachment" class="file-item">
            <a :href="item.filename" target="_blank">{{ item.filename }}</a>
            <i class="el-icon-close" @click="removeFile(index)"></i>
          </div>
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


export default {
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
      hostOption: [],
      imageOption: [],
      capture: null,
      fileChange: false,
      options: [],
      attachment:[], // 临时附件对象
      form: {
        attachment: [],
        host_id: null,
        image_id: null,
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
    if (this.data.id) {
      this.form.id = this.data.id;
      this.form.name = this.data.name;
      this.form.flag = this.data.flag;
      this.form.desc = this.data.desc;
      this.form.active_flag = this.data.active_flag;
      this.form.type = this.data.type;
      this.form.active = this.data.active;
      this.form.score = this.data.score;
      this.form.host_id = this.data.host_id;
      this.form.image_id = this.data.image_id;
      if (this.form.active) {
        this.getDockerHost()
        this.getDockerImage()
      }
      if(this.data.attachment.length>0){
        this.attachment = this.form.attachment
      }
    }

  },
  methods: {
    getOptions() {
      request.get('/api/admin/ctf/question/type').then(res => {
        this.options = res.results;
      })
    },
    getDockerImage() {
      let params = {
        host: this.form.host_id,
        page_size: 999,
        status: 'success'
      }
      let host = this.form.host_id
      request.get(`/api/admin/docker/host/${host}/image_list`).then(res => {
        this.imageOption = res.data;
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
    handleChangeHost() {
      this.getDockerImage()
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
