<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item class="el-form-item" label="用户名">
        <el-input v-model="listQuery.username" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="el-form-item" label="题目">
        <el-input v-model="listQuery.question" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin: 0 5px;" type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">容器列表</p>
      </div>
      <div>
        <el-table v-loading="loading" :data="data" stripe highlight-current-row>
          <el-table-column align="center" label="名称" prop="name" width="120"/>
          <el-table-column align="center" label="用户" prop="username" width="100"/>
          <el-table-column align="center" label="题目" prop="question.name" width="180"/>
          <el-table-column align="center" label="端口信息" prop="container_port" width="120">
            <template #default="scope">
              {{ scope.row.container_port }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Flag" prop="flag" class-name="fnt-12"/>
          <el-table-column align="center" label="创建日期" prop="date_created" width="150" class-name="fnt-12"/>
          <el-table-column align="center" label="有效时间" prop="destroy_time" width="150" class-name="fnt-12"/>
          <el-table-column align="center" label="操作" width="160">
            <template #default="scope">
              <el-button link type="danger"  @click="containerRemove(scope.row)">销毁</el-button>
              <el-button link type="primary" @click="refresh(scope.row)">刷新</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
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
import {http} from "@/utils/http";

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
        username: '',
        question: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      http.get('/api/admin/ctf/resource', this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    },
    refresh(item) {
      http.post(`/api/admin/ctf/resource/${item.id}/refresh`).then(() => {
        this.$message({
          message: "刷新成功",
          type: "success",
          duration: 2000
        });
        this.getList()
      })
    },
    containerRemove(item) {
      this.$confirm('确认要销毁该容器吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.post(`/api/admin/ctf/resource/${item.id}/remove`).then(() => {
          this.$message({
            message: "销毁成功",
            type: "success",
            duration: 2000
          });
          this.getList()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.fnt-12 {
  font-size: 12px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
