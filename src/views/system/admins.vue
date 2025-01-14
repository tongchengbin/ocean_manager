<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item class="el-form-item">
        <el-input v-model="listQuery.search" placeholder="请输入用户名/邮箱" class="w-[200px]"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <el-button type="success" @click="handleCreate({})">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">管理员列表</p>
      </div>
      <div>
        <el-table v-loading="listLoading" :data="list" highlight-current-row stripe>
          <el-table-column
            align="center"
            type="index"
            width="80"
            label="序号"
            fixed="left"
            class-name="fnt-12"
          />
          <el-table-column label="用户名" width="150" align="center" class-name="fnt-12">
            <template #default="scope">
              <el-tag v-if="scope.row.is_captain" effect="dark">{{ scope.row.username }}</el-tag>
              <span v-else>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色" class-name="fnt-12">
            <template #default="scope">
              <span>{{ scope.row.role_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上次登陆时间" width="160" align="center" class-name="fnt-12">
            <template #default="scope">
              <span>{{ scope.row.login_time }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button link type="primary" @click="handleCreate(scope.row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog 
      v-model="isEdit" 
      :title="editForm.id ? '编辑管理员' : '新增管理员'" 
      width="500px"
    >
      <el-form 
        ref="dataForm" 
        :model="editForm" 
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="editForm.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="角色" prop="role" required>
          <el-select v-model="editForm.role" placeholder="请选择角色" class="w-full">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="!editForm.id">
          <el-input v-model="editForm.password" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password" :required="!editForm.id">
          <el-input v-model="editForm.confirm_password" type="password" placeholder="请再次输入密码"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleEdit(false)">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import EditAdmin from "@/views/system/components/editAdmin.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: 'Account',
  components: { EditAdmin },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (!this.editForm.id && !value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isEdit: false,
      editForm: {},
      TeamOptions: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: '',
        page: 1,
        page_size: 10
      },
      roles: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirm_password: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      http.get("/api/admin/admin", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
      }).finally(() => {
        this.listLoading = false
      })
    },
    getRole() {
      http.get('/api/admin/role').then(res => {
        this.roles = res.data
      })
    },
    async handleDelete(row) {
      try {
        await ElMessageBox.confirm('确认要删除该管理员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await http.delete(`/api/admin/admin/${row.id}`)
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
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate(row) {
      this.getRole()
      this.isEdit = true
      this.editForm = { ...row }
    },
    handleEdit(e) {
      this.isEdit = false
      if (e) {
        this.getList()
      }
    },
    async submit() {
      try {
        await this.$refs.dataForm.validate()
        
        if (!this.editForm.id) {
          await http.post('/api/admin/admin', this.editForm)
          ElMessage({
            type: 'success',
            message: '添加成功',
            duration: 2000
          })
        } else {
          await http.put(`/api/admin/admin/${this.editForm.id}`, this.editForm)
          ElMessage({
            type: 'success',
            message: '修改成功',
            duration: 2000
          })
        }
        this.isEdit = false
        this.getList()
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
