<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true" :model="listQuery">
      <el-form-item>
        <el-input
          v-model="listQuery.search"
          placeholder="请输入操作内容"
          class="w-[200px]"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          placeholder="操作状态"
          clearable
          style="width: 120px"
        >
          <el-option label="成功" value="success" />
          <el-option label="失败" value="error" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full page-title">
        <p class="font-bold truncate">审计日志</p>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="list"
          fit
          highlight-current-row
          stripe
        >
          <el-table-column
            align="center"
            label="操作用户"
            prop="username"
            width="120"
          />
          <el-table-column
            align="center"
            label="角色"
            prop="role"
            width="120"
          />

          <el-table-column
            align="center"
            label="操作内容"
            prop="content"
            show-overflow-tooltip
            min-width="300"
          />
          <el-table-column
            align="center"
            label="IP地址"
            prop="ip"
            width="120"
          />
          <el-table-column
            align="center"
            label="状态"
            width="100"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 'success' ? 'success' : 'danger'"
                size="small"
              >
                {{ scope.row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="create_time"
            width="180"
          />
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
import { http } from "@/utils/http";
import { ElMessage } from "element-plus";

export default {
  name: "operator",
  data() {
    return {
      listQuery: {
        page: 1,
        page_size: 10,
        search: null,
        action: null,
        status: null
      },
      loading: false,
      total: 0,
      list: [],
      typeOptions: [
        { value: 'login', label: '登录' },
        { value: 'logout', label: '登出' },
        { value: 'create', label: '创建' },
        { value: 'update', label: '更新' },
        { value: 'delete', label: '删除' },
        { value: 'build', label: '构建' },
        { value: 'run', label: '运行' },
        { value: 'destroy', label: '销毁' },
        { value: 'other', label: '其他' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      http.get('/api/admin/operator', this.listQuery)
        .then(res => {
          this.list = res.data
          this.total = res.total
        })
        .catch(error => {
          ElMessage.error(error.message || '获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getTypeLabel(type) {
      const option = this.typeOptions.find(item => item.value === type)
      return option ? option.label : type
    },
    getTypeTagType(type) {
      const typeMap = {
        login: 'success',
        logout: 'info',
        create: 'primary',
        update: 'warning',
        delete: 'danger',
        build: 'primary',
        run: 'success',
        destroy: 'danger',
        other: ''
      }
      return typeMap[type] || ''
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
