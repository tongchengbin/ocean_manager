<template>
  <div class="container">
    <questionItem v-if="showAddQuestion" :data="chiData" :show="showAddQuestion" @action="handleAdd"></questionItem>
    <div class="widget">
      <div class="tool-bar">题库</div>
      <div class="search-group">
          <el-form inline size="mini">
            <el-form-item class="el-form-item" label="分类">
              <el-select v-model="listQuery.subject" class="select" clearable>
                <el-option
                  v-for="item in qType"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="listQuery.search" placeholder="题目名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini"  type="primary" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button  size="mini" type="primary" @click="handleCreate">添加</el-button>
            </el-form-item>
          </el-form>
      </div>
      <div class="widget-content">
        <el-table size="mini" fit highlight-current-row stripe v-loading="loading" :data="listData" >
          <el-table-column
            align="center"
            label="ID"
            prop="id"
            width="80"/>
          <el-table-column
            align="center"
            label="标题"
            prop="name"
            width="220"/>
          <el-table-column
            align="center"
            label="类别"
            prop="type"
            width="180"/>
          <el-table-column
            align="center"
            label="是否启用"
            prop="name"
            width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.active" @change="switchActive($event,scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否动态"
            width="80">
            <template v-slot="scope">
              <el-tag v-if="scope.row.active_flag" effect="dark">是</el-tag>
              <el-tag v-else effect="dark" type="warning">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="积分"
            prop="score"
            width="80"/>
          <el-table-column
            align="center"
            label="环境"
            prop="resource_name"
            width="180"/>
          <el-table-column
            align="center"
            label="描述"
            prop="desc"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="操作" width="160">
            <template slot-scope="scope">
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
import questionItem from "@/views/ctf/components/questionItem";

export default {
  name: "Question",
  components: {
    questionItem,
  },
  data() {
    return {
      qType: [],
      listQuery: {
        page:1,
        page_size: 10,
        subject: null,
        search:null
      },
      loading: false,
      chiData: {},
      showAddQuestion: false,
      total:0,
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
      request.get(`/api/admin/ctf/question`, this.listQuery).then(res => {
        this.listData = res.results;
        this.loading = false;
        this.total = res.total
      }).catch(_=>{

      })
    },
    handleSizeChange(e){
      this.listQuery.page_size = e;
      this.getList()
    },
    handleCurrentChange(e){
      this.listQuery.page = e;
      this.getList()
    },
    handleCreate() {
      this.chiData = {capture: this.rid}
      this.showAddQuestion = true;
    },
    editHandle(data) {
      this.chiData = data;
      this.showAddQuestion = true

    },
    deleteHandle(row) {
      request.delete(`/api/admin/ctf/question/${row.id}`,).then(_ => {
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
