<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">赛事容器</div>
      <div class="search-group">
        <div class="btn-group">
          <el-tooltip class="item" content="强制刷新容器状态" effect="dark" placement="right">
            <el-button size="mini" type="primary">刷新</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="widget-content">
        <el-table v-loading="loading" size="mini" :data="data" highlight-current-row>
          <el-table-column align="center" label="容器名称" prop="container_name"></el-table-column>
          <el-table-column align="center" label="绑定用户" prop="username"></el-table-column>
          <el-table-column align="center" label="题目名称" prop="question.name"></el-table-column>
          <el-table-column align="center" label="访问地址" prop="addr">
            <template slot-scope="scope">
              <span>{{ scope.row.addr }}:{{ scope.row.container_port }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="容器状态" prop="container_status"></el-table-column>
          <el-table-column align="center" label="创建日期" prop="date_created"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" content="删除容器" effect="dark" placement="top">
                <el-button size="mini" type="danger" @click="containerRemove(scope.row)">删除</el-button>
              </el-tooltip>
              <el-button size="mini" type="primary" @click="refresh(scope.row)">刷新</el-button>
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
  </div>
</template>

<script>
import request from "@/api/public";

export default {
  name: "container",
  data() {
    return {
      loading:false,
      data: [],
      total:0,
      listQuery: {
        page:1,
        page_size:10,
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true;
      request.get('/api/admin/ctf/containers', this.listQuery).then(res => {
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
    containerRemove(item) {
      request.post(`/api/admin/ctf/containers/${item.container_resource}/remove`).then(res => {
        this.$message({message: res.msg})
        this.fetchData()
      }).catch(res => {
        this.fetchData()
      })
    }
  }

}
</script>

<style scoped>

</style>
