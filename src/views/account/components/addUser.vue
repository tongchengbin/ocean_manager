<template>
  <el-dialog @close="$emit('success')" :title="data.id?'编辑用户':'添加用户'" :visible.sync="show" size="mini"
             :close-on-click-modal="false" center width="600px">
    <el-form ref="dataForm" size="mini" :model="data" label-width="100px" :rules="rules" label-position="right">
      <el-form-item size="mini" label="用户名" prop="username">
        <el-input v-model="data.username"/>
      </el-form-item>
      <el-form-item size="mini" label="密    码" prop="password">
        <el-input v-model="data.password" type="password"/>
      </el-form-item>
      <el-form-item size="mini" label="确认密码" prop="confirm_password">
        <el-input v-model="data.confirm_password" type="password"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="$emit('success')">取消</el-button>
      <el-button size="mini" v-if="data.id" type="primary" @click="updateData">更新</el-button>
      <el-button size="mini" v-else type="primary" @click="updateData">添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/api/public'

export default {
  name: "addUser",
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    let require_password;
    require_password = this.data.id === undefined;
    let validator_confirm_password = (rule,value,callback)=>{
      if(value!==this.data.password){
        callback(new Error("两次密码不一致"))
      }

    }
    let rules = {
      username: [
        {required: true, target: 'blur', min: 3},
      ],
      password: [
        {
          required: require_password,
          target:'blur'
        }
      ],
      confirm_password: [
        {
          required: require_password,
          target:'blur',
          validator:validator_confirm_password
        }
      ]
    }
    return {
      rules: rules,
      show: true,
    }
  },
  created() {
    if (this.data === undefined) {
      this.data = {}
    }

  },
  methods: {
    updateData() {
      //   添加用户  更新用户
      if (this.data.id) {
        let data = this.data
        request.put(`/api/admin/user/${data.id}`, data).then(res => {
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
        request.post('/api/admin/user', data).then(res => {
          this.$emit('success')
        }).catch(err => {
        })
      }

    }
  }
}
</script>

<style scoped>

</style>
