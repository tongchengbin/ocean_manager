<template>
  <!--编辑框-->
  <el-dialog center  :visible.sync="show" :title="title" @close="$emit('handleEdit',false)">
    <el-form ref="dataForm"  :model="formData" label-position="left" label-width="80px" label-suffix=":" style="width: 600px; margin: auto auto;font-size: 13px;">
      <el-form-item  label="用户名" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item class="el-form-item" label="角色">
        <el-select v-model="formData.role" class="select" clearable>
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="密    码" prop="password">
        <el-input v-model="formData.password" type="password" />
      </el-form-item>
      <el-form-item  label="确认密码" prop="confirm_password" style="font-size: 12px">
        <el-input v-model="formData.confirm_password" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button  @click="$emit('handleEdit',false)">取消</el-button>
      <el-button  type="primary" @click="submit">{{ formData.id ?'更新':'提交'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {http} from "@/utils/http";
export default {

  name: "editAdmin",
  props:{
    form:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return {
      show:false,
      title:"",
      formData:{},
      roles:[],
    }
  },
  created() {
    this.show = true;
    this.getRole()
    this.formData = this.form || {};
    if(this.formData.id){
      this.title = "编辑管理员"
    }else{
      this.title = "添加管理员"
    }
  },
  methods:{
    getRole(){
      http.get('/api/admin/role').then(res=>{
        this.roles = res.data
      })
    },
    submit() {
      if (!this.form) {
        http.post('/api/admin/admin', this.formData).then(res => {
          this.$message({
              message: '添加成功',
              type: 'success'})
          this.$emit('handleEdit',true)
        }).catch(res => {

        })
      } else {
        http.put(`/api/admin/admin/${this.formData.id}`, this.formData).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('handleEdit',true)
        }).catch(err =>{

        })
      }
    },
  }
}
</script>

<style scoped>

</style>
