<template>
  <el-dialog v-if="show" :visible.sync="show" center title="分类管理" width="1200px">
    <h1>111</h1>
  </el-dialog>
</template>

<script>
export default {
  name: "questionTypeManage",
  props: {
    show: {
      type: Boolean
    }
  },
  created() {
    console.log(this.show)
  },
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
