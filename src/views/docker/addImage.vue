<template>
  <div class="container">
    <div class="widget">
      <el-tabs type="border-card">
        <el-tab-pane>
          <template #label><el-icon><Edit /></el-icon>添加镜像</template>
          <el-form :model=buildForm inline ref="build"  :rules="rules">
            <el-form-item label="名称" prop="tag">
              <el-input v-model="buildForm.tag" placeholder="eg. redis:latest"></el-input>
            </el-form-item>
          </el-form>
          <el-tabs value="dockerfile" ref="tab">
            <el-tab-pane name="dockerfile">
              <template #label><i class="el-icon-edit"></i> DockerFile</template>
              <div>
                <el-form>
                  <el-form-item>
                    <el-input v-model="content" type="textarea" rows="10"
                              placeholder="Define or paste the content of Your Dockerfile here"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane name="tar">
              <template #label><i class="el-icon-upload2"></i> 上传</template>
              <div>
                <div>
                  <el-upload accept="*.tar" :on-change="getFile" action="" ref="upload" :auto-upload="false">
                    <el-button  type="primary">选择文件</el-button>
                  </el-upload>
                </div>
              </div>

            </el-tab-pane>
            <el-tab-pane name="pull">
              <template #label><i class="el-icon-edit"></i>Pull</template>
            </el-tab-pane>
          </el-tabs>
          <div>
            <div class="wd-title">Actions</div>
            <div class="action-group">
              <el-button @click="build" type="primary">上传/编译</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="!showLog">
          <template #label><el-icon><Files /></el-icon>日志</template>
          <div id="log_output" class="output" style="max-height: 300px;overflow: auto">
               <p class="line small" v-for="line in output">{{ line }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import { Edit,Files } from '@element-plus/icons-vue'
export default {
  name: "addImage",
  components:{
    Edit,Files
  },
  data() {
    return {
      rules: {
        tag: [
          {required: true, max: 100, min: 2, message: "请输入要构建的镜像名称"}
        ]
      },
      selectHub: 'DockerHub',
      imageName: '',
      buildForm: {
        tag: '',
      },
      options: [{
        value: 'DockerHub',
        label: 'DockerHub'
      }],
      file: null,
      output: [],
      pk: null,
      content: '',

      listTotal: 0,
      listData: [],
      showLog: false,
    }

  },
  created() {
    this.pk = this.$route.query.id;

  },
  methods: {
    getFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.file = file.raw;
    },
    build() {
      this.$refs["build"].validate((valid) => {
        if (!valid) {
          return false
        }
        let data
        if (this.$refs.tab.currentName === 'tar') {
          data = new FormData();
          data.append("type", 'tar')
          data.append('files', this.file); //file会转为二进制
        } else if (this.$refs.tab.currentName === 'pull') {
          data = {
            tag: this.imageName
          }
        } else {
          // 编译镜像
          data = {
            dockerfile: this.content,
            tag: this.tag
          }
        }
        http.post(`/api/admin/docker/image?build_type=${this.$refs.tab.currentName}&tag=${this.buildForm.tag}`, data).then(res => {
          this.$message({message: "任务已提交", type: "success"})
          this.showLog = true;
          this.output = ["Internal Server Error for url: http+docker://localhost/v1.44/build?t=test%3A%21&q=False&nocache=False&rm=True&forcerm=False&pull=False"];
          this.loopResponse(res.data.task)
        }).catch(_ => {

        })
      })
    },
    loopResponse(task) {
      let timer
      let that = this;
      let query = {
        index: this.output.length
      }
      http.get(`/api/admin/task/${task}/log`, query).then(function (res) {
        that.output = that.output.concat(res.data)
        let div = document.getElementById("log_output")
        // 这里还有没有渲染好就开始定位高度了 所以不是最底部
        div.scrollTop = div.scrollHeight;
        if (res.end) {
          clearTimeout(timer) //清理定时任务
        } else {
          timer = setTimeout(() => {
            that.loopResponse(task)
          }, 5000)
        }
      })
    }
  }
}
</script>

<style scoped>





.small {
  font-size: 80%;
}


.btn-group svg {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.wd-title {
  padding: 10px 6px;
  color: #777;
  border-bottom: 1px solid #777;
}

.action-group {
  padding: 10px 6px;
}

.pre {
  padding: 0 15px;
  color: #000;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.line {
  margin-block-start: 2px;
  margin-block-end: 2px;
}
</style>
