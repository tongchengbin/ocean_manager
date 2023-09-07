<template>
  <!--编辑框-->
  <el-dialog center  :visible.sync="show" :title="title" @close="$emit('handleEdit',false)">
    <el-form ref="dataForm"  :model="formData" label-position="left" label-width="80px" label-suffix=":" style="width: 600px; margin: auto auto;font-size: 13px;">
      <el-form-item  label="角色名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button  @click="$emit('handleEdit',false)">取消</el-button>
      <el-button  type="primary" @click="submit">{{ form.id ?'更新':'提交'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {http} from "@/utils/http";
export default {

  name: "edtRole",
  props:{
    form:{
      type:Object,
      default:{}
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
    this.formData = this.form;
    if(this.form.id){
      this.title = "编辑角色"
    }else{
      this.title = "添加角色"
    }
  },
  methods:{
    submit() {
      if (this.form && this.form.id) {
        http.put(`/api/admin/role`, this.formData).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('handleEdit',true)
        }).catch(err =>{
        })
      } else {
        http.post('/api/admin/role', this.formData).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'})
          this.$emit('handleEdit',true)
        }).catch(res => {
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
