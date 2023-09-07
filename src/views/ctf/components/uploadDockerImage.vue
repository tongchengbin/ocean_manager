<template>
  <el-dialog :visible.async="show" title="添加镜像" center width="650px" @close="cancel">
    <el-form size="mini" label-width="60px" :rules="rules" :model="form" ref="form">
      <el-form-item  label="主机" prop="version">
        <el-select size="mini" v-model="form.host">
          <el-option
            v-for="item in hostList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item  label="版本" prop="version">
        <el-input v-model="form.version"></el-input>
      </el-form-item>
      <el-form-item  label="内存" prop="memory">
        <el-radio v-model="form.memory" :label=128>128M</el-radio>
        <el-radio v-model="form.memory" :label=512>512M</el-radio>
        <el-radio v-model="form.memory" :label=1024>1024M</el-radio>
        <el-radio v-model="form.memory" :label=2048>2048M</el-radio>
        <el-radio v-model="form.memory" :label=4096>4096M</el-radio>
      </el-form-item>
      <el-form-item  label="CPU" prop="cpu">
        <el-radio v-model="form.cpu" :label=1>单核</el-radio>
        <el-radio v-model="form.cpu" :label=2>双核</el-radio>
        <el-radio v-model="form.cpu" :label=4>4核</el-radio>
      </el-form-item>
      <el-form-item label="文件" prop="file_id">
        <input id="inputFile" ref="inputer" style="display: none" type="file" @change="handleFile"></input>
        <el-button type="primary" @click="handleFileClick">上传</el-button>
        <div style="width: 300px;">
          <div class="file-item" v-if="form.file_id!==null">
            <a :href="'/api/upload/'" target="_blank">{{ form.filename }}</a>
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
import request from "../../../utils/request";

export default {
  name: "uploadDockerImage",
  props:{
    item:{
    }
  },
  data(){
    return {
      hostList:[],
      show:true,
      rules:{
        name:[
          { required: true, message: '请输入镜像名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        version:[
          { required: true, message: '请输入镜像版本', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        cpu:[
          { required: true, message: '请选择CPU数量', trigger: 'blur' },
        ],
        memory:[
          { required: true, message: '请选择内存大小', trigger: 'blur' },
        ],
        file_id:[
          { required: true, message: '请选择tar文件', trigger: 'blur' },
        ]
      },
      form:{
        file_id:null
      },
    }
  },
 created() {
    this.form = this.item
    this.fetchHost()
 },
  watch:{

    form:{
      handler(a,b){
        console.log(a,b)
      },
      immediate:true,
      deep:true
    }
  },
  methods:{
    fetchHost(){
      request.get("/api/admin/docker/host",{page_size:999}).then(res=>{
        this.hostList = res.data
        if(this.hostList.length>0){
          this.form.host = this.hostList[0].id
        }
      })
    },
    cancel(){
      this.$emit('close',false)
    },
    submit(){
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          if(this.form.id){
            request.put(`/api/admin/ctf/images/${this.form.id}`,this.form).then(res=>{
              this.$emit('close',true)
            })
          }
          else{
            request.post("/api/admin/ctf/images",this.form).then(res=>{
              this.$emit('close',true)
            })
          }
        } else {
          return false;
        }
      });

    },
    removeFile(index) {
      this.fileChange = true;
      this.form.attachment.splice(index, 1)
    },
    handleFileClick() {
      document.getElementById('inputFile').click()
    },
    handleFile() {
      let inputDOM = this.$refs.inputer;
      let file = inputDOM.files[0];
      let formData = new FormData();
      formData.append("file", file);  //文件上传处理
      request.post('/api/admin/ctf/upload', formData).then(res => {
        console.log(res)
        let { filename,uuid } = res
        this.form.filename = filename;
        this.form.file_id = uuid;
        console.log(this.form)
        this.$forceUpdate()
      }).catch(err=>{
        this.$message({message: "文件上传失败!",type:"error"})
      })
    }
  }
}
</script>

<style scoped>

</style>
