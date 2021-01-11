<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">镜像管理</div>
      <div class="action-bar">
        <el-button @click="$router.push({path:'./add',query:{id:pk}})" size="mini" type="primary" icon="el-icon-plus">添加镜像</el-button>
      </div>
      <el-table  :data="listData" class="table">
        <el-table-column width="500" class="long" label="ID" prop="Id">
          <template slot-scope="scope">
            <div @click="$router.push({path:'./detail',query:{id:pk,image:scope.row.Id}})" :title="scope.row.Id" class="txt-hid small">{{scope.row.Id}}</div>
          </template>
        </el-table-column>
        <el-table-column label="tags" prop="Tags">
          <template slot-scope="scope">
            <span v-if="scope.row.RepoTags && scope.row.RepoTags.length>0 " class="tags small">{{scope.row.RepoTags.join('/')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Size">
          <template slot-scope="scope">
            <span  class="small">{{(scope.row.Size/1000/1000).toFixed(1)}}M</span>
          </template>
        </el-table-column>
        <el-table-column label="Create">
          <template slot-scope="scope">
            <span  class="small">{{(scope.row.Created).split('.')[0].replace('T',' ') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action">
          <template slot-scope="scope">
            <el-button @click="remove(scope.row.Id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
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
            request.get(`/admin/docker/host/${this.pk}/images`).then(res=>{
              this.listData = res.data.images;
            })
        },
        remove(id){
            let host = this.pk
            request.post('/admin/docker/imagesDel',{host:host,id:id}).then(res=>{
              this.$message({message:"删除成功",type:"success"})
              this.getList()
            }).catch(err=>{
              this.$message({message:err.response.data.error,type:"error"})
            })
        }
      }
    }
</script>

<style scoped>
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
.tags {
  background-color: #337ab7;
  display: inline;
  padding: .2em .6em .3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
</style>
