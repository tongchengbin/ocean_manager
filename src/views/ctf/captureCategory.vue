<template>
  <div class="app-container">
    <div class="box">
      <div v-for="item in listData" class="box-warp">
        <div class="item">
          <div class="logo">
            <div>
              <img :src="item.logo"></div>
          </div>
          <div class="info">
            <el-form>
              <el-form-item label="分类名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="item.active"></el-switch>
              </el-form-item>
              <el-form-item label="操作">
                <el-button @click="save(item)" size="small" type="primary">保存</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="isAdd" class="box-warp">
        <div class="item">
          <div class="logo">
            <div>
              <img src="../../assets/401_images/401.gif"></div>
            </div>
          <div class="info">
            <el-form inline-message>
              <el-form-item inline-message inline label="分类名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="form.active"></el-switch>
              </el-form-item>
              <el-form-item label="操作">
                <el-button @click="save(false)" size="small" type="primary">保存</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-else class="box-warp">
        <el-button @click="isAdd=true" type="primary">增加类别</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/api/public'
export default {
  name: "matchCategory",
  data(){
    return {
      listData:[],
      isAdd:false,
      form:{
        name:null,
        active:true,
        logo:null,
      }
    }

  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      request.get(('/api/manager/ctf/question_type/'),{page_size:999}).then(res=>{
        this.listData=res.results;
      })
    },
    save(row){
      console.log(row)
      if(row){
        request.put(`/api/manager/ctf/question_type/${row.id}/`,row).then(res=>{
          this.$message({message:"修改成功",type:"success"})
        })
      }else{
        request.post('/api/manager/ctf/question_type/',this.form).then(res=>{
          this.$message({message:"添加成功",type:"success"})
          this.isAdd=false;
          this.getList()
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>

.box{
  display: flex;
  flex-flow:row wrap;
}
.box-warp{
  margin: 15px;
  width: 100%;
}
.item{
  display: flex;
  background-color: #1f2d3d;
  align-items: center;
}
.item .logo{
  padding: 15px;
  width: 150px;
}
.logo div{
  height: 120px;
  width: 120px;
}
.logo img {
  width: 100%;
  height: 100%;
}
.item .info{
  margin-left: 10px;
  display: inline-block;
  span{
    color: #ffffff;
  }
}
</style>
