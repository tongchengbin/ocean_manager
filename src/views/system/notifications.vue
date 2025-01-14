<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item class="el-form-item">
        <el-input v-model="listQuery.search" placeholder="请输入通知内容" class="w-[200px]"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="success" @click="handleReadAll">一键已读</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full page-title">
        <p class="font-bold truncate">通知列表</p>
      </div>
      <div>
        <el-table
          fit
          highlight-current-row
          stripe
          v-loading="loading"
          :data="listData"
        >
          <el-table-column
            align="center"
            label="通知标题"
            prop="title"
            show-overflow-tooltip
            min-width="200"
          />
          <el-table-column
            align="center"
            label="通知内容"
            prop="description"
            show-overflow-tooltip
            min-width="300"
          />
          <el-table-column
            align="center"
            label="状态"
            width="100"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.is_read ? 'info' : 'warning'"
                size="small"
              >
                {{ scope.row.read ? '已读' : '未读' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="通知时间"
            prop="datetime"
            width="180"
          />
          <el-table-column
            align="center"
            label="操作"
            width="150"
          >
            <template #default="scope">
              <el-button
                v-if="!scope.row.read"
                link
                type="primary"
                @click="handleRead(scope.row)"
              >
                标记已读
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
          <el-pagination
            :current-page="listQuery.page"
            :page-size="listQuery.page_size"
            :page-sizes="[10,20,30,50]"
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
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "notifications",
  data() {
    return {
      listQuery: {
        page: 1,
        page_size: 10,
        search: null
      },
      loading: false,
      total: 0,
      listData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      http.get('/api/admin/message', this.listQuery)
        .then(res => {
          this.listData = res.results
          this.total = res.total
        })
        .catch(error => {
          ElMessage.error(error.message || '获取数据失败')
        })
        .finally(() => {
          this.loading = false
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
    async handleRead(row) {
      try {
        await http.post(`/api/admin/message/read`, {ids: [row.id]})
        ElMessage({
          type: 'success',
          message: '标记已读成功',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      }
    },
    async handleReadAll() {
      try {
        await ElMessageBox.confirm('确定要将所有通知标记为已读吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await http.post('/api/admin/message/read_all')
        ElMessage({
          type: 'success',
          message: '标记已读成功',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '操作失败')
        }
      }
    },
    async handleDelete(row) {
      try {
        await ElMessageBox.confirm('确定要删除该通知吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await http.delete(`/api/admin/message/${row.id}`)
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '删除失败')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.search-form {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.page-r {
  margin-top: 20px;
  padding: 10px;
  text-align: right;
}
</style>
