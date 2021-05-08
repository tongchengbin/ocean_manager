<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">角色管理</div>
      <!--搜索-->
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item>
            <el-button size="mini" type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table size="mini" :data="list" v-loading="loading" highlight-current-row>
        <el-table-column label="角色ID" prop="id"></el-table-column>
        <el-table-column label="角色名" prop="name"></el-table-column>
        <el-table-column prop="Action" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="itemEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="itemDelete(scope.row)">删除</el-button>
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
    <edit-role v-if="isEdit" :form="editForm" @handleEdit="handleEdit"></edit-role>
  </div>
</template>

<script>
import request from '@/api/public'
import editRole from "@/views/system/components/editRole";
export default {
  name: "role",
  components:{editRole},
  data(){
    return {
      listQuery:{
        page:1,
        page_size:10,
      },
      loading:false,
      list:[],
      total:0,
      editForm:{},
      isEdit:false,
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData() {
      this.loading = true;
      request.get('/api/admin/role').then(res=>{
        this.loading = false
        const {data} = res;
        this.list = data
      }).catch(err=>{
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleCreate(){
      this.isEdit = true;
    },
    handleEdit(){
      this.isEdit = false;
      this.fetchData()
    },
    itemEdit(row){
      this.isEdit = true;
      this.editForm = row;
    },
    itemDelete(row){
      request.delete(`/api/admin/role/${row.id}`).then(res=>{
        this.fetchData()
      })
    }
  }
}
</script>

<style scoped>

</style>
