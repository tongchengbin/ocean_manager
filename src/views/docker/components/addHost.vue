<template>
  <el-dialog width="500px" center :visible.async="show" :title="checkHost.id?'编辑主机':'添加主机'">
    <div>
      <el-form label-position="right" size="mini" label-width="100px">
        <el-form-item label="主机名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="出口IP">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="Docker API">
          <el-input v-model="form.docker_api" placeholder="unix:///var/run/docker.sock"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.active"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancel(0)">取 消</el-button>
      <el-button size="mini" type="primary" @click="success(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '../../../api/public'

export default {
  name: "addHost",
  props: {
    checkHost: {
      type: Object,
      default: () => {
      }
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  created() {
    console.log(">>>", this.checkHost)
  },
  mounted() {
    console.log("<<<", this.checkHost)
  },
  data() {
    return {
      form: {
        active: this.checkHost && this.checkHost.active || true,
        ip: this.checkHost.ip,
        name: this.checkHost.name,
        docker_api: this.checkHost.docker_api || "unix:///var/run/docker.sock",
        remark: this.checkHost.remark,
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('success', false)
    },
    success(e) {
      if (e) {
        if (this.checkHost.id) {
          //  编辑
          let data = this.form;
          data.id = this.checkHost.id;
          request.put(`/api/admin/docker/host/${data.id}`, data).then(_ => {
            this.$message({message: "修改成功", type: "success"})
            this.$emit('success', true)
          }).catch(err => {
          })
        } else {
          //  添加
          request.post('/api/admin/docker/host', this.form).then(_ => {
            this.$message({message: "添加成功", type: "success"})
            this.$emit('success', true)
          }).catch(err => {

          })
        }
      } else {
        this.$emit('success', false)
      }

    }
  },

}
</script>

<style scoped>

</style>
