<template>
  <div class="container">
    <!--搜索-->
    <div class="widget">
    <div class="tool-bar">用户管理</div>
    <div class="search-group">
      <el-input v-model="listQuery.search" size="mini" style="width: 200px;" placeholder="用户名" />
      <el-button size="mini" type="primary"  @click="handleFilter">查询</el-button>
      <el-button size="mini"  type="primary"  @click="handleCreate">添加</el-button>
    </div>
      <div class="widget-content">
        <!--用户列表-->
        <el-table fit highlight-current-row stripe v-loading="listLoading" size="mini" :data="list"  style="width: 100%">
          <el-table-column align="center" label="ID" width="70px" prop="id">
          </el-table-column>
          <el-table-column label="用户名" width="150px" align="center">
            <template slot-scope="scope">
              <el-tag  v-if="scope.row.is_captain" effect="dark">{{ scope.row.username }}</el-tag>
              <span v-else>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="邮箱">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册日期">
            <template slot-scope="scope">
              <span>{{scope.row.date_created}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上次登陆" width="250">
            <template slot-scope="scope">
              <span>{{ scope.row.date_modified}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="userDelete(scope.row)" >删除</el-button>
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
        <!--编辑框-->
      </div>

    </div>
    <add-user :data="userForm" @success="handleUser" v-if="dialogUser"></add-user>
  </div>
</template>

<script>
import request from '@/api/public'
import { mapGetters } from 'vuex'
import addUser from "@/views/account/components/addUser";

export default {
  name: 'Account',
  components:{
    addUser,
  },
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
      dialogUser:false,
      TeamOptions:[],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
      RolesData: [],
      userForm: {}
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
      request.get("/api/admin/user", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleUser(){
      this.getList()
      this.dialogUser = false
    },
    userDelete(row) {
      request.delete(`/api/admin/user/${row.id}` ).then(res => {
        this.$message({message:"删除成功",type:"success"})
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
    handleCreate() {
      this.userForm = {}
      this.dialogUser = true
    },
    handleUpdate(row) {
      this.userForm = row
      this.dialogUser = true
    },
  }
}
</script>
<style>


</style>
