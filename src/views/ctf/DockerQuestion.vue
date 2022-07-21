<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">赛事容器
      </div>
      <div class="search-group">
        <el-form inline size="mini">
          <el-form-item>
            <el-select v-model="listQuery.host" size="mini">
              <el-option
                v-for="item in hostList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini">
            <el-input v-model="listQuery.name" placeholder="镜像名称"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-input v-model="listQuery.file" placeholder="文件名"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
          <el-form-item size="mini">
            <el-button size="mini" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table v-loading="loading" :data="data" highlight-current-row size="mini">
          <el-table-column align="center" label="名称" prop="name"></el-table-column>
          <el-table-column align="center" label="版本" prop="version" width="80"></el-table-column>
          <el-table-column align="center" label="宿主机" prop="host_name" width="160"></el-table-column>
          <el-table-column align="center" label="出口IP" prop="ip" width="160"></el-table-column>
          <el-table-column align="center" label="状态" prop="status" width="80">
            <template slot-scope="scope">
              <i v-if="scope.row.status==='success'" class="el-icon-success" style="color: #67C23A"></i>
              <el-tooltip  v-else-if="scope.row.status==='error'" :content="scope.row.build_result" effect="dark" placement="top-start">
                <i  class="el-icon-error" style="color:  #F56C6C"> </i>
              </el-tooltip>
                <el-tooltip v-else :content="scope.row.status">
                  <i   class="el-icon-more" style="color: #409EFF"></i>
                </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="内存" prop="memory" width="80"></el-table-column>
          <el-table-column align="center" label="CPU" prop="cpu" width="80"></el-table-column>
          <el-table-column align="center" label="创建日期" prop="date_created" width="160"></el-table-column>
          <el-table-column align="center" label="文件" prop="filename"></el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-tooltip class="item" content="删除容器" effect="dark" placement="top">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="listQuery.page"
            :page-size="listQuery.page_size"
            :page-sizes="[10,20,30, 50]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <upload-docker-image v-if="uploadDockerImageShow===true" :item="item" @close="handleClose"></upload-docker-image>
  </div>
</template>

<script>
import {getToken} from '@/utils/auth'
import request from "@/api/public";
import uploadDockerImage from "./components/uploadDockerImage";
export default {
  name: "DockerQuestion",
  components:{
    uploadDockerImage,
  },
  data() {
    return {
      item:{
        file:''
      },
      uploadDockerImageShow:false,
      headers: {
        Authorization: getToken()
      },
      showSelectHost: false,
      loading: false,
      data: [],
      hostList: [],
      total: 0,
      listQuery: {
        host:null,
        page: 1,
        page_size: 10,
      }
    }
  },
  created() {
    this.fetchHost()
  },
  methods: {
    fetchData() {
      this.loading = true;
      request.get('/api/admin/ctf/images', this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      }).catch(err=>{
        this.loading = false
      })
    },
    fetchHost(){
      request.get("/api/admin/docker/host",{page_size:999}).then(res=>{
        this.hostList = res.data
        if(this.hostList.length>0){
          this.listQuery.host = this.hostList[0].id;
          this.fetchData()
        }
      })
    },
    apply(){
      this.fetchData()
    },
    handleSizeChange(e){
      this.listQuery.page_size = e;
      this.fetchData()
    },
    handleCurrentChange(e){
      this.listQuery.page = e;
      this.fetchData()
    },
    handleEdit(item) {
      this.item = item
      this.uploadDockerImageShow = true;
    },
    handleDelete(item) {
      request.delete(`/api/admin/ctf/images/${item.id}`).then(res => {
        this.$message({message: res.msg,type:"success"})
        this.fetchData()
      }).catch(res => {
        this.fetchData()
      })
    },
    handleCreate(){
      this.item= {}
      this.uploadDockerImageShow = true
    },
    handleClose(){
      this.uploadDockerImageShow = false
      this.fetchData()
    }
  }

}
</script>

<style scoped>
.li-ui{
  padding: 10px 5px;
  border-top: 1px solid #0a76a4;;
  border-bottom: 1px solid #0a76a4;
  cursor: pointer;
}
</style>
