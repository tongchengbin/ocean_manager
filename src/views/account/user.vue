<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true">
      <el-form-item label="角色名称：" prop="name">
        <el-input
            v-model="listQuery.search"
            placeholder="请输入用户名称"
            clearable
            class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            :icon="useRenderIcon(Search())"
            :loading="loading"
            @click="getList"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full h-[60px] p-4">
        <p class="font-bold truncate">用户列表</p>
        <div class="flex items-center justify-around">
          <el-button type="primary" @click="handleCreate">添加</el-button>
        </div>
      </div>
      <div>
        <el-table fit highlight-current-row stripe v-loading="listLoading" :data="list" style="width: 100%">
          <el-table-column align="center" label="ID" width="70px" prop="id">
          </el-table-column>
          <el-table-column label="用户名" width="150px" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.is_captain" effect="dark">{{ scope.row.username }}</el-tag>
              <span v-else>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="邮箱">
            <template #default="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册日期">
            <template #default="scope">
              <span>{{ scope.row.date_created }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上次登陆" width="250">
            <template #default="scope">
              <span>{{ scope.row.date_modified }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" link @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="danger" link @click="userDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
              background
              class="page-r"
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
    <el-dialog :title="currentItem.id?'编辑用户':'添加用户'" v-model="currentItemVisible" size="mini"
               :close-on-click-modal="false" center width="600px">
      <el-form ref="dataForm" :model="currentItem" label-width="100px"  label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentItem.username"/>
        </el-form-item>
        <el-form-item label="密    码" prop="password" required>
          <el-input type="password" v-model="currentItem.password"  show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password" required>
          <el-input type="password" v-model="currentItem.confirm_password"  show-password/>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="this.currentItemVisible=false">取消</el-button>
        <el-button type="primary" @click="updateData">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import addUser from "@/views/account/components/addUser.vue";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";

export default {
  name: 'Account',
  components: {
    addUser,
  },
  data() {
    return {
      loading: false,
      dialogUser: true,
      TeamOptions: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        page_size: 10
      },
      RolesData: [],
      currentItemVisible: false,
      currentItem: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    Search() {
      return Search
    },
    useRenderIcon,
    getList() {
      this.listLoading = true
      http.get("/api/admin/user", this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    userDelete(row) {
      http.delete(`/api/admin/user/${row.id}`).then(res => {
        this.$message({message: "删除成功", type: "success"})
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
    handleCreate() {
      this.currentItem = {}
      this.currentItemVisible = true
    },
    handleUpdate(row) {
      this.currentItem = row
      this.currentItemVisible = true
    },
    updateData() {
      //   添加用户  更新用户
      if (this.data.id) {
        let data = this.data
        http.put(`/api/admin/user/${data.id}`, data).then(res => {
          this.$emit('success')
        }).catch(err => {
        })
      } else {
        let data = this.data
        if (!data.username) {
          this.$message({message: "请输入用户名", type: "error"})
          return
        }
        if (!data.password) {
          this.$message({message: "请输入密码", type: "error"})
          return
        }
        if (!data.confirm_password) {
          this.$message({message: "请输入确认密码", type: "error"})
          return
        }
        if (data.password !== data.confirm_password) {
          this.$message({message: "两次输入密码不一致", type: "error"})
          return
        }
        http.post('/api/admin/user', data).then(res => {
          this.$emit('success')
        }).catch(err => {
        })
      }

    }
  }
}
</script>
<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.page-r {
  margin: 16px 0;
  display: flex;
  justify-content: flex-end; /* 将内容靠右对齐 */
  align-items: center; /* 垂直居中对齐，如果需要的话 */
  /* 添加其他样式以适应你的页面布局 */
}

</style>
