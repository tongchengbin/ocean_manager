<template>
  <el-dialog width="600px" center :visible.async="show" :title="checkHost && checkHost.id?'编辑主机':'添加主机'">
    <div>
      <el-form ref="form" label-position="right" size="mini"  label-width="100px" :rules="formRule" :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item prop="ip" label="出口IP">
          <el-input v-model="form.ip"  ></el-input>
        </el-form-item>
        <el-form-item label="DockerApi">
          <el-input v-model="form.docker_api" placeholder="unix:///var/run/docker.sock" ></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.active"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="success(0)">取 消</el-button>
      <el-button size="mini" type="primary" @click="success(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '../../../api/public'
import {validIPAddress} from "@/utils/validate";
export default {
  name: "hostItem",
  props:{
    checkHost:{
      type:Object,
      default:{}
    },
    show:{
      type:Boolean,
      default:true
    }
  },
  mounted() {
  },
  data(){
    const validateIPAddress = (rule,value,callback) =>{
      if(!validIPAddress(value)){
        callback(new Error('出口IP地址无效!'))
      }else{
        callback()
      }

    }
    return {
      formRule:{
        ip:[{require:true,trigger:'blur',validator:validateIPAddress}]
      },
      form:{
        active: this.checkHost && this.checkHost.active,
        ip:this.checkHost && this.checkHost.ip,
        name:this.checkHost && this.checkHost.name,
        docker_api:this.checkHost && this.checkHost.docker_api,
        remark:this.checkHost && this.checkHost.remark,
      }
    }
  },
  methods:{
    success(e){
      if(e){
        if (this.$refs.form.validate(valid =>{
          if(!valid){
            return
          }
          if(this.checkHost && this.checkHost.id){
            //  编辑
            let data = this.form;
            data.id = this.checkHost.id;
            request.put(`/api/admin/docker/host/${data.id}`,data).then(_=>{
              this.$message({message:"修改成功",type:"success"})
              this.$emit('success',true)
            }).catch(err=>{
            })
          }else{
            //  添加
            request.post('/api/admin/docker/host',this.form).then(_=>{
              this.$message({message:"添加成功",type:"success"})
              this.$emit('success',true)
            }).catch(err=>{
            })
          }
        }));
      }else{
        this.$emit('success',false)
      }

    }
  },

}
</script>

<style scoped>

</style>
