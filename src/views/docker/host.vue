<template>
  <div class="container">
    <div class="widget" style="padding-bottom:10px">
      <div class="tool-bar"><span><strong>主机管理</strong></span></div>
      <div style="padding: 8px 20px">
        <el-button @click="handleEditHost()" type="primary" size="middle" style="padding: 6px 14px">添加</el-button>
        <el-button @click="getList()" type="primary" size="middle" style="padding: 6px 14px">刷新</el-button>
      </div>
      <div class="host-container">
        <div class="box-warp" v-for="item in listData">
          <el-card  >
            <div class="box-header">
              <div style="text-align: left"><div class="server-list__item-header-left">
                <img alt="" src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/tc-console/tea-static-lighthouse/src/styles/slice/CentOS.svg" class="tea-align-middle tea-mr-1n" style="height: 32px;">
                <span>{{item.name}}</span>
              </div></div>
              <div style="text-align: right;flex: auto;">
                <el-button style="padding: 4px;" @click="handleEditHost(item)" size="mini" icon="el-icon-edit" type="info" circle></el-button>
                <el-button style="padding: 4px;" @click="handleDelete(item)" size="mini" icon="el-icon-delete" type="danger" circle></el-button>
                <el-button style="padding: 4px;" @click="handleToDetail(item)" size="mini" icon="el-icon-more" type="primary" circle></el-button>
              </div>
            </div>
            <div class="box-body" >
              <div class="line-mg">
                <span>docker api：{{item.docker_api}}</span>
              </div>
              <div class="line-mg">
                <span v-if="item.info">version:{{item.info.ServerVersion}}</span>
              </div>
              <div class="line-mg">
                <span >CPU:{{item.system.cpu}}核 - 内存 {{(item.system.memory || 0).toFixed(1)}}G</span>
              </div>
              <div class="line-mg">
                <span>备注：{{item.remark}}</span>
              </div>
            </div>
            <div class="box-footer">
              <div style="text-align: right">{{item.ip}}</div>
            </div>
          </el-card>
        </div>
      </div>
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
            loading:false,
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
          this.loading = true;
          request.get('/api/admin/docker/host',this.listQuery).then(res=>{
            this.listData = res.data;
            this.listTotal = res.total;
            this.loading = false;
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
          if(item){
            console.log("item",item)
            this.checkHost = item
          }
          this.showAdd  =true

        },
        handleDelete(row){
          this.$confirm('此操作将删除主机配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //    删除主机
              request.delete(`/api/admin/docker/host/${row.id}`).then(_=>{
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getList()
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleToDetail(row){
        //    跳转详情
          this.$router.push({path:`/docker/dockerHostDetail?id=${row.id}`})
        }
      }
    }
</script>

<style scoped>
  .sys-info span{
    font-size: 80%;
  }

  .sys-info span+span{
    margin-left: 5px;
  }

  .host-container{
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .box-warp{

    /*cursor: pointer;*/
    padding: 10px;
    width: 33.333%;
    box-sizing: border-box;
  }
  .box-header{
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  .server-list__item-header-left{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .box-footer{
    display: flex;
  }
  .box-footer div{
    flex: auto;
  }
  .color-success {
    color: #67C23A;
    border-color:#67C23A ;
  }
  .color-info{
    border-color: #909399;
  }
  .color-danger{
    border-color: #F56C6C;
  }
  .badge{
    display: inline-block;
    max-width: 100%;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    width: 10px;
    height: 10px;
    border-width: 2px;
    border-style: solid;
    background-color: #fff!important;
    font-size: 0;
    padding: 0;
    border-radius: 100%;
    margin-right: 4px;
    vertical-align: middle;
  }
  .box-body{
    margin: 10px 0;
    font-size: 12px;
  }
  .line-mg{
    margin: 8px 0;
  }
</style>
