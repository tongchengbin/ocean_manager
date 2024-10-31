<template>
  <div class="page-container">
    <resource-form :data="currentRow" :open="showResourceForm"   @action="handleAdd"></resource-form>
    <div class="widget">
      <div class="tool-bar">CTF环境资源</div>
      <div class="search-group">
        <el-form inline>
          <el-form-item>
            <el-input v-model="listQuery.search" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button type="primary" @click="handleCreate">添加</el-button>
            <el-button type="primary" @click="handleSyncRemoteCtfRepo">同步仓库资源</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-content">
        <el-table fit highlight-current-row stripe v-loading="loading" :data="listData">
          <el-table-column align="center" label="标题" prop="name" width="220" />
          <el-table-column align="center" label="镜像" prop="image" />
          <el-table-column align="center" label="加载方式" prop="docker_type_name" width="180" />
          <el-table-column align="center" label="状态" prop="status_name" width="180" />
          <el-table-column align="center" label="添加日期" prop="date_created" show-overflow-tooltip />
          <el-table-column align="center" label="操作" width="240">
            <template #default="scope">
              <el-button v-if="scope.row.status === 0" type="primary" @click="buildHandle(scope.row)" link>编译</el-button>
              <el-button type="primary" @click="editHandle(scope.row)" link>编辑</el-button>
              <el-button type="danger" @click="deleteHandle(scope.row)" link>删除</el-button>
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
      const res = await http.get("/api/admin/docker/resource", { params: listQuery });
      listData.value = res.data;
      total.value = res.total;
      loading.value = false;
    };

    const handleSyncRemoteCtfRepo = async () => {
      await http.post("/api/admin/ctf/sync_repo");
      emit("action", { message: "任务提交成功", type: "success" });
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
      showResourceForm.value = true;
    };

    const  buildHandle = async (row) => {
      await http.post(`/api/admin/docker/resource/${row.id}/build`);
      emit("action", { message: "任务已提交", type: "success" });
      await getList();
    };

    const editHandle = (data) => {
      showResourceForm.value = true;
      currentRow.value = data;
    };

    const deleteHandle = async (row) => {
      await http.delete(`/api/admin/docker/resource/${row.id}`);
      emit("action", { message: "删除成功", type: "success" });
      await getList();
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

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;

  .select {
    margin: 0 10px;
  }
}

.el-form-item {
  margin-bottom: 0;
}
</style>
