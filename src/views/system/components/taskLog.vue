<template>
    <el-dialog :visible.asyn="true" title="日志" class="dialog-log" @close="$emit('close')">
      <div class="box">
        <div v-for="item in log">
          <span>{{item}}</span>
        </div>
      </div>
    </el-dialog>
</template>

<script>
  import request from '../../../api/public'
    export default {
        name: "taskLog",
        props:{
          task:{
            type:Number
          }
        },
      data(){
          return {
            log:[]
          }
      },
      created() {
          request.get(`/api/admin/task/${this.task}/log`).then(res=>{
            this.log = res.results
          })

      }
    }
</script>

<style scoped>
.dialog-log{

}
  .box{
    padding: 20px;
    background-color: black;
    color: #ffffff;
  }

</style>
