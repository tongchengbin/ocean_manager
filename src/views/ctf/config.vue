<template>
<div class="container">
  <div class="widget">
    <div class="tool-bar">赛事配置</div>
    <el-row>
      <el-col span="6">
        <div style="padding: 20px">
          <el-form simi="mini" inline>
            <el-form-item label="容器时长">
              <el-input-number></el-input-number>
            </el-form-item>
          </el-form>
          <div style="text-align: left;margin-top: 20px">
            <el-button type="primary" size="middle" style="padding: 8px 12px">保存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
export default {
name: "ctf"
}
</script>

<style scoped>

</style>
