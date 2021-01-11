<template>
  <el-main class="app-container">
    <!--搜索-->
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="赛事名称" size="small" style="width: 200px;"/>
      <el-button icon="el-icon-search" size="small" type="primary" @click="handleFilter">Search</el-button>
    </div>
    <!--用户列表-->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row size="mini" style="width: 100%">
      <el-table-column label="赛事名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参赛形式" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.player_label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.status_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="题目数" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.question_cnt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="比赛时间">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }} 至 {{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="exportCapture(scope.row)">导出比赛信息</el-button>
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
  </el-main>
</template>

<script>
import request from '@/api/public'

export default {
  name: 'Account',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      TeamOptions: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request.get("/api/manager/ctf/ctf/", this.listQuery).then(res => {
        this.list = res.results
        this.total = res.count
        this.listLoading = false
      })
    },
    userDelete(row) {
      request.delete(`/api/manager/user/${row.id}/`).then(res => {
        this.getList()
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    exportCapture(row) {
      let data = {
        capture: row.id
      }
      request.post(`/api/manager/ctf/capture/export/`, data).then(res => {
        window.open(res.url, '_blank');
      })
    },
    handleCreate() {
      this.$router.push('/match/addMatch')
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.$router.push({path: '/match/addMatch', query: {"id": row.id}})
      this.dialogStatus = 'edit'
      this.formData = row
      this.dialogFormVisible = true
    },
  }
}
</script>
<style>

</style>
