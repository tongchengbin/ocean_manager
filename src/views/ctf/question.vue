<template>
  <div class="container">
    <add-question v-if="showAddQuestion" :data="chiData" :show="showAddQuestion" @action="handleAdd"></add-question>
    <div class="widget">
      <div class="tool-bar">题库</div>
      <div class="action-bar">
        <div class="btn-group">
          <el-form inline size="mini">
            <el-form-item class="el-form-item" label="分类">
              <el-select v-model="listQuery.q_type" class="select" clearable>
                <el-option
                  v-for="item in qType"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-button size="mini" style="margin-left: 5px;" type="primary" @click="getList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleCreate">添加</el-button>
        </div>
      </div>
      <div class="widget-content">
        <el-table size="mini" fit highlight-current-row stripe v-loading="loading" :data="listData">
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
            <template slot-scope="scope">
              <el-tag v-if="scope.row.active_flag" effect="dark">是</el-tag>
              <el-tag v-else effect="dark" type="warning">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="分数"
            prop="integral"
            width="80"/>
          <el-table-column
            align="center"
            label="描述"
            prop="desc"
            width="200"/>
          <el-table-column
            align="center"
            label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/api/public";
import addQuestion from "@/views/ctf/components/addQuestion";

export default {
  name: "Question",
  components: {
    addQuestion,
  },
  data() {
    return {
      qType: [],
      listQuery: {
        page_size: 999,
        subject: null,
      },
      loading: false,
      chiData: {},
      showAddQuestion: false,
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
      request.get('/admin/ctf/question/type').then(res => {
        this.qType = res.results;
      })
    },
    getList() {
      this.loading = true
      request.get(`/admin/ctf/question`, this.listQuery).then(res => {
        this.listData = res.results;
        this.loading = false;
        console.log('show', this.showAddQuestion)
      })

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
      request.post(`/admin/ctf/question/${row.id}/delete`,).then(res => {
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
      request.post(`/api/manager/ctf/question/${row.id}/active/`, {active: e}).then(res => {
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
