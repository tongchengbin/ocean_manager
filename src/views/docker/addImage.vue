<template>
  <div class="container">
    <div class="widget">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-edit"></i>添加镜像</span>
          <el-form inline ref="build">
            <el-form-item  label="名称">
              <el-input v-model="tag" placeholder="eg. myImage:myTag"></el-input>
            </el-form-item>
          </el-form>
          <el-tabs value="dockerfile" ref="tab" type="card">
            <el-tab-pane name="dockerfile">
              <span slot="label"><i class="el-icon-edit"></i> DockerFile</span>
              <div>
                <el-form>
                  <el-form-item>
                    <el-input v-model="content" type="textarea" rows="10" placeholder="Define or paste the content of Your Dockerfile here"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane name="tar">
              <span slot="label"><i class="el-icon-upload2"></i> 上传</span>
            <div>
              <div>
                <el-upload accept="*.tar"  :on-change="getFile" action="" ref="upload"  :auto-upload="false">
                  <el-button size="mini" type="primary">选择文件</el-button></el-upload>
              </div>
            </div>

            </el-tab-pane>
            <el-tab-pane name="pull">
              <span slot="label"><i class="el-icon-edit"></i>Pull</span>
              <el-form label-position="left" label-width="100px">
                <el-form-item   label="Registry">
                  <el-select v-model="selectHub" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="Image">
                  <el-input placeholder="eg. myImage:myTag" v-model="imageName">
                    <template slot="prepend">Docker.io</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div>
            <div class="wd-title">Actions</div>
            <div class="action-group">
              <el-button @click="build" type="primary" size="mini">上传/编译 </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="!showLog">
          <span slot="label"><i class="el-icon-document"></i>日志</span>
          <div class="output">
              <pre class="pre">
               <p class="line small" v-for="line in output">{{line}}</p>
              </pre>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import request from '../../api/public'
export default {
  name: "addImage",
  data(){
    return {
      selectHub:'DockerHub',
      imageName:'',
      pullForm:{},
      options:[{
        value: 'DockerHub',
        label: 'DockerHub'
      }],
      file:null,
      output:[],
      pk:null,
      content:'',
      tag:'',
      listTotal:0,
      listData:[],
      showLog:false,
    }

  },
  created() {
    this.pk = this.$route.query.id;

  },
  methods:{
    getFile(file,fileList){
      if(fileList.length>1){
        fileList.splice(0,1)
      }
      this.file = file.raw;
    },
    build(){
      let data
      if(this.$refs.tab.currentName==='tar'){
        data = new FormData();
        data.append("type",'tar')
        data.append('files', this.file); //file会转为二进制
      }else if (this.$refs.tab.currentName === 'pull'){
        data = {
          tag:this.imageName
        }
      }
      else{
        // 编译镜像
        data = {
          dockerfile:this.content,
          tag:this.tag
        }
      }
      request.post(`/admin/docker/host/${this.pk}/image/build?build_type=${this.$refs.tab.currentName}&tag=${this.tag}`,data).then(res=>{
        this.$message({message:"任务已提交",type:"success"})
        this.showLog=true;
        this.loopResponse(res.data.task)
      }).catch(err=>{
        this.$message({message:err.response.data.error,type:"error"})
      })

    },
    loopResponse(task) {
      let timer
      let that = this;
      let query={
        index:this.output.length
      }
      request.get(`/admin/task/${task}/log`,query).then(function (res) {
        that.output=that.output.concat(res.data)
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


.widget+.widget{
  margin-top: 20px;
}
.widget-content{
  padding: 16px;
}
.tool-bar {
  color: #767676;
  padding: 10px;
  background-color: #f6f6f6;
  overflow: auto;
}
.small{
  font-size: 80%;
}
.txt-hid{
  color: #337ab7;
  cursor: pointer;
  font-weight: 600;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tags{
  background-color: #337ab7;
  display: inline;
  padding: .2em .6em .3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
.action-bar {
  color: #767676;
  padding: 10px;
}
.btn-group svg{
  width: 14px;
  height: 14px;
  margin-right: 4px;
}
.wd-title{
  padding: 10px 6px;
  color: #777;
  border-bottom: 1px solid #777;
}
.action-group{
  padding: 10px 6px;
}
.pre{
  padding: 0 15px;
  color: #000;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.line{
  margin-block-start: 2px;
  margin-block-end: 2px;
}
</style>


<style lang="css">
.widget .el-tabs .is-disabled{
  cursor: not-allowed!important;
  opacity: .65;
  box-shadow: none;
}
</style>
