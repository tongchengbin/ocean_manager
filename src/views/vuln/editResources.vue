<template>
  <div class="page-container">
    <el-card style="height: 100%">
      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="{ span: 20, offset: 2 }"
          :md="{ span: 20, offset: 2 }"
          :lg="{ span: 14, offset: 5 }"
          :xl="{ span: 12, offset: 6 }"
        >
          <el-form :model="form" ref="form" class="form" label-width="80px">
            <el-form-item label="资源名称" docker_type_list>
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="组件" docker_type_list>
              <el-input v-model="form.app"></el-input>
            </el-form-item>
            <el-form-item label="加载类型" required>
              <el-select  v-model="form.docker_type">
                <el-option v-for="op in docker_type_list" :label="op.label" :key="op.id" :value="op.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="CVE">
              <el-tag v-for="(tag,index) in form.cve" :key="tag">{{ tag }} <span class="close-icon" @click="removeTag(index)">x</span></el-tag>
              <el-input v-model="inputValue" placeholder="输入标签内容"></el-input>
              <el-button @click="addTags">添加标签</el-button>
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
          <div class="button-group">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button type="info" @click="goBack">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import  {mavonEditor}  from 'mavon-editor'
import { http } from "@/utils/http";
export default {
  name: "resources",
  components: {
    mavonEditor,
  },
  data() {
    return {
      inputValue: '',
      docker_type_list:[
        {
          label: "远程镜像",
          id: 1
        }
      ],
      form:{
        name:'',
        app:'',
        cve:[],
        description:'',
        image:''
      }

    }
  },
  created() {
    let {query} = this.$route
    let id = query.id;
    if(id){
      this.getItem(id);
    }

  },
  methods: {
    getItem(id){
      http.get(`/api/admin/vuln/${id}`).then(res=> {
        let data = res.data
        this.form.id=id
        this.form.app = data.app
        this.form.cve = data.cve || []
        this.form.name = data.name
        this.form.description = data.description
        this.form.image = "1"
        this.form.docker_type = data.docker_type
      })


    },
    goBack(){
      this.$router.back()
    },
    handleSubmit(){
        if(this.form.id){
          http.put(`/api/admin/vuln/${this.form.id}`,this.form).then(res=>{
            this.$emit('action', true)
            this.$message({message:"提交成功",type:"success"})
            this.$router.replace({name:"vuln.resource"})
          })

        }else{
          http.post(`/api/admin/vuln`,this.form).then(res=>{
            this.$emit('action', true)
            this.$message({message:"提交成功",type:"success"})
            this.$router.replace({name:"vuln.resource"})
          })
        }

    },
    removeTag(index){
      this.form.cve.splice(index, 1);
    },
    addTags() {
        if (this.inputValue) {
          this.form.cve.push(this.inputValue);
          this.inputValue = '';

      }
    }
  }
}

</script>

<style  scoped>
.app-container{
  background-color: #ffffff;
  min-height: 100vh;
}
.close-icon {
  cursor: pointer;
  margin-left: 4px;
  color: #909399;
}
.button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
</style>
