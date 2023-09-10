<template>
  <div class="page-container">
    <!--搜索-->
    <div class="widget">
      <div class="tool-bar">公告提醒</div>
      <div class="search-group">
        <el-form  inline>
          <el-form-item>
            <el-input v-model="listQuery.search"  style="width: 200px;" placeholder="公告内容" />
          </el-form-item>
          <el-form-item >
            <el-select v-model="listQuery.active" placeholder="是否启用" clearable>
              <el-option
                key="1"
                label="启用"
                value="1">
              </el-option>
              <el-option
                key="0"
                label="未启用"
                value="0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.is_top" placeholder="是否置顶" clearable>
              <el-option
                  key="1"
                  label="是"
                  value="1">
              </el-option>
              <el-option
                  key="0"
                  label="否"
                  value="0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary"  @click="handleFilter">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button   type="primary"  @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table v-loading="listLoading"  :data="list"  style="width: 100%" fit highlight-current-row stripe>
          <el-table-column align="center" label="ID" width="70px" prop="id">
          </el-table-column>
          <el-table-column label="内容"  align="center" prop="content"></el-table-column>
          <el-table-column  label="是否显示" width="80" align="center" prop="active">
            <template #default="scope">
              <el-switch @change=changeActive($event,scope.row) v-model="scope.row.active"></el-switch>
            </template>
          </el-table-column>
            <el-table-column label="是否置顶" width="80" align="center" prop="content">
              <template #default="scope">
                <el-switch @change=changeTop($event,scope.row) v-model="scope.row.is_top"></el-switch>
              </template>
            </el-table-column>
          <el-table-column align="center" label="发布日期" prop="date_created"></el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button  type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
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
    <el-dialog width="500px" :title="'添加公告'" center v-model="edit">
      <el-form >
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
      <template #footer class="dialog-footer">
        <el-button  @click="edit = false">取消</el-button>
        <el-button   type="primary" @click="actionForm">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { http } from "@/utils/http";

export default {
  name: 'index',
  data() {
    return {
      edit:false,
      dialogUser:false,
      TeamOptions:[],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        is_top:null,
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      http.get("/api/admin/notice", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    changeTop(e,row){
      let form={
        isTop:e
      }
      http.put(`/api/admin/notice/${row.id}`,form).then(res=>{

      })
    },
    changeActive(e,row){
      let form={
        active:e
      }
      http.put(`/api/admin/notice/${row.id}`,form).then(res=>{

      })
    },
    handleDelete(row) {
      http.delete(`/api/admin/notice/${row.id}` ).then(res => {
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
      http.post('/api/admin/notice',this.form).then(res=>{
        this.edit = false
        this.getList()
      })
    },
  }
}
</script>
<style>


</style>
