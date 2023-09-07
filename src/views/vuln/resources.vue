<template>
  <div class="container">
    <resourceItem v-if="showAddQuestion" :data="chiData" :show="showAddQuestion" @action="handleAdd"></resourceItem>
    <div class="widget">
      <div class="tool-bar">资源</div>
      <div class="search-group">
        <el-form inline size="mini">
          <el-form-item>
            <el-input v-model="listQuery.search" placeholder="名称、app、CVE"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleUpload">导入</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table size="mini" fit highlight-current-row stripe v-loading="loading" :data="listData">
          <el-table-column
            align="center"
            label="标题"
            prop="name"
            width="220"/>
          <el-table-column
            align="center"
            label="组件"
            prop="app"
            width="220"/>
          <el-table-column
            align="center"
            label="镜像"
            prop="image"
            width="200"/>
          <el-table-column
            align="center"
            label="状态"
            prop="status_name"
            width="180"/>
          <el-table-column
            align="center"
            label="CVE"
            prop="cve"
            width="220">
            <template #default="scope">
              <el-tag style="margin: 0 2px;" v-for="i in scope.row.cve" :key="i">{{i}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="添加日期"
            prop="date_created"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="操作" width="240">
            <template #default="scope">
              <el-button v-if="scope.row.status===0" size="mini" type="primary" @click="buildHandle(scope.row)">编译</el-button>
              <el-button v-else size="mini" type="primary" @click="runHandle(scope.row)">启动</el-button>
              <el-button size="mini" type="primary" @click="editHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import request from "@/api/public";
import resourceItem from "@/views/vuln/components/resourceItem";

export default {
  name: "resources",
  components: {
    resourceItem,
  },
  data() {
    return {
      qType: [],
      listQuery: {
        page: 1,
        page_size: 10,
        subject: null,
        search: null
      },
      loading: false,
      chiData: {},
      showAddQuestion: false,
      total: 0,
      listData: [],
      rid: null,
      captureName: null

    }
  },
  created() {
    this.getList()
    this.getOptions()

  },
  methods: {
    getOptions() {
      request.get('/api/admin/ctf/question/type').then(res => {
        this.qType = res.results;
      })
    },
    getList() {
      this.loading = true
      request.get(`/api/admin/vuln`, this.listQuery).then(res => {
        this.listData = res.data;
        this.loading = false;
        this.total = res.total
      }).catch(_ => {

      })
    },
    handleSizeChange(e) {
      this.listQuery.page_size = e;
      this.getList()
    },
    handleCurrentChange(e) {
      this.listQuery.page = e;
      this.getList()
    },
    handleUpload(){
      const input = document.createElement('input');
      input.type = 'file';
      input.addEventListener('change', this.handleFileUpload);
      input.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      request.post('/api/admin/vuln/import',formData).then(res=>{
        this.$message.success("导入成功")
        this.getList()
      })

    },
    handleCreate() {
      this.$router.replace({name:"vuln.edit_resource"})
    },
    buildHandle(row){
      request.post(`/api/admin/docker/resource/${row.id}/build`).then(res=>{
        this.$message.success("任务已提交")
        this.getList()
      })
    },
    editHandle(data) {
      this.$router.replace({name:"vuln.edit_resource",query: { id: data.id }})
    },
    runHandle(row){
      request.post(`/api/admin/vuln/${row.id}/run`,).then(_ => {
        this.$message({
          message: "启动成功",
          type: "success"
        })
        this.getList()
      })
    },

    deleteHandle(row) {
      request.delete(`/api/admin/vuln/${row.id}`,).then(_ => {
        this.$message({
          message: "删除成功",
          type: "success"
        })
        this.getList()
      })
    },
    handleAdd(e) {
      this.showAddQuestion = false;
      if (e) {
        this.getList();
      }
    },
    switchActive(e, row) {
      request.put(`/api/admin/ctf/question/${row.id}`, {active: e}).then(_ => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 2000
        })
      })
    },
  }
}

</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;

  .select {
    margin: 0 10px;
  }

}

.el-form-item {
  margin-bottom: 0;
}
</style>
