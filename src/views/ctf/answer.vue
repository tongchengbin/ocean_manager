<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">答题记录</div>
      <div class="search-group">
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
          </el-form-item>
          <el-form-item class="el-form-item" label="状态">
            <el-select v-model="listQuery.status" class="select" clearable>
              <el-option
                v-for="item in statusList"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="用户名">
            <el-input v-model="listQuery.username" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" label="题目">
            <el-input v-model="listQuery.question" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" style="margin: 0 5px;" type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <div class="page-container">
          <el-table size="mini" v-loading="loading" :data="data" stripe highlight-current-row>
            <el-table-column align="center" label="提交人" prop="username" width="120"/>
            <el-table-column align="center" label="题目" prop="question.name" width="220"/>
            <el-table-column align="center" label="类别" prop="question.type" width="100"/>
            <el-table-column align="center" label="得分" prop="score" width="100"/>
            <el-table-column align="center" label="Flag" prop="flag" />
            <el-table-column align="center" label="状态" prop="has_solved" width="100">
              <template slot-scope="scope">
                <el-tag  effect="dark" :type="statusType[scope.row.status]" >{{scope.row.status_name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="提交IP" prop="ip" width="150"></el-table-column>
            <el-table-column align="center" label="提交时间" prop="date_created" width="150"></el-table-column>
          </el-table>
        </div>
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
      statusList:[],
      statusType:['','primary','info','danger','warning'],
      total: 0,
      listQuery: {
        has_solved: null,
        capture: null,
        page_size: 10,
        q_type: null,
      },
      loading: false,
      chiData: {},
      showAddQuestion: false,
      data: [],
      rid: null,
      captureName: null

    }
  },
  created() {
    this.getData()
    this.getOptions()
  },
  methods: {
    getOptions() {
      request.get('/api/admin/ctf/answers/status_list').then(res=>{
        this.statusList = res.data
      })
      request.get('/api/admin/ctf/question/type').then(res => {
        // 题目类别
        this.qType = res.results;
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getData()
    },
    getData() {
      this.loading = true
      request.get(`/api/admin/ctf/answers`, this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      })

    },
    handleAdd(){
      this.showAddQuestion = false;
      this.getData()
    },
    destroyItem(data) {
      this.chiData = data;
      request.post(`/api/manager/ctf/solved/${row.id}/to_void/`).then(_ => {
        this.$message({
          message: "已作废",
          type: "success"
        })
        this.getData()
      })

    },
    switchActive(e, row) {
      request.post(`/api/manager/ctf/question/${row.id}/active/`, {active: e}).then(_ => {
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

<style lang="scss">
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
