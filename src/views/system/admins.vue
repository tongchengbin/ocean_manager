<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">管理员列表</div>
      <!--搜索-->
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item>
            <el-input v-model="listQuery.search" size="mini" style="width: 200px;" placeholder="用户名/邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleFilter">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini"  type="primary"  @click="handleCreate()">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--用户列表-->
      <el-table v-loading="listLoading" size="mini" :data="list"   highlight-current-row>
        <el-table-column align="center"
                         type="index"
                         width="50"
                         label="序号"
                         fixed="left"></el-table-column>
        <el-table-column label="头像" width="70px" align="center">
          <template slot-scope="scope">
            <svg-icon icon-class="logo" style="font-size: 30px;"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="150px" align="center">
          <template slot-scope="scope">
            <el-tag  v-if="scope.row.is_captain" effect="dark">{{ scope.row.username }}</el-tag>
            <span v-else>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="角色">
          <template slot-scope="scope">
            <span>{{ scope.row.role_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上次登陆时间" width="150px" align="center">
          <template slot-scope="scope">
            <span >{{ scope.row.login_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCreate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="listQuery.page"
          :page-sizes="[5,10,30]"
          :page-size="listQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <edit-admin v-if="isEdit" :form="editForm" @handleEdit="handleEdit" ></edit-admin>
    </div>
  </div>
</template>

<script>
import request from '@/api/public'
import { mapGetters } from 'vuex'
import EditAdmin from "@/views/system/components/editAdmin";

export default {
  name: 'Account',
  components: {EditAdmin},
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
      isEdit:false,
      editForm: {},
      TeamOptions:[],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
      dialogStatus: 'update',
      dialogFormVisible: false,
      RolesData: [],
      formData: {
        email: null,
        id: null,
        username: null,
        confirm_password: null,
        password: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request.get("/api/admin/admin", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleDelete(row) {
      request.delete(`/api/admin/admin/${row.id}` ).then(res => {
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
    handleCreate(form) {
      this.isEdit = true;
      this.editForm = form;
    },
    handleEdit(e){
      this.isEdit = false
      if(e){
        this.getList()
      }
    },
    handleUpdate(row) {
      this.dialogStatus = 'edit'
      this.formData = row
      this.dialogFormVisible = true
    },

  }
}
</script>
<style scoped>
  .container {
    padding: 18px;
  }
  .container .warp{
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
  }

</style>
