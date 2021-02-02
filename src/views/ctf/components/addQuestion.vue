<template>
  <el-dialog v-if="show" :before-close="cancel" :show-close="false" :title="form.id? '编辑题目':'添加题目'" :visible.sync="show"
             center destroy-on-close
             width="800" @close="cancel">
    <el-form class="form" label-width="80px" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别">
            <el-select v-model="form.type">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="block-input" label="是否激活">
        <el-switch v-model="form.active"></el-switch>
      </el-form-item>
      <el-form-item class="block-input" label="动态Flag">
        <el-switch v-model="form.active_flag" @change="changeActiveFlag"></el-switch>
      </el-form-item>
      <el-form-item v-if="form.active_flag" class="block-input" label="主机">
        <el-select v-model="form.host" clearable @change="handleChangeHost">
          <el-option
            v-for="item in hostOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="form.image" clearable filterable>
          <el-option
            v-for="item in imageOption"
            :key="item.RepoTags[0]"
            :label="item.RepoTags[0]"
            :value="item.Id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else class="block-input" label="Flag">
        <el-row>
          <el-col :span="20">
            <el-input v-model="form.flag"></el-input>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" type="textarea"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="积分">
            <el-input v-model="form.integral" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件">
        <input id="inputFile" ref="inputer" style="display: none" type="file" @change="handleFile"></input>
        <el-button type="primary" @click="handleFileClick">上传</el-button>
        <div style="width: 300px;">
          <div v-for="(item,index) in fileList" class="file-item">
            <a :href="item.file_path" target="_blank">{{ item.filename }}</a>
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
      fileList: [],
      options: [],
      form: {
        host: null,
        image: null,
        name: null,
        flag: null,
        desc: null,
        score: null,
        integral: null,
        integral_loss: null,
        type: null,
        active: true,
        active_flag: false,
      }

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
      this.form.integral = this.data.integral;
      if (this.data.resource && this.data.resource.host) {
        this.form.host = this.data.resource.host;
        this.form.image = this.data.resource.image;
        this.getDockerHost()
        this.getDockerImage()
      }
      const { question_file } = this.data
      this.fileList = question_file
    }

  },
  methods: {
    getOptions() {
      request.get('/admin/ctf/question/type').then(res => {
        this.options = res.results;
      })
    },
    getDockerImage() {
      request.get(`/admin/docker/host/${this.form.host}/images`).then(res => {
        this.imageOption = res.data.images;
      })

    },
    getDockerHost() {
      request.get('/admin/docker/hostList', {'page_size': 999}).then(res => {
        this.hostOption = res.data;
      })
    },
    cancel() {
      this.$emit('action', false)
    },
    submit() {
      if (this.fileChange) {
        let attachment = [];
        for (let i = 0; i < this.fileList.length; i++) {
          attachment.push(this.fileList[i])
        }
        this.form.attachment = attachment
      }
      if (this.form.id) {
        request.post(`/admin/ctf/question/${this.form.id}`, this.form).then(res => {
          this.$emit('action', true)
        }).catch(err => {
          this.$message({
            message: err.response.data.msg,
            type: "error"
          })
        })

      } else {
        request.post('/admin/ctf/question/create', this.form).then(res => {
          this.$emit('action', true)
        }).catch(err => {
          this.$message({
            message: err.response.data.msg,
            type: "error"
          })
        })
      }
    },
    handleFileClick() {
      document.getElementById('inputFile').click()
    },
    handleChangeHost() {
      console.log("checge host")
      this.getDockerImage()
    },
    changeActiveFlag(e) {
      if (e) {
        this.getDockerHost()
      }

    },
    removeFile(index) {
      this.fileChange = true;
      this.fileList.splice(index, 1)
    },
    handleFile(e) {
      let inputDOM = this.$refs.inputer;
      let file = inputDOM.files[0];
      let formData = new FormData();
      formData.append("file", file);  //文件上传处理
      request.post('/admin/upload', formData).then(res => {
        this.fileChange = true
        this.fileList.push({
          filename: res.name,
          file_path: res.file_path
        })
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
