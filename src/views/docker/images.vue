<template>
  <div class="container">
    <div class="widget">
      <div class="tool-bar">镜像管理</div>
      <div class="action-bar">
        <el-button @click="$router.push({path:'./add',query:{id:pk}})" size="mini" type="primary" icon="el-icon-plus">
          添加镜像
        </el-button>
        <el-button @click="getList()" size="mini" type="primary">刷新</el-button>
      </div>
      <el-table :data="listData" size="mini" row-class-name="tb-td" cell-class-name="tb-td">
        <el-table-column label="short ID" prop="id" width="150"></el-table-column>
        <el-table-column label="repo" prop="repo"></el-table-column>
        <el-table-column label="tags" prop="tags">
          <template slot-scope="scope">
            <el-tag size="mini" style="font-size: 13px" closable @close="remove(scope.row,tag)" :key="tag"
                    v-for="tag in scope.row.tags" type="dark" class="tag-item">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="size">
          <template slot-scope="scope">
            <span class="small">{{ (scope.row.size / 1000 / 1000).toFixed(1) }}M</span>
          </template>
        </el-table-column>
        <el-table-column label="created" prop="created"></el-table-column>
        <el-table-column label="Action" width="100">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.tags.length>1" @click="remove(scope.row)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: "images",
  data() {
    return {
      pk: null,
      listTotal: 0,
      listData: []
    }
  },
  created() {
    this.pk = this.$route.query.id;
    this.getList()

  },
  methods: {
    getList() {
      request.get(`/api/admin/docker/host/${this.pk}/images`).then(res => {
        this.listData = res.data.images;
      })
    },
    remove(row,tag) {
      let host = this.pk
      let tid;
      if(tag){
        tid = `${row.repo}:${tag}`
      }else{
        tid = row.id
      }
      request.delete('/api/admin/docker/images', {data:{host: host, id: tid}}).then(_ => {
        this.$message({message: "删除成功", type: "success"})
        this.getList()
      }).catch(_ => {

      })
    }
  }
}
</script>

<style scoped lang="scss">
.small {
  font-size: 80%;
}

.txt-hid {
  color: #337ab7;
  cursor: pointer;
  font-weight: 600;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.widget{
  padding: 0 8px;
}
.tag-item {
  margin: 2px!important;
}
.tb-td{
  padding: 0!important;
  td{
    padding: 0!important;
  }
}
.table{
  td,th {
      padding: 4px 0;
  }
}
</style>
