<template>
  <el-form size="mini">
    <el-form-item label="角色">
      <el-input v-model.trim="user.role_name" disabled></el-input>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.username" />
    </el-form-item>

    <el-form-item>
      <el-button size="mini" type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
