<template>

</template>

<script>
import {http} from "@/utils/http";

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
    let validator_confirm_password = (rule, value, callback) => {
      if (value !== this.data.password) {
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
          target: 'blur'
        }
      ],
      confirm_password: [
        {
          required: require_password,
          target: 'blur',
          validator: validator_confirm_password
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

<style scoped>

</style>
