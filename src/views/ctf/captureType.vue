<template>
  <el-main class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" size="small" style="width: 200px;" placeholder="名称"/>
      <el-button size="small" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <el-table :data="listData" fit highlight-current-row stripe>
      <el-table-column label="ID" prop="id" width="70"></el-table-column>
      <el-table-column label="LOGO" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.logo"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="是否启用" prop="active">
        <template slot-scope="scope">
          <el-switch @change="switchActive(scope.row)" v-model="scope.row.active"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="ACTION" prop="active">
        <template slot-scope="scope">
          <el-button @click="save(item)" size="small" type="primary">TODO</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-main>

</template>

<script>
import request from '@/api/public'

export default {
  name: "matchCategory",
  data() {
    return {
      listData: [],
      isAdd: false,
      total: 0,
      listQuery: {
        search: null
      },
      form: {
        name: null,
        active: true,
        logo: null,
      }
    }

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      request.get(('/api/manager/ctf/question_type/'), {page_size: 999}).then(res => {
        this.listData = res.results;
        this.total = res.count;
      })
    },
    switchActive(row) {
      request.put(`/api/manager/ctf/question_type/${row.id}/`, row).then(res => {
        this.$message({message: "修改成功", type: "success", duration: 500})
      }).catch(err => {
        this.getList()
      })

    },
    save(row) {
      if (row) {
        request.put(`/api/manager/ctf/question_type/${row.id}/`, row).then(res => {
          this.$message({message: "修改成功", type: "success"})
        })
      } else {
        request.post('/api/manager/ctf/question_type/', this.form).then(res => {
          this.$message({message: "添加成功", type: "success"})
          this.isAdd = false;
          this.getList()
        })
      }

    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
