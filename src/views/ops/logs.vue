<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">日志检索</div>
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item label="日志文件">
            <el-select v-model="listQuery.filename">
              <el-option v-for="op in filenameOptions" :label="op" :key="op" :value="op"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="关键词">-->
<!--            <el-input v-model="listQuery.search"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="log-box">
        <p v-for="log in list" v-html="$options.filters.logRender(log)"></p>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../../utils/request";

export default {
name: "logs",
  data(){
  return {
    filenameOptions:["api",'worker','beat'],
    listQuery:{
      filename:"api",
      search:null,
      level:null,
    },
    list:[]
  }
  },
  created() {
    this.getList()
  },
  filters: {
    logRender: function (l) {
      if(l.indexOf('ERRO')!==-1){
        return `<pre><code><span style="color:red;">${l}</span></code></pre>`
      }
     return l
    }
  },
  methods:{
    getList(){
      request.get('/admin/logs',{params:this.listQuery}).then(res=>{
        this.list = res.data
      }).catch(err=>{
        this.$message({type:"error",message:err.response.data.msg})
      })

    }
  },

}
</script>

<style scoped>
body{
  overflow: hidden;
}
.log-box{
  overflow: auto;
  height: 450px;
  padding: 18px;
}
</style>
