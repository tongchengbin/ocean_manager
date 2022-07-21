<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">Containers</div>
      <div class="action-bar">
        <div class="btn-group">
          <button @click="containerAction('start')" class="mini-btn success" :disabled="btn.start"><svg-icon icon-class="player-pause" ></svg-icon>Start</button>
          <button @click="containerAction('stop')" class="mini-btn danger" :disabled="btn.stop"><svg-icon icon-class="stop" ></svg-icon>Stop</button>
          <button @click="containerAction('kill')" class="mini-btn danger" :disabled="btn.kill"><svg-icon icon-class="bomb" ></svg-icon>Kill</button>
          <button class="mini-btn restart" :disabled="btn.restart"><svg-icon icon-class="restart" ></svg-icon>Restart</button>
          <button class="mini-btn restart" :disabled="btn.pause"><svg-icon icon-class="player-pause-2" ></svg-icon>Pause</button>
          <button class="mini-btn restart" :disabled="btn.resume"><svg-icon icon-class="player-pause" ></svg-icon>Resume</button>
          <button @click="containerAction('remove')" class="mini-btn danger" :disabled="btn.remove"><svg-icon icon-class="remove" ></svg-icon>Remove</button>
          <button @click="getList()" class="mini-btn restart"><svg-icon icon-class="restart" ></svg-icon>Refresh</button>
        </div>
      </div>
      <el-table v-loading="loading"  :data="listData" class="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column width="180" class="long" label="名称" prop="Id">
          <template slot-scope="scope">
            <div :title="scope.row.Name" class="txt-hid small">{{scope.row.Name.replace('/','')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            <span class="label small" :class="scope.row.State.Status">{{scope.row.State.Status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Image" prop="Config.Image">
        </el-table-column>
        <el-table-column label="端口映射">
          <template slot-scope="scope">
            <span   class="small port-item" v-for="(val,key) in scope.row.NetworkSettings.Ports ">
              <i class="el-icon-share"></i>
              <span>{{key.split('/')[0]}}:</span>
              <span v-for="p in val">{{p.HostPort}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Create">
          <template slot-scope="scope">
            <span  class="small">{{(scope.row.Created).split('.')[0].replace('T',' ') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action">
          <template slot-scope="scope">
          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import request from '../../api/public'
  export default {
    name: "images",
    data(){
      return {
        loading:false,
        btn:{
          start:true,
          stop:true,
          kill:true,
          restart:true,
          pause:true,
          resume:true,
          remove:true
        },
        checkItems:[],
        pk:null,
        listTotal:0,
        listData:[]
      }

    },
    created() {
      this.pk = this.$route.query.id;
      this.getList()

    },
    methods:{
      getList(){
        this.loading=true
        request.get('/api/admin/docker/containers',{id:this.pk}).then(res=>{
          this.listData = res.data.containers;
          this.loading = false
        })
      },
      remove(id){
        let host = this.pk
        request.post('/api/admin/docker/imagesDel',{host:host,id:id}).then(res=>{
        }).catch(err=>{
        })
      },
      containerAction(action){
        for(let i=0;i<this.checkItems.length;i++){
          let item= this.checkItems[i]
          let data = {host:this.pk,id:item.Id,action:action}
          request.post('/api/admin/docker/containerAction',data).then(res=>{
            this.getList()
            this.$message({message:`操作成功 ${item.Name}`,type:"success"})

          }).catch(err=>{
            this.getList()
          })
        }

      },
      stop(){
        for(let i=0;i<this.checkItems.length;i++){
          let item= this.checkItems[i]
          request.post('/api/admin/docker/containerStop',{"host":this.pk,"id":item.Id}).then(res=>{
            this.$message({message:`操作成功 关闭:${item.Name}`,type:"success"})
          }).catch(err=>{

          })
        }
        this.getList()
      },
      start(){
        for(let i=0;i<this.checkItems.length;i++){
          let item= this.checkItems[i]
          request.post('/api/admin/docker/containerStart',{"host":this.pk,"id":item.Id}).then(res=>{
            this.$message({message:`操作成功 启动:${item.Name}`,type:"success"})
          }).catch(err=>{

          })
        }
        this.getList()
      },
      handleSelectionChange(e){
        this.checkItems = e;
        this.btn = {
          start:true,
          stop:true,
          kill:true,
          restart:true,
          pause:true,
          resume:true,
          remove:true
        }
        for(let i=0;i<e.length;i++){
          // 所有状态都可以kill
          this.btn.kill = false
          this.btn.remove = false
          let item = e[i];
          if(item.State.Running || item.State.Created){
            this.btn.stop = false
          }else{
            this.btn.start = false
          }
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    padding: 15px;
  }

  .widget{
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    background: #fff;
    border: 1px solid transparent;
    border-radius: 2px;
    border-color: #e9e9e9;
  }
  .tool-bar {
    color: #767676;
    padding: 10px;
    background-color: #f6f6f6;
    overflow: auto;
  }
  .action-bar {
    color: #767676;
    padding: 10px;
  }
  .action-bar .btn-group{
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .small{
    font-size: 80%;
  }
  .txt-hid{
    color: #337ab7;
    cursor: pointer;
    font-weight: 600;
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .label{
    background-color: #337ab7;
    display: inline;
    padding: .2em .6em .3em;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
  }
  .port-item{
    color: #337ab7;
    margin: auto 2px;
  }
  .table .running{
   background-color: #5cb85c;
  }
  .table .stopped{
    background-color: #d9534f;
  }
  .table .created{
    background-color: #5bc0de;
  }
  .table .exited{
    background-color: #d9534f;
  }
  >>> .el-table--medium th{
    padding: 5px 0;
  }
  >>> .el-table--medium td {
    padding: 5px 0;
  }
  .mini-btn{
    padding: 5px 8px;
    font-size: 12px;
    display: inline-block;
    line-height: 1.5;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #DCDFE6;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 400;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    border-radius: 4px;
    background: #42d885;
    color: #fff;
  }
  .btn-group .danger{
    background-color: #d9534f;
  }
  .btn-group .success{
    background-color: #42d885;
  }
  .btn-group .restart{
    background-color: #337ab7;
  }
  .btn-group svg{
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  .mini-btn[disabled]{
    cursor: not-allowed;
    opacity: .65;
    box-shadow: none;
  }
</style>
