<template>
  <div class="container">
    <resourceItem v-if="showAddQuestion" :data="chiData" :show="showAddQuestion" @action="handleAdd"></resourceItem>
    <div class="widget">
      <div class="tool-bar">资源</div>
      <div class="search-group">
        <el-form inline size="mini">
          <el-form-item>
            <el-input v-model="listQuery.search" placeholder="题目名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table size="mini" fit highlight-current-row stripe v-loading="loading" :data="listData">
          <el-table-column
            align="center"
            label="用户"
            prop="username"
            width="220"/>
          <el-table-column
            align="center"
            label="标题"
            prop="resource.name"
            width="220"/>
          <el-table-column
            align="center"
            label="组件"
            prop="resource.app"
            width="220"/>
          <el-table-column
            align="center"
            label="镜像"
            prop="resource.image"
            width="200"/>
          <el-table-column
            align="center"
            label="容器ID"
            prop="container_id"
            width="200"/>
          <el-table-column
            align="center"
            label="端口信息"
            prop="port_info"
            width="200"/>
          <el-table-column
            align="center"
            label="启动时间"
            prop="date_created"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="操作" width="240">
            <template #default="scope">
              <el-button v-if="scope.row.status===0" size="mini" type="primary" @click="buildHandle(scope.row)">编译</el-button>
              <el-button size="mini" type="primary" @click="editHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">销毁</el-button>
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
      request.get(`/api/admin/vuln/runner`, this.listQuery).then(res => {
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
    deleteHandle(row) {
      request.delete(`/api/admin/vuln/runner/${row.id}`,).then(_ => {
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
