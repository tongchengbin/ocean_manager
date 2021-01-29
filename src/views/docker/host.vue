<template>
  <div class="container">
    <div class="widget">
      <div  class="tool-bar"><span><strong>主机管理</strong></span></div>
      <div class="action-bar">
        <el-button @click="checkHost={};showAdd=true" size="mini" icon="el-icon-plus" type="primary" >添加</el-button>
      </div>
      <el-table size="mini" class="table" :data="listData" >
        <el-table-column  align="center"   prop="name" label="名称" width="80"></el-table-column>
        <el-table-column  align="center"  prop="ip" label="IP" width="110"></el-table-column>
        <el-table-column  align="center"  prop="addr" label="Docker API" width="110"></el-table-column>
        <el-table-column  align="center"  prop="active" label="是否启用" width="80">
          <template slot-scope="scope">
            <el-switch @change="changActive(scope.row)" v-model="scope.row.active"></el-switch>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="system" >
          <template slot-scope="scope">
            <div class="sys-info">
              <span>{{scope.row.info.OperatingSystem}}({{scope.row.info.Architecture}})</span>
              <span v-if="scope.row.info.NCPU">CPU:{{scope.row.info.NCPU}}</span>
              <span v-if="scope.row.info.MemTotal">内存:{{(scope.row.info.MemTotal/1000/1000/1000).toFixed(1)}}G</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="docker info" >
          <template slot-scope="scope">
            <div class="sys-info">
              <span>Version:{{scope.row.info.ServerVersion}}</span>
              <span v-if="scope.row.info.Containers">Containers:<strong>{{scope.row.info.Containers}}</strong></span>
              <span v-if="scope.row.info.Images">Images:<strong>{{scope.row.info.Images}}</strong></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  align="center"  prop="remark" label="备注" width="180"></el-table-column>
        <el-table-column  align="center"  label="Action">
          <template slot-scope="scope">
            <el-button @click="handleEditHost(scope.row)" size="mini" icon="el-icon-edit" type="primary" circle></el-button>
            <el-button @click="handleToDetail(scope.row.id)" size="mini" icon="el-icon-more" type="info" circle></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" icon="el-icon-delete" type="danger" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-host :checkHost="checkHost" :show="showAdd" v-if="showAdd" @success="handleAddHost"></add-host>
  </div>
</template>

<script>
  import request from '../../api/public'
    import AddHost from "./components/addHost";
    export default {
        name: "host",
      components: {AddHost},
      data(){
          return {
            showAdd:false,
            checkHost: {},
            listData:[],
            listTotal:0,
            listQuery:{
              page:1,
              page_size:10
            }
          }
      },
      created() {
          this.getList()
      },
      methods:{
          getList(){
          //  获取主机列表
            request.get('/admin/docker/hostList',this.listQuery).then(res=>{
              this.listData = res.data;
              this.listTotal = res.total
            })
          },
        handleAddHost(e){
          this.showAdd = false
          if(e){
            this.getList()
          }
        },
        handleEditHost(item){
        //    编辑主机
          this.checkHost = item
          this.showAdd  =true

        },
        changActive(row){
            let data = {
              active:row.active
            }
            request.post(`/admin/docker/host/${row.id}`,data).then(res=>{
              this.$message({message:"修改成功",type:"success"})
              this.getList()
            })
        },
        handleDelete(id){
        //    删除主机
          request.post(`/admin/docker/host/${id}/delete`).then(res=>{
            this.$message({message:"删除成功",type:"success"})
            this.getList()
          })
        },
        handleToDetail(id){
        //    跳转详情
          this.$router.push({path:`/docker/dockerHostDetail?id=${id}`})
        }
      }
    }
</script>

<style scoped>
  .table{
    padding: 15px;
  }
  .sys-info span{
    font-size: 80%;
  }

  .sys-info span+span{
    margin-left: 5px;
  }
</style>
