<template>
  <div class="page-container">
    <div class="widget">
      <div class="tool-bar">镜像管理</div>
      <div class="action-bar">
        <el-button @click="$router.push({name:'docker.image.add',query:{id:pk}})" type="primary">
          <el-icon>
            <Plus/>
          </el-icon>&nbsp;添加镜像
        </el-button>
        <el-button @click="getList()" type="primary">查询</el-button>
      </div>
      <el-table :data="list" class="table" max-height="600">
        <el-table-column label="short ID" prop="id" width="150"></el-table-column>
        <el-table-column label="repo" prop="repo"></el-table-column>
        <el-table-column label="tags" prop="tags">
          <template #default="scope">
            <el-tag style="margin: 0 5px;" closable @close="remove(scope.row,tag)" :key="tag"
                    v-for="tag in scope.row.tags" class="tag-item">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="size">
          <template #default="scope">
            <span class="small">{{ (scope.row.size / 1000 / 1000).toFixed(1) }}M</span>
          </template>
        </el-table-column>
        <el-table-column label="created" prop="created"></el-table-column>
        <el-table-column label="Action" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.tags.length>1" @click="remove(scope.row)" type="danger" link>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import {Plus, Edit,} from '@element-plus/icons-vue'

export default {
  name: "images",
  components: {
    Edit, Plus
  },
  data() {
    return {
      pk: null,
      listTotal: 0,
      list: []
    }
  },
  created() {
    this.getList()

  },
  methods: {
    getList() {
      http.get("/api/admin/docker/images").then(res => {
        this.list = res.data;
      })
    },
    remove(row, tag) {
      let host = this.pk
      let tid;
      if (tag) {
        tid = `${row.repo}:${tag}`
      } else {
        tid = row.id
      }
      http.post('/api/admin/docker/delete_images', {host: host, id: tid}).then(_ => {
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

.tag-item {
  margin: 2px !important;
}
</style>
