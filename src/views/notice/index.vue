<template>
  <div class="container">
    <!--搜索-->
    <div class="widget">
      <div class="tool-bar">公告提醒</div>
      <div class="action-bar">
        <el-input v-model="listQuery.search" size="mini" style="width: 200px;" placeholder="公告内容" />
        <el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </div>
      <div class="widget-content">
        <el-table v-loading="listLoading" size="mini" :data="list"  style="width: 100%">
          <el-table-column align="center" label="ID" width="70px" prop="id">
          </el-table-column>
          <el-table-column label="内容" width="150px" align="center" prop="content"></el-table-column>
          <el-table-column  label="是否显示" width="150px" align="center" prop="active">
            <template slot-scope="scope">
              <el-switch @change=changeActive($event,scope.row) v-model="scope.row.active"></el-switch>
            </template>
          </el-table-column>
            <el-table-column label="是否置顶" width="150px" align="center" prop="content">
              <template slot-scope="scope">
                <el-switch @change=changeTop($event,scope.row) v-model="scope.row.is_top"></el-switch>
              </template>
            </el-table-column>
          <el-table-column align="center" label="发布日期" prop="date_created"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
      </div>

    </div>
    <el-dialog width="500px" :title="'添加公告'" center :visible.sync="edit">
      <el-form>
        <el-form-item label="是否公开">
          <el-switch v-model="form.active"></el-switch>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="form.isTop"></el-switch>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="edit = false">取消</el-button>
        <el-button size="mini"  type="primary" @click="actionForm">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/public'
import { mapGetters } from 'vuex'
import addUser from "@/views/account/components/addUser";

export default {
  name: 'index',
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
      edit:false,
      dialogUser:false,
      TeamOptions:[],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
      RolesData: [],
      form: {
        id:null,
        isTop:false,
        active:true,
        content:''
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
      request.get("/admin/notice/list", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    changeTop(e,row){
      let form={
        isTop:e
      }
      request.post(`/admin/notice/${row.id}`,form).then(res=>{

      })
    },
    changeActive(e,row){
      let form={
        active:e
      }
      request.post(`/admin/notice/${row.id}`,form).then(res=>{

      })
    },
    handleDelete(row) {
      request.post(`/admin/notice/${row.id}/delete` ).then(res => {
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
      this.edit = true
    },
    actionForm() {
      request.post('/admin/notice',this.form).then(res=>{
        this.edit = false
        this.getList()
      })
    },
  }
}
</script>
<style>


</style>
