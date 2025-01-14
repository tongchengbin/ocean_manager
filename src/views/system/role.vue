<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="success" @click="handleCreate">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">角色管理</p>
      </div>
      <div>
        <el-table :data="list" v-loading="loading" highlight-current-row stripe>
          <el-table-column label="角色ID" prop="id" align="center" class-name="fnt-12"/>
          <el-table-column label="角色名" prop="name" align="center" class-name="fnt-12"/>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="itemEdit(scope.row)">编辑</el-button>
              <el-button link type="danger" @click="itemDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
          <el-pagination
            :current-page="listQuery.page"
            :page-size="listQuery.page_size"
            :page-sizes="[10,20,30,50]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="currentEdit" 
      :title="currentRow.id ? '编辑角色' : '新增角色'" 
      width="500px"
    >
      <el-form 
        ref="dataForm" 
        :model="currentRow" 
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name" required>
          <el-input v-model="currentRow.name" placeholder="请输入角色名称"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "role",
  data() {
    return {
      listQuery: {
        page: 1,
        page_size: 10,
      },
      loading: false,
      list: [],
      total: 0,
      currentRow: {
        name: '',
      },
      currentEdit: false,
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true;
      http.get('/api/admin/role').then(res => {
        const { data } = res;
        this.list = data
      }).catch(error => {
        ElMessage.error(error.message || '获取数据失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleCreate() {
      this.currentEdit = true;
      this.currentRow = { name: '' }
    },
    handleEdit() {
      this.currentEdit = false;
      this.fetchData()
    },
    itemEdit(row) {
      this.currentRow = { ...row };
      this.currentEdit = true;
    },
    async itemDelete(row) {
      try {
        await ElMessageBox.confirm('确认要删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await http.delete(`/api/admin/role/${row.id}`)
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2000
        })
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    },
    cancel() {
      this.currentEdit = false
    },
    async submit() {
      try {
        await this.$refs.dataForm.validate()
        
        if (this.currentRow.id) {
          await http.put(`/api/admin/role`, this.currentRow)
          ElMessage({
            type: 'success',
            message: '修改成功',
            duration: 2000
          })
        } else {
          await http.post('/api/admin/role', this.currentRow)
          ElMessage({
            type: 'success',
            message: '添加成功',
            duration: 2000
          })
        }
        this.currentEdit = false
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '操作失败')
        }
      }
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
