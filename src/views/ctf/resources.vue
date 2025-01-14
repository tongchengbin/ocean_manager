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
          <el-table-column align="center" label="添加日期" prop="date_created" width="150" class-name="fnt-12"/>
          <el-table-column align="center" label="操作" width="240">
            <template #default="scope">
              <el-button 
                v-if="scope.row.status === 0" 
                link
                type="primary" 
                @click="buildHandle(scope.row)"
              >编译</el-button>
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
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { http } from "@/utils/http";
import resourceForm from "@/views/ctf/components/resourceForm.vue";
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: "resources",
  components: {
    resourceForm,
  },
  setup(_, { emit }) {
    const qType = ref([]);
    const loading = ref(false);
    const currentRow = ref({});
    const showResourceForm = ref(false);
    const total = ref(0);
    const listData = ref([]);

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
        await http.post(`/api/admin/docker/resource/${row.id}/build`);
        ElMessage({
          type: 'success',
          message: '任务已提交',
          duration: 2000
        });
        await getList();
      } catch (error) {
        ElMessage.error('编译失败');
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
      getList,
      handleSyncRemoteCtfRepo,
      handleSizeChange,
      handleCurrentChange,
      handleCreate,
      buildHandle,
      editHandle,
      deleteHandle,
      handleAdd,
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
