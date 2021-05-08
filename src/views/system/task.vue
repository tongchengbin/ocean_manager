<template>
  <div class="container">
    <div class="widget widget-border">
      <div class="tool-bar">任务列表</div>
      <div class="action-bar"></div>
      <div class="widget-content">
        <el-table :data="data">
          <el-table-column width="100" prop="id" label="任务ID"></el-table-column>
          <el-table-column prop="title" label="任务名称"></el-table-column>
          <el-table-column prop="username" label="执行人"></el-table-column>
          <el-table-column prop="status_name" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status_name ==='执行完成'" type="success" effect="dark">{{scope.row.status_name}}</el-tag>
              <el-tag v-else-if="scope.row.status_name ==='排队'" type="primary" effect="dark">{{scope.row.status_name}}</el-tag>
              <el-tag v-else-if="scope.row.status_name ==='取消'" type="info" effect="dark">{{scope.row.status_name}}</el-tag>
              <el-tag v-else-if="scope.row.status_name === '执行错误'" :title="scope.row.remark" type="danger" effect="dark">{{scope.row.status_name}}</el-tag>
              <el-tag v-else-if="scope.row.status_name ==='执行中'"  type="warning" effect="dark">{{scope.row.status_name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="date_created" label="创建时间"></el-table-column>
          <el-table-column prop="date_modified" label="完成时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="handleShowLog(scope.row.id)" size="mini" type="primary">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <task-log :task="chiTask" v-if="showLog" @close="showLog=false"></task-log>
  </div>

</template>

<script>
import request from '../../api/public'
import TaskLog from "./components/taskLog";
  export default {
  name: "task",
    components: {TaskLog},
    data(){
    return {
      showLog:false,
      chiTask:1,
      data:[]
    }
    },
    created() {
    this.getData()
    },
    methods:{
      getData(){
        request.get('/api/admin/task').then(res=>{
          this.data = res.results
        })
      },
      handleShowLog(id){
        this.chiTask = id;
        this.showLog= true;

      }
    }
  }
</script>

<style scoped>

</style>
