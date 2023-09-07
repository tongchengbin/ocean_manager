<template>
  <div class="container">
    <div class="wrap">
      <div class="widget">
        <div class="tool-bar">Image tags</div>
        <div class="widget-content" v-if="data.image && data.image.RepoTags">
          <el-tag
            class="i-tag"
                  @close="delTag(tag)"
                  closable
                  :disable-transitions="false"
                  key="tag" v-for="tag in data.image.RepoTags">
            {{tag}}
          </el-tag>
        </div>
      </div>

      <div class="widget">
        <div class="tool-bar">Image details</div>
        <div class="widget-content">
          <table>
            <tbody class="table">
            <tr>
              <td><span  class="td-attr">Id</span></td>
              <td><span v-if="data.image" class="td-val">{{data.image.Id}}</span></td></tr>
            <tr>
              <td><span class="td-attr">Size</span></td>
              <td><span class="td-val">{{ (data.image.Size/1000/1000).toFixed(1)}}</span></td>
            </tr>
            <tr>
              <td><span class="td-attr">Created</span></td>
              <td><span class="td-val">{{data.image.Created.split(".")[0].replace("T"," ")}}</span></td>
            </tr>
            <tr>
              <td><span class="td-attr">Build</span></td>
              <td><span class="td-val">Docker {{data.image.DockerVersion}} on {{data.image.Os}},{{data.image.Architecture}}</span></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="widget">
        <div class="tool-bar">Dockerfile details</div>
        <div class="widget-content">
          <table>
            <tbody class="table">
            <tr>
              <td><span  class="td-attr">CMD</span></td>
              <td><span v-if="data.image.Config.Cmd" class="td-val">{{data.image.Config.Cmd.join(" ")}}</span></td></tr>
            <tr>
              <td><span class="td-attr">ENTRYPOINT</span></td>
              <td><span class="td-val" v-if="data.image.Config.Entrypoint">{{ data.image.Config.Entrypoint.join()}}</span></td>
            </tr>
            <tr>
              <td><span class="td-attr">EXPOSE</span></td>
              <td><span class="td-val" v-if="data.image.Config">{{data.image.Config.ExposedPorts}}</span></td>
            </tr>
            <tr v-if="data.image.Config">
              <td><span class="td-attr">Env</span></td>
              <td>
                <span class="td-val">
                  <table>
                    <tbody>
                      <tr v-for="t in data.image.Config.Env">
                        {{t}}
                      </tr>
                    </tbody>
                  </table>
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="widget">
        <div class="tool-bar">Image layerss</div>
        <div class="widget-content">
          <el-table :data="history">
           <el-table-column type="index"></el-table-column>
            <el-table-column label="Size">
              <template #default="scope">
                <span v-if="scope.row.Size/1000/1000">{{ (scope.row.Size/1000/1000).toFixed(1)}}M</span>
              </template>
            </el-table-column>
            <el-table-column label="Layer">
              <template #default="scope">
                <span>{{scope.row.CreatedBy.replace("/bin/sh -c #(nop)",'')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {http} from "@/utils/http";
export default {
name: "imageDetail",
  data(){
    return  {
      pk:null,
      history:[],
      data:{
        image:{Config:{Cmd:[]},Created:''}
      },
  }
  },
  created() {
  this.pk = this.$route.query.id
  this.image = this.$route.query.image
  this.getDetail()
  this.getHistory()
  },
  methods:{
  getDetail(){
    http.get(`/api/admin/docker/host/${this.pk}/image/${this.image}`).then(res=>{
      this.data = res.results
    }).catch(err=>{

    })
    },
    delTag(tag){
    //   删除标签  如果镜像下又标签 直接无法直接删除镜像
      http.post(`/api/admin/docker/host/${this.pk}/images/del_tag`,{"tag":tag}).then(res=>{
        this.getDetail()
      }).catch(err=>{

      })
    },
    getHistory(){
      http.get(`/api/admin/docker/host/${this.pk}/image_history/${this.image}`).then(res=>{

        this.history = res.results
      }).catch(err=>{

      })
    }
  }
}
</script>

<style scoped>
.container{
  padding: 15px;
}
.widget {
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  background: #fff;
  border: 1px solid transparent;
  border-radius: 2px;
  border-color: #e9e9e9;
}
.widget-content{
  padding: 16px;
}
.widget+.widget{
  margin-top: 20px;
}
.tool-bar {
  color: #767676;
  padding: 10px;
  background-color: #f6f6f6;
  overflow: auto;
}
.i-tag{
  margin: 4px 10px;
}
.td-attr{
  margin-right: 40px;
  font-size: 13px;
  color: #333;
  width: 120px;
}
.table tr,.table.td{
  line-height: 1.5;
  margin: 20px;
  padding: 10px;
}
.td-val{
  font-size: 13px;

  color: #333;
  padding: 10px;
}
</style>
