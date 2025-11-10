<template>
  <div class="main">
    <resource-form :data="currentRow" :open="showResourceForm" @action="handleAdd"></resource-form>
    
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item class="el-form-item" label="资源名称">
        <el-input v-model="listQuery.search" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin: 0 5px;" type="primary" @click="getList">查询</el-button>
        <el-button type="success" @click="handleCreate">添加</el-button>
        <el-button type="warning" @click="handleSyncRemoteCtfRepo">同步仓库资源</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">CTF环境资源</p>
      </div>
      <div>
        <el-table fit highlight-current-row stripe v-loading="loading" :data="listData">
          <el-table-column align="center" label="标题" prop="name" width="220" class-name="fnt-12"/>
          <el-table-column align="center" label="镜像" prop="image" class-name="fnt-12"/>
          <el-table-column align="center" label="加载方式" prop="docker_type_name" width="180" class-name="fnt-12"/>
          <el-table-column align="center" label="状态" prop="status_name" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                {{ scope.row.status_name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加日期" prop="created_at" width="150" class-name="fnt-12"/>
          <el-table-column align="center" label="操作" width="280">
            <template #default="scope">
              <el-button
                link
                type="primary"
                :loading="buildLoadingMap[scope.row.id]"
                @click="buildHandle(scope.row)"
              >编译</el-button>
              <el-button
                link
                type="primary"
                @click="viewLogHandle(scope.row)"
              >日志</el-button>
              <el-button
                link
                type="primary"
                @click="editHandle(scope.row)"
              >编辑</el-button>
              <el-button
                link
                type="danger"
                @click="deleteHandle(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
          <el-pagination
            :current-page="listQuery.page"
            :page-size="listQuery.page_size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

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
import { ref, reactive, onMounted } from "vue";
import { http } from "@/utils/http";
import resourceForm from "@/views/ctf/components/resourceForm.vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import BuildLogViewer from "@/components/BuildLogViewer/index.vue";

export default {
  name: "resources",
  components: {
    resourceForm,
    BuildLogViewer,
  },
  setup(_, { emit }) {
    const qType = ref([]);
    const loading = ref(false);
    const currentRow = ref({});
    const showResourceForm = ref(false);
    const total = ref(0);
    const listData = ref([]);
    
    // 编译日志相关状态
    const showLogDialog = ref(false);
    const currentBuildId = ref(null);
    const buildLoadingMap = ref({});

    const listQuery = reactive({
      type: "CTF",
      page: 1,
      page_size: 10,
      subject: null,
      search: null,
    });

    const getOptions = async () => {
      const res = await http.get("/api/admin/ctf/question/type");
      qType.value = res.data;
    };

    const getList = async () => {
      loading.value = true;
      try {
        const res = await http.get("/api/admin/docker/resource", listQuery);
        listData.value = res.data;
        total.value = res.total;
      } finally {
        loading.value = false;
      }
    };

    const handleSyncRemoteCtfRepo = async () => {
      try {
        await http.post("/api/admin/ctf/sync_repo");
        ElMessage({
          type: 'success',
          message: '任务提交成功',
          duration: 2000
        });
      } catch (error) {
        ElMessage.error('同步失败');
      }
    };

    const handleSizeChange = (newSize) => {
      listQuery.page_size = newSize;
      getList();
    };

    const handleCurrentChange = (newPage) => {
      listQuery.page = newPage;
      getList();
    };

    const handleCreate = () => {
      currentRow.value = {};
      showResourceForm.value = true;
    };

    const buildHandle = async (row) => {
      try {
        // 设置当前构建ID并显示loading状态
        currentBuildId.value = row.id;
        buildLoadingMap.value[row.id] = true;
        
        // 提交构建请求
        await http.post(`/api/admin/docker/resource/${row.id}/build`);
        
        ElMessage({
          type: 'success',
          message: '任务已提交',
          duration: 2000
        });
        
        // 显示日志对话框
        showLogDialog.value = true;
        
        // 刷新列表
        await getList();
      } catch (error) {
        ElMessage.error('编译失败');
      } finally {
        // 无论成功失败，都清除loading状态
        buildLoadingMap.value[row.id] = false;
      }
    };

    const editHandle = (data) => {
      showResourceForm.value = true;
      currentRow.value = { ...data };
    };

    const deleteHandle = async (row) => {
      try {
        await ElMessageBox.confirm('确认要删除该资源吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        await http.delete(`/api/admin/docker/resource/${row.id}`);
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2000
        });
        await getList();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败');
        }
      }
    };

    const handleAdd = (isUpdated) => {
      showResourceForm.value = false;
      if (isUpdated) getList();
    };
    
    // 日志对话框关闭时的处理
    const handleLogDialogClosed = () => {
      currentBuildId.value = null;
    };

    // 查看日志处理函数
    const viewLogHandle = (row) => {
      currentBuildId.value = row.id;
      showLogDialog.value = true;
    };

    onMounted(() => {
      getList();
      getOptions();
    });

    return {
      qType,
      listQuery,
      loading,
      currentRow,
      showResourceForm,
      total,
      listData,
      // 日志相关
      showLogDialog,
      currentBuildId,
      buildLoadingMap,
      handleLogDialogClosed,
      // 方法
      getList,
      handleSyncRemoteCtfRepo,
      handleSizeChange,
      handleCurrentChange,
      handleCreate,
      buildHandle,
      editHandle,
      deleteHandle,
      handleAdd,
      viewLogHandle,
    };
  },
};
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
</style>
