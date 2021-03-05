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
          <el-form-item>
            <el-button size="mini" style="margin: 0 5px;" type="primary" @click="getData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  size="mini" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <div class="page-container">
          <el-table size="mini" v-loading="loading" :data="data" stripe highlight-current-row>
            <el-table-column align="center" label="提交人" prop="username" width="80"/>
            <el-table-column align="center" label="题目" prop="question.name" width="120"/>
            <el-table-column align="center" label="类别" prop="question.type" width="60"/>
            <el-table-column align="center" label="得分" prop="score" width="50"/>
            <el-table-column align="center" label="Flag" prop="flag" width="240"/>
            <el-table-column align="center" label="状态" prop="has_solved" width="95">
              <template slot-scope="scope">
                <el-tag  effect="dark" :type="statusType[scope.row.status]" >{{scope.row.status_name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="提交IP" prop="ip"></el-table-column>
            <el-table-column align="center" label="提交时间" prop="date_created"></el-table-column>
            <el-table-column
              label="Action">
              <template slot-scope="scope">
                <el-button v-if="scope.row.has_solved" size="small" type="danger" @click="destroyItem(scope.row)">作废
                </el-button>
              </template>
            </el-table-column>
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
import addQuestion from "@/views/ctf/components/addQuestion";

export default {
  name: "Question",
  components: {
    addQuestion,
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
      request.get('/admin/ctf/answers/status_list').then(res=>{
        this.statusList = res.data
      })
      request.get('/admin/ctf/question/type').then(res => {
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
      request.get(`/admin/ctf/answers`, this.listQuery).then(res => {
        this.data = res.data;
        this.total = res.total;
        this.loading = false;
      })

    },
    handleCreate() {
      this.$message({type:"warning",message:"Todos"})
    },
    handleAdd(){
      this.showAddQuestion = false;
      this.getData()
    },
    destroyItem(data) {
      this.chiData = data;
      request.post(`/api/manager/ctf/solved/${row.id}/to_void/`).then(res => {
        this.$message({
          message: "已作废",
          type: "success"
        })
        this.getData()
      })

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
