<template>
  <div class="page-container">
    <div class="widget">
      <div class="tool-bar">管理员列表</div>
      <!--搜索-->
      <div class="search-group">
        <el-form  inline>
          <el-form-item>
            <el-input v-model="listQuery.search"  style="width: 200px;" placeholder="用户名/邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="handleFilter">查询</el-button>
            <el-button   type="primary"  @click="handleCreate({})">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-body">
        <!--用户列表-->
        <el-table v-loading="listLoading"  :data="list"   highlight-current-row>
          <el-table-column align="center"
                           type="index"
                           width="80"
                           label="序号"
                           fixed="left"></el-table-column>
          <el-table-column label="用户名" width="150px" align="center">
            <template #default="scope">
              <el-tag  v-if="scope.row.is_captain" effect="dark">{{ scope.row.username }}</el-tag>
              <span v-else>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="角色">
            <template #default="scope">
              <span>{{ scope.row.role_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上次登陆时间" width="160" align="center">
            <template #default="scope">
              <span >{{ scope.row.login_time }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary"  @click="handleCreate(scope.row)" link>编辑</el-button>
              <el-button type="danger"  @click="handleDelete(scope.row)" link>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-r">
          <el-pagination
            background
            :current-page="listQuery.page"
            :page-sizes="[5,10,30]"
            :page-size="listQuery.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <el-dialog center  v-model="isEdit" :title="editForm.id?'编辑':'新增'+'管理员'" @close="$emit('handleEdit',false)" width="700">
        <el-form ref="dataForm"  :model="editForm" label-position="left" label-width="80px" label-suffix=":" style="width: 500px; margin: auto auto;font-size: 13px;">
          <el-form-item  label="用户名" prop="username" required>
            <el-input v-model="editForm.username" />
          </el-form-item>
          <el-form-item class="el-form-item" label="角色" required>
            <el-select v-model="editForm.role" class="select" clearable>
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="密    码" prop="password">
            <el-input v-model="editForm.password" type="password" />
          </el-form-item>
          <el-form-item  label="确认密码" prop="confirm_password" style="font-size: 12px">
            <el-input v-model="editForm.confirm_password" type="password" />
          </el-form-item>
        </el-form>
        <template #footer class="dialog-footer">
          <el-button  @click=handleEdit(false)>取消</el-button>
          <el-button  type="primary" @click="submit">{{ formData.id ?'更新':'提交'}}</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import EditAdmin from "@/views/system/components/editAdmin.vue";
import { ElMessage } from "element-plus";

export default {
  name: 'Account',
  components: {EditAdmin},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      isEdit:false,
      editForm: {},
      TeamOptions:[],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
      roles:[],
      RolesData: [],
      formData: {
        email: null,
        id: null,
        username: null,
        confirm_password: null,
        password: null
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
        this.listLoading = false
      })
    },
    getRole(){
      http.get('/api/admin/role').then(res=>{
        this.roles = res.data
      })
    },
    handleDelete(row) {
      http.delete(`/api/admin/admin/${row.id}` ).then(res => {
        ElMessage.success('删除成功')
        this.getList()
      })
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
      this.getList()
    },
    handleCreate(form) {
      this.getRole()
      this.isEdit = true;
      this.editForm = {};
    },
    handleEdit(e){
      this.isEdit = false
      if(e){
        this.getList()
      }
    },
    handleUpdate(row) {
      this.formData = row
      this.isEdit = true
    },
    submit() {
      if (!this.editForm.id) {
        http.post('/api/admin/admin', this.editForm).then(res => {
          ElMessage.success('添加成功')
          this.getList()
        }).catch(res => {

        }).finally(
            ()=>{
              this.isEdit= false
            }
        )
      } else {
        http.put(`/api/admin/admin/${this.editForm.id}`, this.editForm).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }).catch(err =>{

        }).finally(
            ()=>{
              this.isEdit= false
            }
        )
      }
    },

  }
}
</script>
<style scoped>
  .container {
    padding: 18px;
  }
  .container .warp{
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
  }

</style>
