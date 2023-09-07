<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">审计日志</div>
      <!--搜索-->
      <div class="search-group">
        <el-form size="mini" inline>
          <el-form-item>
            <el-input size="mini" v-model="listQuery.search" clearable placeholder="操作内容、操作内容"></el-input>
          </el-form-item>
          <el-form-item label="结果">
            <el-select v-model="listQuery.code" class="select" clearable>
              <el-option value="1" label="成功"></el-option>
              <el-option value="0" label="失败"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table size="mini" :data="list" v-loading="loading" highlight-current-row>
        <el-table-column label="角色ID" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="操作内容" prop="content"></el-table-column>
        <el-table-column label="时间" prop="create_time"></el-table-column>
        <el-table-column label="ip" prop="ip"></el-table-column>
        <el-table-column label="状态" prop="code">
          <template slot-scope="scope">
            <span v-if="scope.row.code === true">成功<i style="color: #67C23A" class="el-icon-success"></i></span>
            <span v-else>失败<i style="color: #F56C6C" class="el-icon-error"></i></span>
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
        search:null,
        code:null,
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
      request.get('/api/admin/operator',this.listQuery).then(res=>{
        this.loading = false
        const {data,total} = res;
        this.list = data
        this.total = total
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
