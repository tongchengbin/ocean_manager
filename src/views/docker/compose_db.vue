<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">Compose数据库</div>
      <div class="search-group">
        <el-input v-model="listQuery.search" size="mini" style="width: 200px;" placeholder="名称" />
        <el-button size="mini" type="primary"  @click="getList()">查询</el-button>
        <el-button size="mini"  type="primary"  @click="handleCreate">添加</el-button>
      </div>
      <div class="widget-content">
        <!--用户列表-->
        <el-table fit highlight-current-row stripe v-loading="listLoading" size="mini" :data="list" style="width: 100%">
          <el-table-column label="名称" prop="name" align="center"></el-table-column>
          <el-table-column label="路径" prop="path" width="150px" align="center">
          </el-table-column>
          <el-table-column width="180px" align="center" label="状态">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status===0">创建中</el-tag>
              <el-tag v-if="scope.row.status===1">已编译</el-tag>
              <el-tag v-if="scope.row.status===2">编译失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template v-slot="scope">
              <el-button type="primary" size="mini" @click="handleBuild(scope.row.id)">编译</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <el-dialog  :visible.sync="centerDialogVisible" title="新增Compose" width="30%" center>
      <el-form size="mini">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "compose_db",
  data() {
    return {
      form:{},
      centerDialogVisible:false,
      listQuery:{},
      listLoading: false,
      list: [],
      total:0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      request.get('/api/admin/docker/compose_db').then(res => {
        let {data,total} = res
        console.log(data,total)
        this.list = data
        this.total =total


      })
    },
    handleCreate(){
      this.centerDialogVisible = true
    },
    handleBuild(id){
      request.post(`/api/admin/docker/compose_db/${id}/build`).then(res=>{
        this.getList()
      })
    },
    handleDelete(id){
      request.delete(`/api/admin/docker/compose_db/${id}`).then(res=>{
        this.$message({message:"删除成功",type:"success"})
        this.getList()
      })
    },
    handleSubmit(){
      request.post(`/api/admin/docker/compose_db`,this.form).then(res=>{
        this.$message({message:"添加成功",type:"success"})
        this.form = {}
        this.centerDialogVisible = false
        this.getList()
      })
    },
    handleSizeChange(e) {
      this.listQuery.page_size = e;
      this.fetchData()
    },
    handleCurrentChange(e) {
      this.listQuery.page = e;
      this.fetchData()
    },
  }
}
</script>

<style scoped>

</style>
