<template>
  <div class="page-container">
    <div class="widget">
      <div class="tool-bar">角色管理</div>
      <!--搜索-->
      <div class="search-group">
        <el-form  inline>
          <el-form-item>
            <el-button  type="primary" @click="fetchData">查询</el-button>
            <el-button  type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="">     <el-table  :data="list" v-loading="loading" highlight-current-row>
        <el-table-column label="角色ID" prop="id"></el-table-column>
        <el-table-column label="角色名" prop="name"></el-table-column>
        <el-table-column prop="Action" width="150">
          <template #default="scope">
            <el-button type="primary"  @click="itemEdit(scope.row)" link>编辑</el-button>
            <el-button type="danger"  @click="itemDelete(scope.row)" link>删除</el-button>
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
        </div></div>
    </div>

    <el-dialog center  v-model="currentEdit" :title="currentRow.id?'编辑角色':'新增角色'" width="500px">
      <el-form ref="dataForm"  :model="currentRow" label-position="left" label-width="80px" label-suffix=":" style="margin: auto auto;font-size: 13px;">
        <el-form-item  label="角色名" prop="name">
          <el-input v-model="currentRow.name" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button  @click=cancel>取消</el-button>
        <el-button  type="primary" @click="submit">{{ currentRow.id ?'更新':'提交'}}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import { ElMessage } from "element-plus";
export default {
  name: "role",
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
      currentRow:{
        name:'',
      },
      currentEdit:false,
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData() {
      this.loading = true;
      http.get('/api/admin/role').then(res=>{
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
      this.currentEdit = true;
      this.currentRow = {}
    },
    handleEdit(){
      this.currentEdit = false;
      this.fetchData()
    },
    itemEdit(row){
      this.currentRow = row;
      this.currentEdit = true;
    },
    itemDelete(row){
      http.delete(`/api/admin/role/${row.id}`).then(res=>{
        ElMessage.success('删除成功')
        this.fetchData()
      })
    },
    cancel(){
      this.currentEdit = false
    },
    submit() {
      if (this.currentRow && this.currentRow.id) {
        http.put(`/api/admin/role`, this.currentRow).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.currentEdit=false
          this.fetchData()
        }).catch(err =>{
        })
      } else {
        http.post('/api/admin/role', this.currentRow).then(res => {
          ElMessage.success('删除成功')
          this.currentEdit=false
          this.fetchData()
        }).catch(res => {
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
