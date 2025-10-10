<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item class="el-form-item">
        <el-input v-model="listQuery.search" placeholder="请输入名称" class="w-[200px]"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="success" @click="handleCreate">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">资源中心</p>
      </div>
      <div>
        <el-table fit highlight-current-row stripe v-loading="listLoading" :data="list">
          <el-table-column label="名称" prop="name" align="center" class-name="fnt-12"/>
          <el-table-column label="镜像" prop="image" width="250" align="center" class-name="fnt-12"/>
          <el-table-column label="资源类型" prop="resource_type" width="150" align="center" class-name="fnt-12"/>
          <el-table-column label="加载类型" prop="docker_type_name" width="150" align="center" class-name="fnt-12"/>
          <el-table-column label="开放端口" prop="ports" width="150" align="center" class-name="fnt-12"/>
          <el-table-column label="描述" prop="description" width="150" show-overflow-tooltip align="center" class-name="fnt-12"/>
          <el-table-column width="120" align="center" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 2 ? 'danger' : 'info'">
                {{ scope.row.status === 0 ? '初始化' : scope.row.status === 1 ? '已编译' : '编译失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link :loading="loadingBuildMap[scope.row.id]" type="primary" @click="handleBuild(scope.row.id)">
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
            :page-sizes="[10,20,30,50]"
            :page-size="listQuery.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog v-model="centerDialogVisible" title="添加资源" width="500px">
      <el-form label-width="100px">
        <el-form-item label="资源名称" required>
          <el-input v-model="form.name" placeholder="请输入资源名称"/>
        </el-form-item>
        <el-form-item label="资源类型" required>
          <el-select v-model="form.resource_type" filterable class="w-full">
            <el-option v-for="op in resource_type_list" :label="op.label" :key="op.id" :value="op.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="加载类型" required>
          <el-select v-model="form.docker_type" filterable class="w-full">
            <el-option v-for="op in docker_type_list" :label="op.label" :key="op.id" :value="op.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="镜像名称" required>
          <el-input v-model="form.image" placeholder="请输入镜像名称"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述"/>
        </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
      </el-form>
    </el-dialog>
    <docker_resource_sync v-if="syncDialog" @close="syncDialog = false"></docker_resource_sync>

    <!-- 使用日志查看组件 -->
    <build-log-viewer
      v-model="showLogDialog"
      :resource-id="currentBuildId"
      title="编译日志"
      loading-text="正在编译中，请稍候..."
      api-path="/api/admin/docker/resource/{id}/logs"
      @closed="handleLogDialogClosed"
    />
  </div>
</template>

<script>
import { http } from "@/utils/http";
import docker_resource_sync from './docker_resource_sync.vue';
import BuildLogViewer from "@/components/BuildLogViewer/index.vue";
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: "compose_db",
  components: {
    docker_resource_sync,
    BuildLogViewer
  },
  data() {
    return {
      loadingBuildMap: {},
      syncDialog: false,
      showLogDialog: false,
      currentBuildId: null,
      docker_type_list: [
        { label: "远程镜像", id: 1 },
        { label: "本地镜像", id: 2 }
      ],
      resource_type_list: [
        { label: "CTF", id: "CTF" },
        { label: "VUL", id: "VUL" }
      ],
      form: {
        resource_type: "CTF",
        docker_type: 1
      },
      centerDialogVisible: false,
      listQuery: {
        page: 1,
        page_size: 10,
        search: ''
      },
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
      this.listLoading = true
      http.get('/api/admin/docker/resource', this.listQuery).then(res => {
        const { data, total } = res
        this.list = data
        this.total = total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      this.form = {
        resource_type: "CTF",
        docker_type: 1
      }
      this.centerDialogVisible = true
    },
    handleEdit(row) {
      this.form = { ...row }
      this.centerDialogVisible = true
    },
    handleBuild(id) {
      // 设置当前构建 ID
      this.currentBuildId = id;
      // 设置按钮 loading 状态
      this.loadingBuildMap[id] = true;

      http.post(`/api/admin/docker/resource/${id}/build`).then(() => {
        ElMessage({
          type: 'success',
          message: '任务提交成功',
          duration: 2000
        })

        // 显示日志对话框
        this.showLogDialog = true;

        this.getList()
      }).finally(() => {
        // 只重置当前按钮的状态
        this.loadingBuildMap[id] = false;
      })
    },
    async handleDelete(id) {
      try {
        await ElMessageBox.confirm('确认要删除该资源吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await http.delete(`/api/admin/docker/resource/${id}`)
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    },
    async handleSubmit() {
      try {
        if (this.form.id) {
          await http.put(`/api/admin/docker/resource/${this.form.id}`, this.form)
          ElMessage({
            type: 'success',
            message: '修改成功',
            duration: 2000
          })
        } else {
          await http.post(`/api/admin/docker/resource`, this.form)
          ElMessage({
            type: 'success',
            message: '添加成功',
            duration: 2000
          })
        }
        this.form = {
          resource_type: "CTF",
          docker_type: 1
        }
        this.centerDialogVisible = false
        this.getList()
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      }
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSyncClose() {
      this.syncDialog = false
      this.getList()
    },

    // 日志对话框关闭时的处理
    handleLogDialogClosed() {
      this.currentBuildId = null;
    }
  }
}
</script>

<style lang="scss">
.fnt-12 {
  font-size: 12px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.page-r {
  margin-top: 20px;
  padding: 10px;
  text-align: right;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
