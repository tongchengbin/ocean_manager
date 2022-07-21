<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">赛事容器</div>
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item size="mini">
            <el-input v-model="listQuery.search" placeholder="名称、出口IP"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table v-loading="loading" size="mini" :data="data" highlight-current-row>
          <el-table-column align="center" label="名称" prop="name"></el-table-column>
          <el-table-column align="center" label="出口IP" prop="ip" width="150"></el-table-column>
          <el-table-column align="center" label="DockerApi" prop="docker_api" width="180"></el-table-column>
          <el-table-column align="center" label="Os" prop="system.os" width="150"></el-table-column>
          <el-table-column align="center" label="Memory(G)" prop="system.memory" width="150"></el-table-column>
          <el-table-column align="center" label="备注" prop="remark" width="150"></el-table-column>
          <el-table-column align="center" label="创建日期" prop="create_time" width="160"></el-table-column>
          <el-table-column align="center" label="最后在线" prop="online_time" width="160">
            <template slot-scope="scope">
              <span>
                {{scope.row.online_time}}
                <i v-if="scope.row.is_online" class="el-icon-success" style="color: #3a835d"></i>
                <i v-else class="el-icon-warning" style="color: #E6A23C"></i>
              </span>
            </template>
          </el-table-column>
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
    <host-item :checkHost="editItem" :show="showAdd" v-if="showAdd" @success="handleCreateOk"></host-item>
  </div>
</template>

<script>
import request from "@/api/public";
import hostItem from "./components/hostItem";
import {validIPAddress} from "@/utils/validate";
export default {
  name: "HostList",
  data() {

    return {
      editItem:null,
      loading:false,
      data: [],
      total:0,
      showAdd:false,
      listQuery: {
        search:null,
        page:1,
        page_size:10,
      }
    }
  },
  components:{
    hostItem
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true;
      request.get('/api/admin/docker/host', this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      })
    },
    handleSizeChange(e){
      this.listQuery.page_size = e;
      this.fetchData()
    },
    handleCurrentChange(e){
      this.listQuery.page = e;
      this.fetchData()
    },
    refresh(item) {
      request.post(`/api/admin/ctf/containers/${item.container_resource}/refresh`).then(res => {
        this.fetchData()
      }).catch(err=>{

      })
    },
    handleCreate(){
      this.showAdd = true;
    },
    handleCreateOk(){
      this.editItem = null
      this.showAdd = false
      this.fetchData()
    },
    handleEdit(item){
      this.showAdd = true;
      this.editItem = item;

    },
    handleDelete(item) {
      request.delete(`/api/admin/ctf/host/${item.id}`).then(res => {
        this.$message({message: res.msg})
        this.fetchData()
      }).catch(res => {
        this.fetchData()
      })
    }
  }

}
</script>

<style scoped lang="less">

</style>
