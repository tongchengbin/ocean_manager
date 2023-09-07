<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">赛事容器</div>
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item size="mini">
            <el-input v-model="listQuery.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-input v-model="listQuery.question" placeholder="题目名称"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" @click="getList()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table v-loading="loading" size="mini" :data="data" highlight-current-row>
          <el-table-column align="center" label="名称" prop="name"></el-table-column>
          <el-table-column align="center" label="用户" prop="username" width="80"></el-table-column>
          <el-table-column align="center" label="题目" prop="question.name" width="100"></el-table-column>
          <el-table-column align="center" label="端口信息" prop="container_port">
            <template v-slot="scope">
              {{ scope.row.container_port }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Flag" prop="flag"></el-table-column>
          <el-table-column align="center" label="创建日期" prop="date_created" width="160"></el-table-column>
          <el-table-column align="center" label="有效时间" prop="destroy_time" width="160"></el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" content="删除容器" effect="dark" placement="top">
                <el-button size="mini" type="danger" @click="containerRemove(scope.row)">销毁</el-button>
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
      loading: false,
      data: [],
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10,
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      request.get('/api/admin/ctf/resource', this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      })
    },
    handleSizeChange(e) {
      this.listQuery.page_size = e;
      this.getList()
    },
    handleCurrentChange(e) {
      this.listQuery.page = e;
      this.getList()
    },
    refresh(item) {
      request.post(`/api/admin/ctf/resource/${item.id}/refresh`).then(res => {
        this.getList()
      }).catch(err => {

      })
    },
    containerRemove(item) {
      request.post(`/api/admin/ctf/resource/${item.id}/remove`).then(res => {
        this.$message({message: "销毁成功",type:"success"})
        this.getList()
      }).catch(res => {
        this.getList()
      })
    }
  }

}
</script>

<style scoped lang="less">

</style>
