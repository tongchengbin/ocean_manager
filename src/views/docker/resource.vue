<template>
  <div class="page-container">
    <div class="widget">
      <div class="tool-bar">资源中心</div>
      <div class="search-group">
        <el-form inline>
          <el-form-item>
            <el-input v-model="listQuery.search" style="width: 200px;" placeholder="名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
            <el-button type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
        </el-form>

      </div>
      <div class="widget-content">
        <!--用户列表-->
        <el-table fit highlight-current-row stripe v-loading="listLoading" :data="list" style="width: 100%">
          <el-table-column label="名称" prop="name" align="center"></el-table-column>
          <el-table-column label="镜像" prop="image" width="250px" align="center"></el-table-column>
          <el-table-column label="资源类型" prop="resource_type" width="150px" align="center"></el-table-column>
          <el-table-column label="加载类型" prop="docker_type_name" width="150px" align="center"></el-table-column>
          <el-table-column label="描述" prop="description" width="150px" align="center"></el-table-column>
          <el-table-column width="180px" align="center" label="状态">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status===0">初始化</el-tag>
              <el-tag v-if="scope.row.status===1">已编译</el-tag>
              <el-tag v-if="scope.row.status===2">编译失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template v-slot="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link :loading="loading_build" type="primary" @click="handleBuild(scope.row.id)">
                {{ scope.row.status === 0 ? '编译' : "重新编译" }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
          <el-pagination
            background
            :current-page="listQuery.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!--编辑框-->
      </div>
    </div>
    <el-dialog v-model="centerDialogVisible" title="添加资源" width="40%" center>
      <el-form label-width="100">
        <el-form-item label="资源名称" docker_type_list>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" required>
          <el-select v-model="form.resource_type">
            <el-option v-for="op in resource_type_list" :label="op.label" :key="op.id" :value="op.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加载类型" required>
          <el-select v-model="form.docker_type">
            <el-option v-for="op in docker_type_list" :label="op.label" :key="op.id" :value="op.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镜像名称">
          <el-input v-model="form.image"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
    <docker_resource_sync @close="handleSyncClose" :open="syncDialog"></docker_resource_sync>
  </div>

</template>

<script>
import {http} from "@/utils/http";
import docker_resource_sync from './docker_resource_sync.vue'

export default {
  name: "compose_db",
  components: {
    docker_resource_sync
  },
  data() {
    return {
      loading_build: false,
      syncDialog: false,
      docker_type_list: [
        {
          label: "远程镜像",
          id: 1
        },
        {
          label: "本地镜像",
          id: 2
        }
      ],
      resource_type_list: [
        {
          label: "CTF",
          id: "CTF"
        },
        {
          label: "VUL",
          id: "VUL"
        }
      ],
      form: {
        resource_type: "CTF",
        docker_type: 1
      },
      centerDialogVisible: false,
      listQuery: {},
      listLoading: false,
      list: [],
      total: 0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      http.get('/api/admin/docker/resource').then(res => {
        let {data, total} = res
        console.log(data, total)
        this.list = data
        this.total = total


      })
    },
    handleCreate() {
      this.centerDialogVisible = true
    },
    handleEdit(row) {
      this.form = row
      this.centerDialogVisible = true
    },
    handleBuild(id) {
      this.loading_build = true
      http.post(`/api/admin/docker/resource/${id}/build`).then(res => {
        this.loading_build = false
        this.$message({message: "任务提交成功", type: "success"})
        this.getList()
      })
    },
    handleDelete(id) {
      http.delete(`/api/admin/docker/resource/${id}`).then(res => {
        this.$message({message: "删除成功", type: "success"})
        this.getList()
      })
    },
    handleSubmit() {
      if (this.form.id) {
        http.put(`/api/admin/docker/resource/${this.form.id}`, this.form).then(res => {
          this.$message({message: "修改成功", type: "success"})
          this.form = {}
          this.centerDialogVisible = false
          this.getList()
        })
      } else {
        http.post(`/api/admin/docker/resource`, this.form).then(res => {
          this.$message({message: "添加成功", type: "success"})
          this.form = {}
          this.centerDialogVisible = false
          this.getList()
        })
      }

    },
    handleSizeChange(e) {
      this.listQuery.page_size = e;
      this.fetchData()
    },
    handleCurrentChange(e) {
      this.listQuery.page = e;
      this.fetchData()
    },
    handleSyncClose() {
      this.syncDialog = false
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
