<template>
  <div class="main">
    <el-form class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]" :inline="true" :model="listQuery">
      <el-form-item>
        <el-input
          v-model="listQuery.search"
          placeholder="请输入公告内容"
          class="w-[200px]"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.active"
          placeholder="是否启用"
          clearable
          style="width: 120px"
        >
          <el-option key="1" label="启用" value="1" />
          <el-option key="0" label="未启用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.is_top"
          placeholder="是否置顶"
          clearable
          style="width: 120px"
        >
          <el-option key="1" label="是" value="1" />
          <el-option key="0" label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <el-button type="success" @click="handleCreate">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
      <div class="flex justify-between w-full page-title">
        <p class="font-bold truncate">公告列表</p>
      </div>
      <div>
        <el-table
          v-loading="listLoading"
          :data="list"
          fit
          highlight-current-row
          stripe
        >
          <el-table-column
            align="center"
            label="ID"
            width="70"
            prop="id"
          />
          <el-table-column
            label="内容"
            align="center"
            prop="content"
          />
          <el-table-column
            label="是否显示"
            width="80"
            align="center"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.active"
                @change="val => changeActive(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="是否置顶"
            width="80"
            align="center"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.is_top"
                @change="val => changeTop(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发布日期"
            prop="date_created"
          />
          <el-table-column
            label="操作"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-button
                type="danger"
                link
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4">
          <el-pagination
            v-model:current-page="listQuery.page"
            v-model:page-size="listQuery.page_size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="edit"
      :title="form.id ? '编辑公告' : '添加公告'"
      width="500px"
      center
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="是否公开" prop="active">
          <el-switch v-model="form.active" />
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-switch v-model="form.isTop" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            rows="4"
            placeholder="请输入公告内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="edit = false">取消</el-button>
          <el-button type="primary" @click="actionForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: 'index',
  data() {
    return {
      edit: false,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        is_top: null,
        search: null,
        active: null,
        page: 1,
        page_size: 10
      },
      form: {
        id: null,
        isTop: false,
        active: true,
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const res = await http.get('/api/admin/notice', this.listQuery)
        const { data, total } = res
        this.list = data
        this.total = total
      } catch (error) {
        ElMessage.error(error.message || '获取列表失败')
      } finally {
        this.listLoading = false
      }
    },
    async changeTop(value, row) {
      try {
        await http.put(`/api/admin/notice/${row.id}`, { isTop: value })
        ElMessage({
          type: 'success',
          message: '更新成功'
        })
      } catch (error) {
        row.is_top = !value
        ElMessage.error(error.message || '更新失败')
      }
    },
    async changeActive(value, row) {
      try {
        await http.put(`/api/admin/notice/${row.id}`, { active: value })
        ElMessage({
          type: 'success',
          message: '更新成功'
        })
      } catch (error) {
        row.active = !value
        ElMessage.error(error.message || '更新失败')
      }
    },
    async handleDelete(row) {
      try {
        await ElMessageBox.confirm('确认要删除该公告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await http.delete(`/api/admin/notice/${row.id}`)
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '删除失败')
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
    handleCreate() {
      this.form = {
        id: null,
        isTop: false,
        active: true,
        content: ''
      }
      this.edit = true
    },
    async actionForm() {
      try {
        await this.$refs.formRef.validate()

        if (this.form.id) {
          await http.put(`/api/admin/notice/${this.form.id}`, this.form)
        } else {
          await http.post('/api/admin/notice', this.form)
        }

        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        this.edit = false
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '保存失败')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 16px;
}
</style>
